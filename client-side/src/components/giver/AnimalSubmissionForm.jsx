import React, { useEffect } from 'react';
import { useState } from 'react';
import axiosWithAuth from '../utils/axiosWithAuth';
import { storage} from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Box, Button, TextField, FormControl, InputLabel, Select, MenuItem, TextareaAutosize } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useMediaQuery } from '@mui/material';
import { useTheme } from '@mui/material/styles';
// import { useParams } from 'react-router-dom';
import { Snackbar, Alert } from '@mui/material';
import { jwtDecode } from 'jwt-decode';


export default function AnimalSubmissionForm({ initialData, isAdmin = false, onSubmissionSuccess }) { 
  // const { userId } = useParams();
  const [formData, setFormData] = useState({
    animalName: '',
    animalAge: '',
    animalType: '',
    healthInfo: '',
    imageUrl: ''
  });
  

  const token = localStorage.getItem('token');
  let userId = null;

  if (token) {
    const decodedToken = jwtDecode(token);
    userId = decodedToken.id;
    console.log("UserId in GiverDashboard:", userId);
  }


  
  const [imagePreview, setImagePreview] = useState(null);
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');
 
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = useState(false);

  // useEffect(() => {
  //   if (initialData) {
  //     setFormData(initialData);
  //   }
  // }, [initialData]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
      if (initialData.imageUrl) {
        setImagePreview(initialData.imageUrl);
      }
    }
  }, [initialData]);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    } else {
      setImagePreview(null);
    }
  };

  const handleImageUpload = async (file) => {
    try {
      const storageRef = ref(storage, `images/${file.name}`);
      await uploadBytes(storageRef, file);
      const fileUrl = await getDownloadURL(storageRef);
      return fileUrl;
    } catch (error) {
      console.error('Error uploading file:', error);
      throw error; 
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      let updatedFormData = { ...formData };
     
     // If a new image file is selected, upload it to Firebase and get the URL
     const file = e.target.elements.image?.files[0];
     if (file) {
       const fileUrl = await handleImageUpload(file);
       updatedFormData.imageUrl = fileUrl; // Update the formData with the new image URL
     }

    const endpoint = isAdmin 
      ? `admin/editSubmission/${updatedFormData._id}` 
      : updatedFormData._id 
        ? `giverDashboard/updateListing/${updatedFormData._id}` : 'giverDashboard/submissions';

    
      const axiosInstance = axiosWithAuth();
      const method = updatedFormData._id ? 'patch' : 'post';
      await axiosInstance[method](`http://localhost:5000/${endpoint}`, updatedFormData);

      setFormData({ animalName: '', animalAge: '', animalType: '', healthInfo: '', imageUrl: '' });
      setImagePreview(null);

      setSnackbarMessage('Submission successful!');
      setSnackbarSeverity('success');
      setSnackbarOpen(true);
      onSubmissionSuccess();
     
    } catch (error) {
      console.error('Error submitting form', formData);
      setSnackbarMessage('Error submitting form: ' + (error.response?.data?.message || 'Please try again later'));
      setSnackbarSeverity('error');
      setSnackbarOpen(true);
    }
  };


  const menuItems = [
    
    { text: 'My Activities', path: '/giver-dashboard/'},
    { text: 'Current Listings', path: `/giver-dashboard/current-listings/${userId}`},
    { text: 'Adoption Applications', path: `/giver-dashboard/applications/${userId}` },
    { text: 'Profile', path: `/user/profile/${userId}`}
    
  ];

  // const handleFileChange = (event) => {
  //   const file = event.target.files[0];
  //   setFile(file);
  //   if (file) {
  //     const previewUrl = URL.createObjectURL(file);
  //     setImagePreview(previewUrl);
  //   } else {
  //     setImagePreview(null);
  //   }
  // };

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
    <>
     <AppBar position="static">
        <Toolbar>
          {isMobile && (
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}

          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Animal Submission Form
          </Typography>
          {!isMobile && (
            <Box sx={{ display: 'flex', marginLeft: 'auto' }}>
              {menuItems.map((item, index) => (
                <Button key={index} color="inherit" href={item.path} sx={buttonStyle}>
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
              <ListItem button key={index} component="a" href={item.path}>
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>


      <Box sx={{ maxWidth: '500px', margin: 'auto', padding: '20px' }}>
        <Typography variant="h4" gutterBottom align="center" sx={titleStyle}>
          Animal Submission Form
        </Typography>

        <Box display="flex" justifyContent="center" marginBottom="20px">
          {imagePreview && (
            <Box
              sx={{
                maxWidth: '300px', // Set a max-width for your image container
                maxHeight: '300px', // Set a max-height for your image container
                overflow: 'hidden', // Hide overflow
                display: 'flex', // Use flex for centering
                justifyContent: 'center', // Center horizontally
                alignItems: 'center', // Center vertically
                margin: 'auto', // Center the box itself
                border: '1px solid #ccc', // Add a border
                borderRadius: '4px', // Round the corners
                boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)', // Add a subtle shadow
              }}
            >
              <img src={imagePreview} alt="Preview" style={{ width: '100%', height: 'auto' }} />
            </Box>
          )}
        </Box>




      <form onSubmit={handleSubmit} style={{ maxWidth: '500px', margin: 'auto', padding: '20px' }}>
      <TextField
        label="Animal Name"
        variant="outlined"
        name="animalName"
        value={formData.animalName}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <TextField
        label="Animal Age"
        variant="outlined"
        name="animalAge"
        value={formData.animalAge}
        onChange={handleChange}
        fullWidth
        margin="normal"
      />

      <FormControl fullWidth margin="normal">
        <InputLabel id="animal-type-label">Animal Type</InputLabel>
        <Select
          labelId="animal-type-label"
          value={formData.animalType}
          label="Animal Type"
          onChange={handleChange}
          name="animalType"
        >
          <MenuItem value=""><em>None</em></MenuItem>
          <MenuItem value="dog">Dog</MenuItem>
          <MenuItem value="cat">Cat</MenuItem>
          <MenuItem value="fish">Fish</MenuItem>
          <MenuItem value="bird">Bird</MenuItem>
          <MenuItem value="other">Other</MenuItem>
        </Select>
      </FormControl>

      <TextareaAutosize
        aria-label="Health Information"
        minRows={3}
        placeholder="Health Information"
        style={{ width: '100%', marginTop: 8, marginBottom: 8, padding: 10 }}
        name="healthInfo"
        value={formData.healthInfo}
        onChange={handleChange}
      />

      <Button
        variant="contained"
        component="label"
        fullWidth
        margin="normal"
      >
        Upload Image
        <input
          type="file"
          hidden
          name="image"
          onChange={handleFileChange} // You might need a separate handler for file
        />
      </Button>

      <Button type="submit" variant="contained" color="primary" fullWidth style={{ marginTop: '16px' }}>
        Submit
      </Button>

      {snackbarMessage && (
            <Alert severity={snackbarSeverity} sx={{ width: '100%', mt: 2 }}>
              {snackbarMessage}
            </Alert>
          )}
    </form>

    </Box>
    </>  
  );
};


