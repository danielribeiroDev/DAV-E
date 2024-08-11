import pkg from 'pg';
const { Pool } = pkg;
import * as dotenv from "dotenv";
dotenv.config();

async function initializeDatabase() {
    const pool = new Pool({
        user: process.env.POSTGRES_USER,
        host: process.env.POSTGRES_HOST,
        database: process.env.POSTGRES_DATABASE,
        password: process.env.POSTGRES_PASSWORD,
        port: process.env.POSTGRES_PORT,
    });

    await verifyConnection(pool).catch(err => {
        console.error('Error during database initialization', err);
        process.exit(1); // Exit the process with an error code
    });

    return {query: (text, params) => pool.query(text, params)}
}

async function verifyConnection(pool) {
    try {
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();
      console.log('Database connection is valid');
    } catch (err) {
      console.error('Failed to connect to the database', err);
    }
}

export {
    initializeDatabase
}