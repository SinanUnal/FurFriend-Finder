import React, { useEffect } from 'react';
import { useState } from 'react';
import axiosWithAuth from '../utils/axiosWithAuth';
import { storage} from '../../firebase';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';


export default function AnimalSubmissionForm({ onSubmissionSuccess, initialData }) {

  const [formData, setFormData] = useState({
    animalName: '',
    animalAge: '',
    animalType: '',
    healthInfo: '',
    imageUrl: ''
  });
  const [imageUrls, setImageUrls] = useState([]);

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);
  
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleFileChange = async (e) => {
  
    const file = e.target.files[0];
    if(!file) return;



    try {
      const storageRef = ref(storage ,`images/${file.name}`);
      await uploadBytes(storageRef, file);
      const fileUrl = await getDownloadURL(storageRef);
      
      setFormData(prevFormData => ({ ...prevFormData, imageUrl: fileUrl }));
    } catch (error) {
      console.error('Error uploading file:', error)
    }  
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    const endpoint = formData._id ? `updateListing/${formData._id}` : 'submissions';
    const axiosInstance = axiosWithAuth();

    console.log("Submitting form data:", formData); 

    try {
      if (formData._id) {
        await axiosInstance.patch(`http://localhost:5000/giverDashboard/${endpoint}`, formData);
      } else {
        await axiosInstance.post(`http://localhost:5000/giverDashboard/${endpoint}`, formData);
      }
      
    
     
    

       setFormData({
        animalName: '',
        animalAge: '',
        animalType: '',
        healthInfo: '',
        imageUrl: ''
      });
      alert('Submission successful!');
      onSubmissionSuccess();
    } catch (error) {
      console.error('Error submitting form', error);
      alert('Error submitting form' + (error.response?.data?.message || 'Please try again later '));
    }
      
  }

  return (
    <>
       <form onSubmit={handleSubmit}>
    <input 
        type="text" 
        name="animalName" 
        value={formData.animalName} 
        onChange={handleChange} 
        placeholder="Animal Name" 
    />
    <input 
        type="text" 
        name="animalAge" 
        value={formData.animalAge} 
        onChange={handleChange} 
        placeholder="Animal Age" 
    />
    <input 
        type="text" 
        name="animalType" 
        value={formData.animalType} 
        onChange={handleChange} 
        placeholder="Animal Type" 
    />
    <textarea 
        name="healthInfo" 
        value={formData.healthInfo} 
        onChange={handleChange} 
        placeholder="Health Information" 
    />
    <input 
        type="file" 
        name="image" 
        onChange={handleFileChange} 
        
    />
    <button type="submit">Submit</button>
</form>
{imageUrls.map((url, index) => (
  <div key={index}>
  <h3>Uploaded Image {index + 1}:</h3>
  <img 
    src={url} 
    alt={`Uploaded ${index + 1}`}  
    style={{ maxWidth: '100%', height: 'auto' }} 
  />
  </div>
))}
    </>  
  );
};
