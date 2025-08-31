require("dotenv").config();
const express = require("express");
const app = express();
const cors = require('cors');
const adminRoutes = require("./routes/adminRoutes");
const authRoutes = require("./routes/authRoutes");
const causesRoutes = require("./routes/causesRoutes");
const donationRoutes = require("./routes/donationRoutes");
const recurringDonationRoutes = require('./routes/recurringDonationRoutes');
const analyticsRoutes = require("./routes/analyticsRoutes");


// Enable CORS first
app.use(cors({ origin: 'http://localhost:3000' }));

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/causes", causesRoutes);
app.use("/api/donations", donationRoutes);
app.use("/api/recurringDonation", recurringDonationRoutes);
app.use("/api/analytics", analyticsRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on ${PORT}`));

app.get('/', (req, res) => {
  res.send('🚀 Server is running');
});
