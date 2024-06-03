import React, { useEffect, useRef } from 'react';

const FolderActions = ({ onCreate, onDelete, onRename, contextMenu }) => {
    const menuRef = useRef(null);

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                onCreate(); 
            }
        };

        document.addEventListener("mousedown", handleClickOutside);

        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, [menuRef, onCreate]);

    if (!contextMenu) return null;

    return (
      <ul
        ref={menuRef}
        className="list-group"
        style={{
          position: 'absolute',
          cursor: 'pointer',
          top: `${contextMenu.pageY}px`,
          left: `${contextMenu.pageX}px`
        }}
      >
        {onRename && <li className="list-group-item" onClick={onRename}>
          Переименовать
        </li>}
        {onDelete && <li className="list-group-item" onClick={onDelete}>
          Удалить
        </li>}
      </ul>
    );
};

export default FolderActions;
