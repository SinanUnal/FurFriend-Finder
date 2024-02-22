import React, { useContext } from 'react';
import { useState } from 'react';
import axiosWithAuth from '../utils/axiosWithAuth';
import SearchFilter from '../adopter/SearchFilter';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Auth/Authcontext';

import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';
import SearchOffIcon from '@mui/icons-material/SearchOff';
import { CircularProgress, Typography, Box } from '@mui/material';
import { Card, CardContent, CardActions, CardMedia, Grid, Alert } from '@mui/material';





export default function AdopterDashboard() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { adopterId } = useContext(AuthContext);
  const navigate = useNavigate();
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [error, setError] = useState('');
  const [searchPerformed, setSearchPerformed] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
 

  const menuItems = [
    { text: 'My Applications', path: '/adopter-dashboard/your-applications' },
    { text: 'View Favorites', path: '/adopter-dashboard/favorites' },
    { text: 'View Adopted Animals', path: `/adopter-dashboard/adopted-animals/${adopterId}` },
    { text: 'Profile', path: `/user/profile/${adopterId}` },
    { text: 'Logout', action: logout }
  ];


  const fetchAnimals = async (searchTerm = '', filterType = '') => {
    setLoading(true);
    setError('');
    setSearchPerformed(true);
    try {
      const axiosInstance = axiosWithAuth();
      const response = await axiosInstance.get(`http://localhost:5000/adopterDashboard/animals?searchTerm=${searchTerm}&filterType=${filterType}`);
      setAnimals(response.data);
    } catch (error) {
      console.error('Error fetching animals', error);
      setError('Failed to fetch animals. Please try again later.');
    }
    setLoading(false);
  };


  const handleSelectAnimal = (animalId) => {
    navigate(`/adoption-application/${animalId}`);
  };


  const addToFavorites = async (submissionId) => {
    try {
      const axiosInstance = axiosWithAuth();
      await axiosInstance.patch('http://localhost:5000/adopterDashboard/addToFavorites', { submissionId });
      setFeedbackMessage('Added to favorites successfully!');
      localStorage.setItem('favoritesUpdated', 'true');
     
    } catch (error) {
      console.error('Error adding to favorites:', error.response?.data?.message);
      setError("Favorite not added: This animal is already in your list."
      );
    }
  };

  function logout() {
    localStorage.clear();
    navigate('/login');
  }


  const cardStyles = {
    maxWidth: 345,
    margin: 2,
    backgroundColor: '#f5f5f5', 
    boxShadow: '0 4px 8px 0 rgba(0,0,0,0.2)', 
    transition: '0.3s', 
    '&:hover': {
      boxShadow: '0 8px 16px 0 rgba(0,0,0,0.3)' 
    }
  };

  const cardMediaStyles = {
    height: 200, 
  };



  const buttonStyle = {
    fontWeight: 'bold',
    textTransform: 'none',
    fontFamily: 'Arial, sans-serif',
    fontSize: '1rem',
    margin: '0 10px',
  };



  return (
        <div>
         <AppBar position="static">
        <Toolbar>
          {isMobile && (
            <IconButton
              edge="start"
              color="inherit"
              aria-label="menu"
              onClick={() => setDrawerOpen(true)}
            >
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Adopter Dashboard
          </Typography>
          {!isMobile && (
            <Box sx={{ display: 'flex', marginLeft: 'auto' }}>
              {menuItems.map((item, index) => (
                <Button 
                  key={index} 
                  color="inherit" 
                  component={item.path ? Link : 'button'} 
                  to={item.path} 
                  onClick={item.action}
                  sx={buttonStyle}
                >
                  {item.text}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      {isMobile && (
        <Drawer
          anchor="left"
          open={drawerOpen}
          onClose={() => setDrawerOpen(false)}
        >
          <Box
            sx={{ width: 250 }}
            role="presentation"
            onClick={() => setDrawerOpen(false)}
            onKeyDown={() => setDrawerOpen(false)}
          >
            <List>
              {menuItems.map((item, index) => (
                <ListItem 
                  button 
                  key={index} 
                  component={item.path ? Link : 'button'} 
                  to={item.path} 
                  onClick={item.action}
                  
                >
                  <ListItemText primary={item.text} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      )}

<SearchFilter onSearch={fetchAnimals }/>
          {feedbackMessage && !error && (
            <Alert severity="success" sx={{ margin: 2 }}>
               {feedbackMessage}
            </Alert>
          )}
          {error &&  (
            <Alert severity="error" sx={{ margin: 2 }}>
              {error}
            </Alert>
          )}
          {loading && (
          <Box display="flex"     justifyContent="center" alignItems="center" flexDirection="column" mt={2}>
          <CircularProgress />
          <Typography variant="h6" color="textSecondary" mt={2}>
            Loading...
          </Typography>
        </Box>
      )}


          {searchPerformed && !loading && !error && animals.length === 0 && (
        <Box display="flex" justifyContent="center" alignItems="center" flexDirection="column" mt={2}>
          <SearchOffIcon sx={{ fontSize: 60, color: 'primary.main' }} />
          <Typography variant="h6" color="textSecondary">
            No animals found matching your criteria.
          </Typography>
        </Box>
      )} 
          
          

      <Grid container spacing={2}>
    {!loading && !error && animals.map(animal => (
      <Grid item xs={12} sm={6} md={4} lg={3} key={animal._id}>
        <Card sx={cardStyles}>
          {animal.imageUrl && 
            <CardMedia
              component="img"
              sx={cardMediaStyles}
              image={animal.imageUrl}
              alt={animal.animalName}
            />
          }
          <CardContent>
            <Typography gutterBottom variant="h5" component="div">
              {animal.animalName}
            </Typography>
            <Typography variant="body2" color="text.secondary">
              Type: {animal.animalType}<br/>
              Age: {animal.animalAge}<br/>
              Health: {animal.healthInfo}
            </Typography>
          </CardContent>
          <CardActions>
            <Button component={Link} to={`/user/public-profile/${animal.giverId}`} size="small" color="primary" sx={buttonStyle}>
              View Giver's Profile
            </Button>
            <Button size="small" color="secondary" onClick={() => handleSelectAnimal(animal._id)} sx={buttonStyle}>
              Adopt This Animal
            </Button>
            <Button size="small" onClick={() => addToFavorites(animal._id)} sx={buttonStyle}>
              Add to Favorites
            </Button>
          </CardActions>
        </Card>
      </Grid>
    ))}
  </Grid>
          
        </div>
      );
    }
   
  