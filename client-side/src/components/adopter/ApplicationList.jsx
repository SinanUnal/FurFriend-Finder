import React from 'react';
import { useState, useEffect } from 'react';
import axiosWithAuth from '../utils/axiosWithAuth';
import { jwtDecode } from 'jwt-decode';
import ChatComponent from '../Chat/ChatComponent';
// import axios from 'axios';

import { Card, CardContent, Typography, List, ListItem, Divider } from '@mui/material';

export default function ApplicationList() {
  const [applications, setApplications] = useState([]);
  const [adopterId, setAdopterId] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setAdopterId(decoded.id);
      fetchApplications(decoded.id);
    }
  }, [])

  const fetchApplications = async (adopterId) => {
    try {
      const axiosInstance = axiosWithAuth();
      const response = await axiosInstance.get(`http://localhost:5000/adopterDashboard/applications/${adopterId}`);
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };
  const userType = 'adopter';

  return (
    <div>
     <Typography variant="h4" gutterBottom>
        Your Applications
      </Typography>
      {applications.length > 0 ? (
        applications.map(app => (
          <Card key={app._id} sx={{ marginBottom: 2 }}>
            <CardContent>
              <Typography variant="h6">Application for: {app.submissionId?.animalName || 'N/A'}</Typography>
              <Typography variant="body1">Status: {app.status}</Typography>
              {app.status === 'approved' && (
                <List>
                  <ListItem>
                    <Typography>Giver's Name: {app.submissionId?.giverId?.username}</Typography>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <Typography>Giver's Address: {app.submissionId?.giverId?.address}</Typography>
                  </ListItem>
                  <Divider />
                  <ListItem>
                    <Typography>Giver's Phone Number: {app.submissionId?.giverId?.phoneNumber}</Typography>
                  </ListItem>
                  <ListItem>
                    <ChatComponent adopterId={adopterId} giverId={app.submissionId?.giverId?._id} userType={userType} />
                  </ListItem>
                </List>
              )}
            </CardContent>
          </Card>
        ))
      ) : (
        <Typography variant="body1">No applications found.</Typography>
      )}
    </div>
  )
}
