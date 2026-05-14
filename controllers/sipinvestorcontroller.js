const db = require("../utility/dbmanager");
const { signJwt, verifyJwt } = require("../utility/authmanager");
const investors = require("../models/sipinvestormodel");

// LOGIN
exports.login = (req, res) => {
    const { email, password } = req.body;

    // Check constant user
    const constantUser = investors.find(
        (i) => i.email === email && i.password === password
    );

    if (constantUser) {
        const token = signJwt({ investor_id: "INV001" });

        return res.status(200).json({
            message: "Login successful",
            token,
            investor_id: "INV001",
            user: {
                id: "INV001",
                name: constantUser.name,
                email: constantUser.email,
            },
        });
    }

    // Check database user
    const sql = "SELECT * FROM investor WHERE email = ? AND password = ?";

    db.get(sql, [email, password], (err, user) => {
        if (err) {
            console.error("Database Error during login:", err.message);

            return res.status(500).json({
                error: "Database error",
                details: err.message,
            });
        }

        if (user) {
            const token = signJwt({
                investor_id: user.investor_id,
            });

            return res.status(200).json({
                message: "Login successful (Database User)",
                token,
                investor_id: user.investor_id,
                user: {
                    id: user.investor_id,
                    name:
                        user.name ||
                        `${user.first_name || ""} ${user.last_name || ""}`.trim(),
                    email: user.email,
                },
            });
        }

        return res.status(401).json({
            error: "Invalid email or password",
        });
    });
};

exports.getAllTransactions = (req, res) => {
  const sql = `
    SELECT
      txn_id,
      sip_id,
      investor_id,
      fund_id,
      txn_type,
      txn_amount,
      nav_value,
      units_allocated,
      txn_date,
      payment_mode,
      payment_reference,
      transaction_status
    FROM investment_transaction
    ORDER BY txn_date DESC
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Transaction Fetch Error:", err);

      return res.status(500).json({
        error: err.message,
      });
    }

    return res.status(200).json(rows);
  });
};

// GET ALL INVESTORS
exports.getAllInvestors = (req, res) => {
  const sql = `
    SELECT
      investor_id,
      first_name,
      middle_name,
      last_name,
      email,
      adhaar_no
    FROM investor
  `;

  db.all(sql, [], (err, rows) => {
    if (err) {
      console.error("Database Error:", err);

      return res.status(500).json({
        error: err.message,
      });
    }

    console.log("All Investors:", rows);

    return res.status(200).json(rows);
  });
};

// GET ALL INVESTORS
exports.getDetails = (req, res) => {
    let authHeader = req.headers.authorization;

    if (!authHeader) {
        return res.status(401).send("Access denied. No token provided.");
    }

    // Remove Bearer if exists
    const token = authHeader.startsWith("Bearer ")
        ? authHeader.split(" ")[1]
        : authHeader;

    const decoded = verifyJwt(token);

    if (!decoded) {
        return res.status(401).send("Invalid token.");
    }

    const sql = "SELECT investor_id, first_name, middle_name, last_name, email, adhaar_no FROM investor";

    db.all(sql, [], (err, rows) => {
        if (err) {
            console.error(
                "Database Error fetching all investor details:",
                err.message
            );
            console.log(err);

            if (err.message.toLowerCase().includes("no such table")) {
                // Fallback to model data, mapped to correct fields
                const mappedInvestors = investors.map((inv, index) => ({
                    investor_id: `INV${String(index + 1).padStart(3, '0')}`,
                    first_name: inv.name.split(' ')[0] || '',
                    middle_name: '',
                    last_name: inv.name.split(' ').slice(1).join(' ') || '',
                    email: inv.email,
                    adhaar_no: ''
                }));
                return res.status(200).json(mappedInvestors);
            }

            return res.status(500).json({
                error: err.message,
            });
        }

        if (!rows || rows.length === 0) {
            // Fallback to model data
            const mappedInvestors = investors.map((inv, index) => ({
                investor_id: `INV${String(index + 1).padStart(3, '0')}`,
                first_name: inv.name.split(' ')[0] || '',
                middle_name: '',
                last_name: inv.name.split(' ').slice(1).join(' ') || '',
                email: inv.email,
                adhaar_no: ''
            }));
            return res.status(200).json(mappedInvestors);
        }

        return res.status(200).json(rows);
    });
};

// CREATE INVESTOR
exports.createInvestor = (req, res) => {
    const {
        investor_id,
        first_name,
        middle_name,
        last_name,
        pancard_no,
        adhaar_no,
        passport_no,
        date_of_birth,
        gender,
        occupation,
        annual_income,
        marital_status,
        education,
        qualification,
        address,
        email,
        password,
    } = req.body;

    const sql = `
        INSERT INTO investor (
            investor_id,
            first_name,
            middle_name,
            last_name,
            pancard_no,
            adhaar_no,
            passport_no,
            date_of_birth,
            gender,
            occupation,
            annual_income,
            marital_status,
            education,
            qualification,
            address,
            email,
            password
        )
        VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;

    const params = [
        investor_id,
        first_name,
        middle_name,
        last_name,
        pancard_no,
        adhaar_no,
        passport_no,
        date_of_birth,
        gender,
        occupation,
        annual_income,
        marital_status,
        education,
        qualification,
        address,
        email,
        password,
    ];

    db.run(sql, params, function (err) {
        if (err) {
            console.error("Error creating investor:", err.message);
            console.log(err);

            return res.status(500).json({
                error: err.message,
            });
        }

        return res.status(201).json({
            message: "Investor created successfully",
            investor_id,
        });
    });
};

// GET INVESTOR BY ID
exports.getInvestorById = (req, res) => {
  const { investor_id } = req.params;

  console.log("Requested Investor ID:", investor_id);

  const sql =
    "SELECT * FROM investor WHERE investor_id = ?";

  db.get(sql, [investor_id], (err, row) => {
    if (err) {
      console.error("Database Error:", err);

      return res.status(500).json({
        error: err.message,
      });
    }

    console.log("Investor Row:", row);

    if (!row) {
      return res.status(404).json({
        error: "Investor not found",
      });
    }

    return res.status(200).json(row);
  });
};

// GET HOLDINGS
exports.getHoldings = (req, res) => {
    const { investor_id } = req.params;

    // Constant user
    if (investor_id === "INV001") {
        return res.status(200).json(investors[0].portfolio);
    }

    const sql =
        "SELECT * FROM investor_holdings WHERE investor_id = ?";

    db.all(sql, [investor_id], (err, rows) => {
        if (err) {
            console.error("Database error:", err.message);
            console.log(err);

            if (err.message.includes("no such table")) {
                return res.status(200).json([]);
            }

            return res.status(500).json({
                error: err.message,
            });
        }

        return res.status(200).json(rows || []);
    });
};

// GET NETWORTH
exports.getNetworth = (req, res) => {
    const { investor_id } = req.params;

    // Constant user
    if (investor_id === "INV001") {
        const networth = investors[0].portfolio.reduce(
            (acc, item) => acc + item.price * item.quantity,
            0
        );

        return res.status(200).json({
            investor_id: investor_id,
            networth,
        });
    }

    const sql =
        "SELECT SUM(price * quantity) AS networth FROM holdings WHERE investor_id = ?";

    db.get(sql, [investor_id], (err, row) => {
        if (err) {
            if (err.message.includes("no such table")) {
                return res.status(200).json({
                    investor_id: investor_id,
                    networth: 0,
                });
            }

            return res.status(500).json({
                error: "Database error",
            });
        }

        return res.status(200).json({
            investor_id: investor_id,
            networth: row ? row.networth || 0 : 0,
        });
    });
};