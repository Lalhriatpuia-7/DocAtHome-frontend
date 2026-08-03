import { useState } from 'react';

const DeleteRecurringAvailabilities = ({ mutation }) => {
    const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
    const [selectedDays, setSelectedDays] = useState([]);

    const handleDayClick = (day) => {
        setSelectedDays(prevDays =>
            prevDays.includes(day)
                ? prevDays.filter(d => d !== day)
                : [...prevDays, day]
        );
    };

    const handleDelete = () => {
        if (selectedDays.length > 0) {
            mutation.mutate({ days: selectedDays });
            setSelectedDays([]);
        }
    };

    return (
        <div>
            <h3>Select Days of Week to Delete:</h3>
            <div className="selected-dates-container">
                {daysOfWeek.map(day => (
                    <button
                        key={day}
                        className={`date-btn ${selectedDays.includes(day) ? 'selected' : ''}`}
                        onClick={() => handleDayClick(day)}
                    >
                        {day}
                    </button>
                ))}
            </div>
            <button 
                onClick={handleDelete} 
                disabled={selectedDays.length === 0 || mutation.isPending}
                className="delete-btn"
            >
                {mutation.isPending ? 'Deleting...' : 'Delete Selected Days'}
            </button>
        </div>
    );
};

export default DeleteRecurringAvailabilities;