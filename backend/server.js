require('dotenv').config();
const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();

// Enable Cross-Origin Resource Sharing (CORS) so Live Server on Port 5500 can talk to Port 5001
app.use(cors({
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));
app.use(express.json());

// Establish connection with local MySQL instance using your password configuration
const db = mysql.createConnection({
    host: process.env.DB_HOST || 'localhost',
    user: process.env.DB_USER || 'root',
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME || 'uei_db',
    port: process.env.DB_PORT || 3306
});
db.connect((err) => {
    if (err) {
        console.error('❌ Database connection failed: - server.js:26', err.message);
        return;
    }
    console.log('✅ SUCCESS: Server & MySQL Database (uei_db) are linked! - server.js:29');
    
    // Create the job applications tracking table if it doesn't exist yet
    const createTableSql = `
        CREATE TABLE IF NOT EXISTS job_applications (
            id INT AUTO_INCREMENT PRIMARY KEY,
            student_name VARCHAR(100),
            company_name VARCHAR(100),
            cgpa DECIMAL(3,2),
            skills TEXT,
            applied_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        );
    `;
    db.query(createTableSql, (tableErr) => {
        if (tableErr) console.error('Error initializing job_applications table: - server.js:43', tableErr.message);
    });
});

/* ==========================================================================
   API ENDPOINTS
   ========================================================================== */

// 1. ROUTE: User Authentication/Login
app.post('/api/login', (req, res) => {
    const { username, password } = req.body;
    const sql = "SELECT * FROM users WHERE username = ? AND password = ?";
    db.query(sql, [username, password], (err, results) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        if (results.length > 0) {
            res.json({ success: true, message: "Login successful", username });
        } else {
            res.status(401).json({ success: false, message: "Invalid credentials" });
        }
    });
});

// 2. ROUTE: Fetch Student Dashboard Profile Data
app.get('/api/student/:username', (req, res) => {
    const username = req.params.username;
    const sql = "SELECT name, reg_no, subject, grade, cgpa, status, attendance FROM students WHERE name = ? OR name = 'harshi'";
    db.query(sql, [username], (err, results) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        if (results.length > 0) {
            res.json(results[0]);
        } else {
            res.status(404).json({ success: false, message: "Student metrics records not found" });
        }
    });
});

// 3. ROUTE: Fetch Dynamic Course Materials
app.get('/api/materials', (req, res) => {
    const sql = "SELECT * FROM course_materials";
    db.query(sql, (err, results) => {
        if (err) return res.status(500).json({ success: false, error: err.message });
        res.json(results);
    });
});

// 4. ROUTE: Receive and Record Job Applications
app.post('/api/apply', (req, res) => {
    const { name, company, cgpa, skills } = req.body;
    
    if (!name || !company || !cgpa || !skills) {
        return res.status(400).json({ success: false, message: "All application form fields are strictly required." });
    }

    const sql = `INSERT INTO job_applications (student_name, company_name, cgpa, skills) VALUES (?, ?, ?, ?)`;
    db.query(sql, [name, company, cgpa, skills], (err, result) => {
        if (err) {
            console.error("Database tracking write error: - server.js:99", err);
            return res.status(500).json({ success: false, message: "Failed to record placement data to database." });
        }
        res.json({ success: true, message: "Application tracked and recorded successfully!" });
    });
});

// Set port to 5001 as verified in project workflow
const PORT = process.env.PORT || 5001;

app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Express API engine actively listening on port ${PORT} - server.js:110`);
});