import React, { useState, useEffect } from 'react';
import axiosWithAuth from '../utils/axiosWithAuth';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { storage} from '../../firebase';
import { useParams } from 'react-router-dom';


const UserProfile = () => {
  const { userId } = useParams();
  const [userProfile, setUserProfile] = useState({ profilePicture: '',
  username: '', 
  age: '',
  address: '',
  phoneNumber: '',
  userType: '',
 });
  const [file, setFile] = useState(null);
  const [isEditMode, setIsEditMode] = useState(false);

  useEffect(() => {
    if (!userId) return;

    const fetchUserProfile = async () => {
      try {
        const axiosInstance = axiosWithAuth();
        const response = await axiosInstance.get(`http://localhost:5000/user/profile/${userId}`);
        setUserProfile(response.data);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };

    fetchUserProfile();
  }, [userId]);

  const handleImageUpload = async () => {
    if (!file) return;
    const storageRef = ref(storage, `profileImages/${userId}/${file.name}`);
    await uploadBytes(storageRef, file);
    const fileUrl = await getDownloadURL(storageRef);
    setUserProfile({ ...userProfile, profilePicture: fileUrl });
  };

  const handleRemoveProfilePicture = async () => {
    const storageRef = ref(storage, userProfile.profilePicture);
    await deleteObject(storageRef);
    setUserProfile({ ...userProfile, profilePicture: '' });
  }

  const handleProfileUpdate = async () => {
    try {
      const axiosInstance = axiosWithAuth();
      await axiosInstance.patch(`http://localhost:5000/user/profile/${userId}`, userProfile);
      alert('Profile updated successfully');
    } catch (error) {
      console.error('Error updating profile:', error);
      alert('Error updating profile');
    }
  };

  const handleChange = (event) => {
    const { name, value } = event.target;
    setUserProfile({ ...userProfile, [name]: value });
  };

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
  };

  return (
    <div>
    <h2>User Profile</h2>
    {userProfile.profilePicture && (
      <img src={userProfile.profilePicture} alt="Profile" />
    )}

    {isEditMode ? (
      <>
        {userProfile.profilePicture && (
          <button onClick={handleRemoveProfilePicture}>Remove Profile Picture</button>
        )}
        <input type="file" onChange={(e) => setFile(e.target.files[0])} />
        <button onClick={handleImageUpload} disabled={!file}>Upload Image</button>

        <input type="text" name="username" value={userProfile.username} onChange={handleChange} />
        <input type="number" name="age" value={userProfile.age} onChange={handleChange} />
        <input type="text" name="address" value={userProfile.address} onChange={handleChange} />
        <input type="text" name="phoneNumber" value={userProfile.phoneNumber} onChange={handleChange} />
        <input type="text" name="userType" value={userProfile.userType} onChange={handleChange} disabled />
        <button onClick={handleProfileUpdate}>Save Profile</button>
      </>
    ) : (
      <>
        <p>Username: {userProfile.username}</p>
        <p>Age: {userProfile.age}</p>
        <p>Address: {userProfile.address}</p>
        <p>Phone Number: {userProfile.phoneNumber}</p>
        <p>User Type: {userProfile.userType}</p>
        <button onClick={toggleEditMode}>Edit Profile</button>
      </>
    )}
  </div>
    // <div>
    //  <h2>User Profile</h2>
    //   {userProfile.profilePicture ? (
    //     <>
    //       <img src={userProfile.profilePicture} alt="Profile" />
    //       <button onClick={handleRemoveProfilePicture}>Remove Profile Picture</button>
    //     </>
    //   ) : (
    //     <input type="file" onChange={(e) => setFile(e.target.files[0])} />
    //   )}
    //   <button onClick={handleImageUpload} disabled={!file}>Upload Image</button>

    //   <input
    //     type="text"
    //     name="username"
    //     value={userProfile.username}
    //     onChange={handleChange}
    //     placeholder="Username"
    //   />
    //   <input
    //     type="number"
    //     name="age"
    //     value={userProfile.age}
    //     onChange={handleChange}
    //     placeholder="Age"
    //   />
    //   <input
    //     type="text"
    //     name="address"
    //     value={userProfile.address}
    //     onChange={handleChange}
    //     placeholder="Address"
    //   />
    //   <input
    //     type="text"
    //     name="phoneNumber"
    //     value={userProfile.phoneNumber}
    //     onChange={handleChange}
    //     placeholder="Phone Number"
    //   />
    //   <input
    //     type="text"
    //     name="userType"
    //     value={userProfile.userType}
    //     onChange={handleChange}
    //     placeholder="User Type"
    //     disabled 
    //   />
    //   <button onClick={handleProfileUpdate}>Update Profile</button>

    // </div>
  );
};

export default UserProfile;

