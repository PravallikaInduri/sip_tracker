const db = require("../utility/dbmanager");

exports.createSip = (req, res) => {
    const { sip_id, investor_id, portfolio_id, fund_id, sip_amount, sip_frequency, sip_execution_date, start_date, end_date, sip_status } = req.body;
    const sql = `INSERT INTO sip_registration (sip_id, investor_id, portfolio_id, fund_id, sip_amount, sip_frequency, sip_execution_date, start_date, end_date, sip_status) 
                 VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`;
    db.run(sql, [sip_id, investor_id, portfolio_id, fund_id, sip_amount, sip_frequency, sip_execution_date, start_date, end_date, sip_status || 'ACTIVE'], function(err) {
        if (err) return res.status(500).json({ error: "Database error", details: err.message });
        res.status(201).json({ message: "SIP created successfully", sip_id });
    });
};

exports.getSipById = (req, res) => {
    const { sipId } = req.params;
    const sql = "SELECT * FROM sip_registration WHERE sip_id = ?";
    db.get(sql, [sipId], (err, row) => {
        if (err) return res.status(500).json({ error: "Database error", details: err.message });
        if (!row) return res.status(404).json({ error: "SIP not found" });
        res.status(200).json(row);
    });
};


exports.getSipTransactions = (req, res) => {
    const { sipId } = req.params;
    const sql = "SELECT * FROM investment_transaction WHERE sip_id = ?";
    db.all(sql, [sipId], (err, rows) => {
        if (err) return res.status(500).json({ error: "Database error", details: err.message });
        res.status(200).json(rows);
    });
};

exports.processSipInstallment = (req, res) => {
    const { sipId } = req.params;
    const txn_date = new Date().toISOString().split('T')[0];

    db.get("SELECT * FROM sip_registration WHERE sip_id = ?", [sipId], (err, sip) => {
        if (err) return res.status(500).json({ error: "Database error", details: err.message });
        if (!sip) return res.status(404).json({ error: "SIP not found" });

        db.get("SELECT nav FROM mutual_fund WHERE fund_id = ?", [sip.fund_id], (err, fund) => {
            if (err) return res.status(500).json({ error: "Database error", details: err.message });
            if (!fund) return res.status(404).json({ error: "Mutual fund not found" });

            const units_allocated = parseFloat((sip.sip_amount / fund.nav).toFixed(4));

            const txnSql = `INSERT INTO investment_transaction (sip_id, investor_id, fund_id, txn_type, txn_amount, nav_value, units_allocated, txn_date, transaction_status) 
                           VALUES (?, ?, ?, 'SIP_INSTALLMENT', ?, ?, ?, ?, 'SUCCESS')`;
            
            db.run(txnSql, [sip.sip_id, sip.investor_id, sip.fund_id, sip.sip_amount, fund.nav, units_allocated, txn_date], function(err) {
                if (err) return res.status(500).json({ error: "Database error", details: err.message });

                const txn_id = this.lastID;

                db.get("SELECT * FROM portfolio_holdings WHERE portfolio_id = ? AND fund_id = ?", [sip.portfolio_id, sip.fund_id], (err, holding) => {
                    if (err) return res.status(500).json({ error: "Database error", details: err.message });

                    if (holding) {
                        const new_units = holding.total_units + units_allocated;
                        const new_invested = holding.invested_amount + sip.sip_amount;
                        const new_current = new_units * fund.nav;
                        const new_gain = new_current - new_invested;

                        const updateSql = `UPDATE portfolio_holdings SET total_units = ?, invested_amount = ?, current_value = ?, gain_loss = ?, last_updated = ? 
                                          WHERE holding_id = ?`;
                        db.run(updateSql, [new_units, new_invested, new_current, new_gain, txn_date, holding.holding_id], function(err) {
                            if (err) return res.status(500).json({ error: "Database error", details: err.message });
                            res.status(201).json({ message: "SIP installment processed successfully", txn_id });
                        });
                    } else {
                        const insertSql = `INSERT INTO portfolio_holdings (portfolio_id, fund_id, total_units, invested_amount, current_value, gain_loss, last_updated) 
                                          VALUES (?, ?, ?, ?, ?, ?, ?)`;
                        db.run(insertSql, [sip.portfolio_id, sip.fund_id, units_allocated, sip.sip_amount, sip.sip_amount, 0, txn_date], function(err) {
                            if (err) return res.status(500).json({ error: "Database error", details: err.message });
                            res.status(201).json({ message: "SIP installment processed successfully", txn_id });
                        });
                    }
                });
            });
        });
    });
};