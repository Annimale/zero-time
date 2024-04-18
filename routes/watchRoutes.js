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
    console.log('Archivos recibidos:', req.files);
    const watch = await Watch.create(req.body);
    console.log('BACKEND WATCHROUTES', watch);
    // Aquí puedes procesar las imágenes como necesites, por ejemplo, guardando sus rutas en la DB
    res.status(201).send(watch);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
  
  module.exports = router;
