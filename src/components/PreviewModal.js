// File: AuraDrive/frontend/src/components/PreviewModal.js (Definitive Final Version)

import React, { useState, useEffect } from 'react';
import { Dialog } from '@headlessui/react';
import { motion, AnimatePresence } from 'framer-motion';
import api from '../api';

const PreviewModal = ({ item, onClose }) => {
  const [content, setContent] = useState({ type: 'loading', data: null });

  useEffect(() => {
    // Reset content state when a new item is selected or modal is closed
    if (!item) {
      setContent({ type: 'loading', data: null });
      return;
    }

    const fileUrl = `${api.defaults.baseURL || ''}/api/files/${item.id}/serve`;
    const fileType = item.filetype || '';

    if (fileType.startsWith('image/')) {
      setContent({ type: 'image', data: fileUrl });
    } else if (fileType.startsWith('video/')) {
      setContent({ type: 'video', data: fileUrl });
    } else if (fileType.startsWith('audio/')) {
      setContent({ type: 'audio', data: fileUrl });
    } else if (fileType === 'application/pdf') {
      // --- THIS IS THE PDF FIX ---
      // Fetch the PDF as a blob to include auth headers
      api.get(fileUrl, { responseType: 'blob' })
        .then(response => {
          const blobUrl = window.URL.createObjectURL(new Blob([response.data], { type: 'application/pdf' }));
          setContent({ type: 'pdf', data: blobUrl });
        })
        .catch(() => setContent({ type: 'unsupported', data: null }));
    } else if (fileType.startsWith('text/')) {
      api.get(fileUrl)
        .then(response => setContent({ type: 'text', data: response.data }))
        .catch(() => setContent({ type: 'text', data: 'Could not load file content.' }));
    } else {
      setContent({ type: 'unsupported', data: null });
    }

    // Cleanup blob URL on component unmount or when item changes
    return () => {
      if (content.type === 'pdf' && content.data) {
        window.URL.revokeObjectURL(content.data);
      }
    };
  }, [item]); // Rerun this effect whenever the 'item' prop changes

  const renderContent = () => {
    if (!item) return null;

    switch (content.type) {
      case 'image':
        return <img src={content.data} alt={item.filename} style={{ maxWidth: '100%', maxHeight: '80vh', objectFit: 'contain' }} />;
      case 'pdf':
        return <iframe src={content.data} title={item.filename} style={{ width: '100%', height: '80vh', border: 'none' }} />;
      case 'video':
        return <video src={content.data} controls style={{ maxWidth: '100%', maxHeight: '80vh' }} />;
      case 'audio':
        return <audio src={content.data} controls />;
      case 'text':
        return <pre style={{ whiteSpace: 'pre-wrap', wordBreak: 'break-all', backgroundColor: '#f7f9fc', padding: '1rem', borderRadius: '8px' }}>{content.data}</pre>;
      case 'loading':
        return <div style={{ padding: '2rem', textAlign: 'center' }}>Loading preview...</div>;
      default: // 'unsupported'
        const downloadUrl = `${api.defaults.baseURL || ''}/api/files/${item.id}/download`;
        return (
          <div style={{ textAlign: 'center', padding: '2rem' }}>
            <div style={{ fontSize: '4rem' }}>❔</div>
            <h2>No Preview Available</h2>
            <p>Preview is not available for '{item.filename}'.</p>
            <a href={downloadUrl} download={item.filename} className="download-button">Download File</a>
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
                  <Dialog.Title as="h3" style={{ fontSize: '1.2rem', fontWeight: '600', color: 'var(--text-slate)', margin: '0 0 1rem 0', padding: '0 1rem' }}>
                    {item?.filename}
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