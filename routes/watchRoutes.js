const express = require("express");
const app = express();
const router = express.Router();
const sequelize = require("sequelize");
const Watch = require("../models/watch")

//? INSERT DE UN RELOJ ADD-WATCH
router.post('/api/watches', async (req, res) => {
    try {
      const watch = await Watch.create(req.body);
      res.status(201).send(watch);
    } catch (error) {
      res.status(500).send(error.message);
    }
  });
  
  module.exports = router;
