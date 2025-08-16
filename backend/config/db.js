require('dotenv').config();   // must be at the very top
const oracledb = require('oracledb');

async function initOracle() {
    try {
        const pool = await oracledb.createPool({
            user: process.env.DB_USER,
            password: process.env.DB_PASSWORD,
            connectString: process.env.DB_CONNECT
        });
        console.log("✅ Oracle DB Connected");

        const connection = await pool.getConnection();
        const result = await connection.execute(`SELECT 'Hello from Oracle!' AS MESSAGE FROM dual`);
        console.log(result.rows[0][0]);
        await connection.close();

        return pool;
    } catch (err) {
        console.error("❌ DB Connection Error:", err);
    }
}

module.exports = initOracle;
