import React from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';


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
            // switch (data.user.userType) {
            //   case 'adopter':
            //     navigate('/adopter-dashboard');
            //     break;
            //   case 'giver':
            //     navigate('/giver-dashboard');
            //     break;
            //   default:
            //     navigate('/adopter-dashboard');
            //     break;
            // }
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
    <div>
      <h1>This is login page</h1>
      <input 
        type="text"
        className="input-field"
        placeholder="Username"
        onChange={(e) => {
          setUsername(e.target.value);
        }}/>
      <br />
      <input 
        type="password"
        className="input-field"
        placeholder="Password" 
        onChange={(e) => {
          setPassword(e.target.value);
        }}/>
      <br />
      <p className="error-message">{error}</p>
      <button
        className="button" 
        onClick={() => {
          login();
        }}>Login</button>
      <p>You do not have an account ? <Link to={'/'} className="link">Signup</Link></p>
    </div>
  )
}



















//   return (
//     <div>
//       <h1>This is login page</h1>
//       <input 
//         type="text"
//         className="input-field"
//         placeholder="Username"
//         onChange={(e) => {
//         setUsername(e.target.value);
//       }}/>
//       <br />
//       <input 
//         type="password"
//         className="input-field"
//         placeholder="Password" 
//         onChange={(e) => {
//         setPassword(e.target.value);
//       }}/>
//       <br />
//       <p className="error-message">{error}</p>
//       <button
//         className="button" 
//         onClick={() => {
//         login();
//       }}>Login</button>
//       <p>You do not have an account ? <Link to={'/'} className="link">Signup</Link></p>
//     </div>
//   )
// }