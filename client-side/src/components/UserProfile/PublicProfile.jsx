import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axiosWithAuth from '../utils/axiosWithAuth';


const PublicProfile = () => {
  const { userId } = useParams();
  const [publicProfile, setPublicProfile] = useState({
    username: '',
    profilePicture: '',
    address: '',
    phoneNumber: '',
   
  });


  useEffect(() => {

    const fetchPublicProfile = async () => {
      try {
        console.log("userId from URL:", userId);
        const axiosInstance = axiosWithAuth();
        const response = await axiosInstance.get(`http://localhost:5000/user/public-profile/${userId}`);
        console.log(response);
        setPublicProfile(response.data);
      } catch (error) {
        console.error('Error fetching public profile:', error);
      }
    };

    fetchPublicProfile();
    
  }, [userId]);

  return (
    <div>
      <h2>Public Profile</h2>
      <img src={publicProfile.profilePicture} alt="Profile" />
      <p>Username: {publicProfile.username}</p>
      <p>Address: {publicProfile.address}</p>
      <p>Phone Number: {publicProfile.phoneNumber}</p>

    </div>
  );
};

export default PublicProfile;

