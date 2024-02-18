import React, { useState, useEffect } from 'react';
import axiosWithAuth from '../utils/axiosWithAuth';
import { Link } from 'react-router-dom';
import { useParams } from 'react-router-dom';

const AdoptedAnimals = () => {
  const { userId } = useParams();
  const [adoptedAnimals, setAdoptedAnimals] = useState([]);

  useEffect(() => {
    const fetchAdoptedAnimals = async () => {
      try {
        const axiosInstance = axiosWithAuth();
        const response = await axiosInstance.get(`http://localhost:5000/adopterDashboard/adoptedAnimals/${userId}`);
        setAdoptedAnimals(response.data);
      } catch (error) {
        console.error('Error fetching adopted animals:', error);
      }
    };

    fetchAdoptedAnimals();
  }, [userId]);

  return (
    <div>
      <h2>Your Adopted Animals</h2>
      {adoptedAnimals.length > 0 ? (
        adoptedAnimals.map(animal => (
          <div key={animal._id}>
            <h3>{animal.animalName}</h3>
            <Link to={`/user/public-profile/${animal.giverId._id}`}>View Giver's Profile</Link>
          </div>
        ))
      ) : (
        <p>You have not adopted any animals.</p>
      )}
    </div>
  );
};

export default AdoptedAnimals;
