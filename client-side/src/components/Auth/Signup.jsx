import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';

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
       <h1>Signup page</h1>
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
       
        <div className="password-requirements">    
          <strong>Password must contain:</strong>
          <ul>
            <li className={getValidationClass(passwordValidations.minChar)}>
              6 characters minimum
            </li>
            <li className={getValidationClass(passwordValidations.oneUpper)}>
              One uppercase character
            </li>
            <li className={getValidationClass(passwordValidations.oneLower)}>
              One lowercase character
            </li>
            <li className={getValidationClass(passwordValidations.oneNumber)}>
              One number
            </li>
            <li className={getValidationClass(passwordValidations.oneSpecial)}>
              One special character
            </li>
          </ul>
        </div>
     
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
      {/* {error && <div className="error-message">{error}</div>} */}
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
