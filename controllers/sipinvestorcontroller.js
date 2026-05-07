const db = require("../utility/dbManager");
const { signJwt, verifyJwt } = require("../utility/authmanager");
const investors = require("../models/sipinvestormodel"); 


exports.login = (req, res) => {
    const { email, password } = req.body;

    const constantUser = investors.find(i => i.email === email && i.password === password);
    if (constantUser) {
        
        const token = signJwt({ investor_id: "INV001" });
        return res.status(200).json({
            message: "Login successful ",
            token: token
        });
    }

   
    const sql = "SELECT * FROM investor WHERE email = ? AND password = ?";
    db.get(sql, [email, password], (err, user) => {
        if (err) {
            console.error("Database Error during login:", err.message);
            return res.status(500).json({ error: "Database error", details: err.message });
        }

        if (user) {
            
            const token = signJwt({ investor_id: user.investor_id });
            res.status(200).json({
                message: "Login successful (Database User)",
                token: token
            });
        } else {
            res.status(401).send("Login failed: Invalid credentials");
        }
    });
};

exports.getDetails = (req, res) => {
    let authHeader = req.headers.authorization;
    if (!authHeader) return res.status(401).send("Access denied. No token provided.");

   
    const token = authHeader.startsWith("Bearer ") ? authHeader.split(" ")[1] : authHeader;

    const decoded = verifyJwt(token);
    if (!decoded) return res.status(401).send("Invalid token.");

    const sql = "SELECT * FROM investor";
    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error("Database Error fetching all investor details:", err.message);
            return res.status(500).json({ error: "Database error", details: err.message });
        }

        if (!rows || rows.length === 0) {
            console.log("No data found in the investor table.");
            return res.status(404).json({ error: "No records found in the database" });
        }

        console.log("All Investor Records:", rows);
        res.status(200).json(rows);
    });
};

exports.createInvestor = (req, res) => {
    const { 
        investor_id, first_name, middle_name, last_name, pancard_no, adhaar_no, 
        passport_no, date_of_birth, gender, occupation, annual_income, 
        marital_status, education, qualification, address, email, password 
    } = req.body;

    const sql = `INSERT INTO investor (
        investor_id, first_name, middle_name, last_name, pancard_no, adhaar_no, 
        passport_no, date_of_birth, gender, occupation, annual_income, 
        marital_status, education, qualification, address, email, password
    ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;

    const params = [
        investor_id, first_name, middle_name, last_name, pancard_no, adhaar_no, 
        passport_no, date_of_birth, gender, occupation, annual_income, 
        marital_status, education, qualification, address, email, password
    ];

    db.run(sql, params, function(err) {
        if (err) {
            console.error("Error creating investor:", err.message);
            return res.status(500).json({ error: "Database error", details: err.message });
        }
        res.status(201).json({ message: "Investor created successfully", investor_id });
    });
};


exports.getInvestorById = (req, res) => {
    const { investorId } = req.params;

  
    if (investorId === "INV001") {
        return res.status(200).json(investors[0]);
    }

    const sql = "SELECT * FROM investor WHERE investor_id = ?";
    db.get(sql, [investorId], (err, row) => {
        if (err) return res.status(500).json({ error: "Database error" });
        if (!row) return res.status(404).json({ error: "Investor not found" });
        res.status(200).json(row);
    });
};

exports.getHoldings = (req, res) => {
    const { investorId } = req.params;

    if (investorId === "INV001") {
        return res.status(200).json(investors[0].portfolio);
    }

    const sql = "SELECT * FROM investor_holdings WHERE investor_id = ?";
    db.all(sql, [investorId], (err, rows) => {
        if (err) {
            if (err.message.includes("no such table")) return res.status(200).json([]);
            return res.status(500).json({ error: "Database error" });
        }
        res.status(200).json(rows || []);
    });
};


exports.getNetworth = (req, res) => {
    const { investorId } = req.params;

    if (investorId === "INV001") {
        const networth = investors[0].portfolio.reduce((acc, item) => acc + (item.price * item.quantity), 0);
        return res.status(200).json({ investor_id: investorId, networth });
    }

    const sql = "SELECT SUM(price * quantity) as networth FROM holdings WHERE investor_id = ?";
    db.get(sql, [investorId], (err, row) => {
        if (err) {
            if (err.message.includes("no such table")) return res.status(200).json({ investor_id: investorId, networth: 0 });
            return res.status(500).json({ error: "Database error" });
        }
        res.status(200).json({ 
            investor_id: investorId, 
            networth: row ? (row.networth || 0) : 0 
        });
    });
};