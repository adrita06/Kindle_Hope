const express = require("express");
const app = express();
const authRoutes = require("./routes/authRoutes");

app.use(express.json());
app.use("/api/auth", authRoutes);

app.listen(3000, () => console.log("Server running on 3000"));
app.get('/', (req, res) => {
  res.send('🚀 Server is running');
});
