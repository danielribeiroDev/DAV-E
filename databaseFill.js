import { initializeDatabase } from "./src/database.js";
import csv from 'csv-parser';
import fs from 'node:fs';
import { createObjectCsvWriter as createCsvWriter } from 'csv-writer';
import OpenAI from "openai";
import { ChromaClient } from "chromadb";

/// :: Fill database with AI 

async function run_rdb() {
    const db = await initializeDatabase();
    
    const createTable = `
    CREATE EXTENSION IF NOT EXISTS "pgcrypto";
    CREATE TABLE collections (
        id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        description TEXT
        );
        `
    const listTablesQuery = `
        SELECT table_name
        FROM information_schema.tables
        WHERE table_schema = 'public';
    `
    const createTableQuery = `
        CREATE EXTENSION IF NOT EXISTS "pgcrypto";
        CREATE TABLE IF NOT EXISTS files (
            id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
            collection_id UUID NOT NULL,
            date TIMESTAMP NOT NULL DEFAULT CURRENT_TIMESTAMP,
            description TEXT,
            purpose TEXT,
            name TEXT NOT NULL,
            CONSTRAINT fk_collection
                FOREIGN KEY (collection_id) 
                REFERENCES collections (id) 
                ON DELETE CASCADE
        );
    `
    await db.query(createTableQuery);
        
    const result =  await db.query(listTablesQuery)
    console.log('RESULT::::::::::::::::::'+ result)
}

async function vclearAllCollections() {
    try {
        const chromaClient = new ChromaClient()
        // Recupera todas as collections
        const collections = await chromaClient.listCollections();

        // Itera sobre cada collection e a deleta
        for (const collection of collections) {
            await chromaClient.deleteCollection({name: collection.name});
            console.log(`Collection ${collection.name} deletada com sucesso.`);
        }

        console.log('Todas as collections foram deletadas.');
    } catch (error) {
        console.error('Erro ao deletar as collections:', error);
    }
}

async function getAllCollections() {
    const chromaClient = new ChromaClient()
    const vcollections = await chromaClient.listCollections();

    const db = await initializeDatabase();
    const rCollections = await db.query('SELECT * FROM collections')
    const rFiles = await db.query('SELECT * FROM files')
}

async function rclearAllCollectionsAndFilles() {
    const db = await initializeDatabase();
    await db.query(
        `
        DELETE FROM collections;
        DELETE FROM files;
        `
    );
}

// Exemplo de uso com um cliente fictício do Chroma DB
// Assumindo que `chromaClient` já está configurado para se conectar ao Chroma DB
//clearAllCollections()

// await rclearAllCollectionsAndFilles()
// await vclearAllCollections()

getAllCollections()

