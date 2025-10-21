import React from "react";
import {
  createBrowserRouter,
  createRoutesFromElements,
  Route,
} from "react-router-dom";
import App from "../components/App";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import ForgotPassword from "../pages/auth/Forgot-password";
import Appointments from "../pages/appointments/Appointments";
import Dashboard from "../pages/dashboard/Dashboard";
import PrivateRoute from "./PrivateRoute";
import Profile from "../components/profile/profile";
import CreateProfile from "../components/profile/createProfile";


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

