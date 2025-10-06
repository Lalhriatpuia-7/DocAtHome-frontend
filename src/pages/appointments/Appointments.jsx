import React, { useState, useEffect } from "react";
import { bookAppointment } from "../../apis/appoinmentApi";

const Appointments = () => {
  const [appointments, setAppointments] = useState([]);
  const [form, setForm] = useState({
    doctor: "",
    date: "",
    type: "doctor_visit",
    notes: "",
  });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  useEffect(() => {
    // Fetch appointments from an API or a local source
    const fetchAppointments = async () => {
      // Placeholder for fetching logic
      const response = await fetch("/api/appointments");
      const data = await response.json();
      setAppointments(data);
    };

    fetchAppointments();
  }, []);

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      const token = localStorage.getItem("token");
      if (!token) throw new Error("You must be logged in.");
      await bookAppointment(form, token);
      setSuccess("Appointment booked!");
    } catch (err) {
      setError(err.message);
    }
  };

  const handleAddAppointment = () => {
    // Logic to add a new appointment
  };

  const handleEditAppointment = (id) => {
    // Logic to edit an existing appointment
  };

  const handleDeleteAppointment = (id) => {
    // Logic to delete an appointment
  };

  return (
    <div>
      <h1>Your Appointments</h1>
      <button onClick={handleAddAppointment}>Add Appointment</button>
      <ul>
        {appointments.map((appointment) => (
          <li key={appointment.id}>
            {appointment.title}
            <button onClick={() => handleEditAppointment(appointment.id)}>
              Edit
            </button>
            <button onClick={() => handleDeleteAppointment(appointment.id)}>
              Delete
            </button>
          </li>
        ))}
      </ul>
      <form onSubmit={handleSubmit}>
        <input
          name="doctor"
          value={form.doctor}
          onChange={handleChange}
          placeholder="Doctor ID"
        />
        <input
          name="date"
          type="datetime-local"
          value={form.date}
          onChange={handleChange}
        />
        <select name="type" value={form.type} onChange={handleChange}>
          <option value="doctor_visit">Doctor Visit</option>
          <option value="consultation">Consultation</option>
        </select>
        <textarea
          name="notes"
          value={form.notes}
          onChange={handleChange}
          placeholder="Notes"
        />
        <button type="submit">Book Appointment</button>
        {error && <div style={{ color: "red" }}>{error}</div>}
        {success && <div style={{ color: "green" }}>{success}</div>}
      </form>
    </div>
  );
};

export default Appointments;
