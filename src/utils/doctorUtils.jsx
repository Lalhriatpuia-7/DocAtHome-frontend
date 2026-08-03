import { all } from 'axios';
import React from 'react';
import {format} from 'date-fns';
// UI helper: don't call APIs directly here; caller should provide handlers

const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

export const getTileClassName = (allSlots, apiDayOfWeekMap) => ({ date, view }) => {
    if (view === 'month') {
        const dayOfWeekString = date.toLocaleDateString('en-US', { weekday: 'long' });
        const hasRecurringAvailability = allSlots.some(slot =>
            apiDayOfWeekMap[slot.dayOfWeek] === dayOfWeekString
        );

        if (hasRecurringAvailability) {
            return 'available-day';
        }
    }
    return null;
};

export const getTileContent = (allSlots, apiDayOfWeekMap) => ({ date: calendarDate, view }) => {
    if (view === 'month') {
        // Format date in local timezone to avoid shifting by one day
        const year = calendarDate.getFullYear();
        const month = String(calendarDate.getMonth() + 1).padStart(2, '0');
        const day = String(calendarDate.getDate()).padStart(2, '0');
        const currentDateISO = `${year}-${month}-${day}`;
        
        const jsDay = calendarDate.getDay(); // JavaScript: 0 = Sunday, 1 = Monday, etc.
        // Backend uses 1-7 format (1 = Monday, 7 = Sunday)
        const backendDayOfWeek = jsDay === 0 ? 7 : jsDay;

        // First, check if there's a specific slot (unavailable or exception) for this exact date
        const specificSlotForDate = allSlots.find(slot => slot.day === currentDateISO);

        if (specificSlotForDate) {
            // If there's a specific slot for this date
            if (specificSlotForDate.unavailable) {
                // Show unavailable message
                return (
                    <div className="availability-slots unavailable">
                        <div className="slot-time">
                            Unavailable
                        </div>
                    </div>
                );
            } else {
                // Show the available slot for this specific date
                return (
                    <div className="availability-slots">
                        <div className="slot-time">
                            {specificSlotForDate.startTime} - {specificSlotForDate.endTime}
                        </div>
                    </div>
                );
            }
        }

        // If no specific slot for this date, check for recurring slots matching this day of week
        const recurringSlots = allSlots.filter(slot => {
            return !slot.day && // No specific day means it's a recurring slot
                   slot.dayOfWeek === backendDayOfWeek &&
                   !slot.unavailable;
        });

        if (recurringSlots.length > 0) {
            const firstSlot = recurringSlots[0];
            return (
                <div className="availability-slots">
                    <div className="slot-time">
                        {firstSlot.startTime} - {firstSlot.endTime}
                    </div>
                </div>
            );
        }
    }
    return null;
};

export const handleDeleteAvailabilityClick = (availabilityId, slot, specificDate, setAvailabilityToDelete, setSlotDetailsToDelete, setSpecificDateToDelete, setShowDeletePopup, apiDayOfWeekMap) => {
    setAvailabilityToDelete(availabilityId);
    setSlotDetailsToDelete({
        dayName: apiDayOfWeekMap[slot.dayOfWeek],
        startTime: slot.startTime,
        endTime: slot.endTime,
    });
    setSpecificDateToDelete(specificDate);
    setShowDeletePopup(true);
};

export const confirmDelete = (availabilityToDelete, specificDateToDelete, deleteSpecificAvailabilityInstanceMutation, reason) => {
    if (availabilityToDelete && specificDateToDelete) {
        // Format the date to YYYY-MM-DD to avoid timezone issues
        const formattedDate = specificDateToDelete.getFullYear() + '-' +
            String(specificDateToDelete.getMonth() + 1).padStart(2, '0') + '-' +
            String(specificDateToDelete.getDate()).padStart(2, '0');

        deleteSpecificAvailabilityInstanceMutation.mutate({
            date: formattedDate,
            recurringSlotId: availabilityToDelete,
            reason: reason
        });
    } else if (availabilityToDelete) {
        // Attempting to delete entire recurring pattern. This might be unintended.
    }
};

