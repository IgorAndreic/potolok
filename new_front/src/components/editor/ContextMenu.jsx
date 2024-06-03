import React from 'react';

const ContextMenu = ({ x, y, onDelete }) => {
  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        left: x,
        backgroundColor: 'white',
        border: '1px solid #ccc',
        zIndex: 1000,
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
      }}
    >
      <ul style={{ listStyleType: 'none', padding: '10px', margin: '0' }}>
        <li onClick={onDelete} style={{ cursor: 'pointer', padding: '5px 10px' }}>
          Delete
        </li>
      </ul>
    </div>
  );
};

export default ContextMenu;
