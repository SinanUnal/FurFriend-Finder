import React from 'react';
import { useEffect, useState, useCallback } from 'react';
import axiosWithAuth from '../utils/axiosWithAuth';
import ChatComponent from '../Chat/ChatComponent';


export default function GiverApplications({ giverId }) {
  console.log("GiverId in GiverApplications:", giverId);
  const [applications, setApplications] = useState([]);
  const [fetchType, setFetchType] = useState('pending');

  const fetchApplications = useCallback(async () => {
    const endpoint = fetchType === 'pending'
      ? `http://localhost:5000/giverDashboard/pendingApplications/${giverId}`
      : `http://localhost:5000/giverDashboard/approvedApplications/${giverId}`;



    try {
      const axiosInstance = axiosWithAuth();
      const response = await axiosInstance.get(endpoint);
      
      setApplications(response.data);
     
    } catch (error) {
      console.error('Error fetching applications', error);
    }
  }, [giverId, fetchType]); // giverId is a dependency

  useEffect(() => {
    if (giverId) {
      fetchApplications();
    } else {
      console.log("Giver ID is undefined.");
    }
  }, [fetchApplications, giverId]);
  // useEffect(() => {
  //   fetchApplications();
  // }, [fetchApplications]);

  const fetchPendingApplications = useCallback(async () => {
    try {
      const axiosInstance = axiosWithAuth();
      const response = await axiosInstance.get(`http://localhost:5000/giverDashboard/pendingApplications/${giverId}`);
      setApplications(response.data);
      if (response.data.length === 0) {
        // If no pending applications, fetch approved ones
        setFetchType('approved');
      } else {
        setApplications(response.data);
      }
    } catch (error) {
      console.error('Error fetching applications', error);
    }
  }, [giverId]);

  const fetchApprovedApplications = useCallback(async () => {
    try {
      const axiosInstance = axiosWithAuth();
      const response = await axiosInstance.get(`http://localhost:5000/giverDashboard/approvedApplications/${giverId}`);
      setApplications(response.data);
    } catch (error) {
      console.error('Error fetching applications', error);
    }
  }, [giverId]);

  useEffect(() => {
    if (fetchType === 'pending') {
      fetchPendingApplications();
    } else {
      fetchApprovedApplications();
    }
  }, [fetchPendingApplications, fetchApprovedApplications, fetchType]);


 
  // const userType = 'giver';

  const handleApprove = async (applicationId) => {
    try {
      const axiosInstance = axiosWithAuth();
      await axiosInstance.patch(`http://localhost:5000/giverDashboard/approveApplication/${applicationId}`);
      setFetchType('approved');
      fetchApplications();
    } catch (error) {
      console.error('Error approving application', error);
    }
  };

  const handleReject = async (applicationId) => {
    try {
      const axiosInstance = axiosWithAuth();
      await axiosInstance.patch(`http://localhost:5000/giverDashboard/rejectApplication/${applicationId}`);
      fetchApplications();
    } catch (error) {
      console.error('Error rejecting application', error);
    }
  };

  return (
    <div>
     <h2>{fetchType === 'pending' ? 'Pending' : 'Approved'} Adoption Applications</h2>
     {applications.length > 0 ? applications.map(app => (
      <div key={app._id}>
        
        <p>Application Status: {app.status}</p>

        {/* {app.status === 'approved' && app.adopterId && giverId && ( <ChatComponent adopterId={app.adopterId._id} giverId={giverId} userType={"giver"} /> )} */}
        {app.status === 'approved' && <ChatComponent adopterId={app.adopterId._id} giverId={giverId} userType={'giver'} />}
          {fetchType === 'pending' && (
            <>
              <button onClick={() => handleApprove(app._id)}>Approve</button>
              <button onClick={() => handleReject(app._id)}>Reject</button>
            </>
          )}

      </div> 
     )) : <p>No pending applications.</p>} 
     <button onClick={() => setFetchType(fetchType === 'pending' ? 'approved' : 'pending')}>
  {fetchType === 'pending' ? 'Show Approved Applications' : 'Show Pending Applications'}
</button>

    </div>
  );
}

