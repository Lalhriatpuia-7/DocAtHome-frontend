import React, { use, useContext } from 'react';
import PatientDashboard from '../../components/dashboard-components/patients/PatientDashboard';
import DoctorDashboard from '../../components/dashboard-components/doctor/DoctorDashboard';
import AdminDashboard from '../../components/dashboard-components/admin/AdminDashboard';
import NurseDashboard from '../../components/dashboard-components/nurse/NurseDashboard';
import { AuthContext } from '../../features/auth/AuthContext.jsx';



const Dashboard = () => {
    const {user} = useContext(AuthContext);   
  
   

    if(!user){
        return <div>Please login to view your dashboard</div>
    }
    if(user.role === 'patient'){
        return <>
        <PatientDashboard />
        
        </>
    }
    if(user.role === 'admin'){
        return (
            <AdminDashboard />
        );
    }
    if(user.role ==='doctor'){
        return (
            <DoctorDashboard />
        );  

    }
        if(user.role ==='nurse'){
            return (
                <NurseDashboard />
            );
        }
    return (
        <div>            
            <p>Welcome to your DocAtHome. Please login to view your dashboard</p>
            {/* Additional metrics and information can be added here */}
        </div>
    );
};

export default Dashboard;