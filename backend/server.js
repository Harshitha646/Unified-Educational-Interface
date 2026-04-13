const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');
const path = require('path');

const app = express();
app.use(cors());
app.use(express.json());
// This line allows your browser to find your HTML files
app.use(express.static(path.join(__dirname, '../'))); 

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'Hari@123', // <--- FIX THIS LINE
    database: 'uei_db',
});

db.connect(err => {
    if (err) console.log("❌ DB Error: - server.js:20" + err.message);
    else console.log("✅ SUCCESS: Server & Database are linked! - server.js:21");
});

// ROUTE: Handles Login
app.post('/login', (req, res) => {
    const { username } = req.body;
    // Check if user exists in your MySQL table
    db.query("SELECT * FROM students WHERE name = ?", [username], (err, result) => {
        if (result.length > 0) res.json({ success: true });
        else res.status(401).json({ success: false });
    });
});
app.get('/results/:regNo', (req, res) => {
    const regNo = req.params.regNo;
    const sql = "SELECT * FROM results WHERE reg_no = ?"; // Ensure table name is 'results'
    db.query(sql, [regNo], (err, result) => {
        if (err) return res.status(500).json(err);
        if (result.length > 0) {
            res.json(result[0]); // This sends the row (including cgpa) to your HTML
        } else {
            res.status(404).send("Not Found");
        }
    });
});

app.listen(5001, () => console.log("🚀 Server active on http://localhost:5001 - server.js:46"));