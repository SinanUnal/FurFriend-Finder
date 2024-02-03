import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

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
  const [error, setError] = useState('');

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
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
        if (error.response && error.response.status === 409) {
          const errorMessage = error.response.data.message;
          setError(errorMessage);
        } else {
          console.error('Signup error', error);
          setError(error.message || 'Error during signup');
        }
    });
  };


  return (
    <div>
       <h1>This is Signup page</h1>
      <input 
        type="text"
        name="username"
        className="input-field" 
        placeholder="Username"
        value={formData.username}
        onChange={handleChange}
      />
      <br />
      <input 
        type="password"
        name="password"
        className="input-field"
        placeholder="Password"
        value={formData.password}
        onChange={handleChange}
      />
      <br />
      <input 
        type="number"
        name="age"
        className="input-field"
        placeholder="Age"
        value={formData.age}
        onChange={handleChange}
      />
      <br />
      <input 
        type="text"
        name="address"
        className="input-field"
        placeholder="Address"
        value={formData.address}
        onChange={handleChange}
      />
      <br />
      <input 
        type="text"
        name="phoneNumber"
        className="input-field"
        placeholder="Phone Number"
        value={formData.phoneNumber}
        onChange={handleChange}
      />
      <br />
      <select
        name="userType"
        className="input-field"
        value={formData.userType}
        onChange={handleChange}
      >
        <option value="">Select your intention</option>
        <option value="adopter">Adopt a Pet</option>
        <option value="giver">Give a Pet for Adoption</option>
      </select>
      <br />
      <p className="error-message">{error}</p>
      <button
        className="button" 
        onClick={signup}
      >
        Signup
      </button>
      <br />
      <p>You already have an account? <Link to="/login" className="link">Login</Link></p>
    </div>
  )
}
