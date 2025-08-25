// File: AuraDrive/frontend/src/components/PreviewModal.js (Definitive Final Version)

import React, { Fragment, useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';

const PreviewModal = ({ item, onClose }) => {
  // A single state to hold the content type and the data URL
  const [content, setContent] = useState({ type: 'loading', data: null, filename: '' });

  useEffect(() => {
    let objectUrl = null; // Variable to hold the blob URL for cleanup

    const fetchContent = async () => {
      if (!item) return;

      setContent({ type: 'loading', data: null, filename: item.filename });
      // Use a relative URL, which our api.js will correctly proxy
      const fileUrl = `/api/files/${item.id}/serve`;
      const fileType = item.filetype || '';

      try {
        // Use the authenticated axios instance to fetch the file as a 'blob'
        const response = await api.get(fileUrl, { responseType: 'blob' });
        
        // Create a temporary, local URL from the downloaded data
        objectUrl = window.URL.createObjectURL(response.data);
        
        // Now, set the content state with the correct type and the secure blob URL
        if (fileType.startsWith('image/')) {
          setContent({ type: 'image', data: objectUrl, filename: item.filename });
        } else if (fileType.startsWith('video/')) {
          setContent({ type: 'video', data: objectUrl, filename: item.filename });
        } else if (fileType.startsWith('audio/')) {
          setContent({ type: 'audio', data: objectUrl, filename: item.filename });
        } else if (fileType === 'application/pdf') {
          setContent({ type: 'pdf', data: objectUrl, filename: item.filename });
        } else {
          // For text files, we can make a separate request or treat as unsupported for now
          setContent({ type: 'unsupported', data: null, filename: item.filename });
        }
      } catch (error) {
        console.error("Preview fetch failed:", error);
        setContent({ type: 'unsupported', data: null, filename: item.filename });
      }
    };

    fetchContent();

    // This is the cleanup function that runs when the modal is closed
    return () => {
      if (objectUrl) {
        window.URL.revokeObjectURL(objectUrl);
      }
    };
  }, [item]); // This effect only re-runs when the 'item' prop changes

  const renderContent = () => {
    if (!item) return null;
    switch (content.type) {
      case 'image':
        return <img src={content.data} alt={content.filename} style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }} />;
      case 'pdf':
        return <iframe src={content.data} title={content.filename} style={{ width: '100%', height: '80vh', border: 'none' }} />;
      case 'video':
        return <video src={content.data} controls autoPlay style={{ maxWidth: '100%', maxHeight: '80vh' }} />;
      case 'audio':
        return <audio src={content.data} controls autoPlay style={{width: '90%', margin: '2rem auto'}} />;
      case 'loading':
        return <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-primary)' }}>Loading Preview...</div>;
      default: // 'unsupported' or text files
        const downloadUrl = `/api/files/${item.id}/download`; // Relative URL
        return (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '4rem' }}>❔</div>
            <h2>No Preview Available</h2>
            <p>Preview is not available for '{content.filename}'.</p>
            <a href={downloadUrl} download={content.filename} className="download-button">Download File</a>
          </div>
        );
    }
  };
  
  const backdropVariants = { hidden: { opacity: 0 }, visible: { opacity: 1 } };
  const modalVariants = { hidden: { opacity: 0, y: 30, scale: 0.95 }, visible: { opacity: 1, y: 0, scale: 1, transition: { type: "spring", stiffness: 300, damping: 30 } }, exit: { opacity: 0, scale: 0.95, transition: { duration: 0.2 } } };

  return (
    <AnimatePresence>
      {item && (
        <Dialog open={!!item} as="div" style={{ position: 'relative', zIndex: 50 }} onClose={onClose}>
          <motion.div style={{ position: 'fixed', inset: 0, backgroundColor: 'rgba(0, 0, 0, 0.75)' }} variants={backdropVariants} initial="hidden" animate="visible" exit="hidden" />
          <div style={{ position: 'fixed', inset: 0, overflowY: 'auto' }}>
            <div style={{ display: 'flex', minHeight: '100%', alignItems: 'center', justifyContent: 'center', padding: '1rem' }}>
              <motion.div variants={modalVariants} initial="hidden" animate="visible" exit="exit">
                <Dialog.Panel className="preview-modal-panel" style={{ width: '100%', maxWidth: '80vw', borderRadius: '12px', padding: '1rem', overflow: 'hidden' }}>
                  <Dialog.Title as="h3" style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-primary)', margin: '0 0 1rem 0', padding: '0 1rem', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {item.filename}
                  </Dialog.Title>
                  {renderContent()}
                </Dialog.Panel>
              </motion.div>
            </div>
          </div>
        </Dialog>
      )}
    </AnimatePresence>
  );
};

export default PreviewModal;