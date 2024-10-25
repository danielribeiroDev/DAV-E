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
    await _createUsersTable(db)
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
        user_id UUID NOT NULL,
        name VARCHAR(255) NOT NULL,
        description TEXT,
        CONSTRAINT fk_user
            FOREIGN KEY (user_id) 
            REFERENCES users (id) 
            ON DELETE CASCADE
        );
        `
    await db.query(query);
    console.log('->Collections table created')
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
    console.log('->Files table created')
}

async function _createAssistantsTable(db) {
    const query = `
        CREATE EXTENSION IF NOT EXISTS "pgcrypto";
        CREATE TABLE IF NOT EXISTS assistants (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL,
            description TEXT,
            name TEXT NOT NULL,
            CONSTRAINT fk_user
                FOREIGN KEY (user_id) 
                REFERENCES users (id) 
                ON DELETE CASCADE
        );
        `
    await db.query(query)
    console.log('->Assistants table created')
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
    console.log('->AssistantsCollections table created')
}

async function _createChatsTable(db) {
    const query = `
        CREATE EXTENSION IF NOT EXISTS "pgcrypto";
        CREATE TABLE IF NOT EXISTS chats (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            user_id UUID NOT NULL,
            assistant_id UUID NOT NULL,
            date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            name TEXT NOT NULL,
            CONSTRAINT fk_assistant
                FOREIGN KEY (assistant_id) 
                REFERENCES assistants (id),
            CONSTRAINT fk_user
                FOREIGN KEY (user_id) 
                REFERENCES users (id) 
                ON DELETE CASCADE
        );
    `
    await db.query(query)
    console.log('->Chats table created')
}

async function _createUsersTable(db) {
    const query = `
        
        CREATE EXTENSION IF NOT EXISTS "pgcrypto";
        CREATE TABLE IF NOT EXISTS users (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL UNIQUE,
            password VARCHAR(255) NOT NULL
        );
    `
    await db.query(query)
    console.log('->Users table created')
}

export {
    initializeDatabase, setup_project_tables
}

