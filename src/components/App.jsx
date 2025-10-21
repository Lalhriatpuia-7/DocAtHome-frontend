import React from "react";
import { Outlet, Link } from "react-router-dom";
import "../main.css";
import Header from "./layout-components/Header";
import Footer from "./layout-components/Footer";
import { useContext } from "react";
import { AuthContext } from "../contexts/AuthContext.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";


library.add(fas, far, fab)

const App = () => {
  const { user, logout } = useContext(AuthContext); 
  
  return (
    <>
      <Header />
      <h1>Welcome to DocAtHome</h1>
      <nav className="navbar">
        <div className="navItems">
          <Link to="/login">Login</Link>
          <Link to="/register">Register</Link>
          {user && <Link to="/dashboard">Dashboard</Link>}
        </div>
        <div>
          
          {
          
          user ? (<div className="profile-logout">
          <Link to="/profile">Profile</Link>
            <button className="logout-button" onClick={logout}>
              Logout
            </button>
            </div>
          ) : null}
        </div>
      </nav>
      {
        user ? null : <div>Please login to access your dashboard</div> 
      }
      <Outlet />
      <Footer />
    </>
  );
};

export default App;



