const express = require("express");
const router = express.Router();
const { getDonorLeaderboard, getDonorDonationDetails } = require("../controllers/analyticsController");
const { verifyToken, requireRole } = require("../middlewares/authMiddleware");


router.get('/leaderboard', getDonorLeaderboard);
router.get('/donations', getDonorDonationDetails);

module.exports = router;