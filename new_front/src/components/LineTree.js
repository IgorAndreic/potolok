import React from 'react';
import './css/LineTree.css'; // Подключаем файл со стилями

const LineTree = ({ lines, onSelectLine }) => {

  return (
    <div className="line-tree">
      <ul className="line-list"> {/* Применяем стиль к списку */}
        {lines.filter(line => line.points.length <= 4).map((line, index) => {
          // Присваиваем значение String.fromCharCode(65 + index) полю line.text
          line.text = String.fromCharCode(65 + index);

          return (
            <li key={index} className="line-list-item" onClick={() => onSelectLine(line, index)}> {/* Применяем стиль к элементам списка */}
              <div>{line.text}</div> {/* Отображаем значение line.text */}
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default LineTree;

