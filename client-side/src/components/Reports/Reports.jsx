import React from 'react';
import { useState, useEffect } from 'react';
import axiosWithAuth from '../utils/axiosWithAuth';
import {
  AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Box, Button,
  Grid, Paper
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';

export default function Reports() {
  const [reportData, setReportData] = useState({});
  const [error, setError] = useState('');
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = React.useState(false);


  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const axiosInstance = axiosWithAuth();
      const response = await axiosInstance.get('http://localhost:5000/admin/reports');
      setReportData(response.data);
    } catch (error) {
      setError('Error fetching report data');
    }
  };

  const menuItems = [
    
    { text: 'Admin Dashboard', path: '/admin-dashboard'},
    { text: 'User Management', path: '/admin-dashboard/user-management'},
    { text: 'Pending Approvals', path: '/admin-dashboard/pending-approvals'}
    
  ];

  const buttonStyle = {
    fontWeight: 'bold',
    textTransform: 'none',
    fontFamily: 'Arial, sans-serif',
    fontSize: '1rem',
    margin: '0 10px',
  };

  const titleStyle = {
    textAlign: 'center',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', 
    color: '#3f51b5', 
    backgroundColor: '#f5f5f5',
    padding: '10px 0',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
    margin: '20px 0',
    borderRadius: '4px',
  };

  return (
    <div>
         <AppBar position="static" sx={{ backgroundColor: '#000' }}>
        <Toolbar>
          {isMobile && (
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Reports
          </Typography>
          {!isMobile && (
            <Box sx={{ display: 'flex', marginLeft: 'auto' }}>
              {menuItems.map((item, index) => (
                <Button key={index} color="inherit" component={Link} to={item.path} sx={buttonStyle} onClick={item.action}>
                  {item.text}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250 }} role="presentation" onClick={() => setDrawerOpen(false)} onKeyDown={() => setDrawerOpen(false)}>
          <List>
            {menuItems.map((item, index) => (
              <ListItem button key={index} component={Link} to={item.path} >
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Box sx={{ flexGrow: 1, padding: '20px' }}>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ padding: '20px', textAlign: 'center' }}>
              <Typography variant="h6" component="div" color="primary">
                Active Users
              </Typography>
              <Typography variant="h5" component="div">
                {reportData.activeUsers}
              </Typography>
            </Paper>
          </Grid>

          <Grid item xs={12} sm={6} md={4}>
            <Paper elevation={3} sx={{ padding: '20px', textAlign: 'center' }}>
              <Typography variant="h6" component="div" color="secondary">
                Total Adoptions
              </Typography>
              <Typography variant="h5" component="div">
                {reportData.totalAdoptions}
              </Typography>
            </Paper>
          </Grid>
          
          {/* Add more Grid items here for additional report data */}
        </Grid>
      </Box>





{/* 
      <h2>Reports and Analytics</h2>
      {error && <p>{error}</p>}
      <div>
        <p>Active Users: {reportData.activeUsers}</p>
        <p>Total Adoptions: {reportData.totalAdoptions}</p>
      </div> */}
    </div>
  )
}
