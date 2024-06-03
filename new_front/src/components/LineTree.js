import React from 'react';
import './css/LineTree.css'; // Подключаем файл со стилями

const LineTree = ({ lines, onSelectLine }) => {
  if (!lines || lines.length === 0) {
    return <div><h5 style={{textAlign: 'center'}}>Нет линий</h5></div>;
  }

  return (
    <div className="line-tree">
      <h5 style={{textAlign: 'center'}}>Линии</h5>
      <ul className="line-list"> {/* Применяем стиль к списку */}
        {lines.filter(line => line.points.length <= 4).map((line, index) => (
          <li key={index} className="line-list-item" onClick={() => onSelectLine(line, index)}> {/* Применяем стиль к элементам списка */}
            <div>Линия : {index + 1}</div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LineTree;
