import React from 'react';
import { useEffect, useState } from 'react';
import axiosWithAuth from '../utils/axiosWithAuth';
import UserManagement from '../Users/UserManagement';
import Reports from '../Reports/Reports';
import AnimalSubmissionForm from '../giver/AnimalSubmissionForm';

export default function AdminDashboard() {
  const [pendingSubmissions, setPendingSubmissions] = useState([]);
  const [submissions, setSubmissions] = useState([]);
  const [selectedSubmission, setSelectedSubmission] = useState(null);

  useEffect(() => {
    fetchSubmissions();
  }, []);

  const fetchSubmissions = async () => {
    try {
      const axiosInstance = axiosWithAuth();
      const response = await axiosInstance.get('http://localhost:5000/admin/submissions');
      setSubmissions(response.data);
    } catch (error) {
      console.error('Error fetching submissions:', error);
    }
  };

  const handleEdit = (submission) => {
    setSelectedSubmission(submission);
  };

  const handleUpdateSuccess = () => {
    fetchSubmissions();
    setSelectedSubmission(null);
  };

  
  const fetchPendingSubmissions = async () => {
      try {
        const axiosInstance = axiosWithAuth();
        const response = await axiosInstance.get('http://localhost:5000/admin/approvals');
        // console.log(response.data);
        setPendingSubmissions(response.data);
        
      } catch (error) {
        console.error('Error fetching pending submissions:', error);
      }
    };

    useEffect(() => {
      fetchPendingSubmissions();
    }, []);
    
 


  const handleApprove = async (submissionId) => {
    try {
      const axiosInstance = axiosWithAuth();
      await axiosInstance.post(`http://localhost:5000/admin/approve/${submissionId}`);

      // Remove the item from the state
      setPendingSubmissions(prevSubmission => prevSubmission.filter(submission => submission._id !== submissionId));

      //Refresh list
      // fetchPendingSubmissions();

    } catch (error) {
      console.error('Error approving submission', error);
    }
  };

  const handleReject = async (submissionId) => {
    try {
      const axiosInstance = axiosWithAuth();
      await axiosInstance.post(`http://localhost:5000/admin/reject/${submissionId}`);


      // Remove the item from the state
      setPendingSubmissions(prevSubmission => prevSubmission.filter(submission => submission._id !== submissionId))

      // fetchPendingSubmissions();
    } catch (error) {
      console.error('Error rejecting submission:', error);
    }
  };



  return (
    <div>
      <h1>Admin Dashboard</h1>
      {selectedSubmission && (
        <AnimalSubmissionForm
        initialData={selectedSubmission}
        isAdmin={true}
        onSubmissionSuccess={handleUpdateSuccess}
      />
      )}
      <h2>All submissions</h2>
      {submissions.map(submission => (
        <div key={submission._id}>
          <p>{submission.animalName}</p>
          <button onClick={() => handleEdit(submission)}>Edit</button>
        </div>
      ))}
      
      <h2>Pending Approvals</h2>
      <table>
        <thead>
          <tr>
            <th>Photo</th>
            <th>Animal Name</th>
            <th>Type</th>
            <th>Age</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {pendingSubmissions.map(submission => (
            <tr key={submission._id}>
              <td>
                {submission.imageUrl && (
                  <img src={submission.imageUrl} alt={submission.animalName}  style={{ maxWidth: '100px', maxHeight: '100px' }}/>
                )}
              </td>
              <td>{submission.animalName}</td>
              <td>{submission.animalType}</td>
              <td>{submission.animalAge}</td>
              <td>
                <button onClick={() => handleApprove(submission._id)} >Approve</button>
                <button onClick={() => handleReject(submission._id)} >Reject</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <UserManagement />
      <Reports />
    </div>
  );
}
