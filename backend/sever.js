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
// Get all appointments
app.get("/appointments", (req, res) => {
    const sql = "SELECT * FROM appointments ORDER BY id DESC";

    db.query(sql, (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Failed to fetch appointments"
            });
        }

        res.status(200).json(results);
    });
});
app.get("/appointments/:id", (req, res) => {
    const { id } = req.params;

    const sql = "SELECT * FROM appointments WHERE id = ?";

    db.query(sql, [id], (err, results) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Failed to fetch appointment"
            });
        }

        if (results.length === 0) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        res.status(200).json(results[0]);
    });
});
app.put("/appointments/:id", (req, res) => {
    const { id } = req.params;
    const { name, email, phone, appointment_date, reason } = req.body;

    if (!name || !email || !phone || !appointment_date || !reason) {
        return res.status(400).json({
            message: "All fields are required"
        });
    }

    const sql = `
    UPDATE appointments
    SET name = ?, email = ?, phone = ?, appointment_date = ?, reason = ?
    WHERE id = ?
  `;

    db.query(
        sql,
        [name, email, phone, appointment_date, reason, id],
        (err, result) => {
            if (err) {
                console.error(err);
                return res.status(500).json({
                    message: "Failed to update appointment"
                });
            }

            if (result.affectedRows === 0) {
                return res.status(404).json({
                    message: "Appointment not found"
                });
            }

            res.status(200).json({
                message: "Appointment updated successfully"
            });
        }
    );
});
app.delete("/appointments/:id", (req, res) => {
    const { id } = req.params;

    const sql = "DELETE FROM appointments WHERE id = ?";

    db.query(sql, [id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Failed to delete appointment"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        res.status(200).json({
            message: "Appointment deleted successfully"
        });
    });
});
app.patch("/appointments/:id/status", (req, res) => {
    const { id } = req.params;
    const { status } = req.body;

    if (!["PENDING", "CONFIRMED"].includes(status)) {
        return res.status(400).json({
            message: "Status must be PENDING or CONFIRMED"
        });
    }

    const sql = "UPDATE appointments SET status = ? WHERE id = ?";

    db.query(sql, [status, id], (err, result) => {
        if (err) {
            console.error(err);
            return res.status(500).json({
                message: "Failed to update status"
            });
        }

        if (result.affectedRows === 0) {
            return res.status(404).json({
                message: "Appointment not found"
            });
        }

        res.status(200).json({
            message: "Appointment status updated successfully"
        });
    });
});
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});