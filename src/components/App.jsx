import React from "react";
import { Outlet, Link } from "react-router-dom";
import "../main.css";

const App = () => {
  return (
    <div>
      <h1>Welcome to DocAtHome</h1>
      <nav style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        <Link to="/appointments">Appointments</Link>
        <Link to="/dashboard">Professional Dashboard</Link>
      </nav>
      <Outlet />
    </div>
  );
};


export default App;

