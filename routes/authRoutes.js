// authRoutes.js

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Asegúrate de ajustar la ruta según tu estructura de proyecto

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
      return res.status(400).json({ message: "El email ya está registrado" });
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

module.exports = router;
