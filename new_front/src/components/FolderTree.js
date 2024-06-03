import React from 'react';
import Folder from './Folder';  

const FolderTree = ({ folders, onFolderClick, onFolderContextMenu, className, style, emptyMessage = "Нет категорий \u{1F600}" }) => {
    
    const combinedStyle = {
        ...style 
    };

    return (
      <div className={`row row-cols-1 row-cols-md-4 g-4 ${className}`} style={combinedStyle}>
        {folders.length > 0 ? (
          folders.map(folder => (
            <div className="col" key={folder.id}>
              <Folder
                folder={folder}
                onOpen={onFolderClick}
                onContextMenu={onFolderContextMenu}
              />
            </div>
          ))
        ) : (
          <div>
            <ul>
              <li>{emptyMessage}</li>
            </ul> 
          </div>
        )}
      </div>
    );
};

export default FolderTree;
