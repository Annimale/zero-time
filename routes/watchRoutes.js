const express = require("express");
const app = express();
const router = express.Router();
const sequelize = require("sequelize");
const Watch = require("../models/watch")
const Brand = require("../models/brand")
const multer = require('multer');
const upload = multer({ dest: 'uploads/' }); 

//? INSERT DE UN RELOJ ADD-WATCH
router.post('/api/watches', upload.array('images', 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw new Error("Debe incluir al menos una imagen");
    }
    // Asumiendo que los campos están correctamente nombrados en el formulario y coinciden con el modelo Sequelize
    const watchData = {
      ...req.body,
      images: req.files.map(file => file.path)  // Guarda las rutas de las imágenes
    };
    const watch = await Watch.create(watchData);
    res.status(201).send(watch);
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    res.status(500).send({ message: error.message || "Internal Server Error" });
  }
});

//?ENDPOINT PARA DEVOLVER TODOS LOS RELOJES
router.get('/api/getWatches',async (req,res)=>{
  try{
    console.log('Obteniendo todos los relojes de /watches/api/getWatches');
    const watches=await Watch.findAll();
    console.log(watches);
    res.json(watches)
  }catch(error){
    console.error('Error al procesar la solicitud:', error);
    res.status(500).json({ error: 'Internal Server Error' });
  }
})

//? ENDPOINT PARA DEVOLVER UN RELOJ POR ID

router.get('/api/getWatchById/:id', async (req, res) => {
  try {
    // Extracción del ID del reloj de los parámetros de la ruta
    const watchId = req.params.id;
    // Búsqueda del reloj en la base de datos por su ID
    const watch = await Watch.findByPk(watchId);
    if (!watch) {
      // Si el reloj no se encuentra, envía un error 404
      return res.status(404).send({ message: 'Reloj no encontrado.' });
    }

    // Si se encuentra el reloj, devuélvelo en la respuesta
    res.json(watch);
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    res.status(500).send({ message: error.message || "Internal Server Error" });
  }
});


//? EDITAR UN RELOJ - EDITWATCH
router.patch('/api/editWatch/:id', upload.array('images', 5), async (req, res) => {
  const watchId = req.params.id;
  try {
    const watch = await Watch.findByPk(watchId);
    if (!watch) {
      return res.status(404).send({ message: 'Reloj no encontrado.' });
    }

    // Extraer datos del cuerpo de la petición, excluyendo imágenes ya que se manejarán aparte
    const { images, ...updateData } = req.body;

    if (req.files && req.files.length > 0) {
      // Si hay nuevas imágenes, actualizamos el campo correspondiente
      updateData.images = req.files.map(file => file.path);
    }else if (!req.body.images) {
      // Si no hay nuevas imágenes y no se especifica explícitamente mantener sin imágenes,
      // conservamos las imágenes existentes
      updateData.images = watch.images;
    }

    // Actualizar el reloj con los nuevos datos
    await watch.update(updateData);

    res.send({ message: 'Reloj actualizado correctamente.', watch });
  } catch (error) {
    console.error('Error al procesar la solicitud:', error);
    res.status(500).send({ message: error.message || "Internal Server Error" });
  }
});

router.delete('/api/editWatch/:id', async (req, res) => {
  const { id } = req.params;
  try {
      const watch = await Watch.findByPk(id);
      if (!watch) {
          return res.status(404).send({ message: 'Reloj no encontrado.' });
      }
      await watch.destroy();
      res.send({ message: 'Reloj eliminado correctamente.' });
  } catch (error) {
      console.error('Error al procesar la solicitud:', error);
      res.status(500).send({ message: error.message || "Internal Server Error" });
  }
});

//ENDPOINT PARA CONSEGUIR LOS RELOJES RELACIONADOS CON ESA BRANDID
router.get('/api/brands/:brandId/watches', async (req, res) => {
  try {
    const { brandId } = req.params;
    const watches = await Watch.findAll({
      where: { brandID: brandId }
    });
    
      res.json(watches);
    
  } catch (error) {
    console.error('Error fetching watches:', error);
    res.status(500).send('Internal Server Error');
  }
});
  
  module.exports = router;
