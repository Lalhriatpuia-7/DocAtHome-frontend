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
        body: JSON.stringify({ date, reason }),
    });
    if (!response.ok) {
        throw new Error('Failed to add non-recurring date');
    }
    // return response.json();
    return new Promise(resolve => setTimeout(() => resolve({ success: true, message: "Simulated non-recurring date addition" }), 500)); 
};

export const getDoctorAppointments = async (doctorId, date, token) => {
    try {
        const res = await fetch(`${API_BASE_URL}/doctors/appointments`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!res.ok) {
            throw new Error(`Failed to fetch doctor appointments: ${res.statusText}`);
        }
        return res.json();
    } catch (error) {
        throw error;
    }
};

export const getDoctorAvailableAppointmentSlots = async ( token) => {
    try {
        const res = await fetch(`${API_BASE_URL}/doctors/available-appointments-time-slots`, {
            headers: {
                Method: 'GET',
                Authorization: `Bearer ${token}`,
            },
        });
        if (!res.ok) {
            throw new Error(`Failed to fetch doctor available appointment slots: ${res.statusText}`);
        }
        return res.json();
    } catch (error) {
        throw error;
    }
};


export const getDoctorAvailability = async (token) => {
    try {
        const res = await fetch(`${API_BASE_URL}/doctors/availability`, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!res.ok) {
            throw new Error(`Failed to fetch doctor availability: ${res.statusText}`);
        }
        return res.json();
    } catch (error) {
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

        
        if (!res.ok) {
            throw new Error(`Failed to fetch doctor recurring availability: ${res.statusText}`);
        }
        const data = await res.json();
        console.log('Fetched doctor recurring availability from api:', data);
        return data;
    } catch (error) {
        throw error;
    }
};

export const addDoctorRecurringAvailability = async (newAvailability, token) => {
    try {
        const res = await fetch(`${API_BASE_URL}/doctors/recurring-availability/slots`, {
            method: 'PUT',
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
        throw error;
    }
};

export const deleteDoctorRecurringAvailability = async (dates, token) => {
    console.log("Deleting doctor recurring availability for dates:", dates);
    try {
        const res = await fetch(`${API_BASE_URL}/doctors/recurring-availability/slots`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ dates }),
        });
        if (!res.ok) {
            throw new Error(`Failed to delete doctor recurring availability: ${res.statusText}`);
        }
        return res.json();
    } catch (error) {
        throw error;
    }
};

export const removeUnavailableDate = async (date, token) => {
    try {
        const res = await fetch(`${API_BASE_URL}/doctors/availability/unavailable`, {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ date }),
        });
        if (!res.ok) {
            throw new Error(`Failed to remove unavailable date: ${res.statusText}`);
        }
        return res.json();
    } catch (error) {
        throw error;
    }
};

export const addBreaksToRecurringAvailability = async (breakDetails, token) => {
    try {
        const url = `${API_BASE_URL}/doctors/recurring-availability/addbreaks`;
        const init = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify(breakDetails),
        };

        console.log('POST', url, init);
        const res = await fetch(url, init);
        if (!res.ok) {
            const text = await res.text();
            console.error('addBreaksToRecurringAvailability failed:', res.status, text);
            throw new Error(text || `Failed to add breaks: ${res.statusText}`);
        }
        const data = await res.json();
        return data;
    } catch (error) {
        throw error;
    }
};

export const getBreaksForRecurringAvailability = async (token) => {
    try {
        
        const url = `${API_BASE_URL}/doctors/recurring-availability/breaks`;
        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        if (!res.ok) {
            const text = await res.text();
            console.error('getBreaksForRecurringAvailability failed:', res.status, text);
            throw new Error(text || `Failed to fetch breaks: ${res.statusText}`);
        }
        const data = await res.json();
        
        return data;
    } catch (error) {
        throw error;
    }
};

export const removeBreakFromRecurringAvailability = async (breakId, token) => {
    try {
        const url = `${API_BASE_URL}/doctors/recurring-availability/removebreaks`;
        const init = {
            method: 'DELETE',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({ breakId }),
        };
        const res = await fetch(url, init);
        if (!res.ok) {
            const text = await res.text();
            console.error('removeBreakFromRecurringAvailability failed:', res.status, text);
            throw new Error(text || `Failed to remove break: ${res.statusText}`);
        }
        const data = await res.json();
        return data;

    }     catch (error) {
        throw error;
    }
};

export const addTimeAllotmentToRecurringAvailability = async (timeAllotment, token) => {
    console.log("Adding time allotment to recurring availability:", timeAllotment);
    try {        const url = `${API_BASE_URL}/doctors/recurring-availability/addtimeallotment`;
        const init = {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({timeAllotment}),
        };
        console.log('POST', url, init);
        const res = await fetch(url, init);
        if (!res.ok) {
            const text = await res.text();
            console.error('addTimeAllotmentToRecurringAvailability failed:', res.status, text);
            throw new Error(text || `Failed to add time allotment: ${res.statusText}`);
        }
        const data = await res.json();
        return data;
    } catch (error) {
        throw error;
    }
};

export const getTimeAllotmentsForRecurringAvailability = async (token) => {
    try {
        const url = `${API_BASE_URL}/doctors/recurring-availability/timeallotments`;
        const res = await fetch(url, {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        });
        
        if (!res.ok) {
            const text = await res.text();
            console.error('getTimeAllotmentsForRecurringAvailability failed:', res.status, text);
            throw new Error(text || `Failed to fetch time allotments: ${res.statusText}`);
        }
        const data = await res.json();
        console.log('Fetched time allotments from api:', data);
        return data;
    } catch (error) {
        throw error;
    }
};