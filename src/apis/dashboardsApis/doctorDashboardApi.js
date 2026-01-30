const API_BASE_URL = import.meta.env.VITE_API_BASE_URL;

// Placeholder for a new API function to delete a specific instance of recurring availability
export const deleteDoctorSpecificAvailabilityInstance = async (date, reason, token) => {
    
   
    // In a real scenario, this would be an API call like:
    const response = await fetch(`${API_BASE_URL}/doctors/availability/unavailable`, {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ date: date.toISOString().split('T')[0], reason }),
    });
    if (!response.ok) {
        throw new Error('Failed to add non-recurring date');
    }
    // return response.json();
    return new Promise(resolve => setTimeout(() => resolve({ success: true, message: "Simulated non-recurring date addition" }), 500)); 
};

export const getDoctorAppointments = async (doctorId, date, token) => {
    try {
        const res = await fetch(`${API_BASE_URL}/doctors/${doctorId}/appointments?date=${date}`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!res.ok) {
            throw new Error(`Failed to fetch doctor appointments: ${res.statusText}`);
        }
        return res.json();
    } catch (error) {
        console.error("Error fetching doctor appointments:", error);
        throw error;
    }
};

export const getDoctorAvailability = async (token) => {
    try {
        const res = await fetch(`${API_BASE_URL}/doctors/me/availability`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("Response from getDoctorAvailability:", res);
        if (!res.ok) {
            throw new Error(`Failed to fetch doctor availability: ${res.statusText}`);
        }
        return res.json();
    } catch (error) {
        console.error("Error fetching doctor availability:", error);
        throw error;
    }
};

// These functions were added based on the imports in DoctorAvailability.jsx
export const getDoctorRecurringAvailability = async (token) => {
    try {
        const res = await fetch(`${API_BASE_URL}/doctors/availability`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        console.log("Response from getDoctorRecurringAvailability:", res);
        if (!res.ok) {
            throw new Error(`Failed to fetch doctor recurring availability: ${res.statusText}`);
        }
        return res.json();
    } catch (error) {
        console.error("Error fetching doctor recurring availability:", error);
        throw error;
    }
};

export const addDoctorRecurringAvailability = async (newAvailability, token) => {
    try {
        const res = await fetch(`${API_BASE_URL}/doctors/me/recurring-availability`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(newAvailability),
        });
        if (!res.ok) {
            throw new Error(`Failed to add doctor recurring availability: ${res.statusText}`);
        }
        return res.json();
    } catch (error) {
        console.error("Error adding doctor recurring availability:", error);
        throw error;
    }
};

export const deleteDoctorRecurringAvailability = async (availabilityId, token) => {
    try {
        const res = await fetch(`${API_BASE_URL}/doctors/me/recurring-availability/${availabilityId}`, {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!res.ok) {
            throw new Error(`Failed to delete doctor recurring availability: ${res.statusText}`);
        }
        return res.json();
    } catch (error) {
        console.error("Error deleting doctor recurring availability:", error);
        throw error;
    }
};
