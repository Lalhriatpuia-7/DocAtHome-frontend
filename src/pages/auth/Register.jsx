import React, { useState } from "react";
import { registerUser } from "../../apis/authApi";
import { useNavigate } from "react-router-dom";

import "./register.css";

const Register = () => {
  const navigate = useNavigate();  // ✅ move inside component
  const [errors, setErrors] = useState({});

  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "patient",
    specialization: ""   // ✅ spelling fixed
  });
 

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
  e.preventDefault();
  setErrors({}); // reset errors

  let newErrors = {};

  if (!form.name) newErrors.name = "Name is required";
  if (!form.email) {
    newErrors.email = "Email is required";
  } else {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(form.email)) {
      newErrors.email = "Invalid email format";
    }
  }

  if (!form.password) {
    newErrors.password = "Password is required";
  } else {
    const passwordRegex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/;
    if (!passwordRegex.test(form.password)) {
      newErrors.password =
        "Password must be at least 8 characters, include uppercase(ABC...), lowercase(abc...), number(123...), and special character(!@#$...)";
    }
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  try {
    await registerUser(form);
    alert("Registration successful! Please login.");
    navigate("/login");
  } catch (msg) {
    
    setErrors({ backend: msg });  
  }
};


  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2 className="register-heading">Register</h2>
        <input
          name="name"
          value={form.name}
          onChange={handleChange}
          placeholder="Name"
          required={true}
        />
        {errors.name && <p className="error-text">{errors.name}</p>}
        <input
          name="email"
          value={form.email}
          onChange={handleChange}
          placeholder="Email"
          required={true}
        />
        {errors.email && <p className="error-text">{errors.email}</p>}
        <input
          name="password"
          type="password"
          value={form.password}
          onChange={handleChange}
          placeholder="Password"
          required={true}
        />
        {errors.password && <p className="error-text">{errors.password}</p>}
        <select name="role" value={form.role} onChange={handleChange}>
          <option value="patient">Patient</option>
          <option value="doctor">Doctor</option>
          <option value="nurse">Nurse</option>
        </select>

        {(form.role === "doctor" || form.role === "nurse") && (
          <input
            name="specialization"
            value={form.specialization || ""}
            onChange={handleChange}
            placeholder="Specialization"
          />
        )}

        <button type="submit" className="register-button">Register</button>
        <a href="/login" className="login-link">Already have an account? Login</a>
        {errors.backend && <p className="error-text">{errors.backend}</p>}
        
      </form>
    </div>
  );
};

export default Register;


