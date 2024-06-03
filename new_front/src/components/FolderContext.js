import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
import axios from 'axios';

const FolderContext = createContext();

export const FolderProvider = ({ children }) => {
  const [folderInfo, setFolderInfo] = useState({ name: '', id: null, parent: null, isPublic: false });
  const [csrfToken, setCsrfToken] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCsrfToken = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}csrf/`);
      console.log('CSRF token response:', response);
      setCsrfToken(response.data.csrfToken);
      
    } catch (error) {
      console.error('Failed to fetch CSRF token:', error);
    }
  };

  const fetchFolderDetails = useCallback(async (folderId) => {
    try {
      setLoading(true);
      if (!csrfToken) {
        await fetchCsrfToken();
      }
      const response = await axios.get(`${process.env.REACT_APP_BASE_URL}/folders/${folderId}`,
        { headers: { 'X-CSRFToken': csrfToken } }
      );
      console.log('Folder details response:', response);
      if (response.status === 200) {
        setFolderInfo(response.data);
      }
    } catch (error) {
      console.error('Failed to fetch folder details', error);
      setError('Failed to fetch folder details');
    } finally {
      setLoading(false);
    }
  }, [csrfToken]);

  useEffect(() => {
    if (folderInfo.id) {
      fetchFolderDetails(folderInfo.id);
    }
  }, [folderInfo.id, fetchFolderDetails]);

  return (
    <FolderContext.Provider value={{ folderInfo, setFolderInfo, fetchFolderDetails, loading, error }}>
      {children}
    </FolderContext.Provider>
  );
};

export const useFolder = () => useContext(FolderContext);
