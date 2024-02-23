// import React, { useState, useEffect, useCallback } from 'react';
// import axiosWithAuth from '../utils/axiosWithAuth';
// import { useNavigate } from 'react-router-dom';
// import { Card, CardActionArea, CardContent, Typography, Grid } from '@mui/material';

// export default function GiverDashboardStats({ userId }) {
//   const [dashboardData, setDashboardData] = useState({
//     userName: '',
//     activeSubmission: 0,
//     pendingApprovals: 0,
//     successfulAdoption: 0
//   });
//   const navigate = useNavigate();

//   const fetchDashboardData = useCallback(async () => {
//     try {
//       const axiosInstance = axiosWithAuth();
//       const response = await axiosInstance.get(`http://localhost:5000/giverDashboard/${userId}`);
//       setDashboardData(response.data);
//     } catch (error) {
//       console.error('Error fetching dashboard data:', error);
//     }
//   }, [userId]);

//   useEffect(() => {
//     console.log("UserId in GiverDashboardStats:", userId);
//     fetchDashboardData();
//   }, [fetchDashboardData, userId]);
 
//   const handleCardClick = (path) => {
//     navigate(path);
//   };
  
//   return (
//     <div>
//          <h1>Welcome {dashboardData.userName}</h1>
//             <p>Active Submissions: {dashboardData.activeSubmission}</p>
//             <p>Pending Approvals: {dashboardData.pendingApprovals}</p>
//             <p>Successful Adoptions: {dashboardData.successfulAdoption}</p>
       
//     </div>
//   )
// }



import React, { useState, useEffect, useCallback } from 'react';
import axiosWithAuth from '../utils/axiosWithAuth';
import { Paper, Typography, Grid, Box } from '@mui/material';

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
          <Box sx={{ flexGrow: 1, padding: '20px' }}>
      
      
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ padding: '20px', textAlign: 'center' }}>
            <Typography variant="h6" component="div" color="primary">
              Active Submissions
            </Typography>
            <Typography variant="h5" component="div">
              {dashboardData.activeSubmission}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ padding: '20px', textAlign: 'center' }}>
            <Typography variant="h6" component="div" color="secondary">
              Pending Approvals
            </Typography>
            <Typography variant="h5" component="div">
              {dashboardData.pendingApprovals}
            </Typography>
          </Paper>
        </Grid>
        
        <Grid item xs={12} sm={6} md={4}>
          <Paper elevation={3} sx={{ padding: '20px', textAlign: 'center' }}>
            <Typography variant="h6" component="div" color="success.main">
              Successful Adoptions
            </Typography>
            <Typography variant="h5" component="div">
              {dashboardData.successfulAdoption}
            </Typography>
          </Paper>
        </Grid>
      </Grid>
    </Box>
       
    </div>
  )
}
