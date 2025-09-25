import React, { useState } from "react";
import { loginUser } from "../../apis/authApi";
import { useNavigate } from "react-router-dom";
import "./login.css";

const Login = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) =>
    setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if(!form.email || !form.password){
        setError("Email and password are required");
        return;
    }
    try {
      const data = await loginUser(form);
      localStorage.setItem("token", data.token);
      navigate("/dashboard"); // Redirect to dashboard
    } catch (err) {
      
    setError(err);
  
    }
  };

  return (
    <div className="login-form-container">
    <form onSubmit={handleSubmit} className="login-form">
      <h2 className="email-label">Login</h2>
      <label className="email-label">Email:</label>
      <input
        name="email"
        value={form.email}
        onChange={handleChange}
        placeholder="Email"
      />
      <label className="password-label">Password:</label>
      <input
        name="password"
        type="password"
        value={form.password}
        onChange={handleChange}
        placeholder="Password"
      />
      <button type="submit">Login</button>
      {error && <div><div style={{ color: "red" }}>{error}</div><div><a href="/forgot-password" className="forgot-password-link">forgot password? </a> </div></div>}
      <a href="/register" className="register-link">
        Don't have an account? Register
      </a>
    </form>
    </div>
  );
};

export default Login;
