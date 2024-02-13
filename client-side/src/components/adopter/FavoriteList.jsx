import React, { useState, useEffect } from 'react';
import axiosWithAuth from '../utils/axiosWithAuth';

export default function FavoriteList() {
  const [favorites, setFavorites] = useState([]);
  const [error, setError] = useState('');

  const fetchFavorites = async (userId) => {
    try {
      const axiosInstance = axiosWithAuth();
      const response = await axiosInstance.get(`http://localhost:5000/adopterDashboard/favorites`);
      console.log('Favorites fetched:', response.data);
      setFavorites(response.data);

      localStorage.setItem('favoritesUpdated', 'false');
    } catch (error) {
      setError('Error fetching favorites');
    }
  };

  useEffect(() => {
    if (localStorage.getItem('favoritesUpdated') === 'true');
    fetchFavorites();
  }, []);

  // const addToFavorites = async (submissionId) => {
  //   try {
  //     const axiosInstance = axiosWithAuth();
  //     await axiosInstance.patch('/adopterDashboard/addToFavorites', { submissionId });
  //     fetchFavorites();
  //   } catch (error) {
  //     setError('Error adding to favorites');
  //   }
  // };

  const removeFromFavorites = async (submissionId) => {
    try {
      const axiosInstance = axiosWithAuth();
      await axiosInstance.delete(`http://localhost:5000/adopterDashboard/removeFromFavorites?submissionId=${submissionId}`);
      fetchFavorites();
    } catch (error) {
      setError('Error removing from favorites');
    }
  };

  return  (
    <div>
      <h2>Your Favorite Listings</h2>
      {error && <p>{error}</p>}
      {favorites.map(favorite => (
        <div key={favorite._id}>
          <p>{favorite.animalName}</p>
          <button onClick={() => removeFromFavorites(favorite._id)}>Remove from Favorites</button>
        </div>
      ))}
      {/* Example button to add a submission to favorites - replace 'submissionId' with actual ID */}
      {/* <button onClick={() => addToFavorites(submissionId)}>Add to Favorites</button> */}
    </div>
  );
}
