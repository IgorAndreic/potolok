import React, { useState } from 'react';
import Modal from 'react-bootstrap/Modal';
import Button from 'react-bootstrap/Button';
import Form from 'react-bootstrap/Form';
import axios from 'axios';

const RenameFolderModal = ({ show, onHide, folderName, folderId, onFolderRenamed, folderPublic }) => {
  const [newFolderName, setNewFolderName] = useState(folderName);
  const [ newFolderPublic, setNewFolderPublic ] = useState(folderPublic);

  const handleCheckboxChange = (e) => {
    setNewFolderPublic(e.target.checked);
  }

  const handleRename = async () => {
    if (!newFolderName.trim()) {
      alert('Имя папки не может быть пустым.');
      return;
    }

    try {
      const response = await axios.patch(`${process.env.REACT_APP_BASE_URL}folders/${folderId}/`, {
        name: newFolderName,
        public: newFolderPublic
      });
      console.log('Folder renamed to:', newFolderName, 'Response:', response.data);
      onFolderRenamed({ id: folderId, name: newFolderName, public: newFolderPublic });
      onHide(true); 
    } catch (error) {
      console.error('Failed to rename folder:', error);
      onHide(false); 
    }
  };

  return (
    <Modal show={show} onHide={() => onHide(false)}> 
      <Modal.Header closeButton>
        <Modal.Title>Переименовать {folderName}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={e => e.preventDefault()}>
          <Form.Group>
            <Form.Label>Новое имя категории</Form.Label>
            <Form.Control
              type="text"
              value={newFolderName}
              onChange={(e) => setNewFolderName(e.target.value)}
              placeholder="Введите новое имя категории"
            />
          </Form.Group>
          <Form.Group>
            <Form.Check
              type="checkbox"
              label="Публичная категория"
              checked={newFolderPublic}
              onChange={handleCheckboxChange}
            />
          </Form.Group>
        </Form>
      </Modal.Body>
      <Modal.Footer>
        <Button variant="secondary" style={{color: 'black'}} onClick={() => onHide(false)}>
          Отмена
        </Button>
        <Button variant="primary" style={{color: 'black'}} onClick={handleRename}>
          Переименовать
        </Button>
      </Modal.Footer>
    </Modal>
  );
};
export default RenameFolderModal;