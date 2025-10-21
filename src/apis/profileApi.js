import { useNavigate } from "react-router";


const BASE_URL = import.meta.env.VITE_API_BASE_URL;


export const getMyProfile = async (token) => { 

  const res = await fetch(`${BASE_URL}/profile/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  }); 
 if(res.status === 404) {
    return null; // No profile found
  }

  if (!res.ok) throw new Error("Failed to fetch profile");
  
  return res.json();
};

export const updateUserProfile = async (profileData, token) => {

  console.log("updateUserProfile called with:", profileData, token);
  const res = await fetch(`${BASE_URL}/profile/update`, {
    method: "PUT",
    headers: {  
        
      Authorization: `Bearer ${token}`,
    },
    body: profileData,
  }); 
  console.log("Response from updateUserProfile:", res);
  if (!res.ok) throw new Error("Failed to update profile");
  return res.json();
};

export const createUserProfile = async (profileData, token) => {
  console.log("createUserProfile called with:", profileData, token);

  const res = await fetch(`${BASE_URL}/profile/create`, {
    method: "POST",
    headers: {
      Authorization: `Bearer ${token}`, // ✅ Don't set Content-Type manually
    },
    body: profileData, // ✅ Send FormData directly
  });

  console.log("Response:", res);
  if (!res.ok) throw new Error("Failed to create profile");
  return res.json();
};


export const verifyUserProfile = async (userid, token) => {
  const res = await fetch(`${BASE_URL}/verify`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify({ userid }),
  });
  if (!res.ok) throw new Error("Verification failed");
  return res.json();
};
