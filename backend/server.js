const express = require("express");
const app = express();
const cors = require('cors');
const authRoutes = require("./routes/authRoutes");
const recurringDonationRoutes = require('./routes/recurringDonationRoutes');

// Enable CORS first
app.use(cors({ origin: 'http://localhost:3000' }));

app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/recurringDonation", recurringDonationRoutes);

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => console.log(`Server running on ${PORT}`));

app.get('/', (req, res) => {
  res.send('🚀 Server is running');
});
