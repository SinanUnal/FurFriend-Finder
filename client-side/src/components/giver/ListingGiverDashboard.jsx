import React from 'react'

export default function ListingGiverDashboard({ listing, onEdit, onDelete }) {
  return (
    <div>
      <h3>{listing.animalName}</h3>
      {listing.imageUrl && (
        <img 
          src={listing.imageUrl} 
          alt={`Image of ${listing.animalName}`} 
          style={{ maxWidth: '100%', height: 'auto' }} 
        />
      )}
      <p>Age: {listing.animalAge}</p>
      <p>Type: {listing.animalType}</p>
      <p>Health Info: {listing.healthInfo}</p>
      <button onClick={() => onEdit(listing)}>Edit</button>
      <button onClick={() => onDelete(listing._id)}>Delete</button>
    </div>
  )
}
