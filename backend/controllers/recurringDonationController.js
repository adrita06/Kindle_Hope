const db = require("../config/db");

const create = async (req, res) => {
  console.log('🚀 Recurring Donation request received');
  console.log('📝 Request body:', req.body);

  try {
    const { amount, frequency, start_date, end_date } = req.body;

    // Extract user_id from authenticated request (JWT middleware should set req.user)
    const user_id = req.user?.id;
    const cause_id = req.cause?.id;
    const next_payment_date = start_date; // Initial next payment date is the start date  

    // Validate input
    if (!amount || !frequency || !start_date || !end_date || !user_id) {
      console.log('❌ Missing required fields');
      return res.status(400).json({
        message: "All fields (amount, frequency, start_date, end_date, user_id) are required"
      });
    }

    const donationScheduleData = {
      amount,
      frequency,
      start_date,
      end_date,
      next_payment_date,
      user_id,
      cause_id
    };

    // Insert donation schedule
    const insertResult = await db("donation_schedule").insert(donationScheduleData);
    console.log('📝 Insert result:', insertResult);

    // Fetch the inserted schedule (optional, but good for confirmation)
    const newSchedule = await db("donation_schedule")
      .where({ id: insertResult[0] })
      .first();

    console.log('📅 New donation schedule created:', newSchedule);

    res.status(201).json({
      message: "Recurring donation schedule created successfully!",
      schedule: newSchedule
    });

  } catch (err) {
    console.error("❌ Donation schedule error:", err);
    res.status(500).json({
      message: "Failed to create recurring donation schedule. Please try again.",
      error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
    });
  }
};

module.exports = {
  create
};
