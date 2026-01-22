import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import App from "../components/App";
import Login from "../features/auth/Login";
import Register from "../features/auth/Register";
import ForgotPassword from "../features/auth/ForgotPassword";
import Appointments from "../pages/appointments/Appointments";
import Dashboard from "../pages/dashboard/Dashboard";
import PrivateRoute from "./PrivateRoute";
import Profile from "../components/profile/Profile";
import CreateProfile from "../components/profile/CreateProfile";


const router = createBrowserRouter(
  createRoutesFromElements(
    <>
   
    <Route path="/" element={<App />}>
      <Route path="login" element={<Login />} />
      <Route path="register" element={<Register />} />
      <Route path="forgot-password" element={<ForgotPassword />} />
      <Route path="appointments" element={<Appointments />} />
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="profile" element={
        <PrivateRoute>
          <Profile />
        </PrivateRoute>
      } />
      <Route path="profile/setup" element={
        <PrivateRoute>
          <CreateProfile />
        </PrivateRoute>
      } />
    </Route>
    <Route path="*" element={<div>404 Not Found</div>} />     
    </>
  )
);

export default router;

