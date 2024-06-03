import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate, useParams, useLocation, Link } from 'react-router-dom';
import CreateFolderModal from './modal/CreateFolderModal';
import DeleteFolderModal from './modal/DeleteFolderModal';
import RenameFolderModal from './modal/RenameFolderModal';
import FolderTree from './FolderTree';
import FolderActions from './FolderActions';
import BlueprintsTree from './BlueprintsTree';
import FolderPath from './FolderPath';
import { useAuth } from './AuthContext';
import './css/FolderContent.css';

const FolderContent = () => {
  const [folders, setFolders] = useState([]);
  const [error, setError] = useState('');
  const [contextMenu, setContextMenu] = useState(null);
  const [createModalShow, setCreateModalShow] = useState(false);
  const [deleteModalShow, setDeleteModalShow] = useState(false);
  const [renameModalShow, setRenameModalShow] = useState(false);
  const [selectedFolder, setSelectedFolder] = useState({ id: null, name: '' });
  const [folderPath, setFolderPath] = useState('');
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const { folderId } = useParams();
  const location = useLocation();
  const folderName = location.state?.folderName;
  const folderPublic = location.state?.folderPublic;
  console.log(folderPublic);
 

  useEffect(() => {
    const fetchFolders = async () => {
        const url = `${process.env.REACT_APP_BASE_URL}folders/?parent_id=${folderId || ''}`;
        try {
            const response = await axios.get(url);

            setFolders(response.data);
            
            console.log(response.data);
            
        } catch (error) {
            console.error('Ошибка при получении данных с сервера:', error);
            setError('Ошибка при получении данных с сервера.');
        }
    };

    fetchFolders();
  }, [folderId, folderName]);

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
      <div className="marquee-container">
      <FolderPath folderId={folderId} setFolderPath={setFolderPath} />
      <p>{folderPath}</p>
    </div>
      <div className="row">
      <div className="col d-flex flex-column align-items-center">
          <div>
            <h2 className="mb-3">{folderName}</h2>
          </div>
          <div>
            {(isAuthenticated || folderPublic) && <button
              className="btn btn-secondary btn-sm px-4 py-2 mb-3"
              onClick={() => setCreateModalShow(true)}
              style={{color: "black"}}> 
              Создать подкатегорию
            </button>}
          </div>
        </div>
      </div>
      {error && <div className="alert alert-danger" role="alert">{error}</div>}
      <CreateFolderModal 
      show={createModalShow} 
      handleClose={closeCreateModal} 
      parent={folderId} 
      onFolderCreated={handleFolderCreated} 
      />
      <FolderTree
        folders={folders}
        onFolderClick={handleCardClick}
        onFolderContextMenu={handleCardContextMenu}
      />
      <BlueprintsTree folderId={folderId} folderName={folderName} folderPublic={folderPublic} />
      {(isAuthenticated || folderPublic) && contextMenu && (
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
            setDeleteModalShow(false);
          }
        }}
        folderId={selectedFolder.id}
        folderName={selectedFolder.name}
      />
      <RenameFolderModal
        show={renameModalShow}
        handleClose={closeRenameModal}
        onFolderRenamed={(updatedFolder) => {
          const updatedFolders = folders.map(f =>
            f.id === updatedFolder.id ? { ...f, name: updatedFolder.name } : f
          );
          setFolders(updatedFolders);
          setRenameModalShow(false);
        }}
        folderId={selectedFolder.id}
        folderName={selectedFolder.name}
        onHide={() => setRenameModalShow(false)}
      />
      <div style={{ position: 'fixed', bottom: 0, left: 0 }}>
        <Link to="/" className="btn btn-secondary px-5 py-2 mb-3"  style={{color: "black"}}>
          На главную
        </Link>
      </div>
    </div>
  );
};
export default FolderContent;
