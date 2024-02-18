import React, { useContext } from 'react';
import { useState } from 'react';
import axiosWithAuth from '../utils/axiosWithAuth';
import SearchFilter from '../adopter/SearchFilter';

import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../Auth/Authcontext';





export default function AdopterDashboard() {
  const { adopterId } = useContext(AuthContext);
  const navigate = useNavigate();
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [feedbackMessage, setFeedbackMessage] = useState('');
  const [error, setError] = useState('');

 
  

  

  const fetchAnimals = async (searchTerm = '', filterType = '') => {
    setLoading(true);
    setError('');
    try {
      const axiosInstance = axiosWithAuth();
      const response = await axiosInstance.get(`http://localhost:5000/adopterDashboard/animals?searchTerm=${searchTerm}&filterType=${filterType}`);
      setAnimals(response.data);
    } catch (error) {
      console.error('Error fetching animals', error);
      setError('Failed to fetch animals. Please try again later.');
    }
    setLoading(false);
  };


  const handleSelectAnimal = (animalId) => {
    navigate(`/adoption-application/${animalId}`);
  };


  const addToFavorites = async (submissionId) => {
    try {
      const axiosInstance = axiosWithAuth();
      await axiosInstance.patch('http://localhost:5000/adopterDashboard/addToFavorites', { submissionId });
      setFeedbackMessage('Added to favorites successfully!');
      localStorage.setItem('favoritesUpdated', 'true');
     
    } catch (error) {
      console.error('Error adding to favorites:', error.response?.data?.message);
      setError('Error adding to favorites');
    }
  };

  function logout() {
    localStorage.clear();
    navigate('/login');
  }
  

  return (
        <div>
          <h1>Adopter Dashboard</h1>
          <Link to="/adopter-dashboard/your-applications">Your Applications</Link>
          <Link to="/adopter-dashboard/favorites">View Favorites</Link>
          <Link to={`/adopter-dashboard/adopted-animals/${adopterId}`}>View Adopted Animals</Link>
          <Link to={`/user/profile/${adopterId}`}>Profile</Link>
          <SearchFilter onSearch={fetchAnimals }/>
          {feedbackMessage && <div className="success-message">{feedbackMessage}</div>}
          {error && <div className="error-message">{error}</div>}
          {loading && <p>Loading...</p>}

          {error && <p>{error}</p>}

          {!loading && !error && animals.length === 0 && (
            <p>No animals found matching your criteria.</p>
          )}  
          
          
          {!loading && !error && animals.map(animal => (
            <div key={animal._id}>
               {animal.imageUrl && 
                <img 
                  src={animal.imageUrl} 
                  alt={animal.animalName} 
                  style={{ width: '100px', height: '100px' }} 
                />}
              <h3>{animal.animalName}</h3>
              <p>Type: {animal.animalType}</p>
              <p>Age: {animal.animalAge}</p>
              <p>Health: {animal.healthInfo}</p>
              <Link to={`/user/public-profile/${animal.giverId}`}>View Giver's Profile</Link>
              <button onClick={() => handleSelectAnimal(animal._id)}>Adopt This Animal</button>
              <button onClick={() => addToFavorites(animal._id)}>Add to Favorites</button>

          
            </div>
          ))}

       

      
        
         
         
         <button className="button" onClick={logout}>Logout</button>
        

         
      
        </div>
      );
    }
   
  