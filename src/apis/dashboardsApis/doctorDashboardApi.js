const API_BASE = import.meta.env.VITE_API_BASE_URL;

export const getDoctorAppointments = async (doctorId, date, token) => {
  try {
    const response = await fetch(`${API_BASE}/doctors/appointments?date=${date}`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch appointments');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching doctor appointments:', error);
    throw error;
  }
};

export const getDoctorPatients = async (doctorId, token) => {
  try {
    const response = await fetch(`${API_BASE}/doctors/${doctorId}/patients`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to fetch patients');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching doctor patients:', error);
    throw error;
  }
};

export const getDoctorAvailability = async (token) => {
  try {
    const response = await fetch(`${API_BASE}/doctors/availability`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });

    if (response.status === 404) {
      console.log("No availability set for this doctor. Please add availability.");
      return null; // No availability set
    }

    if (!response.ok) {
      throw new Error('Failed to fetch availability');
    }

    const data = await response.json(); // Read the body ONCE
    console.log('Response from getDoctorAvailability:', data); // Log the data
    return data; // Return the data
  } catch (error) {
    console.error('Error fetching doctor availability:', error);
    throw error;
  }
};

export const updateDoctorAvailability = async (doctorId, availabilityData, token) => {
  try {
    const response = await fetch(`${API_BASE}/doctors/${doctorId}/availability`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(availabilityData),
    });
    if (!response.ok) {
      throw new Error('Failed to update availability');
    }
    return await response.json();
  } catch (error) {
    console.error('Error updating doctor availability:', error);
    throw error;
  }
};

export const getDoctorRecurringAvailability = async (token) => {
  try {
    const response = await fetch(`${API_BASE}/doctors/availability`, {
      headers: {
        'Authorization': `Bearer ${token}`,
      },
      cache: 'no-cache',
    });
    if (!response.ok) {
      throw new Error('Failed to fetch recurring availability');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching recurring availability:', error);
    throw error;
  }
}

export const addDoctorRecurringAvailability = async (availabilityData, token) => {
  try {
    const response = await fetch(`${API_BASE}/doctors/recurring-availability`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(availabilityData),
    });
    if (!response.ok) {
      throw new Error('Failed to add recurring availability');
    }
    return await response.json();
  } catch (error) {
    console.error('Error adding recurring availability:', error);
    throw error;
  }
}

export const deleteDoctorRecurringAvailability = async (availabilityId, token) => {
  try {
    const response = await fetch(`${API_BASE}/doctors/recurring-availability/${availabilityId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    if (!response.ok) {
      throw new Error('Failed to delete recurring availability');
    }
    return await response.json();
  } catch (error) {
    console.error('Error deleting recurring availability:', error);
    throw error;
  }
}


