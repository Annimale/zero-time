const express = require("express");
const app = express();
const router = express.Router();
const sequelize = require("sequelize");
const Brand = require("../models/brand");

//! Endpoint para devolver toda la info de una brand
router.get("/api/brands/:brandName", async (req, res) => {
  try {
    const brandName = req.params.brandName;
    const brand = await Brand.findOne({ where: { name: brandName } });

    if (brand) {
      res.json(brand);
    } else {
      res.status(404).send("Brand not found");
    }
  } catch (error) {
    res.status(500).send(error.message);
  }
});

//! Endpoint para devolver todas las marcas que tenga
router.get("/api/brands", async (req, res) => {
  try {
    console.log('Cogiendo brands');
    const brands = await Brand.findAll();
    console.log(brands);
    res.json(brands);
  } catch (error) {
    res.status(500).json({error:error.message});
  }
});
module.exports = router;
