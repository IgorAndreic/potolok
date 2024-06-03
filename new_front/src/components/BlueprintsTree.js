import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import ContextMenu from './editor/ContextMenu';
import { useAuth } from './AuthContext';

const BlueprintsTree = ({ folderId, folderName, folderPublic, drawing }) => {
  const [blueprints, setBlueprints] = useState([]);
  const [contextMenu, setContextMenu] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlueprints = async () => {
      if (!folderId) return;

      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}folders/${folderId}/blueprints/`);
        setBlueprints(response.data);
      } catch (err) {
        console.error('Failed to fetch blueprints:', err);
        setError('Failed to load blueprints');
      } finally {
        setLoading(false);
      }
    };

    fetchBlueprints();
  }, [folderId]);

  useEffect(() => {
    if (contextMenu) {
      const handleClickOutside = () => setContextMenu(null);
      document.addEventListener('click', handleClickOutside);
      return () => document.removeEventListener('click', handleClickOutside);
    }
  }, [contextMenu]);

  const handleCreateBlueprint = () => {
    navigate('/editor', { state: { folderId, folderName } });
  };

  const handleOrderBlueprint = (blueprintId, blueprintName) => {
    navigate('/order', { state: { folderId, folderName, blueprintId, blueprintName, drawing } });
  };

  const handleDeleteBlueprint = async (blueprintId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_BASE_URL}blueprints/${blueprintId}/`);
      setBlueprints(prevBlueprints => prevBlueprints.filter(bp => bp.id !== blueprintId));
    } catch (err) {
      console.error('Failed to delete blueprint:', err);
      setError('Failed to delete blueprint');
    } finally {
      setContextMenu(null);
    }
  };

  const handleRightClick = (e, blueprintId) => {
    e.preventDefault();
    setContextMenu({
      blueprintId,
      x: e.pageX,
      y: e.pageY
    });
  };

  if (loading) return <div>Loading blueprints...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='container'>
      <div className="row">
        <div className="col d-flex flex-column align-items-center">
          <div>
            <h2 className="mb-3">Схемы</h2>
          </div>
          <div>
            {(isAuthenticated || folderPublic) && <button
              className="btn btn-secondary btn-sm px-4 py-2 mb-3"
              onClick={handleCreateBlueprint}
              style={{ color: "black" }}
            >
              Конструктор схемы
            </button>}
          </div>
        </div>
      </div>
      <div className="row">
        {blueprints.length > 0 ? blueprints.map(blueprint => (
          <div
            key={blueprint.id}
            onClick={() => handleOrderBlueprint(blueprint.id, blueprint.name)}
            onContextMenu={(e) => handleRightClick(e, blueprint.id)}
            style={{ cursor: 'pointer' }}
          >
            {blueprint.name}
          </div>
        )) : <div key="no_schemes">Нет схем в данной категории.</div>}
      </div>
      {isAuthenticated && contextMenu && (
        <ContextMenu
          x={contextMenu.x}
          y={contextMenu.y}
          onDelete={() => handleDeleteBlueprint(contextMenu.blueprintId)}
        />
      )}
    </div>
  );
};

export default BlueprintsTree;
