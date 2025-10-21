import React, { use, useContext } from 'react';
import PatientDashboard from '../../components/dashboard-components/Patient-dashboard';
import DoctorDashboard from '../../components/dashboard-components/Doctor-dashboard';
import AdminDashboard from '../../components/dashboard-components/Admin-dashboard';
import NurseDashboard from '../../components/dashboard-components/Nurse-dashboard';
import { AuthContext } from '../../contexts/AuthContext.jsx';



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