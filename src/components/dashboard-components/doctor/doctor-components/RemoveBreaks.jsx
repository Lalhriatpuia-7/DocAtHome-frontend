const RemoveBreaks = ({removeBreaksMutation, breaks}) =>{

    const handleRemoveBreak = (breakId) => {
        removeBreaksMutation.mutate(breakId);
    };

    return (
        <div className="break-list">
            <h3>Breaks: </h3>
            {breaks.map((breakItem) => (
                <div key={breakItem._id} className="break-item">
                    <div>time {breakItem.startTime} - {breakItem.endTime}: reason {breakItem.details? breakItem.details : "N/A"}</div>
                    <button onClick={() => handleRemoveBreak(breakItem._id)}>Remove</button>
                </div>
            ))}
        </div>
    );
}

export default RemoveBreaks;    
