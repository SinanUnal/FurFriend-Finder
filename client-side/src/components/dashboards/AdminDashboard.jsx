import React from 'react';
import { useEffect, useState } from 'react';
import axiosWithAuth from '../utils/axiosWithAuth';
import AnimalSubmissionForm from '../giver/AnimalSubmissionForm';
import { useNavigate, Link } from "react-router-dom";
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Box, Button, Card, CardContent, CardMedia, Grid } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';



export default function AdminDashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = React.useState(false);
 
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);
  const navigate = useNavigate();
 

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const axiosInstance = axiosWithAuth();
      const response = await axiosInstance.get('http://localhost:5000/admin/submissions');
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const handleEdit = (submission) => {
    setSelectedSubmission(submission);
  
  };

  const handleUpdateSuccess = () => {
    fetchSubmissions();
    setSelectedSubmission(null);
  };

  const handleCancel = () => {
    setSelectedSubmission(null);
    
  };

  function logout() {
    localStorage.clear();
    navigate('/login');
  }

  const menuItems = [
 
    { text: 'User Management', path: '/admin-dashboard/user-management'},
    { text: 'Reports', path: '/admin-dashboard/reports'},
    { text: 'Pending Approvals', path: '/admin-dashboard/pending-approvals'},
    { text: 'Logout', action: logout }
  ];

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

  const buttonStyle = {
    fontWeight: 'bold',
    textTransform: 'none',
    fontFamily: 'Arial, sans-serif',
    fontSize: '1rem',
    margin: '0 10px',
  };

  const titleStyle = {
    textAlign: 'center',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', // Example font family
    color: '#3f51b5', // Example color (Material-UI primary color)
    backgroundColor: '#f5f5f5', // Light grey background
    padding: '10px 0',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)', // Subtle shadow
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

      <Typography variant="h4" gutterBottom style={titleStyle}>
        Admin Dashboard
      </Typography>




{/* 
      <Link to={"/admin-dashboard/user-management"}>User Management</Link>
      <Link to={"/admin-dashboard/reports"}>Reports</Link>
      <Link to={"/admin-dashboard/pending-approvals"}>Pending Approvals</Link> */}
{/*       
      <button className="button" onClick={() => {
               logout();
       }}>Logout</button> */}


    {selectedSubmission && (
        <AnimalSubmissionForm
          initialData={selectedSubmission}
          isAdmin={true}
          onSubmissionSuccess={handleUpdateSuccess}
        />
      )}
      <Box 
        display="flex" 
        justifyContent="center" 
        width="100%" 
        my={4} 
        p={2} // padding
        style={{
          backgroundColor: '#f0f0f0', // Light grey background
          boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Shadow effect
          borderRadius: '4px', // Rounded corners
        }}
      >
        <Typography 
          variant="h4" 
          component="h2" 
          style={{ 
            textAlign: 'center',
            fontWeight: 'bold', // Optional: if you want the text to be bold
          }}
        >
          All Submissions
        </Typography>
      </Box>
      <Grid container spacing={2}>
        {submissions.map(submission => (
          <Grid item xs={12} sm={6} md={4} key={submission._id}>
            <Card sx={cardStyle}>
            <CardMedia
              component="img"
              alt={`Image of ${submission.animalName}`}
              height="200"
              image={submission.imageUrl} // Replace with your image source
            />
              <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {submission.animalName}
              </Typography>
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Age:</Typography>
              <Typography variant="body1" sx={{ marginBottom: 1, fontSize: '1.1rem' }}>{submission.animalAge}</Typography>
              {/* <Typography variant="body2" color="textSecondary">
                Age: {submission.animalAge}
              </Typography> */}
              {/* <Typography variant="body2" color="textSecondary">
                Health Info: {submission.healthInfo}
              </Typography> */}
               <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Health Info:</Typography>
              <Typography variant="body1" sx={{ marginBottom: 1, fontSize: '1.1rem' }}>{submission.healthInfo}</Typography>
              </CardContent>
              <Button sx={buttonStyle} onClick={() => handleEdit(submission)}>Edit</Button>
              {selectedSubmission && selectedSubmission._id === submission._id && (
                <Button sx={buttonStyle} onClick={handleCancel}>Cancel</Button>
              )}
            </Card>
          </Grid>
        ))}
      </Grid>



      {/* {selectedSubmission && (
        <AnimalSubmissionForm
        initialData={selectedSubmission}
        isAdmin={true}
        onSubmissionSuccess={handleUpdateSuccess}
      />
      )}
      <h2>All submissions</h2>
      {submissions.map(submission => (
        <div key={submission._id}>
          <p>{submission.animalName}</p>
          <button onClick={() => handleEdit(submission)}>Edit</button>
        </div>
      ))}
       */}
      
     
    </div>
  );
}
