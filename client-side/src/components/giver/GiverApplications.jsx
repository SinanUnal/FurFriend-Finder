import React from 'react';
import { useEffect, useState, useCallback } from 'react';
import axiosWithAuth from '../utils/axiosWithAuth';
import ChatComponent from '../Chat/ChatComponent';


export default function GiverApplications({ giverId }) {
 


  const [approvedApplications, setApprovedApplications] = useState([]);
  // const [applications, setApplications] = useState([]);

  const fetchApplications = useCallback(async () => {
    try {
      const axiosInstance = axiosWithAuth();
      const response = await axiosInstance.get(`http://localhost:5000/giverDashboard/approvedApplications/${giverId}`);
      setApprovedApplications(response.data);
     
    } catch (error) {
      console.error('Error fetching applications', error);
    }
  }, [giverId]); // giverId is a dependency

  useEffect(() => {
    fetchApplications();
  }, [fetchApplications]);

 
  const userType = 'giver';

  const handleApprove = async (applicationId) => {
    try {
      const axiosInstance = axiosWithAuth();
      await axiosInstance.patch(`http://localhost:5000/giverDashboard/approveApplication/${applicationId}`);
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
     <h2>Pending Adoption Applications</h2>
     {approvedApplications.length > 0 ? approvedApplications.map(app => (
      <div key={app._id}>
        <p>Adopter ID: {app.adopterId._id}</p>
        <p>Submission ID: {app.submissionId._id}</p>
        <p>Application Status: {app.status}</p>
        {/* {app.status === 'approved' && (
            <>
               {console.log("Rendering ChatComponent for:", app)} */}
               <ChatComponent adopterId={app.adopterId} giverId={giverId} userType={userType} />
            {/* </>
         )} */}

        <button onClick={() => handleApprove(app._id)}>Approve</button>
        <button onClick={() => handleReject(app._id)}>Reject</button>
      </div> 
     )) : <p>No pending applications.</p>} 
    </div>
  );
}

