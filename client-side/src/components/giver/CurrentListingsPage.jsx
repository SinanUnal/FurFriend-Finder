import React, { useState, useEffect, useCallback } from 'react';
import axiosWithAuth from '../utils/axiosWithAuth';
import ListingGiverDashboard from './ListingGiverDashboard';
import AnimalSubmissionForm from './AnimalSubmissionForm';
import { useParams } from 'react-router-dom';

export default function CurrentListingsPage() {
  const { userId } = useParams();
  console.log("UserId from URL in CurrentListingsPage:", userId);
  const [currentListing, setCurrentListing] = useState([]);
  const [formData, setFormData] = useState({ // Add this state for form data
    animalName: '',
    animalAge: '',
    animalType: '',
    healthInfo: '',
    imageUrl: '',
    _id: null,
  });
  const [isEditing, setIsEditing] = useState(false);

  const fetchCurrentListing = useCallback(async () => {
    if (!userId) {
      console.error("UserId is undefined");
      return;
    }
    
    try {
      const axiosInstance = axiosWithAuth();
      const response = await axiosInstance.get(`http://localhost:5000/giverDashboard/currentListings/${userId}`);
      setCurrentListing(response.data);
    } catch (error) {
      console.error('Error fetching current listings:', error);
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
    setIsEditing(true);
  };

  const handleDelete = async (listingId) => {
    try {
      const axiosInstance = axiosWithAuth();
      await axiosInstance.delete(`http://localhost:5000/giverDashboard/deleteListing/${listingId}`);
      fetchCurrentListing();
    } catch (error) {
      console.error('Error deleting listing:', error);
      // setError('Error deleting listing. Please try again later.');
    }
  };

  const onSubmissionSuccess = () => {
    setIsEditing(false); // Exit editing mode
    setFormData({ // Reset form data
      animalName: '',
      animalAge: '',
      animalType: '',
      healthInfo: '',
      imageUrl: '',
      _id: null,
    });
    fetchCurrentListing(); // Refresh the listings
  };

  return (
    <div>
       <h2>Current Listings</h2>
      {isEditing && (
        <AnimalSubmissionForm 
          initialData={formData}
          userId={userId}
          onSubmissionSuccess={onSubmissionSuccess}
        />
      )}
      {!isEditing && currentListing.length > 0 ? (
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
      {/* <h2>Current Listings</h2>
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
      )} */}
    </div>
  )
}
