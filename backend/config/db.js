require("dotenv").config();
const knex = require("knex");

const db = knex({
  client: "oracledb",
  connection: {
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    connectString: process.env.DB_CONNECT
  },
  pool: { min: 0, max: 10 }
});

db.raw("SELECT 'Hello from Knex + Oracle' AS MESSAGE FROM dual")
  .then(res => console.log("✅ Oracle Connected:", res))
  .catch(err => console.error("❌ Oracle Error:", err));

module.exports = db;
