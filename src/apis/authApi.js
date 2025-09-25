import axios from "axios";

const API_BASE = "http://localhost:5000/api";

export const loginUser = async (formData) => {
  try {
    const { data } = await axios.post(`${API_BASE}/auth/login`, formData);
    return data;
  } catch (err) {

    console.log(err.response.data);
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

export async function bookAppointment(data, token) {
  const res = await fetch(`${API_BASE}/appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  if (!res.ok) throw new Error("Booking failed");
  return res.json();
}


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