const db = require("../config/db");

const create = async (req, res) => {
  try {
    const { amount, frequency, end_date, cause_id } = req.body;
    const user_id = req.user.id;

    // Convert strings to Date objects
    const start_date = new Date(); // today
    const next_payment_date = new Date(); // same as start_date
    const parsedEndDate = new Date(end_date); // parse frontend string

    // Validation
    if (!amount || !frequency || !end_date || !cause_id || !user_id) {
      return res.status(400).json({
        message: "Missing required fields",
        details: { amount, frequency, end_date, cause_id, user_id },
      });
    }
    // 1️⃣ Check if a schedule already exists
    const [existsResult] = await db.raw(
      `SELECT checkIfExists(:user_id, :cause_id) AS exists_flag FROM dual`,
      { user_id, cause_id }
    );

    // Oracle returns an array of rows with UPPERCASE column names
    const exists = existsResult.EXISTS_FLAG === 1;

    if (exists) {
      return res.status(400).json({
        message: "A recurring donation schedule already exists for this user and cause",
        details: { user_id, cause_id },
      });
    }


    // Prepare data for DB
    const donationScheduleData = {
      amount: Number(amount),
      frequency,
      start_date,          // Date object
      end_date: parsedEndDate, // Date object
      next_payment_date,   // Date object
      user_id,
      cause_id,
    };

    // Insert
    let newSchedule;
    try {
      [newSchedule] = await db("donation_schedule")
        .insert(donationScheduleData)
        .returning("*"); // Postgres
    } catch (err) {
      await db("donation_schedule").insert(donationScheduleData);
      newSchedule = await db("donation_schedule")
        .where("user_id", user_id)
        .orderBy("schedule_id", "desc")
        .first();
    }

    res.status(201).json({
      message: "Recurring donation schedule created successfully!",
      schedule: newSchedule,
    });
  } catch (err) {
    res.status(500).json({
      message: "Failed to create recurring donation schedule.",
      error: process.env.NODE_ENV === "development" ? err.message : "Internal server error",
    });
  }
};
const end = async (req, res) => {
  try {
    const { cause_id } = req.body;
    const user_id = req.user.id;
    
    // Validation
    if (!cause_id || !user_id) {
      return res.status(400).json({
        message: "Missing required fields",
        details: { cause_id, user_id },
      });
    }

    // Delete from donation_schedule
    const deletedRows = await db('donation_schedule')
      .where({ 
        cause_id: cause_id,
        user_id: user_id 
      })
      .del();

    // Check if any rows were actually deleted
    if (deletedRows === 0) {
      return res.status(404).json({
        message: "No recurring donation found for this user and cause",
        details: { cause_id, user_id }
      });
    }

    console.log(`Deleted ${deletedRows} recurring donation(s) for user ${user_id}, cause ${cause_id}`);
    
    res.json({
      success: true,
      message: "Recurring donation ended successfully",
      deletedRows: deletedRows
    });

  } catch (err) {
    console.error('Error ending recurring donation:', err);
    res.status(500).json({
      success: false,
      error: err.message
    });
  }
};

module.exports = { create , end};
