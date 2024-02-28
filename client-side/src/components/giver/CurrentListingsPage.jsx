import React, { useState, useEffect, useCallback } from 'react';
import axiosWithAuth from '../utils/axiosWithAuth';
import ListingGiverDashboard from './ListingGiverDashboard';
import AnimalSubmissionForm from './AnimalSubmissionForm';
import { useParams } from 'react-router-dom';
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Box, Button, Card, CardMedia, CardContent, CardActions, Grid } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { Link } from 'react-router-dom';
import './CurrentListingsPage.css';


export default function CurrentListingsPage() {
  const { userId } = useParams();
  console.log("UserId from URL in CurrentListingsPage:", userId);
  const [currentListing, setCurrentListing] = useState([]);
  const [formData, setFormData] = useState({ 
    animalName: '',
    animalAge: '',
    animalType: '',
    healthInfo: '',
    imageUrl: '',
    _id: null,
  });
  const [isEditing, setIsEditing] = useState(false);

  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = React.useState(false);


  const menuItems = [
    
    { text: 'Animal Submission Form', path: '/giver-dashboard/submission-form'},
    { text: 'Adoption Application', path: `/giver-dashboard/applications/${userId}`},
    { text: 'My Activities', path: '/giver-dashboard/'},
    { text: 'Profile', path: `/user/profile/${userId}`},
  
  ];

  const fetchCurrentListing = useCallback(async () => {
    if (!userId) {
      console.error("UserId is undefined");
      return;
    }
    
    try {
      const axiosInstance = axiosWithAuth();
      const response = await axiosInstance.get(`http://localhost:5000/giverDashboard/currentListings/${userId}`);
      console.log(response.data);
      setCurrentListing(response.data);
    } catch (error) {
      console.error('Error fetching current listings:', error);
    }
  }, [userId]);

  useEffect(() => {
    fetchCurrentListing();
  }, [fetchCurrentListing, userId]);

  const handleEdit = (listing) => {
    console.log('Editing listing:', listing);
    setFormData({
      animalName: listing.animalName,
      animalAge: listing.animalAge,
      animalType: listing.animalType,
      healthInfo: listing.healthInfo,
      imageUrl: listing.imageUrl,
      _id: listing._id 
    });
    setIsEditing(true);
  };

  const handleDelete = async (listingId) => {
    try {
      const axiosInstance = axiosWithAuth();
      await axiosInstance.delete(`http://localhost:5000/giverDashboard/deleteListing/${listingId}`);
      fetchCurrentListing();
    } catch (error) {
      console.error('Error deleting listing:', error);
    
    }
  };

  const onSubmissionSuccess = () => {
    setIsEditing(false); 
    setFormData({ 
      animalName: '',
      animalAge: '',
      animalType: '',
      healthInfo: '',
      imageUrl: '',
      _id: null,
    });
    fetchCurrentListing(); 
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
          Current Listings
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


    
    <div className="listings-main-container">
      <Typography variant="h4" gutterBottom style={titleStyle}>
          Current Listings
        </Typography>
      
      
      {isEditing ? (
        <AnimalSubmissionForm
          initialData={formData}
          userId={userId}
          onSubmissionSuccess={onSubmissionSuccess}
        />
      ) : (
        <Grid container spacing={3}>
          {currentListing.map(listing => (
            <Grid item xs={12} sm={6} md={4} key={listing._id}>
              <Card style={cardStyle}>
                <CardMedia
                  component="img"
                  height="200"
                  image={listing.imageUrl || 'default-image.jpg'}
                  alt={listing.animalName}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5">
                    {listing.animalName}
                  </Typography>
      
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Age:</Typography>
                  <Typography variant="body1" sx={{ marginBottom: 1, fontSize: '1.1rem' }}>{listing.animalAge}</Typography>
      
                   <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Type:</Typography>
                  <Typography variant="body1" sx={{ marginBottom: 1, fontSize: '1.1rem' }}>{listing.animalType}</Typography>
      
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Health Info:</Typography>
                  <Typography variant="body1" sx={{ marginBottom: 1, fontSize: '1.1rem' }}>{listing.healthInfo}</Typography>
                </CardContent>
                <CardActions>
                  <Button size="small" color="primary" sx={buttonStyle} onClick={() => handleEdit(listing)}>
                    Edit
                  </Button>
                  <Button size="small" color="secondary" sx={buttonStyle} onClick={() => handleDelete(listing._id)}>
                    Delete
                  </Button>
                </CardActions>
              </Card>
            </Grid>
          ))}
        </Grid>
      )}
    </div>
  </div>
  );
          }
