// File: AuraDrive/frontend/src/components/PasswordResetModal.js

import React, { useState, Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import api from '../api';
import { toast } from 'react-toastify';

const PasswordResetModal = ({ isOpen, closeModal }) => {
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(''); // Clear previous errors

    if (newPassword !== confirmPassword) {
      setError("New passwords do not match.");
      return;
    }
    if (newPassword.length < 6) {
      setError("New password must be at least 6 characters long.");
      return;
    }

    try {
      const response = await api.post('/auth/reset-password', {
        currentPassword,
        newPassword
      });
      toast.success(response.data.message);
      handleClose(); // Close the modal on success
    } catch (err) {
      setError(err.response?.data?.error || "An error occurred.");
    }
  };

  const handleClose = () => {
    // Reset all fields when closing the modal
    setCurrentPassword('');
    setNewPassword('');
    setConfirmPassword('');
    setError('');
    closeModal();
  };

  return (
    <Transition appear show={isOpen} as={Fragment}>
      <Dialog as="div" style={{ position: 'relative', zIndex: 10 }} onClose={handleClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.5)' }} />
        </Transition.Child>

        <div style={{ position: 'fixed', inset: 0, overflowY: 'auto' }}>
          <div style={{ display: 'flex', minHeight: '100%', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel style={{ 
                  width: '100%', maxWidth: '450px', transform: 'translateY(0)', 
                  backgroundColor: 'white', borderRadius: '12px', padding: '2rem',
                  boxShadow: '0 25px 50px -12px rgba(0,0,0,0.25)',
                  textAlign: 'left'
              }}>
                <Dialog.Title as="h3" style={{ fontSize: '1.5rem', fontWeight: '600', color: 'var(--text-slate)', margin: '0 0 1rem 0' }}>
                  Reset Your Password
                </Dialog.Title>
                
                <form onSubmit={handleSubmit}>
                  <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                    <input 
                      type="password" 
                      placeholder="Current Password" 
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      required
                      style={inputStyle}
                    />
                    <input 
                      type="password" 
                      placeholder="New Password" 
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      required
                      style={inputStyle}
                    />
                    <input 
                      type="password" 
                      placeholder="Confirm New Password" 
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      required
                      style={inputStyle}
                    />
                  </div>
                  
                  {error && <p style={{ color: 'red', marginTop: '1rem', fontSize: '0.9rem' }}>{error}</p>}
                  
                  <div style={{ marginTop: '2rem', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
                    <button type="button" onClick={handleClose} style={{...buttonStyle, background: 'var(--background-light)', color: 'var(--text-slate)'}}>
                      Cancel
                    </button>
                    <button type="submit" style={{...buttonStyle, background: 'var(--primary-blue)', color: 'white'}}>
                      Update Password
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition>
  );
};

// Reusable styles for inputs and buttons
const inputStyle = { padding: '0.75rem 1rem', borderRadius: '8px', border: '1px solid var(--border-gray)', fontSize: '1rem' };
const buttonStyle = { padding: '0.6rem 1.2rem', border: 'none', borderRadius: '8px', cursor: 'pointer', fontWeight: '500' };

export default PasswordResetModal;