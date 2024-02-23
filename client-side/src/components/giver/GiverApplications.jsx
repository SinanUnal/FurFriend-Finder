import React, { useState, useEffect, useCallback, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Box, Button, Card, CardContent, Grid, CardMedia } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChatIcon from '@mui/icons-material/Chat';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import axiosWithAuth from '../utils/axiosWithAuth';
import ChatComponent from '../Chat/ChatComponent';
// import { useParams } from 'react-router-dom';
import { jwtDecode } from 'jwt-decode';
import { Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions } from '@mui/material';
import ReactDOM from 'react-dom';



export default function GiverApplications({ giverId }) {
  console.log('this is givers Id:', giverId);
  const [applications, setApplications] = useState([]);
  const [fetchType, setFetchType] = useState('pending');
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = React.useState(false);
  const [activeChat, setActiveChat] = useState(null);
  const [chatPosition, setChatPosition] = useState({ top: 0, left: 0 });
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedSubmission, setSelectedSubmission] = useState(null);


  const token = localStorage.getItem('token');
  let userId = null;

  if (token) {
    const decodedToken = jwtDecode(token);
    userId = decodedToken.id;
    console.log("UserId in GiverDashboard:", userId);
  }


  const menuItems = [
    
    { text: 'Animal Submission Form', path: '/giver-dashboard/submission-form'},
    { text: 'Current Listings', path: `/giver-dashboard/current-listings/${userId}`},
    { text: 'My Activities', path: '/giver-dashboard/'},
    { text: 'Profile', path: `/user/profile/${userId}`},
  
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

  const handleOpenDialog = (submissionId) => {
    setSelectedSubmission(submissionId);
    setOpenDialog(true);
  };

  
  const fetchApplications = useCallback(async () => {
    const endpoint = fetchType === 'pending'
      ? `http://localhost:5000/giverDashboard/pendingApplications/${giverId}`
      : `http://localhost:5000/giverDashboard/approvedApplications/${giverId}`;



    try {
      const axiosInstance = axiosWithAuth();
      const response = await axiosInstance.get(endpoint);
      
      setApplications(response.data);
     
    } catch (error) {
      console.error('Error fetching applications', error);
    }
  }, [giverId, fetchType]); // giverId is a dependency

  useEffect(() => {
    if (giverId) {
      fetchApplications();
    } else {
      console.log("Giver ID is undefined.");
    }
  }, [fetchApplications, giverId]);
  

  const fetchPendingApplications = useCallback(async () => {
    try {
      const axiosInstance = axiosWithAuth();
      const response = await axiosInstance.get(`http://localhost:5000/giverDashboard/pendingApplications/${giverId}`);
      setApplications(response.data);
      if (response.data.length === 0) {
        // If no pending applications, fetch approved ones
        setFetchType('approved');
      } else {
        setApplications(response.data);
      }
    } catch (error) {
      console.error('Error fetching applications', error);
    }
  }, [giverId]);

  const fetchApprovedApplications = useCallback(async () => {
    try {
      const axiosInstance = axiosWithAuth();
      const response = await axiosInstance.get(`http://localhost:5000/giverDashboard/approvedApplications/${giverId}`);
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications', error);
    }
  }, [giverId]);

  useEffect(() => {
    if (fetchType === 'pending') {
      fetchPendingApplications();
    } else {
      fetchApprovedApplications();
    }
  }, [fetchPendingApplications, fetchApprovedApplications, fetchType]);


 
  // const userType = 'giver';

  const handleApprove = async (applicationId) => {
    try {
      const axiosInstance = axiosWithAuth();
      await axiosInstance.patch(`http://localhost:5000/giverDashboard/approveApplication/${applicationId}`);
      setFetchType('approved');
      fetchApplications();
    } catch (error) {
      console.error('Error approving application', error);
    }
  };

  const handleReject = async (applicationId) => {
    try {
      const axiosInstance = axiosWithAuth();
      await axiosInstance.patch(`http://localhost:5000/giverDashboard/rejectApplication/${applicationId}`);
      fetchApplications();
    } catch (error) {
      console.error('Error rejecting application', error);
    }
  };

  const handleMarkAsAdopted = async () => {
    if (selectedSubmission) {
      try {
        const axiosInstance = axiosWithAuth();
        const response = await axiosInstance.patch(`http://localhost:5000/giverDashboard/updateSubmissionStatus/${selectedSubmission}`, { status: 'adopted' });
       
        if (response.status === 200) {
          // Update the status of the specific application in the state
          setApplications(currentApplications =>
            currentApplications.map(app =>
              app.submissionId._id === selectedSubmission ? { ...app, status: 'adopted' } : app
            )
          );
        }
  
        setOpenDialog(false); 
        setSelectedSubmission(null); 
      } catch (error) {
        console.error('Error marking as adopted:', error);
       
        setOpenDialog(false); 
        setSelectedSubmission(null); 
      }
    }
  };


  const toggleChat = (giverId, event) => {
    if (activeChat === giverId) {
      setActiveChat(null);
    } else {
      setActiveChat(giverId);
      const cardRect = event.currentTarget.closest('.MuiCard-root').getBoundingClientRect();
      setChatPosition({ top: cardRect.bottom + window.scrollY, left: cardRect.left + window.scrollX });
    }
  };

  useEffect(() => {
    const handleResize = () => {
      if (activeChat) {
        const card = document.querySelector(`#card-${activeChat}`);
        const cardRect = card.getBoundingClientRect();
        setChatPosition({ top: cardRect.bottom + window.scrollY, left: cardRect.left + window.scrollX });
      }
    };
  
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [activeChat]);
  
  const renderChatComponent = () => {
    if (activeChat) {
      const chatStyle = {
        position: 'absolute',
        top: `${chatPosition.top}px`,
        left: `${chatPosition.left}px`,
        zIndex: 1000,
        width: '350px',
        maxHeight: '400px',
        overflow: 'auto',
      };
  
      return ReactDOM.createPortal(
        <div style={chatStyle}>
          <ChatComponent adopterId={activeChat} giverId={giverId} userType="giver" />
        </div>,
        document.body
      );
    }
    return null;
  };
  
 

  return (
    <div>
       <AppBar position="static" sx={{
          background: 'linear-gradient(45deg, #6a1b9a 30%, #9c27b0 90%)' 
        }}>
      <Toolbar>
        {isMobile && (
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setDrawerOpen(true)}>
            <MenuIcon />
          </IconButton>
        )}
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          Adoption Applications
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

    
    <Dialog
  open={openDialog}
  onClose={() => setOpenDialog(false)}
  aria-labelledby="alert-dialog-title"
  aria-describedby="alert-dialog-description"
>
  <DialogTitle id="alert-dialog-title">
    {"Mark as Adopted"}
  </DialogTitle>
  <DialogContent>
    <DialogContentText id="alert-dialog-description">
      Are you sure you want to mark this application as "Adopted"?
    </DialogContentText>
  </DialogContent>
  <DialogActions>
    <Button sx={buttonStyle} onClick={() => setOpenDialog(false)} color="primary">
      No, I don't want
    </Button>
    <Button sx={buttonStyle} onClick={handleMarkAsAdopted} color="primary" autoFocus>
      Yes, I want
    </Button>
  </DialogActions>
</Dialog>





    <Typography variant="h4" gutterBottom style={titleStyle}>
      {fetchType === 'pending' ? 'Pending' : 'Approved'} Adoption Applications
    </Typography>

    <Grid container spacing={2}>
      {applications.map(app => (
        <Grid item xs={12} sm={6} md={4} key={app._id} id={`card-${app.adopterId._id}`}>
          <Card sx={cardStyle}>
            {app.submissionId.imageUrl && (
              <CardMedia
                component="img"
                alt={`Image of ${app.submissionId.animalName}`}
                height="200"
                image={app.submissionId.imageUrl}
              />
            )}
            <CardContent>
              <Typography gutterBottom variant="h5" component="h2">
                {app.submissionId.animalName}
              </Typography>
              
              {/* <Typography variant="body2" color="textSecondary" component="p">
                Applicant's Age: {app.age}
              </Typography> */}

              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Applicant's Age:</Typography>
              <Typography variant="body1" sx={{ marginBottom: 1, fontSize: '1.1rem' }}>{app.age}</Typography>

              {/* <Typography variant="body2" color="textSecondary" component="p">
                Home Environment: {app.homeEnvironment}
              </Typography> */}
               <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Home Experience:</Typography>
              <Typography variant="body1" sx={{ marginBottom: 1, fontSize: '1.1rem' }}>{app.homeEnvironment}</Typography>

              
              {/* <Typography variant="body2" color="textSecondary" component="p">
                Pet Experience: {app.petExperience}
              </Typography> */}

              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Pet Experience:</Typography>
              <Typography variant="body1" sx={{ marginBottom: 1, fontSize: '1.1rem' }}>{app.petExperience}</Typography>
              {/* <Typography variant="body2" color="textSecondary" component="p">
                Application Status: {app.status}
              </Typography> */}
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Application Status:</Typography>
              <Typography variant="body1" sx={{ marginBottom: 1, fontSize: '1.1rem' }}>{app.status}</Typography>

            </CardContent>
            {app.status === 'approved' && (
              <>
                <IconButton onClick={(event) => toggleChat(app.adopterId._id, event)}>
                  <ChatIcon />
                </IconButton>
                {activeChat === app.adopterId._id && (
                  <ChatComponent adopterId={app.adopterId._id} giverId={giverId} userType={'giver'} />
                )}
                {app.status !== 'adopted' && (
                <Button sx={buttonStyle} onClick={() => handleOpenDialog(app.submissionId._id)}>Mark as Adopted</Button>
)}
              </>
            )}
            {fetchType === 'pending' && (
              <>
                <Button sx={buttonStyle} onClick={() => handleApprove(app._id)}>Approve</Button>
                <Button sx={buttonStyle} onClick={() => handleReject(app._id)}>Reject</Button>
              </>
            )}
          </Card>
        </Grid>
      ))}
    </Grid>

    <Button sx={buttonStyle} onClick={() => setFetchType(fetchType === 'pending' ? 'approved' : 'pending')}>
      {fetchType === 'pending' ? 'Show Approved Applications' : 'Show Pending Applications'}
    </Button>

    {renderChatComponent()}







     {/* <h2>{fetchType === 'pending' ? 'Pending' : 'Approved'} Adoption Applications</h2> */}

     {/* {applications.length > 0 ? applications.map(app => (
      <div key={app._id}>
          <h3>Application Details</h3>
          <p>Animal Name: {app.submissionId.animalName}</p>
          <p>Applicant's Age: {app.age}</p>
          <p>Home Environment: {app.homeEnvironment}</p>
          <p>Pet Experience: {app.petExperience}</p>
          <p>Application Status: {app.status}</p>
          <Link to={`/user/public-profile/${app.adopterId._id}`}>View Adopter's Profile</Link>

        {app.status === 'approved' && (
        <>
          <ChatComponent adopterId={app.adopterId._id} giverId={giverId} userType={'giver'} />
          <button onClick={() => handleMarkAsAdopted(app.submissionId._id)}>Mark as Adopted</button>
        </>
          
       
        )}

          {fetchType === 'pending' && (
            <>
              <button onClick={() => handleApprove(app._id)}>Approve</button>
              <button onClick={() => handleReject(app._id)}>Reject</button>
            </>
          )}

      </div> 
     )) : <p>No pending applications.</p>} 
     <button onClick={() => setFetchType(fetchType === 'pending' ? 'approved' : 'pending')}>
     {fetchType === 'pending' ? 'Show Approved     Applications' : 'Show Pending Applications'}
     </button> */}

    </div>
  );
}



