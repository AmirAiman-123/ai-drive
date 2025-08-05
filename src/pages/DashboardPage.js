// File: AuraDrive/frontend/src/pages/DashboardPage.js (Corrected Version)

import React, { useState, Fragment } from 'react';
import { useAuth } from '../context/AuthContext';
import Drive from '../components/Drive';
import PasswordResetModal from '../components/PasswordResetModal';
import { Link } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';

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
    alert(
      "Aura AI Instructions:\n\n" +
      "You can ask Aura to:\n\n" +
      "1. Create: 'Create a folder for Lab Reports'\n" +
      "2. Delete: 'Delete the file old_logo.png'\n" +
      "3. Rename: 'Rename final.docx to Final Report.docx'\n" +
      "4. Move/Copy: 'Move all JPEGs into Photos'\n" +
      "5. Search: 'Find the document about machine learning'\n" +
      "6. Analyze: 'What's the total size of my project folder?'\n" +
      "7. Organize: 'Organize my recently uploaded files'\n" +
      "8. Cleanup: 'Help me free up space'"
    );
  };

  return (
    <>
      <PasswordResetModal isOpen={isModalOpen} closeModal={closeModal} />
      
      <div style={{ background: 'var(--background-light)', minHeight: '100vh' }}>
        <header style={{ 
          display: 'flex', justifyContent: 'space-between', alignItems: 'center',
          padding: '1rem 2rem', background: 'var(--surface-white)', 
          borderBottom: '1px solid var(--border-gray)', boxShadow: '0 2px 4px rgba(0,0,0,0.05)'
        }}>
          <h1 style={{ margin: 0, color: 'var(--primary-blue)', fontSize: '1.5rem' }}>AIDrive</h1>
          
          <div className="user-menu">
            <Menu as="div" style={{ position: 'relative', display: 'inline-block' }}>
              <div>
                <Menu.Button style={{ 
                    display: 'inline-flex', justifyContent: 'center', alignItems: 'center',
                    padding: '0.5rem', border: '1px solid var(--border-gray)', borderRadius: '8px', 
                    background: 'transparent', cursor: 'pointer'
                }}>
                  <span style={{ marginRight: '0.75rem' }}>{user?.email}</span>
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
                <Menu.Items style={{
                    position: 'absolute', right: 0, marginTop: '8px', width: '220px',
                    origin: 'top-right', backgroundColor: 'white',
                    borderRadius: '8px', boxShadow: '0 10px 15px -3px rgba(0,0,0,0.1)',
                    border: '1px solid var(--border-gray)', zIndex: 10, padding: '0.5rem',
                    listStyle: 'none'
                }}>
                  <Menu.Item>
                    {({ active }) => (
                      <button onClick={showAiInstructions} className={`menu-item ${active ? 'active' : ''}`}>Aura AI Help</button>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button onClick={openModal} className={`menu-item ${active ? 'active' : ''}`}>Reset My Password</button>
                    )}
                  </Menu.Item>
                  <div style={{ height: '1px', backgroundColor: 'var(--border-gray)', margin: '0.5rem 0' }} />
                  <Menu.Item>
                    {({ active }) => (
                      <button onClick={logout} className={`menu-item-logout ${active ? 'active' : ''}`}>Logout</button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>
          </div>
        </header>

        {/* --- THIS IS THE <main> SECTION TO BE REPLACED --- */}
        <main style={{ padding: '2rem' }}>
          <h2 style={{ fontSize: '1.75rem', color: 'var(--text-slate)', marginBottom: '2rem' }}>Your Worlds</h2>
          
          <div style={{ display: 'grid', gap: '1.5rem', gridTemplateColumns: 'repeat(auto-fill, minmax(350px, 1fr))' }}>
            
            <Link to="/drive/personal" style={{ textDecoration: 'none' }}>
              <Drive 
                title="My Personal Drive" 
                description="Private storage just for you." 
              />
            </Link>

            <Link to="/drive/community" style={{ textDecoration: 'none' }}>
              <Drive 
                title="Global Community Drive" 
                description="Collaborate with all students and staff." 
              />
            </Link>

            {(isStaff || isAdmin) && (
              <Link to="/drive/staff_only" style={{ textDecoration: 'none' }}>
                <Drive 
                  title="Staff-Only Drive" 
                  description="A private space for lecturer collaboration." 
                />
              </Link>
            )}

            {isAdmin && (
              <Link to="/admin" style={{ textDecoration: 'none' }}>
                <Drive 
                  title="Admin Control Tower" 
                  description="Manage users, view logs, and oversee the system."
                />
              </Link>
            )}

          </div>
        </main>
        {/* --- END OF <main> SECTION --- */}

      </div>
    </>
  );
};

export default DashboardPage;