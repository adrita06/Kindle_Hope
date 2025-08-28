const express = require("express");
const router = express.Router();
const db = require("../config/db"); 
const { donate } = require("../controllers/donationController");
const { verifyToken } = require("../middlewares/authMiddleware");

router.post("/", verifyToken, async (req, res) => {
  const { cause_id, amount, anonymous, recurring, frequency } = req.body;
  const user_id = req.user.id;

  if (!amount || !cause_id) {
    return res.status(400).json({ message: "Amount and cause are required" });
  }

  try {
    await db("donations").insert({
      amount,
      donation_date: new Date(),
      recurring_flag: recurring || false,
      anonymous_flag: anonymous || false,
      user_id,
      cause_id,
    });

    if (recurring) {
      await db("donation_schedule").insert({
        amount,
        frequency,
        start_date: new Date(),
        next_payment_date: new Date(),
        user_id,
      });
    }

    res.json({ message: "Donation successful!" });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to process donation" });
  }
});

module.exports = router;
