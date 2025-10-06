const API_BASE = import.meta.env.VITE_API_BASE_URL;

export async function bookAppointment(data, token) {

    try {
  const res = await fetch(`${API_BASE}/appointments`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
    body: JSON.stringify(data),
  });
  console.log(res);
  if (!res.ok) throw new Error("Booking failed");
  return res.json();
    } catch (err) {
        return Promise.reject(
      err.response?.data?.message || err.message || "Something went wrong. Please try again."
    );
    }
}

export async function getCurrentUser(data, token) {
    try {
  const res = await fetch(`${API_BASE}/profile/getCurrentUser`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${token}`,
    },
  });
  console.log(res);
  if (!res.ok) throw new Error("Fetching user failed");
  return res.json();
    } catch (err) {
        return Promise.reject(
      err.response?.data?.message || err.message || "Something went wrong. Please try again."
    );
    } 
}