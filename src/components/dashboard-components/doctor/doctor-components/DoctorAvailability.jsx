import React, { useState, useContext, useMemo, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { getDoctorRecurringAvailability, addDoctorRecurringAvailability, deleteDoctorSpecificAvailabilityInstance, removeUnavailableDate, deleteDoctorRecurringAvailability, addBreaksToRecurringAvailability, removeBreakFromRecurringAvailability, getBreaksForRecurringAvailability,addTimeAllotmentToRecurringAvailability, getTimeAllotmentsForRecurringAvailability} from '../../../../apis/dashboardsApis/doctorDashboardApi';
import { AuthContext } from '../../../../features/auth/AuthContext';
import Calendar from 'react-calendar';
import '../../calendar-style/Calendar.css';
import '../../calendar-style/popup.css'; 
import { getTileClassName, getTileContent, handleDeleteAvailabilityClick, confirmDelete, cancelDelete, ConfirmDeletePopup, DayAvailabilityPopup } from '../../../../utils/doctorUtils.jsx';
import DeleteRecurringAvailabilities from './DeleteRecurringAvailabilities.jsx';
import AddBreaks from './AddBreaks.jsx';
import './availability.css';
import RemoveBreaks from './removeBreaks.jsx';
import TimeAllotment from './TimeAllotment.jsx';



const DoctorAvailability = () => {
    const { user } = useContext(AuthContext);
    const token = localStorage.getItem("token");
    const queryClient = useQueryClient();

    const [day, setDay] = useState('Sunday');
    const [startTime, setStartTime] = useState('');
    const [endTime, setEndTime] = useState('');
    const [date, setDate] = useState(new Date());
    const [selectedDate, setSelectedDate] = useState(null); // New state for selected date

    // State for delete confirmation popup
    const [showDeletePopup, setShowDeletePopup] = useState(false);
    const [availabilityToDelete, setAvailabilityToDelete] = useState(null);
    const [slotDetailsToDelete, setSlotDetailsToDelete] = useState(null);
    const [specificDateToDelete, setSpecificDateToDelete] = useState(null);
    const [deleteReason, setDeleteReason] = useState('');


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

    const breakRes = useQuery({
        queryKey: ['doctorBreaks', user?._id],
        queryFn: () => getBreaksForRecurringAvailability(token).then(data => data.breaks || []), // Assuming breaks are part of the same API response
        enabled: !!user?._id && !!token,
    });
    const breaks = breakRes.data;
    const timeAllotmentRes = useQuery({
        queryKey: ['doctorTimeAllotment', user?._id],
        queryFn: () => getTimeAllotmentsForRecurringAvailability(token).then(data => data.timeAllotment), // Assuming time allotment is part of the same API response
        enabled: !!user?._id && !!token,
    });
    const timeAllotment = timeAllotmentRes.data;
    console.log("Fetched time allotment:", timeAllotment);
    
    const addAvailabilityMutation = useMutation({
        mutationFn: (newAvailability) => addDoctorRecurringAvailability(newAvailability, token),
        onSuccess: () => {
            queryClient.invalidateQueries(['doctorRecurringAvailability', user?._id]);
            setSelectedDate(null); // Clear selected date after adding
        },
    });

    // Mutation for deleting a specific instance of a recurring slot
    const deleteSpecificAvailabilityInstanceMutation = useMutation({
        mutationFn: ({ date, recurringSlotId, reason }) => deleteDoctorSpecificAvailabilityInstance(date, reason, token),
        onSuccess: () => {
            queryClient.invalidateQueries(['doctorRecurringAvailability', user?._id]); // Invalidate recurring query to reflect changes
            // Potentially also invalidate a new query for specific date exceptions if implemented
            setSelectedDate(null);
            setShowDeletePopup(false);
            setAvailabilityToDelete(null);
            setSlotDetailsToDelete(null);
            setSpecificDateToDelete(null);
            setDeleteReason(''); // Clear the reason
            setShowDayAvailabilityPopup(false); // Close day availability popup
        },
        onError: (err) => {
            console.error("Error deleting specific availability instance:", err);
            // Handle error, maybe show a message to the user
        }
    });

    // Mutation to remove an unavailable specific date (make available)
    const removeUnavailableDateMutation = useMutation({
        mutationFn: (date) => removeUnavailableDate(date, token),
        onSuccess: () => {
            queryClient.invalidateQueries(['doctorRecurringAvailability', user?._id]);
            setShowDayAvailabilityPopup(false);
            setSelectedDate(null);
        },
        onError: (err) => {
            console.error('Error removing unavailable date:', err);
        }
    });

    // Mutation for deleting recurring availabilities by day of week
    const deleteRecurringAvailabilityMutation = useMutation({
        mutationFn: ({ days }) => deleteDoctorRecurringAvailability(days, token),
        onSuccess: () => {
            queryClient.invalidateQueries(['doctorRecurringAvailability', user?._id]);
        },
        onError: (err) => {
            console.error('Error deleting recurring availability:', err);
        }
    });

    const addBreakMutation = useMutation({
        mutationFn: ({ breakDetails }) => addBreaksToRecurringAvailability(breakDetails, token),
        onSuccess:()=>{
            queryClient.invalidateQueries(['doctorRecurringAvailability', user?._id]);
        },
        onError: (err) => {
            console.error('Error adding break:', err);      

        }
            
    });

    const removeBreakMutation = useMutation({
        mutationFn: (breakId) => removeBreakFromRecurringAvailability(breakId, token),
        onSuccess:()=>{
            queryClient.invalidateQueries(['doctorRecurringAvailability', user?._id]);
        },
        onError: (err) => {
            console.error('Error removing break:', err);
        }
    });       
    // mutation for adding timeallotment
    const timeAllotmentMutation = useMutation({
        mutationFn: ({ timeAllotment }) => addTimeAllotmentToRecurringAvailability(timeAllotment, token),
        onSuccess: () => {  
            queryClient.invalidateQueries(['doctorTimeAllotment', user?._id]);
        },
        onError: (err) => {
            console.error('Error adding time allotment:', err);
        }
    });

    const handleAddAvailability = (e) => {
        e.preventDefault();
        if (day && startTime && endTime) {
            addAvailabilityMutation.mutate({ day, startTime, endTime });
            setDay('Sunday');
            setStartTime('');
            setEndTime('');
        }
    };

    

    const closeDayAvailabilityPopup = () => {
        setShowDayAvailabilityPopup(false);
        setSelectedDate(null);
    };


    const availabilityToRender = availability?.slots || [];
    

    const selectedDayOfWeek = selectedDate ? apiDayOfWeekMap[selectedDate.getDay()] : null;
    const slotsForSelectedDay = useMemo(() => {
        if (!selectedDate) {
            return [];
        }

        const dayOfWeekString = selectedDate.toLocaleDateString('en-US', { weekday: 'long' });
        const allSlotsForDay = availabilityToRender.filter(slot => 
            apiDayOfWeekMap[slot.dayOfWeek] === dayOfWeekString
        );

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

    }, [selectedDate, availabilityToRender, apiDayOfWeekMap]);

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
            <div className='recurring-availability-container'>
            <h2>Manage Recurring Availability</h2>
            <div className='manage-availability'>
            <form onSubmit={handleAddAvailability}>
                <div>
                    <label>Day of the week:</label>
                    <select value={day} onChange={(e) => setDay(e.target.value)}>
                        <option value="Sunday">Sunday</option>
                        <option value="Monday">Monday</option>
                        <option value="Tuesday">Tuesday</option>
                        <option value="Wednesday">Wednesday</option>
                        <option value="Thursday">Thursday</option>
                        <option value="Friday">Friday</option>
                        <option value="Saturday">Saturday</option>
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
            <DeleteRecurringAvailabilities mutation={deleteRecurringAvailabilityMutation} />
            <AddBreaks MutationAddBreak={addBreakMutation} />
            <RemoveBreaks removeBreaksMutation={removeBreakMutation} breaks={breaks || []} />
            <TimeAllotment timeAllotmentMutation={timeAllotmentMutation} PrevTimeAllotment={timeAllotment} />
            </div>
            </div>
            <div>
                <h3>Current Availability:</h3>
                {isLoading && <p>Loading availability...</p>}
                {isError && <p>Error: {error.message}</p>}
                <Calendar 
                    onChange={onChange} 
                    value={date} 
                    tileClassName={getTileClassName(availabilityToRender, apiDayOfWeekMap)} 
                    tileContent={getTileContent(availabilityToRender, apiDayOfWeekMap)} 
                    onClickDay={setSelectedDate} 
                    calendarType="gregory"
                />
            </div>

            <DayAvailabilityPopup
                isOpen={showDayAvailabilityPopup}
                onClose={closeDayAvailabilityPopup}
                dayOfWeek={selectedDayOfWeek}
                slots={slotsForSelectedDay}
                onDeleteSlot={(availabilityId, slot, specificDate) => handleDeleteAvailabilityClick(availabilityId, slot, specificDate, setAvailabilityToDelete, setSlotDetailsToDelete, setSpecificDateToDelete, setShowDeletePopup, apiDayOfWeekMap)}
                specificDate={selectedDate}
                onMakeAvailable={(date) => removeUnavailableDateMutation.mutate(date)}
            />

            <ConfirmDeletePopup
                isOpen={showDeletePopup}
                onClose={() => cancelDelete(setShowDeletePopup, setAvailabilityToDelete, setSlotDetailsToDelete, setSpecificDateToDelete, setDeleteReason)}
                onConfirm={() => confirmDelete(availabilityToDelete, specificDateToDelete, deleteSpecificAvailabilityInstanceMutation, deleteReason)}
                slotDetails={slotDetailsToDelete}
                specificDate={specificDateToDelete}
                reason={deleteReason}
                onReasonChange={(e) => setDeleteReason(e.target.value)}
            />
        </div>
    );
};

export default DoctorAvailability;