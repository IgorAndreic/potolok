import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import CreateFolderModal from './modal/CreateFolderModal';
import DeleteFolderModal from './modal/DeleteFolderModal';
import RenameFolderModal from './modal/RenameFolderModal';
import FolderTree from './FolderTree';  
import FolderActions from './FolderActions'; 
import { useAuth } from './AuthContext'; 

const FolderList = () => {
  const [folders, setFolders] = useState([]);
  const [error, setError] = useState('');
  const [contextMenu, setContextMenu] = useState(null);
  const [createModalShow, setCreateModalShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [renameModalShow, setRenameModalShow] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState({ id: null, name: '' });
  const [parentFolderId, setParentFolderId] = useState(null);
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    const fetchFolders = async () => {
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}folders/?parent_id=${process.env.REACT_APP_MAIN_FOLDER}`);
        setFolders(response.data);
        // Set parentFolderId based on the presence of a parent in the first folder,
          // otherwise use the main folder ID if no folders are present.
          if (response.data.length > 0) {
            setParentFolderId(response.data[0].parent || process.env.REACT_APP_MAIN_FOLDER);
          } else {
            // Handle case when there are no folders yet, assuming the root creation uses MAIN_FOLDER as parent
            setParentFolderId(process.env.REACT_APP_MAIN_FOLDER);
          }
      } catch (error) {
        console.error('Ошибка при получении данных с сервера:', error);
        setError('Ошибка при получении данных с сервера.');
      }
    };

    fetchFolders();
}, []);

  const handleContainerClick = () => {
    if (contextMenu) {
      setContextMenu(null);
    }
  };

  const handleFolderCreated = (newFolder) => {
    setFolders(prevFolders => [...prevFolders, newFolder]);
  };

  const closeCreateModal = () => setCreateModalShow(false);
  const closeRenameModal = () => setRenameModalShow(false);
  const closeDeleteModal = () => setDeleteModalShow(false);

  const handleCardClick = (folderId) => {
    const folder = folders.find(f => f.id === folderId);
    if (folder) {
        navigate(`/folders/${folderId}`, { state: { folderName: folder.name, folderPublic: folder.public } });
    } else {
        console.error('Folder not found');
    }
};
  const handleCardContextMenu = (event, folder) => {
    event.preventDefault();
    event.stopPropagation();
    setContextMenu({
      folderId: folder.id,
      pageX: event.pageX,
      pageY: event.pageY
    });
  };

  const onRenameClick = (folderId) => {
    const folder = folders.find(f => f.id === folderId);
    setSelectedFolder(folder);
    setRenameModalShow(true);
  };

  const onDeleteClick = (folderId) => {
    const folder = folders.find(f => f.id === folderId);
    setSelectedFolder({ id: folderId, name: folder.name });
    setDeleteModalShow(true);
  };

  return (
    <div className='container' style={{ minHeight: '100vh' }} onClick={handleContainerClick}>
      <div className="row">
      <div className="col d-flex flex-column align-items-center">
          <div>
            <h2 className="mb-3">Главная</h2>
          </div>
          <div>
            { isAuthenticated && 
            <button
              className="btn btn-secondary btn-sm px-4 py-2 mb-3"
              onClick={() => setCreateModalShow(true)}
              style={{color: "black"}}> 
              Создать категорию
            </button>}
          </div>
        </div>
       </div>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <CreateFolderModal show={createModalShow} handleClose={closeCreateModal} parent={parentFolderId} onFolderCreated={handleFolderCreated} />
      <FolderTree
        folders={folders}
        onFolderClick={handleCardClick}
        onFolderContextMenu={handleCardContextMenu}
      />
      {isAuthenticated && contextMenu && (
        <FolderActions
          onRename={() => onRenameClick(contextMenu.folderId)}
          onDelete={() => onDeleteClick(contextMenu.folderId)}
          onCreate={handleContainerClick}
          contextMenu={contextMenu}
        />
      )}
      <DeleteFolderModal
        show={deleteModalShow}
        handleClose={closeDeleteModal}
        onHide={(refresh) => {
          if (refresh) {
            const updatedFolders = folders.filter(f => f.id !== selectedFolder.id);
            setFolders(updatedFolders);
          }
            setDeleteModalShow(false);
        }}
        folderId={selectedFolder.id}
        folderName={selectedFolder.name}
      />
      <RenameFolderModal
        show={renameModalShow}
        onHide={closeRenameModal}
        folderName={selectedFolder.name}
        folderId={selectedFolder.id}
        public={selectedFolder.public}
        onFolderRenamed={(updatedFolder) => {
          const updatedFolders = folders.map(f =>
              f.id === updatedFolder.id ? { ...f, name: updatedFolder.name, public: updatedFolder.public } : f
          );
          setFolders(updatedFolders);
        }}
      />
    </div>
  );
};

export default FolderList;
