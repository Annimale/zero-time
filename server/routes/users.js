// Ejemplo de archivo routes/users.js
const express = require('express');
const router = express.Router();

router.get('/users', (req, res) => {
  // Lógica para obtener y responder con todos los usuarios
});

router.post('/users', (req, res) => {
  // Lógica para crear un nuevo usuario
});

module.exports = router;
