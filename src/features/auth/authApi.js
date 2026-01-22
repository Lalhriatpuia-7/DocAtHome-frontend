import axios from "axios";

const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const loginUser = async (formData) => {
  try {
    const { data } = await axios.post(`${API_BASE}/auth/login`, formData);
    return data;
  } catch (err) {   
    return Promise.reject(
      err.response?.data?.message || err.message || "Something went wrong. Please try again."
    );
  }
};

export const registerUser = async (formData) => {
  
  try {
    const { data } = await axios.post(`${API_BASE}/auth/register`, formData);
    return data;
  } catch (err) {   
    
    return Promise.reject(
      err.response?.data?.message || err.message || "Something went wrong. Please try again."
    );
  
    
  }
};




export const forgotPassword = async (email) => {
  try {
    const { data } = await axios.post(`${API_BASE}/auth/forgot-password`, { email });
    return data;
  } catch (err) {
    return Promise.reject(
      err.response?.data?.message || err.message || "Something went wrong. Please try again."
    );
  }
};

export const logoutUser = async (token) => { 
  console.log("Logging out with token:", token); 
  try {
    const { data } = await axios.post(`${API_BASE}/auth/logout`, {}, {
      headers: {  
        Authorization: `Bearer ${token}`
      }
    });
    console.log(data);
    return data;
  } catch (err) {
    return Promise.reject(
      err.response?.data?.message || err.message || "Something went wrong. Please try again."
    );
  } 
};

export const resetPassword = async (token, newPassword) => {
  try {
    const { data } = await axios.post(`${API_BASE}/auth/reset-password`, { token, newPassword });
    return data;
  } catch (err) {
    return Promise.reject(
      err.response?.data?.message || err.message || "Something went wrong. Please try again."
    );
  }
};