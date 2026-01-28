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
