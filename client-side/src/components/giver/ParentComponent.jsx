import React, { useCallback, useState } from 'react';
import { useEffect } from 'react';
import AnimalSubmissionForm from './AnimalSubmissionForm';
import GiverDashboardStats from './GiverDashboardStats';
import ListingGiverDashboard from './ListingGiverDashboard';
import axiosWithAuth from '../utils/axiosWithAuth';


export default function ParentComponent({ userId }) {
  const [dashboardData, setDashboardData] = useState({
    userName: '',
    activeSubmission: 0,
    pendingApprovals: 0,
    successfulAdoption: 0
  });
  const [currentListing, setCurrentListing] = useState([]);
  const [error, setError] = useState('');
  const [formData, setFormData] = useState({
    animalName: '',
    animalAge: '',
    animalType: '',
    healthInfo: '',
    imageUrl: '',
    _id: null
  });

  const fetchDashboardData = useCallback(async () => {
    try {
      const axiosInstance = axiosWithAuth();
      const response = await axiosInstance.get(`http://localhost:5000/giverDashboard/${userId}`);
      setDashboardData(response.data);
      // console.log("Dashboard data received:", response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching dashboard data:', error);
      setError('Error fetching dashboard data. Please try again later.')
    }
  }, [userId]);




  useEffect(() => {
     fetchDashboardData(); 
  }, [fetchDashboardData, userId]);


  const fetchCurrentListing = useCallback(async () => {
    try {
      const axiosInstance = axiosWithAuth();
      const response = await axiosInstance.get(`http://localhost:5000/giverDashboard/currentListings/${userId}`);
      console.log("Current Listings:", response.data);
      setCurrentListing(response.data);
      setError('');
    } catch (error) {
      console.error('Error fetching current listings:', error);
      setError('Error fetching current listings. Please try again later.')
    }
  }, [userId]);

  useEffect(() => {
    fetchCurrentListing();
  }, [fetchCurrentListing, userId]);


  const handleEdit = (listing) => {
    console.log('Editing listing:', listing);
    setFormData({
      animalName: listing.animalName,
      animalAge: listing.animalAge,
      animalType: listing.animalType,
      healthInfo: listing.healthInfo,
      imageUrl: listing.imageUrl,
      _id: listing._id // include the ID to know if it's an edit
    });
  };

  const handleDelete = async (listingId) => {
    try {
      const axiosInstance = axiosWithAuth();
      await axiosInstance.delete(`http://localhost:5000/giverDashboard/deleteListing/${listingId}`);
      fetchCurrentListing();
    } catch (error) {
      console.error('Error deleting listing:', error);
      setError('Error deleting listing. Please try again later.');
    }
  };

   


  return (
    <div>
      <GiverDashboardStats dashboardData={dashboardData} />
      <AnimalSubmissionForm onSubmissionSuccess={fetchDashboardData} initialData={formData} />
      {error && <p>{error}</p>}
      <div>
      <h2>Current Listings</h2>
      {currentListing.length > 0 ? (
        currentListing.map(listing => (
          <ListingGiverDashboard 
            key={listing._id} 
            listing={listing} 
            onEdit={handleEdit} 
            onDelete={handleDelete} 
          />
        ))
      ) : (
        <p>No current listings available.</p>
      )}
    </div>
    </div>
  );
};
