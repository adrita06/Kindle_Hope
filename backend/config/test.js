const initOracle = require('./db');

(async () => {
    const pool = await initOracle();

    // You can now use pool to execute queries
    const connection = await pool.getConnection();
    const result = await connection.execute('SELECT sysdate FROM dual');
    console.log("Current Oracle Date:", result.rows[0][0]);
    connection.close();
})();
