require("dotenv").config();

const {Pool} = require("pg");

const pool = new Pool({
    host: process.env.DATABASE_HOST,
    user: process.env.DATABASE_USER,
    password: process.env.DATABASE_PASSWORD,
    database: process.env.DATABASE_NAME,
    port: process.env.DATABASE_PORT,
    schema: "public"
})

async function runQuery(query, params = []) {
    const client = await pool.connect();
    try {
        return await client.query(query, params);
    } catch (error) {
        console.error(error);
        throw error;
    } finally {
        client.release();
    }
}

module.exports = runQuery;