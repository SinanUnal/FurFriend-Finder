import React from 'react';
import { useState, useEffect } from 'react';
import axiosWithAuth from '../utils/axiosWithAuth';
import {
  AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemText, Box, Button,
  Table, TableBody, TableCell, TableContainer, TableHead, TableRow, Paper, TextField
} from '@mui/material';
import { styled } from '@mui/material/styles';
import MenuIcon from '@mui/icons-material/Menu';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import SaveIcon from '@mui/icons-material/Save';
import CancelIcon from '@mui/icons-material/Cancel';
import { useTheme } from '@mui/material/styles';
import { useMediaQuery } from '@mui/material';
import './UserManagement.css';
import { Link } from 'react-router-dom';

export default function UserManagement() {
  const [users, setUsers] = useState([]);
  const [error, setError] = useState('');
  const [editingUserId, setEditingUserId] = useState(null);
  const [editFormData, setEditFormData] = useState({ username: '', age: '', address: '', phoneNumber: '' });

  
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const [drawerOpen, setDrawerOpen] = React.useState(false);

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


  const menuItems = [
   
    { text: 'Admin Dashboard', path: '/admin-dashboard'},
    { text: 'Reports', path: '/admin-dashboard/reports'},
    { text: 'Pending Approvals', path: '/admin-dashboard/pending-approvals'}
    
  ];

  const buttonStyle = {
    fontWeight: 'bold',
    textTransform: 'none',
    fontFamily: 'Arial, sans-serif',
    fontSize: '1rem',
    margin: '0 10px',
  };

  const titleStyle = {
    textAlign: 'center',
    fontFamily: '"Roboto", "Helvetica", "Arial", sans-serif', 
    color: '#3f51b5', 
    backgroundColor: '#f5f5f5', 
    padding: '10px 0',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)', 
    margin: '20px 0',
    borderRadius: '4px',
  };

  const tableStyle = {
    marginTop: '20px',
    backgroundColor: 'rgba(255, 255, 255, 0.95)'
  };

  const HeaderTableCell = styled(TableCell)(({ theme }) => ({
    fontWeight: 'bold',
    fontSize: '1.1rem', 
    boxShadow: '0px 2px 4px rgba(0, 0, 0, 0.1)',
    backgroundColor: theme.palette.background.paper, 
  }));


  return (
    <div>
       <AppBar position="static" sx={{ backgroundColor: '#000' }}>
        <Toolbar>
          {isMobile && (
            <IconButton edge="start" color="inherit" aria-label="menu" onClick={() => setDrawerOpen(true)}>
              <MenuIcon />
            </IconButton>
          )}
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            User Management
          </Typography>
          {!isMobile && (
            <Box sx={{ display: 'flex', marginLeft: 'auto' }}>
              {menuItems.map((item, index) => (
                <Button key={index} color="inherit" component={Link} to={item.path} sx={buttonStyle} onClick={item.action}>
                  {item.text}
                </Button>
              ))}
            </Box>
          )}
        </Toolbar>
      </AppBar>

      <Drawer anchor="left" open={drawerOpen} onClose={() => setDrawerOpen(false)}>
        <Box sx={{ width: 250 }} role="presentation" onClick={() => setDrawerOpen(false)} onKeyDown={() => setDrawerOpen(false)}>
          <List>
            {menuItems.map((item, index) => (
              <ListItem button key={index} component={Link} to={item.path} >
                <ListItemText primary={item.text} />
              </ListItem>
            ))}
          </List>
        </Box>
      </Drawer>


      <div className="management-main-container">
      <Box
          display="flex"
          justifyContent="center"
          width="100%"
          my={4}
          p={2} 
          style={{
            backgroundColor: '#f0f0f0', 
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.2)', 
            borderRadius: '4px', 
          }}
        >
          <Typography
            variant="h4"
            component="h2"
            style={{
              textAlign: 'center',
              fontWeight: 'bold', 
            }}
          >
           User management
          </Typography>
        </Box>
        
        <TableContainer component={Paper} style={tableStyle}>
          <Table >
            <TableHead >
              <TableRow>
                <HeaderTableCell>Username</ HeaderTableCell>
                <HeaderTableCell>Age</HeaderTableCell>
                <HeaderTableCell>Address</HeaderTableCell>
                <HeaderTableCell>Phone Number</HeaderTableCell>
                <HeaderTableCell>Actions</HeaderTableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {users.map(user => (
                <TableRow key={user._id}>
                  {editingUserId === user._id ? (
                    <TableCell colSpan="5">
                      <form onSubmit={handleEditSubmit} style={{ display: 'flex', justifyContent: 'space-around' }}>
                        <TextField
                          label="Username"
                          name="username"
                          value={editFormData.username}
                          onChange={handleEditChange}
                        />
                        <TextField
                          label="Age"
                          type="number"
                          name="age"
                          value={editFormData.age}
                          onChange={handleEditChange}
                        />
                        <TextField
                          label="Address"
                          name="address"
                          value={editFormData.address}
                          onChange={handleEditChange}
                        />
                        <TextField
                          label="Phone Number"
                          type="tel"
                          name="phoneNumber"
                          value={editFormData.phoneNumber}
                          onChange={handleEditChange}
                        />
                        <IconButton color="primary" type="submit">
                          <SaveIcon />
                        </IconButton>
                        <IconButton color="secondary" onClick={() => setEditingUserId(null)}>
                          <CancelIcon />
                        </IconButton>
                      </form>
                    </TableCell>
                  ) : (
                    <>
                      <TableCell>{user.username}</TableCell>
                      <TableCell>{user.age}</TableCell>
                      <TableCell>{user.address}</TableCell>
                      <TableCell>{user.phoneNumber}</TableCell>
                      <TableCell>
                        <IconButton color="primary" onClick={() => handleEdit(user)}>
                          <EditIcon />
                        </IconButton>
                        <IconButton color="secondary" onClick={() => handleDelete(user._id)}>
                          <DeleteIcon />
                        </IconButton>
                      </TableCell>
                    </>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </div>

    </div>
  );
}
