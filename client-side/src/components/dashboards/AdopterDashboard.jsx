import React, { useContext } from 'react';
import { useState } from 'react';
import axiosWithAuth from '../utils/axiosWithAuth';
import SearchFilter from '../adopter/SearchFilter';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Auth/Authcontext';

import AppBar from '@mui/material/AppBar';
import Box from '@mui/material/Box';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import Button from '@mui/material/Button';
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import Drawer from '@mui/material/Drawer';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import useMediaQuery from '@mui/material/useMediaQuery';
import { useTheme } from '@mui/material/styles';


import './AdopterDashboard.css';




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
  const [tabValue, setTabValue] = React.useState('one');
  

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const toggleDrawer = (open) => (event) => {
    if (event.type === 'keydown' && (event.key === 'Tab' || event.key === 'Shift')) {
      return;
    }
    setDrawerOpen(open);
  };

  const menuItems = [
    { text: 'Your Applications', path: '/adopter-dashboard/your-applications' },
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
      setError('Error adding to favorites');
    }
  };

  function logout() {
    localStorage.clear();
    navigate('/login');
  }
  

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
          {feedbackMessage && <div className="success-message">{feedbackMessage}</div>}
          {error && <div className="error-message">{error}</div>}
          {loading && <p>Loading...</p>}

          {error && <p>{error}</p>}

          {searchPerformed && !loading && !error && animals.length === 0 && (
            <p>No animals found matching your criteria.</p>
          )}  
          
          
          {!loading && !error && animals.map(animal => (
            <div key={animal._id}>
               {animal.imageUrl && 
                <img 
                  src={animal.imageUrl} 
                  alt={animal.animalName} 
                  style={{ width: '100px', height: '100px' }} 
                />}
              <h3>{animal.animalName}</h3>
              <p>Type: {animal.animalType}</p>
              <p>Age: {animal.animalAge}</p>
              <p>Health: {animal.healthInfo}</p>
              <Link to={`/user/public-profile/${animal.giverId}`}>View Giver's Profile</Link>
              <button onClick={() => handleSelectAnimal(animal._id)}>Adopt This Animal</button>
              <button onClick={() => addToFavorites(animal._id)}>Add to Favorites</button>

          
            </div>
       ))}
        </div>
      );
    }
   
  