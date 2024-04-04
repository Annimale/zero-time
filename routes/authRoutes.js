// authRoutes.js

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Asegúrate de ajustar la ruta según tu estructura de proyecto
const { OAuth2Client } = require('google-auth-library');
const CLIENT_ID = '603153535129-plb0i5pqros03qgdcqbbvm799qf8gsl6.apps.googleusercontent.com';
const client = new OAuth2Client(CLIENT_ID);


const router = express.Router();

router.post("/sign-up", async (req, res) => {
  try {
    const { name,lastName, email, password } = req.body;

    // Hash de la contraseña
    const hashedPassword = await bcrypt.hash(password, 10);

    // Creación del usuario en la base de datos
    const newUser = await User.create({
      name,
      lastName,
      email,
      password: hashedPassword, // Guarda la contraseña hasheada por seguridad
    });

    // Por seguridad, no devolver la contraseña, incluso hasheada
    newUser.password = undefined;

    return res
      .status(201)
      .json({ message: "Usuario creado exitosamente", newUser });
  } catch (error) {
    console.error(error);

    // Aquí puedes manejar errores específicos, por ejemplo, errores de validación o duplicados
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "El email ya está registrado" });
    }

    return res.status(500).json({ message: "Error al registrar el usuario" });
  }
});

router.post("/login", async (req, res) => {
  // Lógica de login aquí
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: "Usuario no encontrado" });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }
    const token = jwt.sign({ id: user.id }, "tu_secreto", { expiresIn: "1h" });
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
});

router.post('/login-with-google', async (req, res) => {
  try {
    const { token } = req.body;
    const ticket = await client.verifyIdToken({
      idToken: token,
      audience: CLIENT_ID, // Asegúrate de reemplazar esto con tu Client ID real
    });
    const payload = ticket.getPayload();

    let user = await User.findOne({ where: { email: payload.email } });

    // Si el usuario no existe, créalo sin una contraseña específica
    if (!user) {
      user = await User.create({
        name: payload.given_name, // Asumiendo que quieres el nombre dado
        lastName: payload.family_name, // Asumiendo que quieres el apellido
        email: payload.email,
        password: '', // Podrías optar por no establecer una contraseña o usar un valor placeholder
        // Considera añadir lógica para manejar roles si es necesario
      });
    }

    const userToken = jwt.sign({ id: user.id }, "tu_secreto", { expiresIn: "1h" });

    res.json({ token: userToken });
  } catch (error) {
    console.error('Error al verificar el token de Google:', error);
    res.status(500).json({ message: "Error al iniciar sesión con Google" });
  }
});


module.exports = router;
