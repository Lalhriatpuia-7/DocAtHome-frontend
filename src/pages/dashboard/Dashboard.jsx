import React, { use } from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import { getCurrentUser } from '../../apis/appoinmentApi';
import PatientDashboard from '../../components/dashboard-components/Patient-dashboard';
import DoctorDashboard from '../../components/dashboard-components/Doctor-dashboard';
import AdminDashboard from '../../components/dashboard-components/Admin-dashboard';


const Dashboard = () => {

    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true);
  

    useEffect(() => {
        const token = localStorage.getItem('token');
        if (!token) {
            setLoading(false);
            return;
        }
        getCurrentUser({}, token).then(data => {
            console.log(data);
            setUser(data);
            setLoading(false);
        }).catch(err => {
            console.error(err);
            setLoading(false);
        });
    }, []);

    console.log(user);

    if(loading){
        return <div>Loading...</div>
    }
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