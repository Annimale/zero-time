//? CONFIGURACIÓN SERTVIDOR EXPRESS BÁSICA
const express = require("express");
const cors = require("cors");
const authRoutes = require("./routes/authRoutes");
const commentRoutes = require("./routes/commentRoutes");
const brandRoutes=require ("./routes/brandRoutes");
const watchRoutes=require("./routes/watchRoutes");
const newsRoutes=require("./routes/newsRoutes");
const salesRoutes=require("./routes/salesRoutes");
const sequelize = require("sequelize");
const bcrypt = require('bcryptjs');
const Sale= require("./models/sale")
const User = require("./models/user");
const Brand = require("./models/brand");

console.log("User model:", User);
console.log("Brand model:", Brand);

const path = require('path');
const app = express();
const cookieParser = require("cookie-parser");
const { error } = require("console");
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cookieParser());
// Aquí es donde configuramos CORS
app.use(
  cors({
    // Permite el acceso desde cualquier origen o especifica tu dominio, como 'http://localhost:4200'
    origin: "http://localhost:4200",
    methods: ["GET", "POST", "DELETE", "UPDATE", "PUT", "PATCH"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true, // Permite el envío de cookies
  })
);
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// Rutas
app.get("/", (req, res) => {
  res.send("Servidor Express funcionando!");
});

app.get("/user/:id", async (req, res) => {
  try {
    const userId = req.params.id;
    console.log("Este es el userId:", userId);
    const foundUser = await User.findByPk(userId);
    console.log(foundUser);

    if (!foundUser) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }

    res.send(  foundUser ); // Envía el nombre del usuario como respuesta
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error al obtener datos del usuario" });
  }
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


//USER GOOGLE
app.get("/user", (req, res) => {
  // Leer el token desde la cookie
  const token = req.cookies["token"];
  if (!token) {
    return res.status(403).json({ message: "No autorizado",error });
  }

  try {
    // Verificar el token y extraer la información
    const datosUsuario = token; 
    res.json({ user: datosUsuario });
  } catch (error) {
    res.status(403).json({ message: "Token inválido o expirado" });
  }
});


//USER SESION NORMAL
app.get("/localUser/:id", async (req, res) => {
  try {
    const user = await User.findByPk(req.params.id);
    if (!user) {
      return res.status(404).send("Usuario no encontrado");
    }
    res.json(user);
  } catch (error) {
    res.status(500).send("Error al buscar el usuario", error);
  }
});

app.post('/verify-password', async (req, res) => {
  const { userId, password } = req.body;
  try {
    const user = await User.findByPk(userId);

    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }

    // Verificar la contraseña hasheada
    bcrypt.compare(password, user.password, (err, isMatch) => {
      if (err) {
        return res.status(500).send({ message: "Error al verificar la contraseña" });
      }

      if (isMatch) {
        res.send({ isValid: true });
      } else {
        res.send({ isValid: false });
      }
    });
  } catch (error) {
    res.status(500).send({ message: "Error en el servidor" });
  }
});


app.put("/updateUser/:id", async (req, res) => {
  const userId = req.params.id;
  const { name, lastName, newPassword } = req.body;

  try {
    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).send({ message: "Usuario no encontrado" });
    }

    // Actualizar los campos del usuario
    user.name = name || user.name;
    user.lastName = lastName || user.lastName;

    if (newPassword) {
      const salt = bcrypt.genSaltSync(10);
      user.password = bcrypt.hashSync(newPassword, salt);
    }

    await user.save();
    res.json({ message: "Perfil actualizado con éxito", user: user });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Error al actualizar el perfil", error: error });
  }
});



app.use("/api/auth", authRoutes)
app.use("/brands",brandRoutes)
app.use("/watches",watchRoutes)
app.use("/news",newsRoutes)
app.use("/sales",salesRoutes)
app.use("/comments",commentRoutes)

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
