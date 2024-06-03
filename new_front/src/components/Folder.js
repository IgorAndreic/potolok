import React from 'react';

const Folder = ({ folder, onOpen, onContextMenu, className, style }) => {
    // Слияние пользовательских стилей с базовыми стилями карточки
    const combinedStyle = {
        cursor: 'pointer',
        ...style // Пользовательские стили, если они предоставлены
    };

    return (
      <div
        className={`card h-100 ${className}`} // Возможность добавления пользовательских классов
        style={combinedStyle}
        onClick={() => onOpen(folder.id)}
        onContextMenu={(e) => onContextMenu(e, folder)}
      >
        <div className="card-body d-flex align-items-center justify-content-center">
          <h5 className="card-title">{folder.name}</h5>
          {/* Можно добавить дополнительные элементы, например, иконки или кнопки */}
        </div>
      </div>
    );
};

export default Folder;
