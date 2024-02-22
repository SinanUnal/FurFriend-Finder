import React, { useState, useEffect, useContext } from 'react';
import axiosWithAuth from '../utils/axiosWithAuth';
import {
  AppBar, Toolbar, Typography, IconButton, Box, Button, Grid, Card, CardMedia, CardContent, CardActions, Drawer, List, ListItem, ListItemText, Dialog, DialogActions, DialogContent, DialogContentText, DialogTitle, Alert
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Auth/Authcontext';



export default function FavoriteList() {
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState('');
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedFavorite, setSelectedFavorite] = useState(null);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const navigate = useNavigate();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { adopterId } = useContext(AuthContext);

  const [drawerOpen, setDrawerOpen] = useState(false);

  const menuItems = [
    { text: 'My Applications', path: '/adopter-dashboard/your-applications' },
    // { text: 'View Favorites', path: '/adopter-dashboard/favorites' },
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

  const buttonStyle = {
    fontWeight: 'bold',
    textTransform: 'none',
    fontFamily: 'Arial, sans-serif',
    fontSize: '1rem',
    margin: '0 10px',
  };

  

  const fetchFavorites = async (userId) => {
    try {
      const axiosInstance = axiosWithAuth();
      const response = await axiosInstance.get(`http://localhost:5000/adopterDashboard/favorites`);
      console.log('Favorites fetched:', response.data);
      setFavorites(response.data);

      localStorage.setItem('favoritesUpdated', 'false');
    } catch (error) {
      setError('Error fetching favorites');
    }
  };

  useEffect(() => {
    if (localStorage.getItem('favoritesUpdated') === 'true');
    fetchFavorites();
  }, []);

  

  const confirmRemove = (favoriteId) => {
    setSelectedFavorite(favoriteId);
    setOpenDialog(true);
  };

  const removeFromFavorites = async () => {
    if (selectedFavorite) {
      try {
        const axiosInstance = axiosWithAuth();
        await axiosInstance.delete(`http://localhost:5000/adopterDashboard/removeFromFavorites?submissionId=${selectedFavorite}`);
        fetchFavorites();
        setFeedbackMessage('Removed from favorites successfully!');
        setOpenDialog(false);
      } catch (error) {
        setError('Error removing from favorites');
      }
    }
  };

  // const removeFromFavorites = async () => {
  //   try {
  //     const axiosInstance = axiosWithAuth();
  //     await axiosInstance.delete(`http://localhost:5000/adopterDashboard/removeFromFavorites?submissionId=${selectedFavorite}`);
  //     fetchFavorites();
  //     setFeedbackMessage('Removed from favorites successfully!');
  //     setOpenDialog(false);
  //   } catch (error) {
  //     setError('Error removing from favorites');
  //   }
  // };

  const handleSelectAnimal = (animalId) => {
    navigate(`/adoption-application/${animalId}`);
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



  return  (
    <div>
       <AppBar position="static">
        <Toolbar>
          {isMobile && (
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Favorite Listings
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
        Your Favorite Listings
      </Typography>
      {error && <p>{error}</p>}

      {feedbackMessage && <Alert severity="success">{feedbackMessage}</Alert>}
      {error && <Alert severity="error">{error}</Alert>}

      {favorites.length === 0 ? (
        <Typography variant="h6" color="textSecondary" align="center" style={{ marginTop: 20 }}>
          You do not have any favorites at the moment.
        </Typography>
      ) : (
      <Grid container spacing={2}>
        {favorites.map(favorite => (
          <Grid item xs={12} sm={6} md={4} key={favorite._id}>
            <Card sx={cardStyle}>
              <CardMedia
                component="img"
                height="200"
                image={favorite.imageUrl || 'path-to-default-image.jpg'}
                alt={favorite.animalName}
              />
              <CardContent>
                <Typography gutterBottom variant="h5" sx={{ fontWeight: 'bold' }}>
                  {favorite.animalName}
                </Typography>
               
                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Age:</Typography>
                <Typography variant="body1" sx={{ marginBottom: 1, fontSize: '1.1rem' }}>{favorite.animalAge}</Typography>

                <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Health Status:</Typography>
                <Typography variant="body1" sx={{ marginBottom: 1, fontSize: '1.1rem' }}>{favorite.healthInfo}</Typography>

              </CardContent>
              <CardActions>
               
                <Button component={Link} to={`/user/public-profile/${favorite.giverId}`} size="small" color="primary" sx={buttonStyle}>
                  View Giver's Profile
                </Button>
                <Button size="small" color="secondary" onClick={() => confirmRemove(favorite._id)} sx={buttonStyle}>
                  Remove from Favorites
                </Button>
                <Button  size="small" color="primary" onClick={() => handleSelectAnimal(favorite._id)} sx={buttonStyle}>
                  Adopt This Animal
                </Button>
              </CardActions>
            </Card>
          </Grid>
        ))}
      </Grid>
    )}
      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">{"Remove from Favorites"}</DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            Are you sure you want to remove this item from your favorites?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={removeFromFavorites} color="secondary">
            Remove
          </Button>
        </DialogActions>
      </Dialog>
   
    </div>
  );
}
