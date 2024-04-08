// authRoutes.js

const express = require("express");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user"); // Asegúrate de ajustar la ruta según tu estructura de proyecto
const { OAuth2Client } = require("google-auth-library");
const { error } = require("console");
// const CLIENT_ID = "407408718192.apps.googleusercontent.com";//POSTMAN
const CLIENT_ID =
  "603153535129-plb0i5pqros03qgdcqbbvm799qf8gsl6.apps.googleusercontent.com"; //REAL GOOGLE

const client = new OAuth2Client(CLIENT_ID);

const router = express.Router();

router.post("/sign-up", async (req, res) => {
  try {
    const { name, lastName, email, password } = req.body;

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
    const token = jwt.sign(
      { id: user.id },
      "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",
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
});

router.post("/login-with-google", async (req, res) => {
  console.log(req.body); // Agrega esto para depurar

  try {
    const { credential } = req.body;
    console.log("credential recibido:", credential);

    if (!credential) {
      console.log(error);
      return res.status(400).send("credential no proporcionado");
    }
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: CLIENT_ID, // Asegúrate de reemplazar esto con tu Client ID real
    });

    const payload = ticket.getPayload();
    console.log("Payload recibido:", payload);

    if (!payload.email) {
      return res.status(400).json({
        message: "No se pudo obtener el email del credential de Google",
      });
    }
    let user = await User.findOne({ where: { email: payload.email } });

    // Si el usuario no existe, créalo sin una contraseña específica
    if (!user) {
      user = await User.create({
        name: payload.given_name, // Asumiendo que quieres el nombre dado
        lastName: payload.family_name, // Asumiendo que quieres el apellido
        email: payload.email,
        password: "", // Podrías optar por no establecer una contraseña o usar un valor placeholder
        // Considera añadir lógica para manejar roles si es necesario
      });
    }

    const userToken = jwt.sign(
      { id: user.id },
      "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",
      {
        expiresIn: "1h",
      }
    );
    console.log("userToken recibido:", userToken);

    res.cookie("token", userToken, { httpOnly: true, secure: false });
    // res.json(payload);
    res.redirect(`http://localhost:4200/home`);

    // res.json({name:user.given_name})
    // res.redirect("http://localhost:4200/home"); //CON ESTO PODEMOS REDIRIGIR
    //res.json({ credential: userToken });//CON ESTO ENVIAMOS EL TOKEN AL CLIENTE
    // res.redirect(`http://localhost:4200/home?token=${userToken}`);
  } catch (error) {
    console.error("Error al verificar el credential de Google:", error);
    res.status(500).json({ message: "Error al iniciar sesión con Google" });
  }
});

router.post("/logout", (req, res) => {
  res.clearCookie("token");
  res.status(200).json({ message: "Logout successful" });
});

router.get("/getUserName", (req, res) => {
  res.send("GUCCI");
  return payload.given_name;
});

module.exports = router;
