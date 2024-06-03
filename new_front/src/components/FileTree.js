import React, { useState, useEffect } from 'react';
import axios from 'axios';
import ContextMenu from './editor/ContextMenu';  // Adjust the path as necessary

const FileTree = ({ folderId, folderName }) => {
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [contextMenu, setContextMenu] = useState(null);

  useEffect(() => {
    const fetchFiles = async () => {
      if (!folderId) return;  // Ensure folderId is present

      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}folders/${folderId}/files/`);
        setFiles(response.data);
      } catch (err) {
        console.error('Failed to fetch files:', err);
        setError('Failed to load files');
      } finally {
        setLoading(false);
      }
    };

    fetchFiles();
  }, [folderId]);

  useEffect(() => {
    if (contextMenu) {
      const handleClickOutside = () => setContextMenu(null);
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu]);

  const handleDeleteFile = async (fileId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}files/${fileId}/`);
      setFiles(prevFiles => prevFiles.filter(file => file.id !== fileId));
    } catch (err) {
      console.error('Failed to delete file:', err);
      setError('Failed to delete file');
    } finally {
      setContextMenu(null);
    }
  };

  const handleRightClick = (e, fileId) => {
    e.preventDefault();
    setContextMenu({
      fileId,
      x: e.pageX,
      y: e.pageY
    });
  };

  if (loading) return <div>Loading files...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='container'>
      <div className="row">
        <div className="col d-flex justify-content-center">
          <h2 className="mb-3">Файлы</h2>
        </div>
        <ul>
          {files.length > 0 ? files.map(file => (
            <li
              key={file.id}
              onContextMenu={(e) => handleRightClick(e, file.id)}
              style={{ cursor: 'pointer' }}
            >
              <a href={file.file_url} target='_blank' rel='noopener noreferrer'>{file.name}</a>
            </li>
          )) : <li key="no-files">Нет файлов в данной категории.</li>}
        </ul>
      </div>
      {contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onDelete={() => handleDeleteFile(contextMenu.fileId)}
        />
      )}
    </div >
  );
};

export default FileTree;
