import pkg from 'pg';
const { Pool } = pkg;
import * as dotenv from "dotenv";
dotenv.config();

///:: initialize database conection
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

///:: verify database connection
async function verifyConnection(pool) {
    try {
      const client = await pool.connect();
      await client.query('SELECT 1');
      client.release();
      console.log('Database connection is valid');
    } catch (err) {
      console.error('Failed to connect to the database', err);
      process.exit(2);
    }
}

///:: setup project dependency tables
async function setup_project_tables(db) {
    await _createCollectionsTable(db)
    await _createFilesTable(db)
    await _createAssistantsTable(db)
    await _createAssistantsCollectionsTable(db)
    await _createChatsTable(db)
}

async function _createCollectionsTable(db) {

    const query = `
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    CREATE TABLE IF NOT EXISTS collections (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT
        );
        `
    await db.query(query);
}

async function _createFilesTable(db) {
    const query = `
        CREATE EXTENSION IF NOT EXISTS "pgcrypto";
        CREATE TABLE IF NOT EXISTS files (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            collection_id UUID NOT NULL,
            date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            description TEXT,
            name TEXT NOT NULL,
            CONSTRAINT fk_collection
                FOREIGN KEY (collection_id) 
                REFERENCES collections (id) 
                ON DELETE CASCADE
        );
    `
    await db.query(query);
}

async function _createAssistantsTable(db) {
    const query = `
        CREATE EXTENSION IF NOT EXISTS "pgcrypto";
        CREATE TABLE IF NOT EXISTS assistants (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            description TEXT,
            name TEXT NOT NULL,
            collections TEXT 
        );
        `
    await db.query(query)
}

async function _createAssistantsCollectionsTable(db) {
    const query = `
        CREATE TABLE IF NOT EXISTS assistants_collections (
            assistant_id UUID NOT NULL,
            collection_id UUID NOT NULL,
            PRIMARY KEY (assistant_id, collection_id),
            FOREIGN KEY (assistant_id) REFERENCES assistants(id) ON DELETE CASCADE,
            FOREIGN KEY (collection_id) REFERENCES collections(id) ON DELETE CASCADE
        );

        `
    await db.query(query)
}

async function _createChatsTable(db) {
    const query = `
        CREATE EXTENSION IF NOT EXISTS "pgcrypto";
        CREATE TABLE IF NOT EXISTS chats (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            assistant_id UUID NOT NULL,
            date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            name TEXT NOT NULL,
            CONSTRAINT fk_assistant
                FOREIGN KEY (assistant_id) 
                REFERENCES assistants (id) 
        );
    `
    await db.query(query)
}

export {
    initializeDatabase, setup_project_tables
}

