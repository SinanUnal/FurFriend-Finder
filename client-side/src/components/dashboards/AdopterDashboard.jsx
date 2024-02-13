// import React from 'react';
// import { useState, useEffect } from 'react';
// import axiosWithAuth from '../utils/axiosWithAuth';
// import SearchFilter from '../adopter/SearchFilter';
// import AdoptionApplicationForm from '../adopter/AdoptionApplicationForm';
// import { useNavigate } from "react-router-dom";
// import { Link } from 'react-router-dom';
// import { jwtDecode } from 'jwt-decode';


// export default function AdopterDashboard() {
//   const [animals, setAnimals] = useState([]);
//   const [feedbackMessage, setFeedbackMessage] = useState('');
//   const [loading, setLoading] = useState(false);
//   const [error, setError] = useState('');
//   const [selectedAnimal, setSelectedAnimal] = useState(null);
//   const [adopterId, setAdopterId] = useState(null);
//   const navigate = useNavigate();
 

//   useEffect(() => {
//     const token = localStorage.getItem('token');
//     if (token) {
//       const decoded = jwtDecode(token);
//       setAdopterId(decoded.id);
//       // fetchApplications(decoded.id); // You might still need this
//     }
//     fetchAnimals(); // And other initial data fetches
//   }, []);
 

//   const fetchAnimals = async (searchTerm = '', filterType = '') => {
//     setLoading(true);
//     setError('');
//     try {
//       const axiosInstance = axiosWithAuth();
//       const response = await axiosInstance.get(`http://localhost:5000/adopterDashboard/animals?searchTerm=${searchTerm}&filterType=${filterType}`);
//       setAnimals(response.data);

//       setFeedbackMessage('');
//       setError('');
//     } catch (error) {
//       console.error('Error fetching animals', error);
//       setError('Failed to fetch animals. Please try again later.');
//     }
//     setLoading(false);
//   };

//   const handleSelectAnimal = (animal) => {
//     setSelectedAnimal(animal);
//   };

//   const addToFavorites = async (submissionId) => {
//     try {
//       console.log('Adding to favorites:', submissionId);
//       const axiosInstance = axiosWithAuth();
//       await axiosInstance.patch(`http://localhost:5000/adopterDashboard/addToFavorites`, { submissionId });

//       localStorage.setItem('favoritesUpdated', 'true');
//       setFeedbackMessage('Added to favorites successfully!');
//       fetchAnimals();
//     } catch (error) {
//       console.error('Error adding to favorites:', error.response?.data?.message);
//       setError('Error adding to favorites');
//     }
//   };

//   function logout() {
//     localStorage.clear();
//     navigate('/login');
//   }

//   return (
//         <div>
//           <h1>Adopter Dashboard</h1>
//           <Link to="/favorites">View My Favorites</Link>

//           <Link to="/applications">View Your Applications</Link>

//           {feedbackMessage && <div className="success-message">{feedbackMessage}</div>}
//           {error && <div className="error-message">{error}</div>}


//           <SearchFilter onSearch={fetchAnimals }/>
//           {loading && <p>Loading...</p>}

//           {error && <p>{error}</p>}

//           {!loading && !error && animals.length === 0 && (
//             <p>No animals found matching your criteria.</p>
//           )}  
          
          
//           {!loading && !error && animals.map(animal => (
//             <div key={animal._id}>
//                {animal.imageUrl && 
//                 <img 
//                   src={animal.imageUrl} 
//                   alt={animal.animalName} 
//                   style={{ width: '100px', height: '100px' }} 
//                 />}
//               <h3>{animal.animalName}</h3>
//               <p>Type: {animal.animalType}</p>
//               <p>Age: {animal.animalAge}</p>
//               <p>Health: {animal.healthInfo}</p>
//               <button onClick={() => handleSelectAnimal(animal)}>Adopt This Animal</button>
//               <button onClick={() => addToFavorites(animal._id)}>Add to Favorites</button>
//             </div>
//           ))}

         

//           {selectedAnimal && adopterId && (
//             <AdoptionApplicationForm 
//             submissionId={selectedAnimal._id} 
//             adopterId={adopterId}
//           />
//           )}


//           <button className="button" onClick={() => {
//                logout();
//            }}>Logout</button>

            
       
//         </div>
//       );
//     }
   
  

import React from 'react';
import { useState, useEffect } from 'react';
import axiosWithAuth from '../utils/axiosWithAuth';
import SearchFilter from '../adopter/SearchFilter';
import AdoptionApplicationForm from '../adopter/AdoptionApplicationForm';
import { jwtDecode } from 'jwt-decode';
import ChatComponent from '../Chat/ChatComponent';


export default function AdopterDashboard() {
  const [animals, setAnimals] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [selectedAnimal, setSelectedAnimal] = useState(null);
  const [adopterId, setAdopterId] = useState(null);
  const [applications, setApplications] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      const decoded = jwtDecode(token);
      setAdopterId(decoded.id); 
      fetchApplications(decoded.id);
    }
    fetchAnimals();
  }, []);

  const fetchApplications = async (adopterId) => {
    try {
      const axiosInstance = axiosWithAuth();
      const response = await axiosInstance.get(`http://localhost:5000/adopterDashboard/applications/${adopterId}`);
      setApplications(response.data); 
    } catch (error) {
      console.error('Error fetching applications:', error);
    }
  };

  const userType = 'adopter';

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

  

  return (
        <div>
          <h1>Adopter Dashboard</h1>
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

          <h2>Your Applications</h2>
          {applications.length > 0 ? (
            applications.map(app => (
              <div key={app._id}>
                <p>Application for: {app.submissionId?.animalName || 'N/A'}</p>
                <p>Status: {app.status}</p>
                {app.status === 'approved' && (
                  <div>
                    <p>Giver's Name: {app.submissionId?.giverId?.username}</p>
                    <p>Giver's Address: {app.submissionId?.giverId?.address}</p>
                    <p>Giver's Phone Number: {app.submissionId?.giverId?.phoneNumber}</p>
                    <ChatComponent adopterId={adopterId} giverId={app.submissionId?.giverId?._id} userType={userType} />
                  </div>
                )}
              </div>
            ))
          ) : (
            <p>No applications found.</p>
          )}
        </div>
      );
    }
   
  