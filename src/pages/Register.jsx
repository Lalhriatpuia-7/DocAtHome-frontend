import React, { useState } from "react";
import { registerUser } from "../api";

const Register = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
  });
  const [error, setError] = useState("");

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await registerUser(form);
      alert("Registration successful! Please login.");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <input
        name="name"
        value={form.name}
        onChange={handleChange}
        placeholder="Name"
      />
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <select name="role" value={form.role} onChange={handleChange}>
        <option value="patient">Patient</option>
        <option value="doctor">Doctor</option>
      </select>
      <button type="submit">Register</button>
      {error && <div style={{ color: "red" }}>{error}</div>}
    </form>
  );
};

export default Register;
