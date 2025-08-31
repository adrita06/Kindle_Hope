const knex = require('../db/knex'); // Adjust path as needed

exports.getDonorLeaderboard = async (req, res) => {
  try {
    const leaderboard = await knex("donations")
      .select(
        knex.raw(`
          CASE 
            WHEN "donations"."anonymous_flag" = 1 THEN 'Anonymous'
            ELSE "users"."name"
          END as donor_name
        `),
        knex.raw(`
          CASE 
            WHEN "donations"."anonymous_flag" = 1 THEN NULL
            ELSE "users"."email"
          END as donor_email
        `),
        knex.raw(`
          CASE 
            WHEN "donations"."anonymous_flag" = 1 THEN 'anon_' || "donations"."donation_id"
            ELSE 'user_' || "users"."id"
          END as donor_key
        `)
      )
      .sum("donations.amount as total_donated")
      .leftJoin("users", "donations.user_id", "users.id")  // ✅ correct join
      .groupByRaw(`
        CASE 
          WHEN "donations"."anonymous_flag" = 1 THEN 'Anonymous'
          ELSE "users"."name"
        END,
        CASE 
          WHEN "donations"."anonymous_flag" = 1 THEN NULL
          ELSE "users"."email"
        END,
        CASE 
          WHEN "donations"."anonymous_flag" = 1 THEN 'anon_' || "donations"."donation_id"
          ELSE 'user_' || "users"."id"
        END
      `)
      .orderBy("total_donated", "desc");

    console.log("Raw leaderboard:", leaderboard); // 🔍 see what Oracle actually returns
    res.json(leaderboard);
  } catch (err) {
    console.error("Leaderboard error:", err); // ✅ log exact DB error
    res.status(500).json({ error: "Failed to fetch leaderboard." });
  }
};

exports.getRecurringDonations = async (req, res) => {
  try {
    const userId = req.user.id; // <-- comes from JWT middleware

    const recurringDonations = await knex('donation_schedule')
      .select(
        'donation_schedule.schedule_id',
        'causes.title as cause_title',
        'donation_schedule.amount',
        'donation_schedule.frequency',
        'donation_schedule.next_payment_date',
        'donation_schedule.start_date',
        'donation_schedule.end_date'
      )
      .leftJoin('causes', 'donation_schedule.cause_id', 'causes.cause_id')
      .where('donation_schedule.user_id', userId)
      .orderBy('donation_schedule.start_date', 'desc');

    const enhanced = recurringDonations.map(row => ({
      ...row,
      status: (row.end_date && new Date(row.end_date) < new Date()) ? 'Inactive' : 'Active'
    }));

    res.json(enhanced);
  } catch (err) {
    console.error('Recurring donations error:', err);
    res.status(500).json({ error: 'Failed to fetch recurring donations.' });
  }
};

exports.getOneTimeDonations = async (req, res) => {
  try {
    const userId = req.user.id;

    const oneTimeDonations = await knex('donations')
      .select(
        'donations.donation_id',
        'causes.title as cause_title',
        'donations.amount',
        'donations.donation_date',
        'donations.anonymous_flag'
      )
      .leftJoin('causes', 'donations.cause_id', 'causes.cause_id')
      .where('donations.user_id', userId)
      .andWhere('donations.recurring_flag', false)
      .orderBy('donations.donation_date', 'desc');

    res.json(oneTimeDonations);
  } catch (err) {
    console.error('One-time donations error:', err);
    res.status(500).json({ error: 'Failed to fetch one-time donations.' });
  }
};


// Add to your recurring donation controller
exports.endRecurringDonation = async (req, res) => {
  try {
    const { scheduleId } = req.params;
    const userId = req.user.id;

    const deleted = await knex('donation_schedule')
      .where({ schedule_id: scheduleId, user_id: userId })
      .del();

    if (!deleted) {
      return res.status(404).json({ error: 'Recurring donation not found or not yours.' });
    }

    res.json({ message: 'Recurring donation ended and removed.' });
  } catch (err) {
    console.error('End recurring donation error:', err);
    res.status(500).json({ error: 'Failed to end recurring donation.' });
  }
};
 