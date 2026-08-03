

import React, { useState, useEffect } from 'react';

const TimeAllotment = ({ timeAllotmentMutation, PrevTimeAllotment }) => {

    const [timeAllotment, setTimeAllotment] = useState(PrevTimeAllotment || '');

    useEffect(() => {
        setTimeAllotment(PrevTimeAllotment || '');
    }, [PrevTimeAllotment]);

    const isValidNumber = (value) => {
        const number = parseInt(value, 10);
        return !isNaN(number) && number > 0;
    };

    const handleTimeAllotment = (e) => {
        e.preventDefault();
        if (timeAllotment === '') {
            console.error('Time allotment is required');
            return;
        }
        if (isValidNumber(timeAllotment)) {
            timeAllotmentMutation.mutate({ timeAllotment: parseInt(timeAllotment, 10) });
            setTimeAllotment('');
        } else {
            console.error('Time allotment must be a valid positive number');
        }
    };
    return (
        <div className="time-allotment-container">
            <h2>Time allotted for each session: {PrevTimeAllotment || 0} minutes</h2>
            <form onSubmit={handleTimeAllotment}>   
                <label>Change Time Allotment:
                    <input
                        type="number"
                        name="timeAllotment"
                        min="1"
                        step="1"
                        value={timeAllotment}
                        onChange={(e) => setTimeAllotment(e.target.value)}
                        required
                    />
                </label>
                <button type="submit">Add Time Allotment</button>
            </form>
        </div>
    )
}

export default TimeAllotment;
    