import React, { useState, useEffect } from 'react';
import axiosWithAuth from '../utils/axiosWithAuth';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage} from '../../firebase';
import { Link, useParams } from 'react-router-dom';
import { AppBar, Snackbar, Alert, TextField, Card, CardContent, CardActions, Toolbar, Typography, IconButton, Box, Button, Drawer, List, ListItem, ListItemText, Avatar } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';

import { useNavigate } from 'react-router-dom';


const UserProfile = () => {
  const navigate = useNavigate();
  const { userId } = useParams();
  const [userProfile, setUserProfile] = useState({ profilePicture: '',
  username: '', 
  age: '',
  address: '',
  phoneNumber: '',
  userType: null,
 });
  const [file, setFile] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');

 

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


  useEffect(() => {
    if (!userId) return;

    const fetchUserProfile = async () => {
      try {
        const axiosInstance = axiosWithAuth();
        const response = await axiosInstance.get(`http://localhost:5000/user/profile/${userId}`);
        setUserProfile(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [userId]);

  let menuItems;

  if (userProfile.userType === 'giver') {
    menuItems = [
      { text: 'Animal Submission Form', path: '/giver-dashboard/submission-form'},
      { text: 'Current Listings', path: `/giver-dashboard/current-listings/${userId}`},
      { text: 'Adoption Applications', path: `/giver-dashboard/applications/${userId}` },
      { text: 'My Activities', path: '/giver-dashboard/'},
      { text: 'Logout', action: logout }
    ];
  } else if (userProfile.userType === 'adopter') {
    menuItems = [
      { text: 'My Applications', path: '/adopter-dashboard/your-applications' },
      { text: 'View Favorites', path: '/adopter-dashboard/favorites' },
      { text: 'View Adopted Animals', path: `/adopter-dashboard/adopted-animals/${userId}` },
      { text: 'Find Your Perfect Match', path: '/adopter-dashboard' },
      { text: 'Logout', action: logout }
    ];
  } else {
    
    menuItems = []; 
  }





  const handleImageUpload = async () => {
    if (!file) return;
    const storageRef = ref(storage, `profileImages/${userId}/${file.name}`);
    await uploadBytes(storageRef, file);
    const fileUrl = await getDownloadURL(storageRef);
    setUserProfile({ ...userProfile, profilePicture: fileUrl });
  };

  const handleRemoveProfilePicture = async () => {
    const storageRef = ref(storage, userProfile.profilePicture);
    await deleteObject(storageRef);
    setUserProfile({ ...userProfile, profilePicture: '' });
  }

  const handleProfileUpdate = async () => {
    try {
      const axiosInstance = axiosWithAuth();
      await axiosInstance.patch(`http://localhost:5000/user/profile/${userId}`, userProfile);
      
      setSnackbarMessage('Profile updated successfully');
      setSnackbarOpen(true);

      setIsEditMode(false);
    } catch (error) {
      console.error('Error updating profile:', error);
      setSnackbarMessage('Error updating profile');
      setSnackbarOpen(true);
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserProfile({ ...userProfile, [name]: value });
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  function logout() {
    localStorage.clear();
    navigate('/login');
  }


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
      User Profile
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
              <ListItem button key={index} component={Link} 
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
        Your Profile
      </Typography>
    
    

   


 
    {isEditMode ? (
          <Card variant="outlined" sx={{ maxWidth: 345, margin: 'auto', mt: 4 }}>
            <CardContent>
    
            <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '20px' }}>
              <Avatar
                src={userProfile.profilePicture}
                alt="Profile"
                sx={{ width: 100, height: 100 }}
                style={{ border: '2px solid lightgray' }}
              />
            </div>
    
              {userProfile.profilePicture && (
                <Button variant="contained" color="secondary" onClick={handleRemoveProfilePicture} sx={{ mb: 2 }}>
                  Remove Profile Picture
                </Button>
              )}
              <input
                accept="image/*"
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                style={{ display: 'block', marginBottom: 16 }}
              />
              <Button variant="contained" onClick={handleImageUpload} disabled={!file} sx={{ mb: 2 }}>
                Upload Image
              </Button>
    
              <TextField
                label="Username"
                name="username"
                value={userProfile.username}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Age"
                type="number"
                name="age"
                value={userProfile.age}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Address"
                name="address"
                value={userProfile.address}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="Phone Number"
                name="phoneNumber"
                value={userProfile.phoneNumber}
                onChange={handleChange}
                fullWidth
                margin="normal"
              />
              <TextField
                label="User Type"
                name="userType"
                value={userProfile.userType}
                onChange={handleChange}
                fullWidth
                margin="normal"
                disabled
              />
            </CardContent>
            <CardActions>
              <Button variant="contained" color="primary" onClick={handleProfileUpdate} fullWidth>
                Save Profile
              </Button>
            </CardActions>
          </Card>
        ) : (
          <Card variant="outlined" sx={{
            maxWidth: 400,
            margin: 'auto',
            mt: 4,
            boxShadow: 3,
            borderRadius: '10px',
            backgroundColor: 'background.paper'
          }}>
            <CardContent>
              <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', marginBottom: '20px' }}>
                <Avatar
                  src={userProfile.profilePicture}
                  alt="Profile"
                  sx={{
                    width: 150, height: 150,
                    marginBottom: 2,
                    border: '3px solid lightgray'
                  }}
                />
                <Typography variant="h5" sx={{ fontWeight: 'bold' }}>Profile Info</Typography>
              </div>
    
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Username:</Typography>
              <Typography variant="body1" sx={{ marginBottom: 1, fontSize: '1.1rem' }}>{userProfile.username}</Typography>
    
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Age:</Typography>
              <Typography variant="body1" sx={{ marginBottom: 1, fontSize: '1.1rem' }}>{userProfile.age}</Typography>
    
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Address:</Typography>
              <Typography variant="body1" sx={{ marginBottom: 1, fontSize: '1.1rem' }}>{userProfile.address}</Typography>
    
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Phone Number:</Typography>
              <Typography variant="body1" sx={{ marginBottom: 1, fontSize: '1.1rem' }}>{userProfile.phoneNumber}</Typography>
    
              <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>User Type:</Typography>
              <Typography variant="body1" sx={{ marginBottom: 2, fontSize: '1.1rem' }}>{userProfile.userType}</Typography>
            </CardContent>
            <CardActions>
              <Button variant="contained" color="primary" onClick={toggleEditMode} fullWidth>
                Edit Profile
              </Button>
            </CardActions>
          </Card>
    
        )}
         <Snackbar
          open={snackbarOpen}
          autoHideDuration={6000}
          onClose={() => setSnackbarOpen(false)}
          anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          style={{ top: '57%' }}
        >
          <Alert onClose={() => setSnackbarOpen(false)} severity="success" sx={{ width: '100%' }}>
            {snackbarMessage}
          </Alert>
        </Snackbar>
  
</div>
     

  );
};

export default UserProfile;

