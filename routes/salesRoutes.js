const express = require("express");
const app = express();
const router = express.Router();
const sequelize = require("sequelize");
const multer = require("multer");
const path = require("path"); 
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

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

// Ruta para crear una venta con imágenes de relojes
router.post("/api/createSale", upload.array('images', 5), async (req, res) => {
    const { status, ref, brandID, model, caseSize, condition, box, papers, notes, yearOfPurchase, watchID } = req.body;
    const userID = req.user.id; 

    const images = req.files.map(file => file.path);

    try {
        const sale = await Sale.create({
            status,
            ref,
            brandID,
            model,
            caseSize,
            condition,
            box: box === 'true',
            papers: papers === 'true',
            images: JSON.stringify(images),
            notes,
            yearOfPurchase,
            watchID,
            userID
        });
        res.status(201).json({
            message: "Venta creada con éxito",
            saleId: sale.id
        });
    } catch (error) {
        console.error("Error al crear la venta", error);
        res.status(500).json({ message: "Error al crear la venta" });
    }
});

module.exports = router;