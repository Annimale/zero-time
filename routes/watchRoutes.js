const express = require("express");
const app = express();
const router = express.Router();
const sequelize = require("sequelize");
const Watch = require("../models/watch")
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

  
  module.exports = router;
