import React from 'react';
import './css/LineTree.css'; // Подключаем файл со стилями

const LineTree = ({ lines, onSelectLine }) => {
  if (!lines || lines.length === 0) {
    return <div><h5 style={{textAlign: 'center'}}>Начни замер</h5></div>;
  }

  return (
    <div className="line-tree">
      <h5 style={{textAlign: 'center'}}>Линии</h5>
      <ul className="line-list"> {/* Применяем стиль к списку */}
        {lines.filter(line => line.points.length <= 4).map((line, index) => (
          <li key={index} className="line-list-item" onClick={() => onSelectLine(line, index)}> {/* Применяем стиль к элементам списка */}
            <div> {String.fromCharCode(65 + index)}</div> {/* Преобразовываем индекс в латинскую букву */}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default LineTree;
