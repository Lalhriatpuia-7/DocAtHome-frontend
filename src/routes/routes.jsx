import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import App from "../components/App";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Appointments from "../pages/appointments/Appointments";
import ProfessionalDashboard from "../pages/dashboard/ProfessionalDashboard";

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
