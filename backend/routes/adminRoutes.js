const express = require("express");
const router = express.Router();
const knex = require("../db/knex"); 
const { verifyToken, requireRole } = require("../middlewares/authMiddleware");


router.post("/causes", verifyToken, requireRole("admin"), async (req, res) => {
  const { title, description, goal_amount } = req.body;

  try {
    const [cause_id] = await knex("causes")
      .insert({
        title,
        description,
        goal_amount
      })
      .returning("cause_id"); 

    res.json({ message: "Cause created successfully", cause_id });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});


router.get("/causes", verifyToken, requireRole("admin"), async (req, res) => {
  try {
    const causes = await knex("causes").select("*");
    res.json(causes);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
