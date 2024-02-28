import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';
import './Login.css';


export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();

  function login() {
    axios.post('http://localhost:5000/login', { username, password })
    .then(({ data }) => {
      if (data.message === 'Login is successful') {
        localStorage.setItem('token', data.token);
        localStorage.setItem('user', JSON.stringify(data.user));
        console.log('Token set in localStorage:', localStorage.getItem('token'));
        

        window.dispatchEvent(new CustomEvent('token-updated'));
        
   
        
        // Redirect based on user role
        if (data.role === 'admin') {
          navigate('/admin-dashboard', { replace: true });
        } else if (data.user.userType === 'adopter') {
          navigate('/adopter-dashboard');
        } else if (data.user.userType === 'giver') {
          navigate('/giver-dashboard/submission-form');
        }
      } else {
        setError(data.message);
      }
    }).catch(error => {
      setError(error.response?.data?.message || 'Error during login');
    });

  }

  return (
    <div className='Login-main-container'>
      <div className='container mt-5'>
      <div className='row'>
        <div className='col-md-6 offset-md-3'>
          
          <form>
             <div className='col-12 mb-4'>
              <input 
                type="text"
                className="form-control"
                placeholder="Username"
                onChange={(e) => {
                  setUsername(e.target.value);
              }}/>
             </div>
             <div className='col-12 mb-5'>
              <input 
                type="password"
                className="form-control"
                placeholder="Password" 
                onChange={(e) => {
                  setPassword(e.target.value);
              }}/>
            </div>
            <div className='mb-3'>
              <p className="error-message">{error}</p>
            </div>
            <div className='mb-3'>
              <button
                type='button'
                className="btn btn-primary w-100" 
                onClick={() => {
                  login();
              }}>Login</button>
            </div>
            <div className='text-left-align'>
              <p>You do not have an account? <Link to={'/'} className="link">Signup</Link></p>
            </div> 
          </form>
        </div>  
      </div>    
    </div>
    </div>
    
  )
}



















