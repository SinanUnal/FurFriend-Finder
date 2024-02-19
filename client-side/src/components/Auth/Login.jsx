import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import 'bootstrap/dist/css/bootstrap.min.css';



export default function Login() {
  const navigate = useNavigate();
  const [username, setUsername] = useState();
  const [password, setPassword] = useState();
  const [error, setError] = useState();

  function login() {
    axios.post('http://localhost:5000/login', {
      username: username,
      password: password
    })
    .then(({ data }) => {
      console.log(data);
      if (data.message === 'Login is successful') {
        if (data.token) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('user', JSON.stringify(data.user));
          
          // Check the user's role and redirect accordingly
          if (data.role === 'admin') {
            navigate('/admin-dashboard');
          } 
          // For non-admin users, check their userType
          else {
        
            const user = data.user;
            let adopterId, giverId;
            if (user.userType === 'adopter') {
              adopterId = user._id;
              navigate('/adopter-dashboard', { state: { adopterId} });
            } else if (user.userType === 'giver') {
              giverId = user._id;
              navigate('/giver-dashboard', { state: { giverId } });
            }
            

          }
        }
      } else {
        setError(data.message);
      }
    }).catch(error => {
      console.error('Login error', error);
      setError(error.response?.data?.message || 'Error during login');
    });
  }

  return (
    <div className='container mt-5'>
      <div className='row'>
        <div className='col-md-6 offset-md-3'>
          <h1>This is login page</h1>
          <form>
             <div className='col-12 mb-3'>
              <input 
                type="text"
                className="form-control"
                placeholder="Username"
                onChange={(e) => {
                  setUsername(e.target.value);
              }}/>
             </div>
             <div className='col-12 mb-3'>
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
                className="btn btn-primary w-100" 
                onClick={() => {
                  login();
              }}>Login</button>
            </div>
          </form>
        </div>   
      </div>
      
      <p className='text-center'>You do not have an account ? <Link to={'/'} className="link">Signup</Link></p>
    </div>
  )
}



















