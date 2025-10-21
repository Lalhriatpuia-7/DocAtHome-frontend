import React, { useContext } from "react";
import { Navigate } from "react-router-dom";
import { AuthContext } from "../contexts/AuthContext";

const PrivateRoute = ({ children }) => {
  const { user, loading } = useContext(AuthContext);

  // Wait for AuthContext to finish checking token
  if (loading) {
    return <p>Checking authentication...</p>;
  }

  // Only redirect if we've confirmed there's no user
  if (!user) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

export default PrivateRoute;

