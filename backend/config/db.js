const oracledb = require('oracledb');  
require('dotenv').config();

async function initOracle() {
    try {
        await oracledb.createPool({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECT
        });
        console.log("✅ Oracle DB Connected");
    } catch (err) {
        console.error("❌ DB Connection Error:", err);
    }
}

module.exports = initOracle;