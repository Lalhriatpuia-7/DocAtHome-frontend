import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import App from "../components/App";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Appointments from "../pages/Appointments";
import ProfessionalDashboard from "../pages/ProfessionalDashboard";

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<App />}>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="appointments" element={<Appointments />} />
      <Route path="dashboard" element={<ProfessionalDashboard />} />
    </Route>
  )
);

export default router;
