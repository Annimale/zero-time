const express = require("express");
const app = express();
const router = express.Router();
const sequelize = require("sequelize");
const multer = require("multer");
const path = require("path");
const Comment = require("../models/comment");
const cookieParser = require("cookie-parser");
app.use(cookieParser());
const jwt = require("jsonwebtoken");

//ENDPOINT CREAR COMENTARIO
router.post("/api/createComment", async (req, res) => {
  try {
    const { body, userID, articleID } = req.body;
    if (!req.isAuthenticated || req.user.id !== userID) {
      return res.status(403).send("No autorizado");
    }
    const newComment = await Comment.create({ body, userID, articleID });
    res.status(201).json(newComment);
  } catch (error) {
    res.status(400).send(error.message);
  }
});

//EDNPOINT PARA OBTENER TODOS LOS COMENTARIOS DE UN ARTICLE/NEWS
router.get("/api/getComments/:articleId", async (req, res) => {
  try {
    const { articleId } = req.params;
    const comments = await Comment.findAll({
      where: { articleID: articleId },
      include: [
        {
          model: User,
          attributes: ["id", "name"], // Solo retorna el id y nombre del usuario para la privacidad
        },
      ],
    });
    res.json(comments);
  } catch (error) {
    res.status(500).send(error.message);
  }
});
module.exports = router;
