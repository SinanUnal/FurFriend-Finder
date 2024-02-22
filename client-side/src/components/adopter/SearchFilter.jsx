import React from 'react';
import { useState } from 'react';
import { TextField, FormControl, Select, MenuItem, Button, Box, Grid, Alert } from '@mui/material';

export default function SearchFilter({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');
  const [showAlert, setShowAlert] = useState(false);

  const handleSearch = () => {
    if (!filterType) {
      
      setShowAlert(true);
    } else {
      
      onSearch(searchTerm, filterType);
      setShowAlert(false); 
    }
  };

  return (
    <div>
      <Box sx={{ flexGrow: 1, margin: 2 }}>
      <Grid container spacing={2} alignItems="center">
        <Grid item xs={12} md={6} lg={4}>
          <TextField
            fullWidth
            type="text"
            label="Search..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            variant="outlined"
            size="small"
          />
        </Grid>
        <Grid item xs={12} md={3} lg={2}>
          <FormControl fullWidth size="small">
            <Select
              value={filterType}
              onChange={(e) => setFilterType(e.target.value)}
              displayEmpty
              variant="outlined"
            >
              <MenuItem value=""><em>Filter by Type</em></MenuItem>
              <MenuItem value="dog">Dog</MenuItem>
              <MenuItem value="cat">Cat</MenuItem>
              <MenuItem value="fish">Fish</MenuItem>
              <MenuItem value="bird">Bird</MenuItem>
              <MenuItem value="other">Other</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2} lg={1}>
          <Button 
            variant="contained" 
            color="primary" 
            onClick={handleSearch} 
            fullWidth
            size="medium"
            sx={{ padding: '6px 16px', fontSize: '0.875rem' }} 
          >
            Search
          </Button>
        </Grid>
      </Grid>
      {showAlert && (
          <Alert severity="warning" sx={{ marginTop: 2 }}>
            Choose the type of animal you are looking for.
          </Alert>
        )}

    </Box>
    </div>
  )
}
