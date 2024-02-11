import React from 'react';
import { useState } from 'react';

export default function SearchFilter({ onSearch }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('');

  const handleSearch = () => {
    onSearch(searchTerm, filterType);
  };

  return (
    <div>
       <input 
        type="text" 
        placeholder="Search by name..." 
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)} 
      />
      <select onChange={(e) => setFilterType(e.target.value)} value={filterType}>
        <option value="">Filter by Type</option>
        <option value="dog">Dog</option>
        <option value="cat">Cat</option>
        <option value="fish">Fish</option>
        <option value="bird">Bird</option>
        <option value="other">Other</option>
        {/* Add more animal types as options */}
      </select>
      <button onClick={handleSearch}>Search</button>
    </div>
  )
}
