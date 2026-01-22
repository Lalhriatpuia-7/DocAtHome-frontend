import React from "react";
import { Outlet, Link } from "react-router-dom";
import "../main.css";
import Header from "./layout-components/Header";
import Footer from "./layout-components/Footer";
import { useContext } from "react";
import { AuthContext } from "../features/auth/AuthContext.jsx";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { library } from "@fortawesome/fontawesome-svg-core";
import { fas } from "@fortawesome/free-solid-svg-icons";
import { far } from "@fortawesome/free-regular-svg-icons";
import { fab } from "@fortawesome/free-brands-svg-icons";
import Navbar from "./layout-components/Navbar.jsx";


library.add(fas, far, fab)

const App = () => {
  const { user, logout } = useContext(AuthContext); 
  
  return (
    <>
      <Header />
      <Navbar/>      
      <Outlet />
      <Footer />
    </>
  );
};

export default App;



