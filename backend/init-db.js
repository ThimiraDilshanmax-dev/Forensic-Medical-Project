import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import pool from './config/db.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

async function initDatabase() {
    try {
        console.log("Reading schema.sql...");
        const schemaPath = path.join(__dirname, 'schema.sql');
        const sql = fs.readFileSync(schemaPath, 'utf8');

        console.log("Connecting to the database and running schema...");
        // Execute schema queries
        await pool.query(sql);

        console.log("Database initialized successfully with all tables!");
    } catch (error) {
        console.error("Failed to initialize database:", error);
        process.exit(1);
    } finally {
        await pool.end();
        console.log("Database connection closed.");
    }
}

initDatabase();
