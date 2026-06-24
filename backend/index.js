import app from "./app.js";
import pool from "./config/db.js";

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