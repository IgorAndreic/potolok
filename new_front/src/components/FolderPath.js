import React, { useState, useEffect } from 'react';
import axios from 'axios';

const FolderPath = ({ folderId, setFolderPath }) => {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFolderPath = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}folders/${folderId}/path/`);
        setFolderPath(response.data.path); // Обновляем состояние в родительском компоненте
        setLoading(false);
      } catch (err) {
        setError('Failed to load folder path');
        setLoading(false);
      }
    };

    fetchFolderPath();
  }, [folderId, setFolderPath]);

  if (loading) return <p>Loading folder path...</p>;
  if (error) return <p>Error: {error}</p>;
  return null; // Возвращаем null, так как компонент не содержит видимого контента
};
export default FolderPath;