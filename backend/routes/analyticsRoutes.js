const express = require("express");
const router = express.Router();
const { getDonorLeaderboard, getRecurringDonations, getOneTimeDonations, endRecurringDonation } = require("../controllers/analyticsController");
const { verifyToken, requireRole } = require("../middlewares/authMiddleware");


router.get('/leaderboard', getDonorLeaderboard);
router.get('/recurring-donations', getRecurringDonations);
router.get('/onetime-donations', getOneTimeDonations);
router.put('/end/:scheduleId', endRecurringDonation);
module.exports = router;