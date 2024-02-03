import React from 'react';

export default function GiverDashboardStats({ dashboardData }) {
 
  return (
    <div>
         <h1>Welcome {dashboardData.userName}</h1>
            <p>Active Submissions: {dashboardData.activeSubmission}</p>
            <p>Pending Approvals: {dashboardData.pendingApprovals}</p>
            <p>Successful Adoptions: {dashboardData.successfulAdoption}</p>
            {/* {error && <p>{error}</p>} */}
    </div>
  )
}
