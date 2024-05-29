const express = require("express");
const app = express();
const router = express.Router();
const sequelize = require("sequelize");
const multer = require("multer");
const path = require("path");
const Sale = require("../models/sale");
const Brand = require("../models/brand");
const User = require("../models/user");

Sale.belongsTo(User, { foreignKey: "userID", as: "user" });
Sale.belongsTo(Brand, { foreignKey: "brandID", as: "brand" });

const cookieParser = require("cookie-parser");
app.use(cookieParser());
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

const jwt = require("jsonwebtoken");

const authenticateToken = (req, res, next) => {
  const tokenFromHeader = req.headers["authorization"]?.split(" ")[1];
  const tokenFromCookie = req.cookies["token"];

  const token = tokenFromHeader || tokenFromCookie;

  //console.log("Token from Header:", tokenFromHeader);
  //console.log("Token from Cookie:", tokenFromCookie);
  //console.log("Token used for verification:", token);

  if (!token) return res.status(401).send({ message: "No token provided" });

  jwt.verify(token, "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", (err, decoded) => {
    if (err) {
      console.error("Error verifying token:", err);
      return res.status(403).send({ message: "Invalid token" });
    }
    req.user = decoded;
    next();
  });
};

app.use(authenticateToken);

// Ruta para crear una venta con imágenes de relojes
router.post(
  "/api/createSale",
  authenticateToken,
  upload.array("images", 5),
  async (req, res) => {
    const {
      status,
      ref,
      brandID,
      model,
      caseSize,
      condition,
      box,
      papers,
      notes,
      yearOfPurchase,
      watchID,
    } = req.body;
    //console.log("User:", req.user);
    if (!req.user) {
      return res.status(401).json({ message: "User not authenticated" });
    }
    const userID = req.user.id;

    const images = req.files.map((file) => file.path);

    try {
      const sale = await Sale.create({
        status,
        ref,
        brandID,
        model,
        caseSize,
        condition,
        box: box === "true",
        papers: papers === "true",
        images: JSON.stringify(images),
        notes,
        yearOfPurchase,
        watchID,
        userID,
      });
      res.status(201).json({
        message: "Venta creada con éxito",
        saleId: sale.id,
      });
    } catch (error) {
      console.error("Error al crear la venta", error);
      res.status(500).json({ message: "Error al crear la venta" });
    }
  }
);

router.get("/api/getAllSales", async (req, res) => {
  try {
    //console.log("Obteniendo todas las sales");
    const sales = await Sale.findAll({
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name"],
        },
        {
          model: Brand,
          as: "brand",
          attributes: ["id", "name"],
        },
      ],
    });
    //console.log(sales);
    res.json(sales);
  } catch (error) {
    console.error("Error al procesar la peticion:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});
//Endpoint para aprobar la sale
router.put("/api/approveSale/:saleId", async (req, res) => {
  const { saleId } = req.params;

  try {
    const sale = await Sale.findByPk(saleId);

    if (!sale) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    sale.status = "approved";
    await sale.save();

    res
      .status(200)
      .json({ message: "Estado de la venta actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar el estado de la venta:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

//Endpoint para aprobar la sale
router.put("/api/declineSale/:saleId", async (req, res) => {
  const { saleId } = req.params;

  try {
    const sale = await Sale.findByPk(saleId);

    if (!sale) {
      return res.status(404).json({ message: "Venta no encontrada" });
    }

    sale.status = "declined";
    await sale.save();

    res
      .status(200)
      .json({ message: "Estado de la venta actualizado correctamente" });
  } catch (error) {
    console.error("Error al actualizar el estado de la venta:", error);
    res.status(500).json({ message: "Error interno del servidor" });
  }
});

router.delete("/api/deleteSale/:saleId", async (req, res) => {
  const { saleId } = req.params;
  try {
    const sale = await Sale.findByPk(saleId);
    if (!sale) {
      return res.status(404).send({ message: "Sale no encontrada" });
    }
    await sale.destroy();
    return res.status(200).send({ message: "Sale borrada" });
  } catch (error) {
    console.error("Error al eliminar la venta", error);
    res.status(500).send({
      message:
        error.message || "Error interno del servidor al eliminar la venta",
    });
  }
});

router.get("/api/getUserSales/:userId", async (req, res) => {
  try {
    const userId = req.params.userId;
    const userSales = await Sale.findAll({
      where: { userID: userId }, // Filtra las ventas por el ID del usuario
      include: [
        {
          model: User,
          as: "user",
          attributes: ["id", "name"],
        },
        {
          model: Brand,
          as: "brand",
          attributes: ["id", "name"],
        },
      ],
    });
    res.json(userSales);
  } catch (error) {
    console.error("Error al obtener las ventas del usuario:", error);
    res.status(500).json({ error: "Error interno del servidor" });
  }
});

module.exports = router;
