import React, { useState, useContext, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDoctorRecurringAvailability, addDoctorRecurringAvailability, deleteDoctorRecurringAvailability, deleteDoctorSpecificAvailabilityInstance } from '../../../../apis/dashboardsApis/doctorDashboardApi';
import { AuthContext } from '../../../../features/auth/AuthContext';
import Calendar from 'react-calendar';
import '../../calendar-style/Calendar.css';
import '../../calendar-style/popup.css'; // Import the new CSS file
import { getTileClassName, getTileContent, handleDeleteAvailabilityClick, confirmDelete, cancelDelete, ConfirmDeletePopup, DayAvailabilityPopup } from '../../../../utils/doctorUtils.jsx';



const DoctorAvailability = () => {
    const { user } = useContext(AuthContext);
    const token = localStorage.getItem("token");
    const queryClient = useQueryClient();

    const [day, setDay] = useState('Monday');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [date, setDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null); // New state for selected date

    // State for delete confirmation popup
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [availabilityToDelete, setAvailabilityToDelete] = useState(null);
    const [slotDetailsToDelete, setSlotDetailsToDelete] = useState(null);
    const [specificDateToDelete, setSpecificDateToDelete] = useState(null);


    // State for day availability popup
    const [showDayAvailabilityPopup, setShowDayAvailabilityPopup] = useState(false);


    const apiDayOfWeekMap = useMemo(() => ({
        1: 'Monday',
        2: 'Tuesday',
        3: 'Wednesday',
        4: 'Thursday',
        5: 'Friday',
        6: 'Saturday',
        0: 'Sunday',
    }), []);

    const { data: availability, isLoading, isError, error } = useQuery({
        queryKey: ['doctorRecurringAvailability', user?._id],
        queryFn: () => getDoctorRecurringAvailability(token),        
        enabled: !!user?._id && !!token,
    });
    const addAvailabilityMutation = useMutation({
        mutationFn: (newAvailability) => addDoctorRecurringAvailability(newAvailability, token),
        onSuccess: () => {
            queryClient.invalidateQueries(['doctorRecurringAvailability', user?._id]);
            setSelectedDate(null); // Clear selected date after adding
        },
    });

    // Mutation for deleting a specific instance of a recurring slot
    const deleteSpecificAvailabilityInstanceMutation = useMutation({
        mutationFn: ({ date, recurringSlotId }) => deleteDoctorSpecificAvailabilityInstance(date, recurringSlotId, token),
        onSuccess: () => {
            queryClient.invalidateQueries(['doctorRecurringAvailability', user?._id]); // Invalidate recurring query to reflect changes
            // Potentially also invalidate a new query for specific date exceptions if implemented
            setSelectedDate(null);
            setShowDeletePopup(false);
            setAvailabilityToDelete(null);
            setSlotDetailsToDelete(null);
            setSpecificDateToDelete(null);
            setShowDayAvailabilityPopup(false); // Close day availability popup
        },
        onError: (err) => {
            console.error("Error deleting specific availability instance:", err);
            // Handle error, maybe show a message to the user
        }
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

    

    const closeDayAvailabilityPopup = () => {
        setShowDayAvailabilityPopup(false);
        setSelectedDate(null);
    };


    const availabilityToRender = availability?.slots || [];
    console.log("Fetched Recurring Availability:", availabilityToRender);

    const availableDays = useMemo(() => {
        const days = new Set();
        availabilityToRender.forEach(slot => {
            if (apiDayOfWeekMap[slot.dayOfWeek]) {
                days.add(apiDayOfWeekMap[slot.dayOfWeek]);
            }
        });
        return days;
    }, [availabilityToRender, apiDayOfWeekMap]);

    const memoizedAvailabilityMap = useMemo(() => {
        const map = {};
        const seenIds = new Set();
        availabilityToRender.forEach(slot => {
            if (seenIds.has(slot._id)) return;
            seenIds.add(slot._id);
            
            const dayName = apiDayOfWeekMap[slot.dayOfWeek];
            if (dayName) {
                if (!map[dayName]) {
                    map[dayName] = [];
                }
                map[dayName].push(slot);
            }
        });
        return map;
    }, [availabilityToRender, apiDayOfWeekMap]);

    console.log("Memoized Availability Map:", memoizedAvailabilityMap);

    const selectedDayOfWeek = selectedDate ? apiDayOfWeekMap[selectedDate.getDay()] : null;
    const slotsForSelectedDay = useMemo(() => {
        if (!selectedDate) return [];

        const dayOfWeekString = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
        const allSlotsForDay = memoizedAvailabilityMap[dayOfWeekString] || [];

        // Check if the API returns exceptions and filter them out
        const filteredSlots = allSlotsForDay.filter(slot => {
            if (!slot.exceptions || slot.exceptions.length === 0) {
                return true; // No exceptions, so the slot is available
            }

            // Normalize selectedDate to midnight to compare with exception dates
            const selectedDateMidnight = new Date(selectedDate);
            selectedDateMidnight.setHours(0, 0, 0, 0);

            const hasException = slot.exceptions.some(exceptionDateStr => {
                const exceptionDate = new Date(exceptionDateStr);
                exceptionDate.setHours(0, 0, 0, 0);
                return exceptionDate.getTime() === selectedDateMidnight.getTime();
            });

            return !hasException; // Keep the slot if it does not have an exception for the selected date
        });

        return filteredSlots;

    }, [selectedDate, memoizedAvailabilityMap]);
    console.log("Slots for Selected Day:", slotsForSelectedDay);

    const onChange = (newDate) => {
        setDate(newDate);
        setSelectedDate(newDate);
    };

    useEffect(() => {
        if (selectedDate) {
            if (slotsForSelectedDay.length > 0) {
                setShowDayAvailabilityPopup(true);
            } else {
                // If there are no slots after filtering, don't show the popup, and clear the selected date
                setShowDayAvailabilityPopup(false);
                setSelectedDate(null);
            }
        }
    }, [slotsForSelectedDay, selectedDate]);

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
                <Calendar 
                    onChange={onChange} 
                    value={date} 
                    tileClassName={getTileClassName(availableDays)} 
                    tileContent={getTileContent(memoizedAvailabilityMap)} 
                    onClickDay={setSelectedDate} 
                />
            </div>

            <DayAvailabilityPopup
                isOpen={showDayAvailabilityPopup}
                onClose={closeDayAvailabilityPopup}
                dayOfWeek={selectedDayOfWeek}
                slots={slotsForSelectedDay}
                onDeleteSlot={(availabilityId, slot, specificDate) => handleDeleteAvailabilityClick(availabilityId, slot, specificDate, setAvailabilityToDelete, setSlotDetailsToDelete, setSpecificDateToDelete, setShowDeletePopup, apiDayOfWeekMap)}
                specificDate={selectedDate}
            />

            <ConfirmDeletePopup
                isOpen={showDeletePopup}
                onClose={() => cancelDelete(setShowDeletePopup, setAvailabilityToDelete, setSlotDetailsToDelete, setSpecificDateToDelete)}
                onConfirm={() => confirmDelete(availabilityToDelete, specificDateToDelete, deleteSpecificAvailabilityInstanceMutation)}
                slotDetails={slotDetailsToDelete}
                specificDate={specificDateToDelete}
            />
        </div>
    );
};

export default DoctorAvailability;