const express = require("express");
const router = express.Router();
// At the top of your route file
// Change to:
const db = require("../db/knex"); 

const { create, end } = require("../controllers/recurringDonationController");
const { verifyToken } = require("../middlewares/authMiddleware"); 

// Protect this route with JWT
router.post("/create", verifyToken, create);
router.post("/end", verifyToken, end);

router.post('/run-recurring', async (req, res) => {
  console.log('Route hit: /run-recurring');
  
  try {
    // Oracle syntax for calling stored procedures
    await db.raw(`BEGIN process_recurring_donations; END;`);
    
    console.log('Recurring donations processed successfully');
    res.json({ success: true, message: 'Recurring donations processed!' });
  } catch (err) {
    console.error('Error executing recurring donations:', err);
    res.status(500).json({ 
      success: false, 
      error: err.message 
    });
  }
});

module.exports = router;
