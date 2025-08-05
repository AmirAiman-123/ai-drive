// File: AuraDrive/frontend/src/pages/AdminPage.js

import React, { useState, useEffect, useCallback } from 'react';
import api from '../api';
import { useAuth } from '../context/AuthContext';
//import { Navigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { Link, Navigate } from 'react-router-dom'; // Make sure Link is included


const AdminPage = () => {
  const { user } = useAuth();
  const [logs, setLogs] = useState([]);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchData = useCallback(async () => {
    try {
      // Fetch both sets of data at the same time
      const [logsResponse, usersResponse] = await Promise.all([
        api.get('/admin/logs'),
        api.get('/admin/users')
      ]);
      setLogs(logsResponse.data);
      setUsers(usersResponse.data);
    } catch (err) {
      setError('Failed to fetch admin data. You may not have permission.');
      console.error(err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleDeleteUser = async (userId, userEmail) => {
    if (window.confirm(`Are you sure you want to permanently delete user ${userEmail}? This cannot be undone.`)) {
      try {
        const response = await api.delete(`/admin/users/${userId}`);
        toast.success(response.data.message);
        fetchData(); // Refresh data after deleting
      } catch (err) {
        toast.error(err.response?.data?.error || 'Failed to delete user.');
      }
    }
  };

  const handleResetPassword = async (userId, userEmail) => {
    const newPassword = prompt(`Enter a new password for ${userEmail}:`);
    if (newPassword && newPassword.length >= 6) {
      if (window.confirm(`Are you sure you want to set this new password for ${userEmail}?`)) {
        try {
          const response = await api.post(`/admin/users/${userId}/set-password`, { password: newPassword });
          toast.success(response.data.message);
        } catch (err) {
          toast.error(err.response?.data?.error || 'Failed to set password.');
        }
      }
    } else if (newPassword) {
      alert("Password must be at least 6 characters long.");
    }
  };

  if (user?.role !== 'admin') return <Navigate to="/dashboard" />;
  if (loading) return <div>Loading Admin Panel...</div>;
  if (error) return <div style={{ color: 'red' }}>{error}</div>;

  return (
    <div style={{ padding: '2rem' }}>
      <h1>Admin Control Tower</h1>
      
      {/* User Management Table */}
      <h2 style={{marginTop: '2rem'}}>User Management</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse', marginBottom: '3rem' }}>
        <thead>
          <tr style={{ background: 'var(--background-light)' }}>
            <th style={tableHeaderStyle}>ID</th>
            <th style={tableHeaderStyle}>Email</th>
            <th style={tableHeaderStyle}>Role</th>
            <th style={tableHeaderStyle}>Matrick No.</th>
            <th style={tableHeaderStyle}>Actions</th>
          </tr>
        </thead>

        <tbody>
          {users.map(u => (
            <tr key={u.id} style={tableRowStyle}>
              <td style={tableCellStyle}>{u.id}</td>
              <td style={tableCellStyle}>{u.email}</td>
              <td style={tableCellStyle}>{u.role}</td>
              <td style={tableCellStyle}>{u.matrick_number || 'N/A'}</td>
              <td style={tableCellStyle}>
                {/* NEW "View Drive" BUTTON */}
                <Link to={`/drive/personal?user_id=${u.id}`} style={{...actionButtonStyle, background: '#e6f4ff', color: '#005a9e', textDecoration: 'none'}}>
                  View Drive
                </Link>
                <button onClick={() => handleResetPassword(u.id, u.email)} style={{...actionButtonStyle, background: '#fffbe6', color: '#d69e2e'}}>Reset PW</button>
                {user.id !== u.id && (
                  <button onClick={() => handleDeleteUser(u.id, u.email)} style={{...actionButtonStyle, background: '#fdecec', color: '#c53030'}}>Delete</button>
                )}
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Activity Log Table */}
      <h2>Recent Activity Log</h2>
      <table style={{ width: '100%', borderCollapse: 'collapse' }}>
        <thead>
          <tr style={{ background: 'var(--background-light)' }}>
            <th style={tableHeaderStyle}>Timestamp</th>
            <th style={tableHeaderStyle}>Email</th>
            <th style={tableHeaderStyle}>Action</th>
            <th style={tableHeaderStyle}>Details</th>
          </tr>
        </thead>
        <tbody>
          {logs.map(log => (
            <tr key={log.id} style={tableRowStyle}>
              <td style={tableCellStyle}>{log.timestamp}</td>
              <td style={tableCellStyle}>{log.user_email}</td>
              <td style={tableCellStyle}>{log.action}</td>
              <td style={tableCellStyle}>{log.details || 'N/A'}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

const tableHeaderStyle = { padding: '12px 15px', textAlign: 'left', borderBottom: '2px solid var(--primary-blue)' };
const tableRowStyle = { borderBottom: '1px solid var(--border-gray)' };
const tableCellStyle = { padding: '10px 15px', verticalAlign: 'middle' };
const actionButtonStyle = { marginLeft: '10px', padding: '5px 10px', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer', fontWeight: '500' };

export default AdminPage;