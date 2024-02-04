import React from 'react';
import { useState, useEffect } from 'react';
import axiosWithAuth from '../utils/axiosWithAuth';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);
  const [editFormData, setEditFormData] = useState({ username: '', age: '', address: '', phoneNumber: '' });

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      const axiosInstance = axiosWithAuth();
      const response = await axiosInstance.get('http://localhost:5000/admin/users');
      setUsers(response.data);
    } catch (error) {
      setError('Error fetching users');
    }
  };

  const handleDelete  = async (userId) => {
    try {
      const axiosInstance = axiosWithAuth();
      await axiosInstance.delete(`http://localhost:5000/admin/users/${userId}`);
      fetchUsers(); // Refresh user list
    } catch (error) {
      setError('Error deleting user');
    }
  };

  const handleEdit = (user) => {
    setEditingUserId(user._id);
    setEditFormData({ username: user.username, age: user.age, address: user.address, phoneNumber: user.phoneNumber });
  };

  const handleEditChange = (e) => {
    setEditFormData({ ...editFormData, [e.target.name]: e.target.value });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    try {
      const axiosInstance = axiosWithAuth();
      await axiosInstance.patch(`http://localhost:5000/admin/users/${editingUserId}`, editFormData);
      setEditingUserId(null);
      fetchUsers();
    } catch (error) {
      setError('Error updating user');
    }
  };

  return (
    <div>
       <h2>User Management</h2>
      {error && <p>{error}</p>}
      <table>
        <thead>
          <tr>
            <th>Username</th>
            <th>Age</th>
            <th>Address</th>
            <th>Phone Number</th>
            <th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {users.map(user => (
            <tr key={user._id}>
              {editingUserId === user._id ? (
                <td colSpan="4">
                  <form onSubmit={handleEditSubmit}>
                    <input
                      type="text"
                      name="username"
                      value={editFormData.username}
                      onChange={handleEditChange}
                    />
                    <input
                      type="number"
                      name="age"
                      value={editFormData.age}
                      onChange={handleEditChange}
                    />
                    <input
                      type="text"
                      name="address"
                      value={editFormData.address}
                      onChange={handleEditChange}
                    />
                    <input
                      type="number"
                      name="phoneNumber"
                      value={editFormData.phoneNumber}
                      onChange={handleEditChange}
                    />
                    <button type="submit">Save</button>
                    <button onClick={() => setEditingUserId(null)}>Cancel</button>
                  </form>
                </td>
              ) : (
                <>
                  <td>{user.username}</td>
                  <td>{user.age}</td>
                  <td>{user.address}</td>
                  <td>{user.phoneNumber}</td>
                  <td>
                    <button onClick={() => handleEdit(user)}>Edit</button>
                    <button onClick={() => handleDelete(user._id)}>Delete</button>
                  </td>
                </>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