export const cancelDelete = (setShowDeletePopup, setAvailabilityToDelete, setSlotDetailsToDelete, setSpecificDateToDelete, setDeleteReason) => {
    setShowDeletePopup(false);
    setAvailabilityToDelete(null);
    setSlotDetailsToDelete(null);
    setSpecificDateToDelete(null);
    setDeleteReason(''); // Reset the reason
};

export const ConfirmDeletePopup = ({ isOpen, onClose, onConfirm, slotDetails, specificDate, reason, onReasonChange }) => {
    if (!isOpen) return null;

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h3>Confirm Deletion</h3>
                <p>Are you sure you want to remove the availability for:</p>
                {slotDetails && (
                    <p>
                        <strong>
                            {slotDetails.dayName}: {slotDetails.startTime} - {slotDetails.endTime}
                            {specificDate && ` on ${specificDate.toDateString()}`}
                        </strong>
                    </p>
                )}
                <div>
                    <label htmlFor="unavailability-reason">Reason for unavailability:</label>
                    <textarea
                        id="unavailability-reason"
                        value={reason}
                        onChange={onReasonChange}
                        placeholder="e.g., Personal appointment"
                    />
                </div>
                <div className="popup-actions">
                    <button onClick={onConfirm} className="confirm-button">Confirm</button>
                    <button onClick={onClose} className="cancel-button">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export const DayAvailabilityPopup = ({ isOpen, onClose,  slots, onDeleteSlot, specificDate, onMakeAvailable }) => {
    if (!isOpen) return null;
    const convertedDate = specificDate ? format(specificDate, 'yyyy-MM-dd') : null;
    const selectedDateSlots = slots.filter(slot => slot.day === convertedDate);
    console.log("Slots for selected date in DayAvailabilityPopup:", selectedDateSlots);
    if(selectedDateSlots && selectedDateSlots.length > 0 && selectedDateSlots[0].unavailable) {
        return (
            <div className="popup-overlay">
                <div className="popup-content">
                    <h3>Availability {specificDate && `on ${specificDate.toDateString()}`}</h3>
                    <p>{`Unavailable reason: ${selectedDateSlots[0].reason}`}</p>
                    <button onClick={() => onMakeAvailable && onMakeAvailable(selectedDateSlots[0].day)}>Make Available</button>
                    <div className="popup-actions">
                        <button onClick={onClose} className="cancel-button">Close</button>
                    </div>
                </div>
            </div>
        );
    }
    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h3>Availability {specificDate && `on ${specificDate.toDateString()}`}</h3>
                {selectedDateSlots && selectedDateSlots.length > 0 ? (
                    <ul>
                        <li key={selectedDateSlots[0]._id}>
                            {selectedDateSlots[0].startTime} - {selectedDateSlots[0].endTime}
                            <button onClick={() => onDeleteSlot(selectedDateSlots[0]._id, selectedDateSlots[0], specificDate)}>Remove</button>
                            
                            
                        </li>
                    </ul>
                ) : (
                    <p>No availability for this day.</p>
                )}
                <div className="popup-actions">
                    <button onClick={onClose} className="cancel-button">Close</button>
                    
                </div>
            </div>
        </div>
    );
};

export const getTileClassNameForAppointments = (availableSlots) => ({ date, view }) => {
    if (view === 'month') {
        const dateString = format(date, 'yyyy-MM-dd');
        console.log("Available Slots:", availableSlots.availableSlots);
        console.log("Date String:", dateString);
        const currentDaySlots = availableSlots.availableSlots?.filter(slot => slot.day === dateString);
        const checkIfBooked = currentDaySlots?.slots?.some(slot => slot.booked);
        if (currentDaySlots && currentDaySlots.length > 0) {
            return checkIfBooked ? 'booked-day' : 'available-day';
        }
        if (currentDaySlots && currentDaySlots.length === 0) {
            return 'unavailable-day';
        }
        
    }
    return null;
};
