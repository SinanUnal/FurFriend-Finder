import React, { useState, useEffect, useCallback } from 'react';
import axiosWithAuth from '../utils/axiosWithAuth';

export default function GiverDashboardStats({ userId }) {
  const [dashboardData, setDashboardData] = useState({
    userName: '',
    activeSubmission: 0,
    pendingApprovals: 0,
    successfulAdoption: 0
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      const axiosInstance = axiosWithAuth();
      const response = await axiosInstance.get(`http://localhost:5000/giverDashboard/${userId}`);
      setDashboardData(response.data);
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
    }
  }, [userId]);

  useEffect(() => {
    console.log("UserId in GiverDashboardStats:", userId);
    fetchDashboardData();
  }, [fetchDashboardData, userId]);
 
  return (
    <div>
         <h1>Welcome {dashboardData.userName}</h1>
            <p>Active Submissions: {dashboardData.activeSubmission}</p>
            <p>Pending Approvals: {dashboardData.pendingApprovals}</p>
            <p>Successful Adoptions: {dashboardData.successfulAdoption}</p>
       
    </div>
  )
}
// dashboardData