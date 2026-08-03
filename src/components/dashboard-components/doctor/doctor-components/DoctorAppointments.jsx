import React, { useState, useEffect, useContext, useMemo } from "react";
import Calendar from 'react-calendar';
import { getDoctorAvailability, getDoctorAppointments,getDoctorAvailableAppointmentSlots } from "../../../../apis/dashboardsApis/doctorDashboardApi";
import { getTileClassNameForAppointments} from "../../../../utils/doctorUtils.jsx";
import { useQuery } from "@tanstack/react-query";
import '../../calendar-style/Calendar.css';
import { AuthContext } from "../../../../features/auth/AuthContext.jsx";
import {format} from 'date-fns';


const DoctorAppointments = () => {
  const [date, setDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [availableAppointments, setAvailableAppointments] = useState([]); 
  const { user } = useContext(AuthContext);
  const doctorId = user?._id;
  const token = localStorage.getItem("token");


  const { data: doctorAvailability, isLoading: isLoadingAvailability, isError: isErrorAvailability, error: availabilityError } = useQuery({
    queryKey: ["doctorAvailability", doctorId],
    queryFn: () => getDoctorAvailability(token),
    enabled: !!doctorId && !!token,
  });

  const { data: doctorAppointments, isLoading: isLoadingAppointments, isError: isErrorAppointments, error: appointmentsError } = useQuery({
    queryKey: ["doctorsAppointments", doctorId, date], // Use toDateString for consistent key
    queryFn: () => getDoctorAppointments(doctorId, date, token),
    enabled: !!doctorId && !!token,
  });

  const doctorAvailableSlots  = useQuery({
    queryKey: ["doctorAvailableSlots", doctorId],
    queryFn: () => getDoctorAvailableAppointmentSlots(token),
    enabled: !!doctorId && !!token,
  });
  
  const availableSlots = doctorAvailableSlots.data || [];
  console.log("Available Slots:", availableSlots.availableSlots);

  useEffect(() => {
    if (availableSlots?.availableSlots) {
      const slotsForDate = availableSlots.availableSlots.filter(slot => slot.day === date);
      setAvailableAppointments(slotsForDate);
    }
  }, [availableSlots, date]);

  const onChange = (newDate) => {    
    setDate(format(newDate, 'yyyy-MM-dd'));
  };

  

  const appointmentDates = useMemo(() => {
    if (!doctorAppointments) return new Set();
    const dates = new Set();
    doctorAppointments.forEach(appointment => {
      dates.add(new Date(appointment.date).toDateString());
    });
    return dates;
  }, [doctorAppointments]);

  const tileContent = ({ date: calendarDate, view }) => {
    if (view === 'month' && appointmentDates.has(calendarDate.toDateString())) {
      return <p className="has-appointment-dot"></p>;
    }
    return null;
  };

  const filteredAppointments = doctorAppointments?.filter(
    (appointment) => format(new Date(appointment.date), 'yyyy-MM-dd') === date
  );
  
  const availabilityToRender =
    doctorAvailability?.availability || (Array.isArray(doctorAvailability) ? doctorAvailability : []);

  return (
    <div className="appointments-container">
      <h2>Doctor Appointments</h2>

      {isLoadingAvailability && <p>Loading availability...</p>}
      {isErrorAvailability && <p>Error loading availability: {availabilityError.message}</p>}
      {availabilityToRender.length > 0 ? (
        <div className="availability-info">
          <h3>Your Availability:</h3>
          <ul>
            {availabilityToRender.map((slot, index) => (
              <li key={index}>
                {slot.day}: {slot.startTime} - {slot.endTime}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        !isLoadingAvailability && <p>No availability information available. Please add availability information.</p>
      )}


      {isLoadingAppointments && <p>Loading appointments...</p>}
      {isErrorAppointments && <p>Error loading appointments: {appointmentsError.message}</p>}
      
        <Calendar 
          onChange={onChange} 
          value={new Date(date + 'T00:00:00')} 
          selectRange={false} 
          tileContent={tileContent} 
          tileClassName={getTileClassNameForAppointments(availableSlots)} 
          calendarType="gregory"
        />
        
        <div className="selected-date">
            <h3>Appointments for {date}:</h3>
            {console.log("selected date:", date)}
            {console.log("availableAppointments:", availableAppointments)}
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

            <h3>Available Slots for {date}:</h3>
            {availableAppointments && availableAppointments.length > 0 ? (
                <ul>
                    {availableAppointments.map((slot, index) => (
                        <li key={index}>
                            {slot.startTime} - {slot.endTime}
                        </li>
                    ))}
                </ul>
            ) : (
                <p>No available slots for this date.</p>
            )}
        </div>
    </div>
    );
}
export default DoctorAppointments;