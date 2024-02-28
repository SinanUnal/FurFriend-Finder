import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import AppBar from '@mui/material/AppBar';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
import { TextField, Button, FormControl, InputLabel, Select, MenuItem, FormHelperText } from '@mui/material';



export default function Signup() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    age: '',
    address: '',
    phoneNumber: '',
    userType: ''
  });
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [passwordValidations, setPasswordValidations] = useState({
    minChar: false,
    oneUpper: false,
    oneLower: false,
    oneNumber: false,
    oneSpecial: false
  });
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  useEffect(() => {
    setPasswordValidations({
      minChar: formData.password.length >= 6,
      oneUpper: /[A-Z]/.test(formData.password),
      oneLower: /[a-z]/.test(formData.password),
      oneNumber: /[0-9]/.test(formData.password),
      oneSpecial: /[!@#$%^&*]/.test(formData.password)
    });
  }, [formData.password]);

  const getValidationClass = (isValid) => {
    return formData.password.length === 0 ? '' : isValid ? 'valid' : 'invalid';
  };


  function signup() {
    axios.post('http://localhost:5000/signup', formData)
      .then(( response ) => {
        console.log(response);
        if (response.status === 409) {
          console.log('Conflict response:', response.data.message);
          setError(response.data.message);
          console.log('Error state after setError:', error);
        } else if (response.data.message === 'User registered successfully') {
          console.log('Registration success response:', response.data.message);
          navigate('/login');
        } else {
          console.log('Other response:', response.data.message);
          setError(response.data.message);


          console.log('Error state after setError:', error);
        }
    })
      .catch((error) => {
        if (error.response && error.response.status === 400) {
          let errorMessage = error.response.data.message;
          const splitMessage = errorMessage.split('password: ');
          if (splitMessage.length > 1) {
            errorMessage = splitMessage[1];
          }
          setError(errorMessage);
        } else if (error.response && error.response.status === 409) {
          
          setError('Username already exist.');
        } else {
          console.error('Signup error', error);
          setError("An unexpected error occurred. Please try again later.");
        }
    });
  };


 

  return (
    <div>
     <AppBar position="sticky" color="default">
            <Toolbar>
             <div style={{ flexGrow: 1, textAlign: 'center' }}>
              <img 
                src={require('../img/professional.webp')} 
                alt="FurFriend Logo"
                style={{ maxHeight: '60px' }}s 
              />
    </div>
            </Toolbar>
        </AppBar>

        <div className="main-container">
       
      <div className="welcome-text">
      <Typography variant="h3" gutterBottom style={{ fontWeight: 'bold', color:'#333', lineHeight: '1.5', fontSize: '2.5rem' }}>
        Welcome to FurFriend!
      </Typography>
    
      <Typography variant="subtitle1" style={{ lineHeight: '1.6', fontSize: '1.25rem' }}>
      Welcome to FurFriend, where love finds a way home! Our platform is a heartwarming community dedicated to connecting those who wish to find a new, loving home for their pets with those who are eager to open their hearts and homes to a new furry friend. Here, every tail wag and purr is a story of compassion and companionship waiting to unfold. Whether you're a pet parent facing the tough decision of rehoming your beloved companion or you're looking to adopt and enrich your life with a pet's unconditional love, FurFriend is here to guide you every step of the way. Join our family today and be part of a journey that changes lives, two paws at a time!
      </Typography>
      </div>


        
        
          <div className="form-container">
          <Typography variant="h5" style={{ fontWeight: 'bold', marginBottom: '5px' }}>
                Create an Account
              </Typography>
          <form>
            <TextField 
              label="Username" 
              variant="outlined" 
              fullWidth 
              name="username"
              value={formData.username}
              onChange={handleChange}
              margin="normal"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#ffffff', 
                  borderRadius: '4px',
                  '& fieldset': {
                    borderRadius: '4px', 
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main', 
                  },
                  '& input': {
                    height: '10px',
                  },
                },
              }}
            />
            <TextField 
              label="Password" 
              variant="outlined" 
              fullWidth 
              type="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              margin="normal"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#ffffff', 
                  borderRadius: '4px',
                  '& fieldset': {
                    borderRadius: '4px', 
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main', 
                  },
                  '& input': {
                    height: '10px',
                  },
                },
              }}
            />
            <div className='password-requirements'>
              <strong>Password must contain:</strong>
              <ul>
                <li className={getValidationClass(passwordValidations.minChar)}>6 characters minimum</li>
                <li className={getValidationClass(passwordValidations.oneUpper)}>One uppercase character</li>
                <li className={getValidationClass(passwordValidations.oneLower)}>One lowercase character</li>
                <li className={getValidationClass(passwordValidations.oneNumber)}>One number</li>
                <li className={getValidationClass(passwordValidations.oneSpecial)}>One special character</li>
              </ul>
            </div>
            <TextField 
              label="Age" 
              variant="outlined" 
              fullWidth 
              type="number"
              name="age"
              value={formData.age}
              onChange={handleChange}
              margin="normal"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#ffffff', 
                  borderRadius: '4px',
                  '& fieldset': {
                    borderRadius: '4px', 
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main', 
                  },
                  '& input': {
                    height: '10px',
                  },
                },
              }}
            />
            <TextField 
              label="Address" 
              variant="outlined" 
              fullWidth 
              name="address"
              value={formData.address}
              onChange={handleChange}
              margin="normal"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#ffffff', 
                  borderRadius: '4px',
                  '& fieldset': {
                    borderRadius: '4px', 
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main', 
                  },
                  '& input': {
                    height: '10px',
                  },
                },
              }}
            />
            <TextField 
              label="Phone Number" 
              variant="outlined" 
              fullWidth 
              name="phoneNumber"
              value={formData.phoneNumber}
              onChange={handleChange}
              margin="normal"
              sx={{
                '& .MuiOutlinedInput-root': {
                  backgroundColor: '#ffffff', 
                  borderRadius: '4px',
                  '& fieldset': {
                    borderRadius: '4px', 
                  },
                  '&.Mui-focused fieldset': {
                    borderColor: 'primary.main', 
                  },
                  '& input': {
                    height: '10px',
                  },
                },
              }}
            />
            <FormControl fullWidth margin="normal">
              <InputLabel id="userType-label">Select your intention</InputLabel>
              <Select
                labelId="userType-label"
                id="userType"
                value={formData.userType}
                label="User Type"
                onChange={handleChange}
                name="userType"
                sx={{
                  '& .MuiOutlinedInput-root': {
                    backgroundColor: '#ffffff',
                    borderRadius: '4px', 
                    '& fieldset': {
                      borderRadius: '4px', 
                    },
                    '&.Mui-focused fieldset': {
                      borderColor: 'primary.main', 
                    },
                  },
                  '& .MuiSelect-select': {
                    padding: '10px 14px', 
                    backgroundColor: '#ffffff', 
                    borderRadius: '4px', 
                    '&:focus': {
                      backgroundColor: '#ffffff', // 
                    },
                  },
                }}
              >
                <MenuItem value=""><em>None</em></MenuItem>
                <MenuItem value="adopter">Adopt a Pet</MenuItem>
                <MenuItem value="giver">Give a Pet for Adoption</MenuItem>
              </Select>
            </FormControl>
            {error && <FormHelperText error>{error}</FormHelperText>}
            <Button variant="contained" color="primary" fullWidth onClick={signup} style={{ marginTop: '20px' }}>
              Signup
            </Button>
          </form>
          <p className='text-center'>You already have an account? <Link to="/login" className="login-link">Log in</Link></p>
        </div>

      </div>
      </div>
      
   
  )
}
{/* <div className="container mt-5">
<div className="row" style={{ minHeight: '100vh' }}>
  
  <div className="col-md-6" style={{ position: 'relative' }}>
    <img src={require('../img/adoption-picture.webp')} alt="Adoption" style={{ width: '100%', height: '100vh', objectFit: 'cover', position: 'absolute', left: '0', top: '0', zIndex: -1 }} />
    <div style={{
      position: 'absolute', 
      top: '0', 
      left: '0', 
      padding: '20px',
      backgroundColor: 'rgba(255, 255, 255, 0.7)', // Semi-transparent background
      borderRadius: '8px', // Rounded corners
      maxWidth: '100%', // Max-width for responsiveness
      boxSizing: 'border-box'
    }}>
       <Typography variant="h3" gutterBottom style={{ fontWeight: 'bold', color:'#333', lineHeight: '1.5', fontSize: '2.5rem' }}>
        Welcome to FurFriend!
      </Typography>
    
      <Typography variant="subtitle1" style={{ lineHeight: '1.6', fontSize: '1.25rem' }}>
      Welcome to FurFriend, where love finds a way home! Our platform is a heartwarming community dedicated to connecting those who wish to find a new, loving home for their pets with those who are eager to open their hearts and homes to a new furry friend. Here, every tail wag and purr is a story of compassion and companionship waiting to unfold. Whether you're a pet parent facing the tough decision of rehoming your beloved companion or you're looking to adopt and enrich your life with a pet's unconditional love, FurFriend is here to guide you every step of the way. Join our family today and be part of a journey that changes lives, two paws at a time
      </Typography>
    </div>
  </div>  */}