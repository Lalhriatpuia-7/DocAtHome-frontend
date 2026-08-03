import React, { useState } from 'react';
import DoctorAppointments from './doctor-components/DoctorAppointments';
import DoctorPatients from './doctor-components/DoctorPatients';
import DoctorAvailability from './doctor-components/DoctorAvailability';
import { useContext } from 'react';
import { AuthContext } from '../../../features/auth/AuthContext.jsx';
import Login from '../../../features/auth/Login.jsx';
import '../../dashboard-components/dashboard.css';

const DoctorDashboard = () => {
  const [activeTab, setActiveTab] = useState('appointments');

  const { user } = useContext(AuthContext);

  if (!user || user.role !== 'doctor') {
    return <Login />;
  }

  return (
    <div className="dashboard-container">
      <h1>Doctor Dashboard</h1>
      <div className="dashboard-nav">
        <button onClick={() => setActiveTab('appointments')}>Appointments</button>
        <button onClick={() => setActiveTab('patients')}>Patients</button>
        <button onClick={() => setActiveTab('availability')}>Availability</button>
      </div>
      <div className="dashboard-content">
        {activeTab === 'appointments' && <DoctorAppointments />}
        {activeTab === 'patients' && <DoctorPatients />}
        {activeTab === 'availability' && <DoctorAvailability />}
      </div>
    </div>
  );
}
export default DoctorDashboard;