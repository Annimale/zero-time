const express = require("express");
const app = express();
const router = express.Router();
const sequelize = require("sequelize");
const Watch = require("../models/watch");
const Brand = require("../models/brand");
const multer = require("multer");
const upload = multer({ dest: "uploads/" });

//? INSERT DE UN RELOJ ADD-WATCH
router.post("/api/watches", upload.array("images", 5), async (req, res) => {
  try {
    if (!req.files || req.files.length === 0) {
      throw new Error("Debe incluir al menos una imagen");
    }
    const watchData = {
      ...req.body,
      images: req.files.map((file) => file.path),
    };
    const watch = await Watch.create(watchData);
    res.status(201).send(watch);
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).send({ message: error.message || "Internal Server Error" });
  }
});

//?ENDPOINT PARA DEVOLVER TODOS LOS RELOJES
router.get("/api/getWatches", async (req, res) => {
  try {
    //console.log('Obteniendo todos los relojes de /watches/api/getWatches');
    const watches = await Watch.findAll();
    //console.log(watches);
    res.json(watches);
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).json({ error: "Internal Server Error" });
  }
});

//? ENDPOINT PARA DEVOLVER UN RELOJ POR ID

router.get("/api/getWatchById/:id", async (req, res) => {
  try {
    const watchId = req.params.id;
    const watch = await Watch.findByPk(watchId);
    if (!watch) {
      return res.status(404).send({ message: "Reloj no encontrado." });
    }

    res.json(watch);
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).send({ message: error.message || "Internal Server Error" });
  }
});

//? EDITAR UN RELOJ - EDITWATCH
router.patch(
  "/api/editWatch/:id",
  upload.array("images", 5),
  async (req, res) => {
    const watchId = req.params.id;
    try {
      const watch = await Watch.findByPk(watchId);
      if (!watch) {
        return res.status(404).send({ message: "Reloj no encontrado." });
      }

      const { images, ...updateData } = req.body;

      if (req.files && req.files.length > 0) {
        updateData.images = req.files.map((file) => file.path);
      } else if (!req.body.images) {
        updateData.images = watch.images;
      }

      await watch.update(updateData);

      res.send({ message: "Reloj actualizado correctamente.", watch });
    } catch (error) {
      console.error("Error al procesar la solicitud:", error);
      res
        .status(500)
        .send({ message: error.message || "Internal Server Error" });
    }
  }
);


router.delete("/api/editWatch/:id", async (req, res) => {
  const { id } = req.params;
  try {
    const watch = await Watch.findByPk(id);
    if (!watch) {
      return res.status(404).send({ message: "Reloj no encontrado." });
    }
    await watch.destroy();
    res.send({ message: "Reloj eliminado correctamente." });
  } catch (error) {
    console.error("Error al procesar la solicitud:", error);
    res.status(500).send({ message: error.message || "Internal Server Error" });
  }
});

//ENDPOINT PARA CONSEGUIR LOS RELOJES RELACIONADOS CON ESA BRANDID
router.get("/api/brands/:brandId/watches", async (req, res) => {
  try {
    const { brandId } = req.params;
    const watches = await Watch.findAll({
      where: { brandID: brandId },
    });

    res.json(watches);
  } catch (error) {
    console.error("Error fetching watches:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
