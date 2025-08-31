const knex = require('../db/knex'); // Adjust path as needed

exports.getDonorLeaderboard = async (req, res) => {
  try {
    const leaderboard = await knex('users')
      .select('users.id', 'users.name', 'users.email')
      .sum('donations.amount as total_donated')
      .leftJoin('donations', 'users.id', 'donations.user_id')
      .where('users.user_role', 'Donor')
      .groupBy('users.id', 'users.name', 'users.email')
      .orderBy('total_donated', 'desc')  // ✅ Sort by highest first
      .orderBy('users.name', 'asc');     // ✅ Secondary sort by name for ties

    const formattedLeaderboard = leaderboard.map(item => ({
      ...item,
      total_donated: parseFloat(item.total_donated) || 0
    }));

    res.json(formattedLeaderboard);
  } catch (err) {
    console.error('Leaderboard error:', err);
    res.status(500).json({ error: 'Failed to fetch leaderboard.' });
  }
};

exports.getRecurringDonations = async (req, res) => {
  try {
    const recurringDonations = await knex('donation_schedule')
      .select(
        'donation_schedule.schedule_id',
        'users.name as donor_name',
        'causes.title as cause_title',
        'donation_schedule.amount',
        'donation_schedule.frequency',
        'donation_schedule.next_payment_date',
        'donation_schedule.start_date',
        'donation_schedule.end_date'
      )
      .leftJoin('users', 'donation_schedule.user_id', 'users.id')
      .leftJoin('causes', 'donation_schedule.cause_id', 'causes.cause_id')
      .orderBy('donation_schedule.start_date', 'desc');

    // Add status
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

// Get one-time donations only
exports.getOneTimeDonations = async (req, res) => {
  try {
    const oneTimeDonations = await knex('donations')
      .select(
        'donations.donation_id',
        'users.name as donor_name',
        'causes.title as cause_title',
        'donations.amount',
        'donations.donation_date' // <-- use this instead of created_at
      )
      .leftJoin('users', 'donations.user_id', 'users.id')
      .leftJoin('causes', 'donations.cause_id', 'causes.cause_id')
      .orderBy('donations.donation_date', 'desc'); // <-- use this instead of created_at

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
    // Get today's date in YYYY-MM-DD format
    const today = new Date().toISOString().slice(0, 10);

    // Use Oracle's TO_DATE function for proper format
    await knex('donation_schedule')
      .where('schedule_id', scheduleId)
      .update({
        end_date: knex.raw(`TO_DATE(?, 'YYYY-MM-DD')`, [today])
      });

    res.json({ message: 'Recurring donation ended successfully.' });
  } catch (err) {
    console.error('End recurring donation error:', err);
    res.status(500).json({ error: 'Failed to end recurring donation.' });
  }
};