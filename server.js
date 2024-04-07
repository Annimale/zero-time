//? CONFIGURACIÓN SERTVIDOR EXPRESS BÁSICA
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Aquí es donde configurarás CORS
app.use(
  cors({
    // Permite el acceso desde cualquier origen o especifica tu dominio, como 'http://localhost:4200'
    origin: "http://localhost:4200", // Asegúrate de cambiar esto al dominio de tu frontend Angular
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);
//F
// Rutas
app.get("/", (req, res) => {
  res.send("Servidor Express funcionando!");
});

app.get('/logout', (req, res) => {
  // Esto establecerá la cookie 'token' con una fecha de expiración en el pasado, eliminándola
  res.cookie('token', '', { expires: new Date(0), httpOnly: true, secure: true });
});



// Monta las rutas de autenticación en '/api/auth'
app.use("/api/auth", authRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
