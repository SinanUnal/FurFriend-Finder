import React, { useState, useEffect, useContext } from 'react';
import axiosWithAuth from '../utils/axiosWithAuth';
import {
  AppBar, Toolbar, Typography, IconButton, Box, Button, Card, CardContent, CardMedia, CardActions, 
  Drawer, List, ListItem, ListItemText, Grid
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import ChatIcon from '@mui/icons-material/Chat';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { AuthContext } from '../Auth/Authcontext';
import ChatComponent from '../Chat/ChatComponent';
// import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import ReactDOM from 'react-dom';

export default function AdopterApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [activeChat, setActiveChat] = useState(null);
  const { adopterId, loading } = useContext(AuthContext);
  // const navigate = useNavigate();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [chatPosition, setChatPosition] = useState({ top: 0, left: 0 });

  const menuItems = [
    { text: 'View Favorites', path: '/adopter-dashboard/favorites' },
    { text: 'View Adopted Animals', path: `/adopter-dashboard/adopted-animals/${adopterId}` },
    { text: 'Find Your Perfect Match', path: '/adopter-dashboard' },
    { text: 'Profile', path: `/user/profile/${adopterId}` }
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

  const buttonStyle = {
    fontWeight: 'bold',
    textTransform: 'none',
    fontFamily: 'Arial, sans-serif',
    fontSize: '1rem',
    margin: '0 10px',
  };

  useEffect(() => {
 
    if (!loading && adopterId ) {
        console.log('Adopter ID before fetching:', adopterId);
        console.log('Token before fetching:', localStorage.getItem('token'));
        fetchApplications(adopterId);
    }
}, [adopterId, loading]);

  // useEffect(() => {
  //   console.log("Adopter ID in AdopterApplicationsPage:", adopterId);
  //   if (adopterId) {
  //     fetchApplications(adopterId);
  //   }
  // }, [adopterId]);


  const fetchApplications = async (adopterId) => {
    try {
      const axiosInstance = axiosWithAuth();
      const response = await axiosInstance.get(`http://localhost:5000/adopterDashboard/applications/${adopterId}`);
      console.log("Applications fetched:", response.data);
      setApplications(response.data); 
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  // const userType = 'adopter';

  // const toggleChat = (giverId) => {
  //   if (activeChat === giverId) {
  //     setActiveChat(null); 
  //   } else {
  //     setActiveChat(giverId); 
  //   }
  // };
  const toggleChat = (giverId, event) => {
    if (activeChat === giverId) {
      // Close the chat box
      setActiveChat(null); 
    } else {
      // Open the chat box and calculate its position
      setActiveChat(giverId); 
      const cardRect = event.currentTarget.closest('.MuiCard-root').getBoundingClientRect();
      // Set the top position to the bottom of the card plus the vertical scroll offset
      setChatPosition({ top: cardRect.bottom + window.scrollY, left: cardRect.left + window.scrollX });
    }
  };

  useEffect(() => {
    const handleResize = () => {
      // If there's an active chat, update its position
      if (activeChat) {
        const card = document.querySelector(`#card-${activeChat}`);
        const cardRect = card.getBoundingClientRect();
        setChatPosition({ top: cardRect.bottom + window.scrollY, left: cardRect.left + window.scrollX });
      }
    };
  
    // Add event listener
    window.addEventListener('resize', handleResize);
  
    // Remove event listener on cleanup
    return () => window.removeEventListener('resize', handleResize);
  }, [activeChat]);

  const renderChatComponent = () => {
    if (activeChat) {
      // Determine the chat box style
      const chatStyle = {
        position: 'absolute',
        top: `${chatPosition.top}px`, // Position at the calculated top
        left: `${chatPosition.left}px`, // Position at the calculated left
        zIndex: 1000, // Ensure it's above other elements
        // Add other styles as needed, like width, max-height, overflow, etc.
        width: '350px', // Example width, adjust as needed
        maxHeight: '400px', // Example max-height, adjust as needed
        overflow: 'auto', // If content overflows, scroll bars will appear
        // Other styling can be added here
      };
  
      // Render the chat component at the specified position using a portal
      return ReactDOM.createPortal(
        <div style={chatStyle}>
          <ChatComponent adopterId={adopterId} giverId={activeChat} userType="adopter" />
        </div>,
        document.body // We append the portal directly to the body
      );
    }
    return null; // If no active chat, return null
  };
  return (
    <div>
      <AppBar position="static" sx={{background: 'linear-gradient(to right, #8e2de2, #4a00e0)'}}>
        <Toolbar>
          {isMobile && (
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My Applications
          </Typography>
          {!isMobile && (
            <Box sx={{ display: 'flex', marginLeft: 'auto' }}>
              {menuItems.map((item, index) => (
                <Button key={index} color="inherit" component={Link} to={item.path} sx={buttonStyle}>
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
              <ListItem button key={index} component={Link} to={item.path}>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>



      <Typography variant="h4" gutterBottom style={titleStyle}>
        My Applications
      </Typography>
      {/* {error && <p>{error}</p>} */}
      {applications.length > 0 ? (
        <Grid container spacing={2}>
          {applications.map(app => (
            <Grid item xs={12} sm={6} md={4} key={app._id}>
          
            <Card sx={cardStyle} id={`card-${app.submissionId?.giverId?._id}`}>
              
                {app.submissionId?.imageUrl && (
                  <CardMedia
                    component="img"
                    height="200"
                    image={app.submissionId.imageUrl}
                    alt={app.submissionId.animalName}
                  />
                )}
            
                <CardContent>
                  <Typography gutterBottom variant="h5" sx={{ fontWeight: 'bold' }}>
                    {app.submissionId?.animalName || 'N/A'}
                  </Typography>
                 
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Status:</Typography>
                  <Typography variant="body1" sx={{ marginBottom: 1, fontSize: '1.1rem' }}>{app.status}</Typography>
                  {app.status === 'approved' && (
                    <>
                    
                       <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Giver's Name:</Typography>
                       <Typography variant="body1" sx={{ marginBottom: 1, fontSize: '1.1rem' }}>{app.submissionId?.giverId?.username}</Typography>
                  
                       <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Giver's Address:</Typography>
                       <Typography variant="body1" sx={{ marginBottom: 1, fontSize: '1.1rem' }}>{app.submissionId?.giverId?.address}</Typography>
                     
                      <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Giver's Phone Number:</Typography>
                      <Typography variant="body1" sx={{ marginBottom: 2, fontSize: '1.1rem' }}>{app.submissionId?.giverId?.phoneNumber}</Typography>
                    </>
                  )}
                </CardContent>
              
              <CardActions>
                {app.status === 'approved' && (
                  <IconButton onClick={(event) => toggleChat(app.submissionId?.giverId?._id, event)}>
                    <ChatIcon sx={{ color: theme.palette.primary.main }}  />
                  </IconButton>
                )}
              </CardActions>
        
            </Card>
            {/* {app.status === 'approved' && activeChat === app.submissionId?.giverId?._id &&  (
              <ChatComponent adopterId={adopterId} giverId={app.submissionId?.giverId?._id} userType="adopter" />
            )} */}
              </Grid>
              ))} 
        </Grid>
        
      ) : (
        <Typography variant="h6" color="textSecondary" style={titleStyle}>
        No applications found. Start adopting today!
      </Typography>
      )}

      {renderChatComponent()} 
    </div>
  )
}
