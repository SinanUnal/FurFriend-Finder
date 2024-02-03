import React from 'react';
import { jwtDecode } from 'jwt-decode';
import ParentComponent from '../giver/ParentComponent';



export default function GiverDashboard() {
  const token = localStorage.getItem('token');
  let userId = null;

  if (token) {
    const decodedToken = jwtDecode(token);
    userId = decodedToken.id;
  }

  
    

  return (
    <div>
      <h1>giver dashboard</h1>
      <ParentComponent userId={userId} />
      
    </div>
  )
}
