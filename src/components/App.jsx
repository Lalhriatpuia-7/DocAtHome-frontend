import React from "react";
import { Outlet, Link } from "react-router-dom";
import "../main.css";

const App = () => {
  return (
    <div>
      <header>
        <meta charSet="UTF-8" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0"/>
        <title>DocAtHome</title>
        
      </header>
      <h1>Welcome to DocAtHome</h1>
      <nav style={{ display: "flex", gap: "1rem", marginBottom: "1rem" }}>
        <Link to="/login">Login</Link>
        <Link to="/register">Register</Link>
        {/* <Link to="/appointments">Appointments</Link> */}
        {/* <Link to="/dashboard">Professional Dashboard</Link> */}
      </nav>
      <p>Please login to view your dashboard</p>
      <Outlet />
    </div>
  );
};


export default App;

