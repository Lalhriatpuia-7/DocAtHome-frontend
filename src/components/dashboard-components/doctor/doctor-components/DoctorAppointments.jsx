import React, { useState, useEffect, useContext } from "react";
import Calendar from 'react-calendar';
import { getDoctorAvailability, getDoctorAppointments } from "../../../../apis/dashboardsApis/doctorDashboardApi";
import { useQuery } from "@tanstack/react-query";
import '../../calendar-style/Calendar.css';
import { AuthContext } from "../../../../features/auth/AuthContext.jsx";


const DoctorAppointments = () => {
  const [date, setDate] = useState(new Date());

  const { user } = useContext(AuthContext);
  const doctorId = user?._id;
  const token = localStorage.getItem("token");


  const { data: doctorAvailability, isLoading: isLoadingAvailability, isError: isErrorAvailability, error: availabilityError } = useQuery({
    queryKey: ["doctorAvailability", doctorId],
    queryFn: () => getDoctorAvailability(token),
    enabled: !!doctorId && !!token,
  });

  const { data: doctorAppointments, isLoading: isLoadingAppointments, isError: isErrorAppointments, error: appointmentsError } = useQuery({
    queryKey: ["doctorsAppointments", doctorId, date.toDateString()], // Use toDateString for consistent key
    queryFn: () => getDoctorAppointments(doctorId, date.toISOString(), token),
    enabled: !!doctorId && !!token,
  });
  
  const onChange = (newDate) => {
    setDate(newDate);
  };

  const tileContent = ({ date: calendarDate, view }) => {
    if (view === 'month' && doctorAppointments) {
      const hasAppointment = doctorAppointments.some(
        (appointment) => new Date(appointment.date).toDateString() === calendarDate.toDateString()
      );
      if (hasAppointment) {
        return <p className="has-appointment-dot"></p>; // Small dot to indicate appointment
      }
    }
    return null;
  };

  const filteredAppointments = doctorAppointments?.filter(
    (appointment) => new Date(appointment.date).toDateString() === date.toDateString()
  );
  
  return (
    <div className="appointments-container">    
        <h2>Doctor Appointments</h2>
        
        {isLoadingAvailability && <p>Loading availability...</p>}
        {isErrorAvailability && <p>Error loading availability: {availabilityError.message}</p>}
        {doctorAvailability ? (
          <div className="availability-info">
            <h3>Your Availability:</h3>
            <ul>
              {doctorAvailability.map((slot, index) => (
                <li key={index}>
                  {slot.day}: {slot.startTime} - {slot.endTime}
                </li>
              ))}
            </ul>
          </div>
        ) : (
          <p>No availability information available. Please add availability information.</p>
        )}

        
        {isLoadingAppointments && <p>Loading appointments...</p>}
        {isErrorAppointments && <p>Error loading appointments: {appointmentsError.message}</p>}

        <Calendar onChange={onChange} value={date} selectRange={false} tileContent={tileContent} />
        
        <div className="selected-date">
            <h3>Appointments for {date.toDateString()}:</h3>
            {filteredAppointments && filteredAppointments.length > 0 ? (
                <ul>
                    {filteredAppointments.map((appointment) => (
                        <li key={appointment._id}>
                            {new Date(appointment.date).toLocaleTimeString()} - {appointment.patientName || "N/A"}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No appointments for this date.</p>
            )}
        </div>
    </div>
    );
}
export default DoctorAppointments;