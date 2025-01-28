const express = require("express");
const Words = require("../models/words");

const router = express.Router();
const {sequelize} = require("../config/database");

router.get("/:level/:numOfWords", async (req, res) => {
  const { level, numOfWords } = req.params;

  const words = await Words.findOne({
    where: { level: level, word_count: numOfWords },
    order: sequelize.random(),
  });

  res.send(words);
});

module.exports = router;
