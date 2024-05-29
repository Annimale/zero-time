const express = require("express");
const app = express();
const router = express.Router();
const sequelize = require("sequelize");
const multer = require("multer");
const path = require("path");
const User = require("../models/user");
const Comment = require("../models/comment");
const Article = require("../models/article");

User.hasMany(Comment, { foreignKey: "userID", as: "comments" });
Comment.belongsTo(User, { foreignKey: "userID", as: "user" });

const cookieParser = require("cookie-parser");
app.use(cookieParser());
const jwt = require("jsonwebtoken");

//ENDPOINT CREAR COMENTARIO
const authenticateToken = (req, res, next) => {
  const tokenFromHeader = req.headers["authorization"]?.split(" ")[1];
  const tokenFromCookie = req.cookies["token"];
  const token = tokenFromHeader || tokenFromCookie;

  //console.log("Token from Header:", tokenFromHeader);
  //console.log("Token from Cookie:", tokenFromCookie);
  //console.log("Token used for verification:", token);

  if (!token) {
    //console.log("No token provided");
    return res.status(401).send({ message: "No token provided" });
  }

  jwt.verify(token, "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", (err, decoded) => {
    if (err) {
      //console.log("Error verifying token:", err);
      return res.status(403).send({ message: "Invalid token" });
    }
    //console.log("Token is valid, decoded:", decoded);
    req.user = decoded;
    next();
  });
};

app.use(authenticateToken);

router.post("/api/createComment", authenticateToken, async (req, res) => {
  const { body, articleID } = req.body;
  const userID = req.user.id;
  const articleExists = await Article.findByPk(articleID);
  if (!articleExists) {
    return res.status(400).json({ message: "Article not found" });
  }
  try {
    const comment = await Comment.create({
      body,
      articleID,
      userID,
    });
    res.status(201).json({ message: "Comment created successfully", comment });
  } catch (error) {
    console.error("Error adding the comment", error);
    res.status(500).json({ message: "Error adding the comment" });
  }
});

//EDNPOINT PARA OBTENER TODOS LOS COMENTARIOS DE UN ARTICLE/NEWS
// Endpoint para obtener todos los comentarios de un artículo
router.get("/api/getComments/:articleId", async (req, res) => {
  try {
    const { articleId } = req.params;
    const comments = await Comment.findAll({
      where: { articleID: articleId },
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name"],
        },
      ],
    });
    res.json(comments);
  } catch (error) {
    console.error("Error loading comments:", error);
    res
      .status(500)
      .send({ message: "Error fetching comments", error: error.message });
  }
});

//ENDPOINT PARA EDITAR UN COMENTARIO
router.put(
  "/api/editComment/:commentId",
  authenticateToken,
  async (req, res) => {
    const { body } = req.body;
    const { commentId } = req.params;
    const userID = req.user.id; // ID del usuario desde el token
    //console.log(`Intentando editar el comentario con ID: ${req.params.commentId}`);

    try {
      const comment = await Comment.findByPk(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      if (comment.userID !== userID) {
        return res
          .status(403)
          .json({ message: "Unauthorized to edit this comment" });
      }

      comment.body = body;
      await comment.save();

      res
        .status(200)
        .json({ message: "Comment updated successfully", comment });
    } catch (error) {
      console.error("Error updating the comment", error);
      res
        .status(500)
        .json({ message: "Error updating the comment", error: error.message });
    }
  }
);

// ENDPOINT PARA BORRAR UN COMENTARIO
router.delete(
  "/api/deleteComment/:commentId",
  authenticateToken,
  async (req, res) => {
    const { commentId } = req.params;
    const userID = req.user.id; // ID del usuario desde el token

    try {
      const comment = await Comment.findByPk(commentId);
      if (!comment) {
        return res.status(404).json({ message: "Comment not found" });
      }

      // Verifica que el usuario que intenta borrar el comentario es el dueño del comentario
      if (comment.userID !== userID) {
        return res
          .status(403)
          .json({ message: "Unauthorized to delete this comment" });
      }

      // Borrar el comentario
      await comment.destroy();
      res.status(200).json({ message: "Comment deleted successfully" });
    } catch (error) {
      console.error("Error deleting the comment", error);
      res
        .status(500)
        .json({ message: "Error deleting the comment", error: error.message });
    }
  }
);

module.exports = router;
