import React, { useState, useEffect, useContext } from 'react';
import axiosWithAuth from '../utils/axiosWithAuth';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../Auth/Authcontext';
import { AppBar, Toolbar, Typography, CardMedia, CardActions, IconButton, Box, Button, Card, CardContent, Grid, Drawer, List, ListItem, ListItemText, useTheme, useMediaQuery, Paper } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import SentimentDissatisfiedIcon from '@mui/icons-material/SentimentDissatisfied';
import { useNavigate } from 'react-router-dom';

const AdoptedAnimals = () => {
  const { userId } = useParams();
  const [adoptedAnimals, setAdoptedAnimals] = useState([]);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const { adopterId } = useContext(AuthContext);


  const menuItems = [
    { text: 'My Applications', path: '/adopter-dashboard/your-applications' },
    { text: 'View Favorites', path: '/adopter-dashboard/favorites' },
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

  
    const navigate = useNavigate();


    const handleExploreClick = () => {
      navigate('/adopter-dashboard');
    };

  useEffect(() => {
    const fetchAdoptedAnimals = async () => {
      try {
        const axiosInstance = axiosWithAuth();
        const response = await axiosInstance.get(`http://localhost:5000/adopterDashboard/adoptedAnimals/${userId}`);
        setAdoptedAnimals(response.data);
      } catch (error) {
        console.error('Error fetching adopted animals:', error);
      }
    };

    fetchAdoptedAnimals();
  }, [userId]);

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
            Your Adopted Animals
          </Typography>
          {!isMobile && (
            <Box sx={{ display: 'flex', marginLeft: 'auto' }}>
              {menuItems.map((item, index) => (
                <Button key={index} color="inherit" component={Link} to={item.path} sx={{ fontWeight: 'bold', textTransform: 'none', fontFamily: 'Arial, sans-serif', fontSize: '1rem', margin: '0 10px' }}>
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
        Adopted Animals
      </Typography>

      <Grid container spacing={2}>
        {adoptedAnimals.length > 0 ? (
          adoptedAnimals.map(animal => (
            <Grid item xs={12} sm={6} md={4} key={animal._id}>
              <Card sx={cardStyle}>
                <CardMedia
                  component="img"
                  height="200"
                  image={animal.imageUrl || 'path-to-default-image.jpg'}
                  alt={animal.animalName}
                />
                <CardContent>
                  <Typography gutterBottom variant="h5" sx={{ fontWeight: 'bold' }}>
                    {animal.animalName}
                  </Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Status:</Typography>
                  <Typography variant="body1" sx={{ marginBottom: 1, fontSize: '1.1rem' }}>{animal.status}</Typography>
                  {/* <Typography variant="body2" color="text.secondary">
                    Age: {animal.animalAge}<br/>
                    Health: {animal.healthInfo}
                  </Typography> */}
                   <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Age:</Typography>
                  <Typography variant="body1" sx={{ marginBottom: 1, fontSize: '1.1rem' }}>{animal.animalAge}</Typography>
                  <Typography variant="subtitle1" sx={{ fontWeight: 'bold' }}>Health Status:</Typography>
                  <Typography variant="body1" sx={{ marginBottom: 1, fontSize: '1.1rem' }}>{animal.healthInfo}</Typography>
                </CardContent>
                <CardActions>
                <Button component={Link} to={`/user/public-profile/${animal.giverId._id}`} size="small" color="primary" sx={buttonStyle}>
                  View Giver's Profile
                </Button>
                </CardActions>
              </Card>
            </Grid>
          ))
        ) : (
          <Grid container justifyContent="center" alignItems="center" mt={8}>
      <Grid item xs={12} md={6} lg={4}>
        <Paper elevation={3} sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: 4,
          backgroundColor: '#f7f7f7',
          borderRadius: '15px',
        }}>
          <SentimentDissatisfiedIcon sx={{ fontSize: 60, color: 'primary.main' }} />
          <Typography variant="h6" color="textSecondary" align="center" sx={{ mt: 2, mb: 2 }}>
            You have not adopted any animals.
          </Typography>
          <Button variant="contained" color="primary" onClick={handleExploreClick}>
            Start Exploring
          </Button>
        </Paper>
      </Grid>
    </Grid>
        )}
      </Grid>
    </div>
  );
};

export default AdoptedAnimals;
