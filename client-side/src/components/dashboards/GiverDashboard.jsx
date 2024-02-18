import React from 'react';
import { jwtDecode } from 'jwt-decode';
import GiverDashboardStats from '../giver/GiverDashboardStats';
import { useNavigate } from "react-router-dom";
import { Link } from 'react-router-dom';





export default function GiverDashboard() {
  const navigate = useNavigate();

  const token = localStorage.getItem('token');
  let userId = null;

  if (token) {
    const decodedToken = jwtDecode(token);
    userId = decodedToken.id;
    console.log("UserId in GiverDashboard:", userId);
  }

  
    
  function logout() {
    localStorage.clear();
    navigate('/login');
  }


  return (
    <div>
      <h1>giver dashboard</h1>
      <GiverDashboardStats userId={userId} />
      <Link to={`/user/profile/${userId}`}>Profile</Link>
      <nav>
        <ul>
          <li><Link to="/giver-dashboard/submission-form">Animal Submission Form</Link></li>
          <li><Link to={`/giver-dashboard/current-listings/${userId}`}>Current Listings</Link></li>
          <li><Link to={`/giver-dashboard/applications/${userId}`}>Adoption Applications</Link></li>
        </ul>
      </nav>

  
   
    <button className="button" onClick={logout}>Logout</button>
   



  
    </div>
  )
}
