import { useEffect, useState } from "react";
import "./App.css";

function App() {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    appointment_date: "",
    reason: "",
  });

  const [appointments, setAppointments] = useState([]);
  const [editingId, setEditingId] = useState(null);
  const [currentPage, setCurrentPage] = useState("entry");

  // GET - Fetch all appointments
  const fetchAppointments = async () => {
    try {
      const response = await fetch("http://localhost:5000/appointments");
      const data = await response.json();

      if (response.ok) {
        setAppointments(data);
      } else {
        console.error("Failed to fetch appointments");
      }
    } catch (error) {
      console.error("Error fetching appointments:", error);
    }
  };

  // Load appointments when application starts
  useEffect(() => {
    fetchAppointments();
  }, []);

  // Handle form input changes
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // POST / PUT - Create or update appointment
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (
      !formData.name ||
      !formData.email ||
      !formData.phone ||
      !formData.appointment_date ||
      !formData.reason
    ) {
      alert("Please fill all fields");
      return;
    }

    try {
      const url = editingId
        ? `http://localhost:5000/appointments/${editingId}`
        : "http://localhost:5000/appointments";

      const method = editingId ? "PUT" : "POST";

      const response = await fetch(url, {
        method: method,
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      });

      const data = await response.json();

      if (response.ok) {
        alert(
          editingId
            ? "Appointment updated successfully"
            : "Appointment created successfully"
        );

        // Clear form
        setFormData({
          name: "",
          email: "",
          phone: "",
          appointment_date: "",
          reason: "",
        });

        setEditingId(null);

        // Refresh appointment list
        await fetchAppointments();

        // Move to appointment list
        setCurrentPage("list");
      } else {
        alert(data.message || "Operation failed");
      }
    } catch (error) {
      console.error(error);
      alert("Unable to connect to server");
    }
  };

  // EDIT - Load appointment data into form
  const handleEdit = (appointment) => {
    setCurrentPage("entry");
    setEditingId(appointment.id);

    setFormData({
      name: appointment.name,
      email: appointment.email,
      phone: appointment.phone,
      appointment_date: appointment.appointment_date.split("T")[0],
      reason: appointment.reason,
    });

    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  // DELETE - Delete appointment
  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this appointment?"
    );

    if (!confirmDelete) {
      return;
    }

    try {
      const response = await fetch(
        `http://localhost:5000/appointments/${id}`,
        {
          method: "DELETE",
        }
      );

      const data = await response.json();

      if (response.ok) {
        alert("Appointment deleted successfully");
        fetchAppointments();
      } else {
        alert(data.message || "Failed to delete appointment");
      }
    } catch (error) {
      console.error(error);
      alert("Unable to connect to server");
    }
  };

  // PATCH - Change appointment status
  const handleStatus = async (id, currentStatus) => {
    const newStatus =
      currentStatus === "PENDING" ? "CONFIRMED" : "PENDING";

    try {
      const response = await fetch(
        `http://localhost:5000/appointments/${id}/status`,
        {
          method: "PATCH",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            status: newStatus,
          }),
        }
      );

      const data = await response.json();

      if (response.ok) {
        fetchAppointments();
      } else {
        alert(data.message || "Failed to update status");
      }
    } catch (error) {
      console.error(error);
      alert("Unable to connect to server");
    }
  };

  return (
    <div className="app">
      {/* Navigation */}
      <div className="nav-buttons">
        <button
          onClick={() => {
            setCurrentPage("entry");
          }}
        >
          Appointment Entry
        </button>

        <button
          onClick={() => {
            setCurrentPage("list");
            fetchAppointments();
          }}
        >
          Appointment List
        </button>
      </div>

      {/* Appointment Entry Page */}
      {currentPage === "entry" && (
        <div className="form-container">
          <h1>Appointment Record System</h1>

          <p>
            {editingId
              ? "Update appointment details"
              : "Create a new appointment"}
          </p>

          <form onSubmit={handleSubmit}>
            <label>Name</label>
            <input
              type="text"
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter your name"
              required
            />

            <label>Email</label>
            <input
              type="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              placeholder="Enter your email"
              required
            />

            <label>Phone Number</label>
            <input
              type="tel"
              name="phone"
              value={formData.phone}
              onChange={handleChange}
              placeholder="Enter 10 digit phone number"
              pattern="[0-9]{10}"
              maxLength="10"
              required
            />

            <label>Appointment Date</label>
            <input
              type="date"
              name="appointment_date"
              value={formData.appointment_date}
              onChange={handleChange}
              required
            />

            <label>Reason</label>
            <textarea
              name="reason"
              value={formData.reason}
              onChange={handleChange}
              placeholder="Enter reason for appointment"
              required
            />

            <button type="submit">
              {editingId
                ? "Update Appointment"
                : "Create Appointment"}
            </button>
          </form>
        </div>
      )}

      {/* Appointment List Page */}
      {currentPage === "list" && (
        <div className="list-container">
          <h2>Appointment List</h2>

          {appointments.length === 0 ? (
            <p>No appointments found.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>Name</th>
                  <th>Email</th>
                  <th>Phone</th>
                  <th>Date</th>
                  <th>Reason</th>
                  <th>Status</th>
                  <th>Actions</th>
                </tr>
              </thead>

              <tbody>
                {appointments.map((appointment) => (
                  <tr key={appointment.id}>
                    <td>{appointment.name}</td>

                    <td>{appointment.email}</td>

                    <td>{appointment.phone}</td>

                    <td>
                      {new Date(
                        appointment.appointment_date
                      ).toLocaleDateString()}
                    </td>

                    <td>{appointment.reason}</td>

                    <td>{appointment.status}</td>

                    <td className="actions">
                      {/* Edit */}
                      <button
                        className="edit-btn"
                        onClick={() => handleEdit(appointment)}
                      >
                        Edit
                      </button>

                      {/* Status */}
                      <button
                        className="status-btn"
                        onClick={() =>
                          handleStatus(
                            appointment.id,
                            appointment.status
                          )
                        }
                      >
                        {appointment.status === "PENDING"
                          ? "Confirm"
                          : "Set Pending"}
                      </button>

                      {/* Delete */}
                      <button
                        className="delete-btn"
                        onClick={() =>
                          handleDelete(appointment.id)
                        }
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      )}
    </div>
  );
}

export default App;