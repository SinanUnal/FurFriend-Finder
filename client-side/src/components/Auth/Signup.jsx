import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Signup.css';
import 'bootstrap/dist/css/bootstrap.min.css';

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
    <div className='container mt-5'>
      <div className='row'>
        <div className='col-md-6 offset-md-3'>
          <h1 className='text-center'>Signup page</h1>
          <form>
            <div className='col-12 mb-3'>
              <input 
                type="text"
                name="username"
                className="form-control" 
                placeholder="Username"
                value={formData.username}
                onChange={handleChange}
              />
            </div>
            <div className='col-12 mb-3'>
              <input 
                type="password"
                name="password"
                className="form-control"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
              />
            </div>
            <div className='mb-3'>
            <div      className="password-requirements">    
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

            </div>
            <div className='col-12 mb-3'>
              <input 
                type="number"
                name="age"
                className="form-control"
                placeholder="Age"
                value={formData.age}
                onChange={handleChange}
              />
            </div>
            <div className='col-12 mb-3'>
              <input 
                type="text"
                name="address"
                className="form-control"
                placeholder="Address"
                value={formData.address}
                onChange={handleChange}
              /> 
            </div>
            <div className='col-12 mb-3'>
              <input 
                type="text"
                name="phoneNumber"
                className="form-control"
                placeholder="Phone Number"
                value={formData.phoneNumber}
                onChange={handleChange}
              />
            </div>
            <div className='mb-3'>
              <select
                name="userType"
                className="input-field"
                value={formData.userType}
                onChange={handleChange}
                >
                <option         value="">Select your intention</option>
                <option value="adopter">Adopt a Pet</option>
                <option value="giver">Give a Pet for Adoption</option>
              </select>
            </div>
            <div className='mb-3'>
              <p className="error-message">{error}</p>
            </div>
            <div className='mb-3'>           
              <button
                className="btn btn-primary w-100"
                type='button' 
                onClick={signup}
              >
               Signup
              </button>
            </div>
          </form>
      
          <p className='text-center'>You already have an account? <Link to="/login" className="link">Login</Link>
          </p>
        </div>
      </div>
      
    </div>
  )
}
