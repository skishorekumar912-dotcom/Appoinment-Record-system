const express = require("express");
const cors = require("cors");
const db = require("./db");

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

app.get("/", (req, res) => {
    res.json({
        message: "Appointment Record System API is running"
    });
});
// CREATE - Add a new appointment
app.post("/appointments", (req, res) => {
    const { name, email, phone, appointment_date, reason } = req.body;

    // Basic validation
    if (!name || !email || !phone || !appointment_date || !reason) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const sql = `
    INSERT INTO appointments
    (name, email, phone, appointment_date, reason, status)
    VALUES (?, ?, ?, ?, ?, 'PENDING')
  `;

    db.query(
        sql,
        [name, email, phone, appointment_date, reason],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: "Failed to create appointment"
                });
            }

            res.status(201).json({
                message: "Appointment created successfully",
                appointmentId: result.insertId
            });
        }
    );
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});