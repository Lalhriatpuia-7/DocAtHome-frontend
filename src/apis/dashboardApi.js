const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function getDashboardData(token) {
    try {
  const res = await fetch(`${API_BASE}/dashboard`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",   
        Authorization: `Bearer ${token}`,
    },
  });
  console.log(res);
  if (!res.ok) throw new Error("Fetching dashboard data failed");
  return res.json();
    } catch (err) {
        return Promise.reject(
      err.response?.data?.message || err.message || "Something went wrong. Please try again."
    );
    }   
}

export async function getMetrics(token) {
    try {
  const res = await fetch(`${API_BASE}/dashboard/metrics`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
    },
  });
  console.log(res);
  if (!res.ok) throw new Error("Fetching metrics failed");
  return res.json();
    }
    catch (err) {
        return Promise.reject(
      err.response?.data?.message || err.message || "Something went wrong. Please try again."
    );
    }   
}

