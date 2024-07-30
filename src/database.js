import pkg from 'pg';
const { Pool } = pkg;

async function initializeDatabase({
    credentials
}) {
    const pool = new Pool({
        user: credentials.user,
        host: credentials.host,
        database: credentials.database,
        password: credentials.password,
        port: credentials.port,
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