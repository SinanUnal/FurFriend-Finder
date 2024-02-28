import React, { useState, useEffect, useContext } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import axiosWithAuth from '../utils/axiosWithAuth';
import {
  Card, CardContent, AppBar, Toolbar, Typography, Paper, Box, Avatar,
  IconButton, Drawer, List, ListItem, ListItemText,
  useMediaQuery, Button
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import { AuthContext } from '../Auth/Authcontext';
import './PublicProfile.css';

const PublicProfile = () => {
  const { userId } = useParams();
  const navigate = useNavigate();
  const { adopterId } = useContext(AuthContext);


  const [publicProfile, setPublicProfile] = useState({
    username: '',
    profilePicture: '',
    address: '',
    phoneNumber: '',
  });
  const [drawerOpen, setDrawerOpen] = useState(false);

 
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));


  useEffect(() => {
    const fetchPublicProfile = async () => {
      try {
        const axiosInstance = axiosWithAuth();
        const response = await axiosInstance.get(`http://localhost:5000/user/public-profile/${userId}`);
        setPublicProfile(response.data);
      } catch (error) {
        console.error('Error fetching public profile:', error);
      }
    };

    fetchPublicProfile();
  }, [userId]);

  
  const menuItems = [
    { text: 'My Applications', path: '/adopter-dashboard/your-applications' },
    { text: 'View Favorites', path: '/adopter-dashboard/favorites' },
    { text: 'View Adopted Animals', path: `/adopter-dashboard/adopted-animals/${adopterId}` },
    { text: 'Profile', path: `/user/profile/${adopterId}` },
  ];

  const buttonStyle = {
    fontWeight: 'bold',
    textTransform: 'none',
    fontFamily: 'Arial, sans-serif',
    fontSize: '1rem',
    margin: '0 10px',
  };


  const logout = () => {
    localStorage.clear();
    navigate('/login');
  };

  return (
    <div>
        <div className="public-main-container">
      <AppBar position="static">
        <Toolbar>
          {isMobile && (
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Public Profile
          </Typography>
          {!isMobile && (
            <Box sx={{ display: 'flex', marginLeft: 'auto' }}>
              {menuItems.map((item, index) => (
                <Button key={index} color="inherit" component={Link} to={item.path} sx={buttonStyle}>
                  {item.text}
                </Button>
              ))}
              <Button color="inherit" sx={buttonStyle} onClick={logout}>
                Logout
              </Button>
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
            <ListItem button onClick={logout}>
              <ListItemText primary="Logout" />
            </ListItem>
          </List>
        </Box>
      </Drawer>

    
        <Card variant="outlined" sx={{
          maxWidth: 400,
          margin: 'auto',
          mt: 4,
          boxShadow: 3,
          borderRadius: '10px',
          backgroundColor: 'background.paper'
        }}>
        <CardContent>
          <Box display="flex" flexDirection="column" alignItems="center" mb={2}>
            <Avatar
              alt="Profile Picture"
              src={publicProfile.profilePicture || 'path-to-your-default-image.png'}
              sx={{ width: 150, height: 150, marginBottom: 2 }}
            />
            <Typography variant="h5" sx={{ fontWeight: 'bold' }}>
              {publicProfile.username || 'Username'}
            </Typography>
          </Box>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Address:</Typography>
          <Typography variant="body1" sx={{ marginBottom: 1, fontSize: '1.1rem' }}>
            {publicProfile.address || 'N/A'}
          </Typography>
          <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Phone Number:</Typography>
          <Typography variant="body1" sx={{ marginBottom: 1, fontSize: '1.1rem' }}>
            {publicProfile.phoneNumber || 'N/A'}
          </Typography>
        </CardContent>
            </Card>
      </div>
    </div>
  );
};

export default PublicProfile;

