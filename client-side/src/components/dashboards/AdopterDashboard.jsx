import React from 'react';
import { useState, useEffect } from 'react';
import axiosWithAuth from '../utils/axiosWithAuth';
import SearchFilter from '../adopter/SearchFilter';
import AdoptionApplicationForm from '../adopter/AdoptionApplicationForm';
import { Link } from 'react-router-dom';
import { useNavigate } from 'react-router-dom';



export default function AdopterDashboard() {
  const navigate = useNavigate();
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  
  const [adopterId, setAdopterId] = useState(null);
  

  

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

  const handleSelectAnimal = (animal) => {
    setSelectedAnimal(animal);
  };

  function logout() {
    localStorage.clear();
    navigate('/login');
  }
  

  return (
        <div>
          <h1>Adopter Dashboard</h1>
          <Link to="/adopter-dashboard/your-applications">Your Applications</Link>
          <SearchFilter onSearch={fetchAnimals }/>
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
              <button onClick={() => handleSelectAnimal(animal)}>Adopt This Animal</button>
            </div>
          ))}

          {selectedAnimal && adopterId && (
            <AdoptionApplicationForm 
            submissionId={selectedAnimal._id} 
            adopterId={adopterId}
          />
          )}

        
         
         
         <button className="button" onClick={logout}>Logout</button>
        

         
      
        </div>
      );
    }
   
  