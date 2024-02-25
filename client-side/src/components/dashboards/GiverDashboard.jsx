import React from 'react';
import { jwtDecode } from 'jwt-decode';
import GiverDashboardStats from '../giver/GiverDashboardStats';
// import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Box, Button } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';




export default function GiverDashboard() {
  // const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));

  const token = localStorage.getItem('token');
  let userId = null;

  if (token) {
    const decodedToken = jwtDecode(token);
    userId = decodedToken.id;
    console.log("UserId in GiverDashboard:", userId);
  }

  
    
  // function logout() {
  //   localStorage.clear();
  //   navigate('/login');
  // }

  const [drawerOpen, setDrawerOpen] = React.useState(false);

  const menuItems = [
    
    { text: 'Animal Submission Form', path: '/giver-dashboard/submission-form'},
    { text: 'Current Listings', path: `/giver-dashboard/current-listings/${userId}`},
    { text: 'Adoption Applications', path: `/giver-dashboard/applications/${userId}` },
    { text: 'Profile', path: `/user/profile/${userId}`},
    // { text: 'Logout', action: logout }
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
       <AppBar position="static" sx={{
          background: 'linear-gradient(45deg, #6a1b9a 30%, #9c27b0 90%)' 
        }}>
        <Toolbar>
          {isMobile && (
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setDrawerOpen(true) }>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My Activities
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
              <ListItem button 
                key={index} 
                component={Link} 
                to={item.path}
                onClick={item.action}
              >
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>

      <Typography variant="h4" gutterBottom style={titleStyle}>
        My Activities
      </Typography>

     

      <GiverDashboardStats userId={userId} />

  
   
    
   



  
    </div>
  )
}
