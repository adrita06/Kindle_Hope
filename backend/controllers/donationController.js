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

    
    let nextPaymentDate = null;
    if (recurring && frequency) {
      nextPaymentDate = new Date(donationDate); 
      switch (frequency) {
        case "daily":
          nextPaymentDate.setDate(nextPaymentDate.getDate() + 1);
          break;
        case "weekly":
          nextPaymentDate.setDate(nextPaymentDate.getDate() + 7);
          break;
        case "monthly":
          nextPaymentDate.setMonth(nextPaymentDate.getMonth() + 1);
          break;
        case "yearly":
          nextPaymentDate.setFullYear(nextPaymentDate.getFullYear() + 1);
          break;
        default:
          return res.status(400).json({ message: "Invalid frequency" });
      }
    }

    // Insert donation into donations table
    await db("donations").insert({
      cause_id,
      user_id,
      amount: Number(amount),
      anonymous_flag: anonymous || false,
      recurring_flag: recurring || false,
      donation_date: formatDate(donationDate),
    });

    // Insert into donation_schedule if recurring
    if (recurring && frequency) {
      await db("donation_schedule").insert({
        user_id,
        amount: Number(amount),
        frequency,
        start_date: formatDate(donationDate),
        next_payment_date: formatDate(nextPaymentDate),
      });
    }


    res.json({ message: "Donation successful" });
  } catch (err) {
    console.error("Donation error:", err);
    res.status(500).json({ message: "Donation failed" });
  }
};

module.exports = { donate };
