const express = require("express");
const Races = require("../models/races");

const router = express.Router();
const {sequelize} = require("../config/database");
const { Sequelize } = require('sequelize')

router.post("/track", async (req, res) => {
  try {
    const race = await Races.create({
      ...req.body
    })
    res.json("Worked")
  }
  catch (error) {
    res.json({err: "Something went wrong..."})
  }

});


router.get("/stats/:user_id", async (req, res) => {
  try {
    const { user_id } = req.params
    const race = await Races.findOne({
      where: { user_id },
      attributes: [
        [Sequelize.fn('AVG', Sequelize.cast(Sequelize.col('wpm'), 'integer')), 'averageWPM']
      ],
    });
    
    const averageWPM = race ? race.get('averageWPM') : null;

    res.json({wpm: parseInt(averageWPM)})
  } catch (err) {
    res.json({err: "Something went wrong..."})
  }
})

module.exports = router;
