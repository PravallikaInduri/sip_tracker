const db = require("../utility/dbmanager");


exports.createFund = (req, res) => {
    const { fund_id, amc_id, fund_name, fund_type, category, risk_level, nav, launch_date } = req.body;
    const sql = "INSERT INTO mutual_fund (fund_id, amc_id, fund_name, fund_type, category, risk_level, nav, launch_date) VALUES (?, ?, ?, ?, ?, ?, ?, ?)";
    db.run(sql, [fund_id, amc_id, fund_name, fund_type, category, risk_level, nav, launch_date], function(err) {
        if (err) return res.status(500).json({ error: "Database error", details: err.message });
        res.status(201).json({ message: "Fund created successfully", fund_id });
    });
};

exports.getFunds = (req, res) => {
    db.all("SELECT * FROM mutual_fund", [], (err, rows) => {
        if (err) return res.status(500).json({ error: "Database error", details: err.message });
        res.status(200).json(rows);
    });
};

exports.updateNav = (req, res) => {
    const { fundId } = req.params;
    const { nav } = req.body;
    const sql = "UPDATE mutual_fund SET nav = ? WHERE fund_id = ?";
    db.run(sql, [nav, fundId], function(err) {
        if (err) return res.status(500).json({ error: "Database error", details: err.message });
        if (this.changes === 0) return res.status(404).json({ error: "Fund not found" });
        res.status(200).json({ message: "NAV updated successfully" });
    });
};