const express = require("express");
const router = express.Router();
const knex = require('../knex');
const { create } = require("../controllers/recurringDonationController");
const { verifyToken } = require("../middlewares/authMiddleware"); 

// Protect this route with JWT
router.post("/create", verifyToken, create);
router.post('/run-recurring', async (req, res) => {
  try {
    await knex.raw('BEGIN process_recurring_donations; END;');
    res.json({ success: true, message: 'Recurring donations processed!' });
  } catch (err) {
    console.error(err);
    res.status(500).json({ success: false, error: err.message });
  }
});

module.exports = router;
