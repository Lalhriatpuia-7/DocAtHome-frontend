 const AddBreaks = ({ MutationAddBreak })=>{
    const handleAddBreakSubmit = (e) => {
        e.preventDefault();
        const formData = new FormData(e.target);
        const startTime = formData.get('startTime');
        const endTime = formData.get('endTime');
        const details = formData.get('details');
        const breakDetails = { startTime, endTime, details };
        console.log("Submitting break details:", breakDetails);
        if (startTime && endTime) {
            MutationAddBreak.mutate({ breakDetails });
            e.target.reset();
        }   
    };

    return (
        <div className="add-break-container">
            <h2>Add Breaks</h2>
                <form onSubmit={handleAddBreakSubmit}>
                    <label>Start Time:
                        <input type="time" name="startTime" required />
                    </label>
                    <label>
                        End Time:
                        <input type="time" name="endTime" required />
                    </label>
                    <label htmlFor="details">Details:
                        <input type="text" name="details" />
                    </label>
                    <button type="submit">Add Break</button>
                </form>

        </div>
    )
}

export default AddBreaks;