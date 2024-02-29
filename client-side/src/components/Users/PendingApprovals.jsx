import React, { useEffect, useState } from 'react';
import axiosWithAuth from '../utils/axiosWithAuth';
import {
  AppBar, Paper, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Box, Button, Card, CardContent, CardMedia, Grid
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import './PendingApprovals.css';

export default function PendingApprovals() {
  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = React.useState(false);

  useEffect(() => {
    fetchPendingSubmissions();
  }, []);

  const fetchPendingSubmissions = async () => {
    try {
      const axiosInstance = axiosWithAuth();
      const response = await axiosInstance.get('http://localhost:5000/admin/approvals');
      setPendingSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching pending submissions:', error);
    }
  };

  const handleApprove = async (submissionId) => {
    try {
      const axiosInstance = axiosWithAuth();
      await axiosInstance.post(`http://localhost:5000/admin/approve/${submissionId}`);

      // Remove the item from the state
      setPendingSubmissions(prevSubmission => prevSubmission.filter(submission => submission._id !== submissionId));

    

    } catch (error) {
      console.error('Error approving submission', error);
    }
  };

  const handleReject = async (submissionId) => {
    try {
      const axiosInstance = axiosWithAuth();
      await axiosInstance.post(`http://localhost:5000/admin/reject/${submissionId}`);


   
      setPendingSubmissions(prevSubmission => prevSubmission.filter(submission => submission._id !== submissionId))

     
    } catch (error) {
      console.error('Error rejecting submission:', error);
    }
  };

  

  const menuItems = [
    { text: 'Admin Dashboard', path: '/admin-dashboard'},
    { text: 'User Management', path: '/admin-dashboard/user-management'},
    { text: 'Reports', path: '/admin-dashboard/reports'}
    
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

  const cardStyle = {
    maxWidth: 345,
    margin: '20px auto',
    backgroundColor: '#f5f5f5',
    boxShadow: '0 8px 16px 0 rgba(0, 0, 0, 0.2)',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.05)',
      boxShadow: '0 10px 20px 0 rgba(0, 0, 0, 0.3)'
    }
  };

  const noDataStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '20px',
    backgroundColor: '#f0f0f0',
    borderRadius: '8px',
    margin: '20px 0',
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
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
            Admin Dashboard
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
              <ListItem button key={index} component={Link} to={item.path} onClick={item.action}>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <div className="approvals-main-container">
      <Box
          display="flex"
          justifyContent="center"
          width="100%"
          my={4}
          p={2} 
          style={{
            backgroundColor: '#f0f0f0', 
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
            borderRadius: '4px', 
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            style={{
              textAlign: 'center',
              fontWeight: 'bold', 
            }}
          >
            Pending Approvals
          </Typography>
        </Box>
        {pendingSubmissions.length > 0 ? (
          <Grid container spacing={2}>
            {pendingSubmissions.map(submission => (
        <Grid item xs={12} sm={6} md={4} key={submission._id}>
          <Card sx={cardStyle}>
            <CardMedia
              component="img"
              alt={`Image of ${submission.animalName}`}
              height="200"
              image={submission.imageUrl}
            />
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {submission.animalName}
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Type:</Typography>
              <Typography variant="body1" sx={{ marginBottom: 1, fontSize: '1.1rem' }}>
                {submission.animalType}
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Age:</Typography>
              <Typography variant="body1" sx={{ marginBottom: 1, fontSize: '1.1rem' }}>
                {submission.animalAge}
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Health State:</Typography>
              <Typography variant="body1" sx={{ marginBottom: 1, fontSize: '1.1rem' }}>
                {submission.healthInfo}
              </Typography>
              </Typography>
            </CardContent>
            <Box sx={{ display: 'flex', justifyContent: 'center', p: 2 }}>
              <Button
                startIcon={<CheckCircleIcon />}
                sx={buttonStyle}
                onClick={() => handleApprove(submission._id)}
                color="primary"
              >
                Approve
              </Button>
              <Button
                startIcon={<CancelIcon />}
                sx={buttonStyle}
                onClick={() => handleReject(submission._id)}
                color="secondary"
              >
                Reject
              </Button>
            </Box>
          </Card>
        </Grid>
            ))}
          </Grid>
        ) : (
          <Paper elevation={3} style={noDataStyle}>
            <SentimentDissatisfiedIcon style={{ fontSize: 60, color: '#ff0000' }} />
            <Typography variant="h6" color="textSecondary">
             No pending approvals at the moment.
            </Typography>
          </Paper>
        )}
      </div>



    </div>
  );
}