import express from "express";
import dotenv from "dotenv";
import pkg from "pg";



const { Pool } = pkg;

dotenv.config();

const app = express();

app.use(express.json());


const POSTGRES_URI = process.env.POSTGRES_URI;

const pool = new Pool({
    connectionString: POSTGRES_URI,
    ssl: {
        rejectUnauthorized: false
    }
});

// Test database connection
pool.connect()
    .then(client => {
        console.log("Connected to PostgreSQL successfully");
        client.release();
    })
    .catch(err => {
        console.error("Database connection failed:", err);
    });

app.listen(3000, () => {
    console.log("Server started successfully");
    console.log("Listening on port 3000");
});

export default pool;