const express = require("express");
const app = express();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const { OAuth2Client } = require("google-auth-library");
const { error } = require("console");

const CLIENT_ID =
  "603153535129-plb0i5pqros03qgdcqbbvm799qf8gsl6.apps.googleusercontent.com"; //REAL GOOGLE
const { v4: uuidv4 } = require("uuid");

const Mailjet = require("node-mailjet");
const mailjet = new Mailjet.apiConnect(
  "5a6cdc86502f7b5b2d296902b168e59b",
  "4b147b229b323c7b3a6d35962c4838da"
);
const client = new OAuth2Client(CLIENT_ID);
const bodyParser = require("body-parser");

const router = express.Router();
app.use(bodyParser.json());

router.post("/sign-up", async (req, res) => {
  try {
    const { name, lastName, email, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = uuidv4(); // Generar un token único

    const newUser = await User.create({
      name,
      lastName,
      email,
      password: hashedPassword,
      verificationToken,
    });
    const verifyUrl = `http://localhost:3000/api/auth/verify/${verificationToken}`;
    const request = mailjet.post("send", { version: "v3.1" }).request({
      Messages: [
        {
          From: {
            Email: "zerotimeoclock@gmail.com",
            Name: "Zero Time",
          },
          To: [
            {
              Email: email,
              Name: name,
            },
          ],
          Subject: "Bienvenido/a a Zero Time",
          HTMLPart: `<h3>Bienvenido ${name},</h3>
          <p>&iexcl;Bienvenido a Zero Time! Nos complace que hayas decidido unirte a nuestra comunidad de amantes de los relojes. Para comenzar a disfrutar de todas las funciones y beneficios de nuestra aplicaci&oacute;n, necesitamos que actives tu cuenta.</p>
          <p>&nbsp;</p>
          <p>Por favor, haz clic en el siguiente enlace para activar tu cuenta de Zero Time: <a href="${verifyUrl}">confirmar correo</a></p>
          <p>Una vez cliques en el enlace se activar&aacute; tu cuenta y ya podr&aacute;s iniciar sesi&oacute;n correctamente<br /><br /></p>
          <p >Zero Time es tu destino definitivo para la venta de relojes y estar al tanto de las &uacute;ltimas noticias relacionadas con el mundo de la relojer&iacute;a. Nuestra plataforma te ofrece una amplia variedad de marcas y estilos de relojes, desde cl&aacute;sicos hasta modernos, para satisfacer tus gustos y necesidades.</p>
          <p>Adem&aacute;s de una amplia selecci&oacute;n de relojes, en Zero Time tambi&eacute;n encontrar&aacute;s art&iacute;culos informativos, rese&ntilde;as y entrevistas exclusivas con expertos de la industria. Te mantendremos al tanto de las &uacute;ltimas tendencias, lanzamientos y eventos relacionados con el fascinante mundo de los relojes.</p>
          <p >&iexcl;No esperes m&aacute;s y activa tu cuenta para comenzar a explorar todo lo que Zero Time tiene para ofrecerte! Si tienes alguna pregunta o necesitas ayuda, nuestro equipo de atenci&oacute;n al cliente est&aacute; listo para asistirte en todo momento.</p>
          <p >Gracias por unirte a Zero Time. &iexcl;Esperamos que disfrutes de la experiencia!</p>
          <p >&nbsp;</p>
          <p ><strong>Zero Time</strong></p>`,
        },
      ],
    });
    request
      .then((result) => {
        //console.log(result.body);
        return res.status(201).json({
          message: "Usuario creado exitosamente y correo enviado",
          newUser: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            isVerified: newUser.isVerified,
          },
        });
      })
      .catch((err) => {
        console.error(err.statusCode);
        return res.status(500).json({
          message: "Usuario creado, pero el correo no pudo ser enviado",
        });
      });
  } catch (error) {
    console.error(error);
    if (error.name === "SequelizeUniqueConstraintError") {
      return res.status(409).json({ message: "El email ya está registrado" });
    }
    return res
      .status(500)
      .json({ message: "Error al registrar el usuario", error });
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
    if (!user.isVerified) {
      return res.status(403).json({
        message:
          "Por favor, verifica tu correo electrónico antes de iniciar sesión",
      });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Contraseña incorrecta" });
    }
    const token = jwt.sign(
      { id: user.id, role: user.role },
      "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",
      { expiresIn: "1h" }
    );
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: "Error al iniciar sesión" });
  }
});

router.get("/verify/:token", async (req, res) => {
  const { token } = req.params;
  const user = await User.findOne({ where: { verificationToken: token } });

  if (!user) {
    return res.status(404).send("Usuario no encontrado o token ya utilizado.");
  }

  user.verificationToken = null; // Limpiar el token 
  user.isVerified = true; // Marcar el usuario como verificado
  await user.save();

  res.redirect(`http://localhost:4200/login`);
});

router.post("/login-with-google", async (req, res) => {
  try {
    const { credential } = req.body;

    if (!credential) {
      return res.status(400).send("credential no proporcionado");
    }
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: CLIENT_ID,
    });
    const payload = ticket.getPayload();
    //console.log("Payload recibido:", payload);
    if (!payload.email) {
      return res.status(400).json({
        message: "No se pudo obtener el email del credential de Google",
      });
    }
    let user = await User.findOne({ where: { email: payload.email } });
    // Si el usuario no existe, créalo sin una contraseña específica
    if (!user) {
      user = await User.create({
        name: payload.given_name,
        lastName: payload.family_name,
        email: payload.email,
        password: "",
      });
    }

    const userToken = jwt.sign(
      { id: user.id, role: user.role },
      "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",
      {
        expiresIn: "1h",
      }
    );
    //console.log("userToken recibido:", userToken);
    res.cookie("token", userToken, { httpOnly: false, secure: false });
    res.redirect(`http://localhost:4200/home`);
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
