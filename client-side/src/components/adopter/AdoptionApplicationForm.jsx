import React, { useContext } from 'react';
import { useState } from 'react';
import axiosWithAuth from '../utils/axiosWithAuth';
import { useParams } from 'react-router-dom';
import { AuthContext } from '../Auth/Authcontext';

export default function AdoptionApplicationForm() {
  const { adopterId, loading } = useContext(AuthContext);
  console.log("Adopter ID from Context:", adopterId);
  const { submissionId } = useParams();
  const [formData, setFormData] = useState({
    age: '',
    homeEnvironment: '',
    petExperience: ''
  });

  if (loading) {
    return <div>Loading...</div>; 
  }

  console.log("AdoptionApplicationForm Props:", { submissionId, adopterId });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    console.log("Submitting Form Data:", formData);
    console.log("Adopter ID at submission:", adopterId);
    console.log("Submitting Form Data:", formData);

    try {
      const axiosInstance = axiosWithAuth();
      await axiosInstance.post('http://localhost:5000/submitApplication', {
        ...formData,
        adopterId,
        submissionId
      });
      alert('Application submitted successfully');
    } catch (error) {
      alert('Failed to submit application');
    }
  };

  return (
    <div>
       <form onSubmit={handleSubmit}>
        <input 
          type="number"
          name='age'
          value={formData.age}
          onChange={handleChange}
          placeholder='Your Age'
          min='18' />
        <textarea 
          name="homeEnvironment"
          value={formData.homeEnvironment}  
          onChange={handleChange}
          placeholder="Describe your home environment"
        ></textarea>
        <textarea 
          name="petExperience" 
          value={formData.petExperience}
          onChange={handleChange}
          placeholder="Describe your experience with pets" 
        ></textarea>
        <button type="submit">Submit Application</button>
    </form>
    </div>
  )
}
