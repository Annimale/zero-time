const express = require("express");
const app = express();
const router = express.Router();
const sequelize = require("sequelize");
const Article = require("../models/article");
const multer = require("multer");
const path = require("path"); // Asegúrate de incluir esta línea

const storage = multer.diskStorage({
    destination: function (req, file, cb) {
        cb(null, "uploads/"); // Asegúrate de que esta carpeta exista
    },
    filename: function (req, file, cb) {
        cb(null, Date.now() + path.extname(file.originalname)); // Usa path.extname para obtener la extensión del archivo
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
        res
          .status(201)
          .json({
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

module.exports = router;
