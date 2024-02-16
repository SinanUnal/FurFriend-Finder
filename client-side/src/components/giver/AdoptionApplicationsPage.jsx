import React from 'react';
import GiverApplications from './GiverApplications';
import { useParams } from 'react-router-dom';

export default function AdoptionApplicationsPage() {
  const { userId } = useParams();
  console.log("UserId in AdoptionApplicationsPage:", userId);
  
  return (
    <div>
      <h2>Adoption Applications</h2>
      <GiverApplications giverId={userId} />
      {/* <ChatComponent giverId={userId}/>; */}
    </div>
  )
}
