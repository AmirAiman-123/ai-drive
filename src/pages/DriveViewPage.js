// File: AuraDrive/frontend/src/pages/DriveViewPage.js (Definitive Final Version with Copy/Paste)

import React, { useState, useEffect, useCallback } from 'react';
import { useParams, Link, useLocation, useNavigate } from 'react-router-dom';
import { useDropzone } from 'react-dropzone';
import { toast } from 'react-toastify';
import api from '../api';
import ContextMenu, { ContextMenuItem } from '../components/ContextMenu';
import PreviewModal from '../components/PreviewModal';
import { useAppContext } from '../context/AppContext'; // Import AppContext
import './DriveViewPage.css';
import DriveAi from '../components/DriveAi';


// Helper component for the 3-dot icon
function MoreOptionsIcon(props) {
  return (
    <svg {...props} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 12.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5ZM12 18.75a.75.75 0 1 1 0-1.5.75.75 0 0 1 0 1.5Z" />
    </svg>
  );
}

const DriveViewPage = () => {
  const { scope } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { clipboard, setClipboardContents, clearClipboard } = useAppContext();
  const [items, setItems] = useState([]);
  const [breadcrumbs, setBreadcrumbs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [contextMenu, setContextMenu] = useState({ show: false, x: 0, y: 0, itemId: null, itemType: null });
  const [previewItem, setPreviewItem] = useState(null);
  const [selectedItems, setSelectedItems] = useState(new Set());

  const fetchItems = useCallback(async () => {
    if (!scope) return;
    setLoading(true);
    try {
      const searchParams = new URLSearchParams(location.search);
      const parentId = searchParams.get('parent_id');
      const userId = searchParams.get('user_id');
      let apiUrl = `/api/files/${scope}`;
      const params = new URLSearchParams();
      if (parentId) params.append('parent_id', parentId);
      if (userId) params.append('user_id', userId);
      const queryString = params.toString();
      if (queryString) apiUrl += `?${queryString}`;
      const response = await api.get(apiUrl);
      setItems(response.data);
      if (parentId) {
        const breadcrumbResponse = await api.get(`/api/files/breadcrumbs/${parentId}`);
        setBreadcrumbs(breadcrumbResponse.data);
      } else {
        setBreadcrumbs([]);
      }
    } catch (error) {
      toast.error(`Failed to load items from ${scope} drive.`);
    } finally {
      setLoading(false);
    }
  }, [scope, location.search]);

  useEffect(() => {
    fetchItems();
    setSelectedItems(new Set());
  }, [fetchItems]);

  const onDrop = useCallback(async (acceptedFiles) => {
    const searchParams = new URLSearchParams(location.search);
    const parentId = searchParams.get('parent_id');
    for (const file of acceptedFiles) {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('scope', scope);
      if (parentId) formData.append('parent_id', parentId);
      try {
        await api.post('/api/files/upload', formData, { headers: { 'Content-Type': 'multipart/form-data' } });
        toast.success(`'${file.name}' uploaded successfully.`);
      } catch (error) {
        toast.error(error.response?.data?.error || `'${file.name}' upload failed.`);
      }
    }
    fetchItems();
  }, [scope, fetchItems, location.search]);

  const handleCreateFolder = useCallback(async () => {
    const folderName = prompt("Enter a name for the new folder:");
    if (folderName) {
      const searchParams = new URLSearchParams(location.search);
      const parentId = searchParams.get('parent_id');
      try {
        await api.post('/api/files/folder', { name: folderName, scope: scope, parent_id: parentId });
        toast.success(`Folder '${folderName}' created.`);
        fetchItems();
      } catch (error) {
        toast.error(error.response?.data?.error || "Failed to create folder.");
      }
    }
  }, [scope, fetchItems, location.search]);

  const handleContextMenu = useCallback((e, itemId, itemType) => {
    e.preventDefault();
    e.stopPropagation();
    if (!selectedItems.has(itemId)) {
      setSelectedItems(new Set([itemId]));
    }
    const x = e.pageX;
    const y = e.pageY;
    setContextMenu({ show: true, x, y, itemId, itemType });
  }, [selectedItems]);

  const closeContextMenu = useCallback(() => {
    setContextMenu(prev => ({ ...prev, show: false }));
  }, []);

  useEffect(() => {
    document.addEventListener('click', closeContextMenu);
    return () => document.removeEventListener('click', closeContextMenu);
  }, [closeContextMenu]);

  const handlePreview = useCallback((itemId) => {
    const itemToPreview = items.find(i => i.id === itemId);
    if (itemToPreview && itemToPreview.type === 'file') {
      setPreviewItem(itemToPreview);
    }
  }, [items]);

  const closePreviewModal = () => {
    setPreviewItem(null);
  };

  const handleDeleteItem = useCallback(async () => {
    if (selectedItems.size === 0) return;
    if (window.confirm(`Are you sure you want to delete ${selectedItems.size} item(s)? This action cannot be undone.`)) {
      try {
        // In a real app, you might want a dedicated endpoint for batch deletes.
        // For now, we delete one by one.
        for (const itemId of selectedItems) {
            await api.delete(`/api/files/${itemId}`);
        }
        toast.success(`${selectedItems.size} item(s) deleted successfully.`);
        fetchItems();
      } catch (error) {
        toast.error(error.response?.data?.error || `Failed to delete items.`);
      }
    }
  }, [selectedItems, fetchItems]);

  const handleRenameItem = useCallback(async () => {
    if (selectedItems.size !== 1) {
        toast.info("Please select a single item to rename.");
        return;
    }
    const itemId = selectedItems.values().next().value;
    const currentItem = items.find(i => i.id === itemId);
    if (!currentItem) return;
    const newName = prompt("Enter a new name:", currentItem.filename);
    if (newName && newName !== currentItem.filename) {
      try {
        await api.patch(`/api/files/${itemId}/rename`, { newName });
        toast.success("Item renamed successfully.");
        fetchItems();
      } catch (error) {
        toast.error(error.response?.data?.error || "Failed to rename item.");
      }
    }
  }, [selectedItems, items, fetchItems]);

  const handleDownloadFile = useCallback(() => {
    if (selectedItems.size !== 1) {
        toast.info("Please select a single file to download.");
        return;
    }
    const itemId = selectedItems.values().next().value;
    const item = items.find(i => i.id === itemId);
    if (item && item.type !== 'file') {
      toast.error("You can only download files.");
      return;
    }
    api.get(`/api/files/${itemId}/download`, { responseType: 'blob' }).then(response => { const filename = item ? item.filename : 'download'; const url = window.URL.createObjectURL(new Blob([response.data])); const link = document.createElement('a'); link.href = url; link.setAttribute('download', filename); document.body.appendChild(link); link.click(); link.parentNode.removeChild(link); window.URL.revokeObjectURL(url); }).catch(() => toast.error("Download failed."));
  }, [selectedItems, items]);
  
  const handleItemClick = (e, item) => {
    e.stopPropagation();
    if (e.ctrlKey || e.metaKey) {
      setSelectedItems(prev => {
        const newSelection = new Set(prev);
        if (newSelection.has(item.id)) {
          newSelection.delete(item.id);
        } else {
          newSelection.add(item.id);
        }
        return newSelection;
      });
    } else {
      setSelectedItems(new Set([item.id]));
    }
  };

  const handleItemDoubleClick = (item) => {
    if (item.type === 'folder') {
      navigate(`/drive/${scope}?parent_id=${item.id}`);
    } else {
      handlePreview(item.id);
    }
  };

// In DriveViewPage.js, replace the old handleCopy function

  const handleCopy = () => {
    if (selectedItems.size > 0) {
      setClipboardContents(selectedItems, 'copy'); // Correct function name and arguments
      toast.info(`${selectedItems.size} item(s) ready to copy.`);
    }
  };

  const handleCut = () => {
    if (selectedItems.size > 0) {
      setClipboardContents(selectedItems, 'cut');
      toast.info(`${selectedItems.size} item(s) ready to move.`);
    }
  };

  const handlePaste = async () => {
    if (clipboard.itemIds.size === 0 || !clipboard.operation) return;

    const searchParams = new URLSearchParams(location.search);
    const destinationParentId = searchParams.get('parent_id');
    const endpoint = clipboard.operation === 'copy' ? '/api/files/copy' : '/api/files/move';
    
    try {
      setLoading(true);
      const response = await api.post(endpoint, {
        item_ids: Array.from(clipboard.itemIds),
        destination_scope: scope,
        destination_parent_id: destinationParentId,
      });
      toast.success(response.data.message);
      clearClipboard();
      fetchItems(); // This will also clear local selection
    } catch (error) {
      toast.error(error.response?.data?.error || "Operation failed.");
      setLoading(false);
    }
  };

  const { getRootProps, getInputProps, isDragActive, open } = useDropzone({ onDrop, noClick: true, noKeyboard: true });
  
  const formatBytes = (bytes, decimals = 2) => {
    if (!bytes && bytes !== 0) return '';
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const dm = decimals < 0 ? 0 : decimals;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + ' ' + sizes[i];
  };

  if (!scope) { return <div>Loading...</div>; }
  
  const pageTitle = scope.charAt(0).toUpperCase() + scope.slice(1);

  return (
    <>
      <PreviewModal item={previewItem} onClose={closePreviewModal} />
      
      <div className="drive-view-container" onClick={() => setSelectedItems(new Set())}>
        <header className="drive-view-header" onClick={e => e.stopPropagation()}>
          <Link to="/dashboard" className="back-link">← Back to Dashboard</Link>
          <h1>{pageTitle.replace('_', ' ')} Drive</h1>
        {clipboard.operation && (
          <button onClick={handlePaste} className="paste-btn">
            Paste ({clipboard.itemIds.size})
          </button>
          )}
          <button onClick={handleCreateFolder} className="create-folder-btn">+ Create Folder</button>
        </header>
        
        <div className="breadcrumb-bar" onClick={e => e.stopPropagation()}>
          <Link to={`/drive/${scope}`}>Home</Link>
          {breadcrumbs.map(crumb => (
            <React.Fragment key={crumb.id}>
              <span>/</span>
              <Link to={`/drive/${scope}?parent_id=${crumb.id}`}>{crumb.filename}</Link>
            </React.Fragment>
          ))}
        </div>

        <div className={`dropzone ${isDragActive ? 'active' : ''}`} onClick={open}>
          <input {...getInputProps()} />
          <p>{isDragActive ? "Drop files here..." : "Drag 'n' drop files or click this area to upload"}</p>
        </div>

        <div className="file-grid" onClick={e => e.stopPropagation()}>
          {loading ? ( <p>Loading items...</p> ) : 
           items.length > 0 ? (
            items.map(item => (
              <div
                key={item.id}
                className={`file-card-wrapper ${selectedItems.has(item.id) ? 'selected' : ''}`}
                onClick={(e) => handleItemClick(e, item)}
                onDoubleClick={() => handleItemDoubleClick(item)}
                onContextMenu={(e) => handleContextMenu(e, item.id, item.type)}
              >
                <div className="file-card">
                  <div className="file-icon folder-icon">{item.type === 'folder' ? '📁' : '📄'}</div>
                  <div className="file-info">
                    <span className="file-name">{item.filename}</span>
                    {item.type === 'file' && <span className="file-size">{formatBytes(item.filesize)}</span>}
                  </div>
                </div>
                <button
                  className="more-options-btn"
                  onClick={(e) => handleContextMenu(e, item.id, item.type)}
                >
                  <MoreOptionsIcon />
                </button>
              </div>
            ))
          ) : ( <p>This folder is empty.</p> )}
        </div>
        
      <ContextMenu x={contextMenu.x} y={contextMenu.y} show={contextMenu.show}>
        <ContextMenuItem onClick={handleCopy}>Copy</ContextMenuItem>
        <ContextMenuItem onClick={handleCut}>Cut</ContextMenuItem>
        <ContextMenuItem onClick={handleRenameItem}>Rename</ContextMenuItem>
        <ContextMenuItem onClick={handleDownloadFile}>Download</ContextMenuItem>
        <ContextMenuItem onClick={handleDeleteItem} danger={true}>Delete</ContextMenuItem>
      </ContextMenu>
      </div>

<DriveAi onActionExecuted={fetchItems} breadcrumbs={breadcrumbs} />
    </>
  );
};

export default DriveViewPage;