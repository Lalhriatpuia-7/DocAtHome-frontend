import React, { useState, useContext, useMemo } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDoctorRecurringAvailability, addDoctorRecurringAvailability, deleteDoctorRecurringAvailability } from '../../../../apis/dashboardsApis/doctorDashboardApi';
import { AuthContext } from '../../../../features/auth/AuthContext';
import Calendar from 'react-calendar';
import '../../calendar-style/Calendar.css';
import { getTileClassName, getTileContent } from '../../../../utils/doctorUtils.jsx';

const DoctorAvailability = () => {
    const { user } = useContext(AuthContext);
    const token = localStorage.getItem("token");
    const queryClient = useQueryClient();

    const [day, setDay] = useState('Monday');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [date, setDate] = useState(new Date());

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

    const availabilityToRender = availability?.slots || [];

    const availableDays = useMemo(() => {
        const days = new Set();
        const apiDayOfWeekMap = {
            1: 'Monday',
            2: 'Tuesday',
            3: 'Wednesday',
            4: 'Thursday',
            5: 'Friday',
            6: 'Saturday',
            0: 'Sunday',
        };
        availabilityToRender.forEach(slot => {
            if (apiDayOfWeekMap[slot.dayOfWeek]) {
                days.add(apiDayOfWeekMap[slot.dayOfWeek]);
            }
        });
        return days;
    }, [availabilityToRender]);

    const memoizedAvailabilityMap = useMemo(() => {
        const map = {};
        const apiDayOfWeekMap = {
            1: 'Monday', 2: 'Tuesday', 3: 'Wednesday', 4: 'Thursday',
            5: 'Friday', 6: 'Saturday', 0: 'Sunday',
        };
        availabilityToRender.forEach(slot => {
            const dayName = apiDayOfWeekMap[slot.dayOfWeek];
            if (dayName) {
                if (!map[dayName]) {
                    map[dayName] = [];
                }
                map[dayName].push(slot);
            }
        });
        return map;
    }, [availabilityToRender]);

    const onChange = (newDate) => {
        setDate(newDate);
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
                <Calendar onChange={onChange} value={date} tileClassName={getTileClassName(availableDays)} tileContent={getTileContent(memoizedAvailabilityMap)} />
            </div>
        </div>
    );
};

export default DoctorAvailability;
