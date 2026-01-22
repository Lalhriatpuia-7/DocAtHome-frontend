import React, { useState, useContext } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDoctorRecurringAvailability, addDoctorRecurringAvailability, deleteDoctorRecurringAvailability } from '../../../../apis/dashboardsApis/doctorDashboardApi';
import { AuthContext } from '../../../../features/auth/AuthContext';

const DoctorAvailability = () => {
    const { user } = useContext(AuthContext);
    const token = localStorage.getItem("token");
    const queryClient = useQueryClient();

    const [day, setDay] = useState('Monday');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');

    const { data: availability, isLoading, isError, error } = useQuery({
        queryKey: ['doctorRecurringAvailability', user?._id],
        queryFn: () => getDoctorRecurringAvailability(token),
        enabled: !!user?._id && !!token,
    });

    const addAvailabilityMutation = useMutation({
        mutationFn: (newAvailability) => addDoctorRecurringAvailability(newAvailability, token),
        onSuccess: () => {
            queryClient.invalidateQueries(['doctorRecurringAvailability', user?._id]);
        },
    });

    const deleteAvailabilityMutation = useMutation({
        mutationFn: (availabilityId) => deleteDoctorRecurringAvailability(availabilityId, token),
        onSuccess: () => {
            queryClient.invalidateQueries(['doctorRecurringAvailability', user?._id]);
        },
    });

    const handleAddAvailability = (e) => {
        e.preventDefault();
        if (day && startTime && endTime) {
            addAvailabilityMutation.mutate({ day, startTime, endTime });
            setDay('Monday');
            setStartTime('');
            setEndTime('');
        }
    };

    const handleDeleteAvailability = (availabilityId) => {
        deleteAvailabilityMutation.mutate(availabilityId);
    };

    return (
        <div>
            <h2>Manage Recurring Availability</h2>
            <form onSubmit={handleAddAvailability}>
                <div>
                    <label>Day of the week:</label>
                    <select value={day} onChange={(e) => setDay(e.target.value)}>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
                        <option value="Sunday">Sunday</option>
                    </select>
                </div>
                <div>
                    <label>Start Time:</label>
                    <input type="time" value={startTime} onChange={(e) => setStartTime(e.target.value)} required />
                </div>
                <div>
                    <label>End Time:</label>
                    <input type="time" value={endTime} onChange={(e) => setEndTime(e.target.value)} required />
                </div>
                <button type="submit" disabled={addAvailabilityMutation.isLoading}>
                    {addAvailabilityMutation.isLoading ? 'Adding...' : 'Add Availability'}
                </button>
            </form>
            <div>
                <h3>Current Availability:</h3>
                {isLoading && <p>Loading availability...</p>}
                {isError && <p>Error: {error.message}</p>}
                <ul>
                    {availability?.map((slot) => (
                        <li key={slot._id}>
                            {slot.day}: {slot.startTime} - {slot.endTime}
                            <button onClick={() => handleDeleteAvailability(slot._id)} disabled={deleteAvailabilityMutation.isLoading}>
                                {deleteAvailabilityMutation.isLoading ? 'Deleting...' : 'Delete'}
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </div>
    );
};

export default DoctorAvailability;
