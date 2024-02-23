import React, { useContext } from 'react';
import { useState } from 'react';
import axiosWithAuth from '../utils/axiosWithAuth';
import { useParams, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Auth/Authcontext';
import { TextField, Typography, Button, Box, Alert, Container, Paper } from '@mui/material';

export default function AdoptionApplicationForm() {
  const { adopterId, loading } = useContext(AuthContext);
  const { submissionId } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    age: '',
    homeEnvironment: '',
    petExperience: ''
  });
  const [message, setMessage] = useState({ type: '', text: '' });

  

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const axiosInstance = axiosWithAuth();
      await axiosInstance.post('http://localhost:5000/submitApplication', {
        ...formData,
        adopterId,
        submissionId
      });
      setMessage({ type: 'success', text: 'Application submitted successfully' });

      setTimeout(() => {
        navigate(-1); // Go back to the previous page after few seconds
      }, 3000);
    } catch (error) {
      setMessage({ type: 'error', text: 'Failed to submit application' });
    }
  };

  if (loading) {
    return <div>Loading...</div>; 
  }

  const formContainerStyle = {
    maxWidth: '500px', // Reasonable width for the form
    margin: 'auto',
    padding: '20px',
    marginTop: '30px',
    backgroundColor: '#ffffff', // Light grey background
    boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', // Subtle shadow effect
    borderRadius: '8px', // Rounded corners
  };

  const pageStyle = {
    backgroundColor: '#f0f0f0', // light grey background for the whole page
    minHeight: '100vh',
    paddingTop: '20px',
  };

  return (
    <div>
       <Box style={pageStyle}>
       <Container>
        <Paper sx={formContainerStyle}>
        <Typography component="h1" variant="h4" style={{ fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
          Adoption Application
        </Typography>
       <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="age"
              label="Your Age"
              type="number"
              id="age"
              value={formData.age}
              onChange={handleChange}
              inputProps={{ min: 18 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="homeEnvironment"
              label="Describe Your Home Environment"
              multiline
              rows={4}
              value={formData.homeEnvironment}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="petExperience"
              label="Describe Your Experience With Pets"
              multiline
              rows={4}
              value={formData.petExperience}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Submit Application
            </Button>
            {message.text && (
              <Alert severity={message.type}>{message.text}     </Alert>
            )}
          </Box> 
        </Paper>
      </Container>
       </Box>
      {/* <Container>
        <Paper sx={formContainerStyle}>
        <Typography component="h1" variant="h4" style={{ fontWeight: 'bold', marginBottom: '20px', textAlign: 'center' }}>
          Adoption Application
        </Typography>
       <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 1 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              name="age"
              label="Your Age"
              type="number"
              id="age"
              value={formData.age}
              onChange={handleChange}
              inputProps={{ min: 18 }}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="homeEnvironment"
              label="Describe Your Home Environment"
              multiline
              rows={4}
              value={formData.homeEnvironment}
              onChange={handleChange}
            />
            <TextField
              margin="normal"
              required
              fullWidth
              name="petExperience"
              label="Describe Your Experience With Pets"
              multiline
              rows={4}
              value={formData.petExperience}
              onChange={handleChange}
            />
            <Button
              type="submit"
              fullWidth
              variant="contained"
              sx={{ mt: 3, mb: 2 }}
            >
              Submit Application
            </Button>
            {message.text && (
              <Alert severity={message.type}>{message.text}     </Alert>
            )}
          </Box> 
        </Paper>
      </Container>
        */}
    </div>
  )
}
