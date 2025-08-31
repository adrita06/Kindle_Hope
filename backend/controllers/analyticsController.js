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

exports.getDonorDonationDetails = async (req, res) => {
  try {
    const details = await knex('donation_schedule')
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
      .leftJoin('causes', 'donation_schedule.cause_id', 'causes.cause_id');

    const today = new Date();

    const enhanced = details.map(row => {
      let status = "Active";
      if (row.end_date) {
        const endDate = new Date(row.end_date);
        status = endDate >= today ? "Active" : "Inactive";
      }
      return { ...row, status };
    });

    res.json(enhanced);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch donation details.' });
  }
};