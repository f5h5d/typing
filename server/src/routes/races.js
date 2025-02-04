const express = require("express");
const Races = require("../models/races");

const router = express.Router();
const { sequelize } = require("../config/database");
const { Sequelize } = require("sequelize");

router.post("/track", async (req, res) => {

  console.log("reafched here")
  try {
    const race = await Races.create({
      ...req.body,
    });

    
    res.json("Worked");
  } catch (error) {
    console.log(error)
    res.json({ err: "Something went wrong..." });

  }
});

router.get("/stats/:user_id", async (req, res) => {

  console.log("ere")
  try {
    const { user_id } = req.params;
    const userStatsPromise = Races.findOne({
      where: { user_id },
      attributes: [
        [
          Sequelize.fn("AVG", Sequelize.cast(Sequelize.col("wpm"), "integer")),
          "averageWpm",
        ],
        [
          Sequelize.fn(
            "AVG",
            Sequelize.cast(Sequelize.col("accuracy"), "integer")
          ),
          "averageAccuracy",
        ],
        [
          Sequelize.fn(
            "MAX",
            Sequelize.cast(Sequelize.col("race_number"), "integer")
          ),
          "totalRaces",
        ],
        [
          Sequelize.fn("MAX", Sequelize.cast(Sequelize.col("wpm"), "integer")),
          "highestWpm",
        ],
      ],
    });

    const mostRecentRacePromise = Races.findOne({
      where: { user_id },
      order: [["race_number", "DESC"]],
    });

    const totalRacesWonPromise = Races.count({
      where: { user_id, won: true },
    });

    const lastTenRacesPromise = sequelize.query(
      `
      SELECT 
        AVG(CAST(wpm AS INTEGER)) AS lasttenraceswpm, 
        AVG(CAST(accuracy AS INTEGER)) AS lasttenracesaccuracy
      FROM (
        SELECT wpm, accuracy
        FROM Races
        WHERE user_id = :user_id
        ORDER BY race_number DESC
        LIMIT 10
      ) AS subquery
      `,
      {
        replacements: { user_id },
        type: Sequelize.QueryTypes.SELECT,
      }
    );

    try {
      // Resolve all promises in parallel
      const [userStats, mostRecentRace, totalRacesWon, [lastTenRaces]] =
        await Promise.all([
          userStatsPromise,
          mostRecentRacePromise,
          totalRacesWonPromise,
          lastTenRacesPromise,
        ]);

      // Extract user stats
      const averageWpm = parseInt(userStats?.get("averageWpm")) || null;
      const averageAccuracy = parseInt(userStats?.get("averageAccuracy")) || null;
      const totalRaces = userStats?.get("totalRaces") || null;
      const highestWpm = userStats?.get("highestWpm") || null;

      // Extract other race stats
      const mostRecentWpm = mostRecentRace?.get("wpm") || null;
      const lastTenRacesWpm = parseInt(lastTenRaces?.lasttenraceswpm) || null;
      const lastTenRacesAccuracy = parseInt(lastTenRaces?.lasttenracesaccuracy) || null;


      const stats = {
        averageWpm,
        averageAccuracy,
        totalRaces,
        highestWpm,
        mostRecentWpm,
        totalRacesWon,
        lastTenRacesWpm,
        lastTenRacesAccuracy,
        guest: false, // just extra
      };

      res.json(stats);
    } catch (error) {
      console.error("Error fetching user stats:", error);
    }
    
  } catch (err) {
    res.json({ err: "Something went wrong..." });
  }
});

module.exports = router;
