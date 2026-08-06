import React from "react";
import { useContext } from "react";
import { AuthContext } from "../../features/auth/AuthContext.jsx";
import { Link } from "react-router-dom";
import "./navbar.css";

const Navbar = ()=>{
    const { user, logout } = useContext(AuthContext);

    return (<>
         
      <nav className="navbar">
        <div className="navItems">
          {
            user ? <span className="welcome-message">Welcome, {user.name}!</span> : (
              <>
                <Link to="/login">Login</Link>
                <Link to="/register">Register</Link>
              </>
            )
          }
          
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
      {/* {
        user ? null : <div>Please login to access your dashboard</div> 
      } */}
      </>
    )
}

export default Navbar;