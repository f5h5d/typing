const express = require("express");
const Quotes = require("../models/quotes");
const router = express.Router();
const { Op } = require("sequelize");
const {sequelize} = require("../config/database");

router.get("/:min/:max", async (req, res) => {
  const { min, max }  = req.params;

  const quote = await Quotes.findOne({
    where: {
      char_count: {
          [Op.between]: [min, max] // find a data point where the char_count is between the two given values
      }
  },
    order: sequelize.random(),
  });

  res.send(quote);
});

module.exports = router;
