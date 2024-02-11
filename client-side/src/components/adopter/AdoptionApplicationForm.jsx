import React from 'react';
import { useState } from 'react';
import axiosWithAuth from '../utils/axiosWithAuth';

export default function AdoptionApplicationForm({ submissionId, adopterId }) {
  const [formData, setFormData] = useState({
    age: '',
    homeEnvironment: '',
    petExperience: ''
  });

  console.log("AdoptionApplicationForm Props:", { submissionId, adopterId });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
