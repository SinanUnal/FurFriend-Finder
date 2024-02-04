import React from 'react';
import { useState, useEffect } from 'react';
import axiosWithAuth from '../utils/axiosWithAuth';

export default function Reports() {
  const [reportData, setReportData] = useState({});
  const [error, setError] = useState('');

  useEffect(() => {
    fetchReportData();
  }, []);

  const fetchReportData = async () => {
    try {
      const axiosInstance = axiosWithAuth();
      const response = await axiosInstance.get('http://localhost:5000/admin/reports');
      setReportData(response.data);
    } catch (error) {
      setError('Error fetching report data');
    }
  };

  return (
    <div>
      <h2>Reports and Analytics</h2>
      {error && <p>{error}</p>}
      <div>
        <p>Active Users: {reportData.activeUsers}</p>
        <p>Total Adoptions: {reportData.totalAdoptions}</p>
      </div>
    </div>
  )
}
