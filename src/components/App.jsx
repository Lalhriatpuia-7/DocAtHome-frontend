import React from "react";
import { Outlet, Link } from "react-router-dom";

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

// const NotFound = () => (
//   <div>
//     <h2>404 - Page Not Found</h2>
//     <p>The page you are looking for does not exist.</p>
//   </div>
// );

export default App;
// export { NotFound };
