const express = require("express");
const app = express();
const router = express.Router();
const sequelize = require("sequelize");
const Article = require("../models/article");
const multer = require("multer");
const path = require("path"); 
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "uploads/"); 
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname)); 
  },
});

const fileFilter = (req, file, cb) => {
  if (file.mimetype.startsWith("image")) {
    cb(null, true);
  } else {
    cb(new Error("Not an image! Please upload only images."), false);
  }
};

const upload = multer({ storage: storage, fileFilter: fileFilter });

//? INSERT DE UNA NEWS/ARTICLE
router.post(
  "/api/news",
  upload.fields([
    { name: "coverImage", maxCount: 1 },
    { name: "secondaryImage", maxCount: 1 },
  ]),
  (req, res) => {
    const { title, subtitle, body, author, category } = req.body;
    const coverImage = req.files["coverImage"]
      ? req.files["coverImage"][0].path
      : null;
    const secondaryImage = req.files["secondaryImage"]
      ? req.files["secondaryImage"][0].path
      : null;

    // Crea un nuevo artículo usando el modelo Sequelize
    Article.create({
      title,
      subtitle,
      body,
      coverImage,
      secondaryImage,
      author,
      date: new Date(), // Asumiendo que quieres la fecha actual como la fecha del artículo
      category,
    })
      .then((article) => {
        res.status(201).json({
          message: "Artículo creado con éxito",
          articleId: article.id,
        });
      })
      .catch((error) => {
        console.error("Error al guardar el artículo", error);
        res.status(500).json({ message: "Error al crear el artículo" });
      });
    console.log(req.files); // Verifica que los archivos se reciben correctamente
    console.log(req.body);
    console.log(req.body.coverImage, req.body.secondaryImage);
  }
);
//?ENDPOINT PARA DEVOLVER TODOS LOS RELOJES
router.get("/api/getNews", async (req, res) => {
  try {
    console.log("Obteniendo todos los relojes de /articles/api/getNews");
    const articles = await Article.findAll();
    console.log(articles);
    res.json(articles);
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//? ENDPOINT PARA DEVOLVER UNA NEWS POR ID

router.get("/api/getNewsById/:id", async (req, res) => {
  try {
    // Extracción del ID del reloj de los parámetros de la ruta
    const newsId = req.params.id;
    // Búsqueda del reloj en la base de datos por su ID
    const news = await Article.findByPk(newsId);
    if (!news) {
      // Si el reloj no se encuentra, envía un error 404
      return res.status(404).send({ message: "Reloj no encontrado." });
    }

    // Si se encuentra el reloj, devuélvelo en la respuesta
    res.json(news);
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).send({ message: error.message || "Internal Server Error" });
  }
});

module.exports = router;
