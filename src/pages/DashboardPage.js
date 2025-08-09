// File: AuraDrive/frontend/src/pages/DashboardPage.js (Definitive Final Version)

import React, { useState, Fragment } from 'react';
import { useAuth } from '../context/AuthContext';
import Drive from '../components/Drive';
import PasswordResetModal from '../components/PasswordResetModal';
import { Link } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import { motion } from 'framer-motion'; // Import motion

function MenuIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 6.75h16.5M3.75 12h16.5m-16.5 5.25h16.5" />
    </svg>
  );
}

const DashboardPage = () => {
  const { user, logout } = useAuth();
  const [isModalOpen, setIsModalOpen] = useState(false);

  const isAdmin = user?.role === 'admin';
  const isStaff = user?.role === 'staff';

  const openModal = () => setIsModalOpen(true);
  const closeModal = () => setIsModalOpen(false);

  const showAiInstructions = () => {
    alert("AI Instructions: Ask me to create folders, rename items, delete, search, and more!");
  };

  // Animation variants for Framer Motion
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { 
      y: 0, 
      opacity: 1,
      transition: { type: 'spring', stiffness: 100 }
    }
  };

  return (
    <>
      <PasswordResetModal isOpen={isModalOpen} closeModal={closeModal} />
      
      {/* The main container no longer needs an opaque background color */}
      <div style={{ minHeight: '100vh' }}>
        <header style={{
          padding: '1rem 2.5rem',
          background: 'linear-gradient(to right, var(--surface-dark), var(--background-dark))', // Gradient background
          borderBottom: '1px solid var(--border-color)',
          boxShadow: '0 5px 25px rgba(0, 0, 0, 0.2), 0 0 15px -5px var(--primary-glow)', // Glowing effect
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          position: 'sticky',
          top: 0,
          zIndex: 50
        }}>
          <h1 style={{ 
            margin: 0, 
            fontSize: '1.75rem', 
            fontWeight: '700',
            background: 'linear-gradient(to right, var(--primary-glow), var(--primary-accent))',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            AIDrive
          </h1>
          <div className="user-menu">
            <Menu as="div" style={{ position: 'relative', display: 'inline-block' }}>
              <div>
                <Menu.Button className="user-menu-button">
  <span className="user-email-display">{user?.email}</span> {/* <-- ADD className HERE */}
                  <MenuIcon style={{ width: '1.25rem', height: '1.25rem' }} />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items className="user-menu-items">
                  <Menu.Item>
                    {({ active }) => (<button onClick={showAiInstructions} className={`menu-item ${active ? 'active' : ''}`}>DriveAi Help</button>)}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (<button onClick={openModal} className={`menu-item ${active ? 'active' : ''}`}>Reset My Password</button>)}
                  </Menu.Item>
                  <div style={{ height: '1px', backgroundColor: 'var(--border-color)', margin: '0.5rem 0' }} />
                  <Menu.Item>
                    {({ active }) => (<button onClick={logout} className={`menu-item-logout ${active ? 'active' : ''}`}>Logout</button>)}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </header>

        <main style={{ padding: '2rem 2.5rem', maxWidth: '1200px', margin: '0 auto' }}>
          <h2 style={{ 
            fontSize: '2.5rem', 
            fontWeight: '700',
            marginBottom: '2.5rem',
            background: 'linear-gradient(to right, var(--primary-glow), #fff)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent'
          }}>
            Your Worlds
          </h2>
          
          <motion.div 
            style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            <motion.div variants={cardVariants}>
              <Link to="/drive/personal" style={{ textDecoration: 'none' }}>
                <Drive title="My Personal Drive" description="Private storage just for you." />
              </Link>
            </motion.div>

            <motion.div variants={cardVariants}>
              <Link to="/drive/community" style={{ textDecoration: 'none' }}>
                <Drive title="Global Community Drive" description="Collaborate with all students and staff." />
              </Link>
            </motion.div>

            {(isStaff || isAdmin) && (
              <motion.div variants={cardVariants}>
                <Link to="/drive/staff_only" style={{ textDecoration: 'none' }}>
                  <Drive title="Staff-Only Drive" description="A private space for lecturer collaboration." />
                </Link>
              </motion.div>
            )}

            {isAdmin && (
              <motion.div variants={cardVariants}>
                <Link to="/admin" style={{ textDecoration: 'none' }}>
                  <Drive title="Admin Control Tower" description="Manage users, view logs, and oversee the system." />
                </Link>
              </motion.div>
            )}
          </motion.div>
        </main>
      </div>
    </>
  );
};

export default DashboardPage;