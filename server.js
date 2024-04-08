//? CONFIGURACIÓN SERTVIDOR EXPRESS BÁSICA
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const app = express();
const cookieParser = require('cookie-parser');
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Aquí es donde configurarás CORS
app.use(
  cors({
    // Permite el acceso desde cualquier origen o especifica tu dominio, como 'http://localhost:4200'
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Permite el envío de cookies

  })
);
//F
// Rutas
app.get("/", (req, res) => {
  res.send("Servidor Express funcionando!");
});

app.get("/logout", (req, res) => {
  // Esto establecerá la cookie 'token' con una fecha de expiración en el pasado, eliminándola
  res.cookie("token", "", {
    expires: new Date(0),
    httpOnly: true,
    secure: true,
  });

  res.redirect(`http://localhost:4200/home`);
});


app.get("/user", (req, res) => {
  // Leer el token desde la cookie

  const token = req.cookies["token"];
  if (!token) {
    return res.status(403).json({ message: "No autorizado" });
  }

  try {
    // Verificar el token y extraer la información
    const datosUsuario = token; // Asumiendo una función que verifica el token
    // Envía solo la información necesaria y segura al cliente
    res.json({ user: datosUsuario });

  } catch (error) {
    res.status(403).json({ message: "Token inválido o expirado" });
  }
});

// Monta las rutas de autenticación en '/api/auth'
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
