const db = require("../config/db"); 


const formatDate = (date) => {
  return date.toISOString().split('T')[0];
};


const donate = async (req, res) => {
  const { cause_id, amount, anonymous, recurring, frequency } = req.body;
  const user_id = req.user.id; 

  if (!cause_id || !amount || isNaN(amount) || Number(amount) <= 0) {
    return res.status(400).json({ message: "Cause and valid amount are required" });
  }

  try {
    const donationDate = new Date();
    await db("donations").insert({
      cause_id,
      user_id,
      amount: Number(amount),
      anonymous_flag: anonymous || false,
      recurring_flag: recurring || false,
      donation_date: formatDate(donationDate),
    });



    res.json({ message: "Donation successful" });
  } catch (err) {
    console.error("Donation error:", err);
    res.status(500).json({ message: "Donation failed" });
  }
};

module.exports = { donate };
