const express = require("express");
const router = express.Router();
const { getDonorLeaderboard, getRecurringDonations, getOneTimeDonations, endRecurringDonation } = require("../controllers/analyticsController");
const { verifyToken, requireRole } = require("../middlewares/authMiddleware");


router.get('/leaderboard', verifyToken, getDonorLeaderboard);
router.get('/recurring-donations', verifyToken, getRecurringDonations);
router.get('/onetime-donations', verifyToken, getOneTimeDonations);
router.put('/end/:scheduleId', verifyToken, endRecurringDonation);
module.exports = router;