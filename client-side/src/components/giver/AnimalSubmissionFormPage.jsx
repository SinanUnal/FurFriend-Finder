import React, { useState, useEffect } from 'react';
import AnimalSubmissionForm from './AnimalSubmissionForm';
import axiosWithAuth from '../utils/axiosWithAuth';

export default function AnimalSubmissionFromPage({ userId }) {
  const [formData, setFormData] = useState({
    animalName: '',
    animalAge: '',
    animalType: '',
    healthInfo: '',
    imageUrl: '',
    _id: null
  });

  useEffect(() => {
    console.log("UserId in AnimalSubmissionFromPage:", userId);
    // Fetch logic here if you need to pre-populate the form
  }, [userId]);

  const onSubmissionSuccess = () => {
    setFormData({
      animalName: '',
      animalAge: '',
      animalType: '',
      healthInfo: '',
      imageUrl: '',
      _id: null
    });
    // Additional success logic
  };

  return (
    <div>
      <h2>Animal Submission Form</h2>
      <AnimalSubmissionForm 
        initialData={formData} 
        onSubmissionSuccess={onSubmissionSuccess}
        userId={userId}
      />
    </div>
  )
}
