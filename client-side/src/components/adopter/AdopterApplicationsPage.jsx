import React from 'react';
import { useState, useEffect } from 'react';
import axiosWithAuth from '../utils/axiosWithAuth';
import { jwtDecode } from 'jwt-decode';
import ChatComponent from '../Chat/ChatComponent';


export default function AdopterApplicationsPage() {
  const [applications, setApplications] = useState([]);
  const [adopterId, setAdopterId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setAdopterId(decoded.id); 
      fetchApplications(decoded.id);
    }
    // fetchAnimals();
  }, []);

  const fetchApplications = async (adopterId) => {
    try {
      const axiosInstance = axiosWithAuth();
      const response = await axiosInstance.get(`http://localhost:5000/adopterDashboard/applications/${adopterId}`);
      setApplications(response.data); 
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };


  return (
    <div>
      <h2>Your Applications</h2>
          {applications.length > 0 ? (
      applications.map(app => {
             
       return (
          <div key={app._id}>
            <p>Application for: {app.submissionId?.animalName || 'N/A'}</p>
            <p>Status: {app.status}</p>
            {app.status === 'approved' && (
                  <div>
                    <p>Giver's Name: {app.submissionId?.giverId?.username}</p>
                    <p>Giver's Address: {app.submissionId?.giverId?.address}</p>
                    <p>Giver's Phone Number: {app.submissionId?.giverId?.phoneNumber}</p>
                    <ChatComponent adopterId={adopterId} giverId={app.submissionId?.giverId?._id} userType={'adopter'} />
                  </div>
                )}

          
          </div>
        );
      })
    ) : (
      <p>No applications found.</p>
    )}
    </div>
  )
}
