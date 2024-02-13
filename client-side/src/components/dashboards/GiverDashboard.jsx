import React from 'react';
import { jwtDecode } from 'jwt-decode';
import ParentComponent from '../giver/ParentComponent';
import GiverApplications from '../giver/GiverApplications';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';




export default function GiverDashboard() {
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  let userId = null;

  if (token) {
    const decodedToken = jwtDecode(token);
    userId = decodedToken.id;
  }

  
    
  function logout() {
    localStorage.clear();
    navigate('/login');
  }


  return (
    <div>
      <h1>giver dashboard</h1>
      <button className="button" onClick={() => {
               logout();
       }}>Logout</button>
      <ParentComponent userId={userId} />
      <GiverApplications giverId={userId} />
      
    </div>
  )
}
