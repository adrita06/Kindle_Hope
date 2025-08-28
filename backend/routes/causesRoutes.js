// routes/causesRoutes.js
const express = require("express");
const router = express.Router();
const knex = require("../db/knex");

// Public endpoint for all users
router.get("/", async (req, res) => {
  try {
    const causes = await knex("causes").select("*");
    res.json(causes);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch causes" });
  }
});

module.exports = router;
