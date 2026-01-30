import React from 'react';

export const getTileClassName = (availableDays) => ({ date, view }) => {
    if (view === 'month') {
        const dayOfWeekString = date.toLocaleDateString('en-US', { weekday: 'long' });
        if (availableDays.has(dayOfWeekString)) {
            return 'available-day';
        }
    }
    return null;
};

export const getTileContent = (memoizedAvailabilityMap) => ({ date: calendarDate, view }) => {
    if (view === 'month') {
        const dayOfWeekString = calendarDate.toLocaleDateString('en-US', { weekday: 'long' });
        const slotsForDay = memoizedAvailabilityMap[dayOfWeekString];
        if (slotsForDay && slotsForDay.length > 0) {
            return (
               <div className="availability-slots">
                    <div className="slot-time">
                        {slotsForDay[0].startTime} - {slotsForDay[0].endTime}
                    </div>
                    {slotsForDay.length > 1 && <div className="more-slots-indicator">...</div>}
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

export const confirmDelete = (availabilityToDelete, specificDateToDelete, deleteSpecificAvailabilityInstanceMutation) => {
    if (availabilityToDelete && specificDateToDelete) {
        deleteSpecificAvailabilityInstanceMutation.mutate({
            date: specificDateToDelete,
            recurringSlotId: availabilityToDelete
        });
    } else if (availabilityToDelete) {
        console.warn("Attempting to delete entire recurring pattern. This might be unintended.");
    }
};

export const cancelDelete = (setShowDeletePopup, setAvailabilityToDelete, setSlotDetailsToDelete, setSpecificDateToDelete) => {
    setShowDeletePopup(false);
    setAvailabilityToDelete(null);
    setSlotDetailsToDelete(null);
    setSpecificDateToDelete(null);
};

export const ConfirmDeletePopup = ({ isOpen, onClose, onConfirm, slotDetails, specificDate }) => {
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
                <div className="popup-actions">
                    <button onClick={onConfirm} className="confirm-button">Confirm</button>
                    <button onClick={onClose} className="cancel-button">Cancel</button>
                </div>
            </div>
        </div>
    );
};

export const DayAvailabilityPopup = ({ isOpen, onClose, dayOfWeek, slots, onDeleteSlot, specificDate }) => {
    if (!isOpen) return null;
    console.log("Rendering DayAvailabilityPopup with slots:", slots);

    return (
        <div className="popup-overlay">
            <div className="popup-content">
                <h3>Availability {specificDate && `on ${specificDate.toDateString()}`}</h3>
                {slots && slots.length > 0 ? (
                    <ul>
                        {slots.map(slot => (
                            <li key={slot._id}>
                                {slot.startTime} - {slot.endTime}
                                <button onClick={() => onDeleteSlot(slot._id, slot, specificDate)}>Remove</button>
                            </li>
                        ))}
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
