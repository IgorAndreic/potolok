import React from 'react';
import './css/LineTree.css'; // Подключаем файл со стилями

const LineTree = ({ lines, onSelectLine }) => {
<<<<<<< HEAD
=======
  if (!lines || lines.length === 0) {
    return <div><h5 style={{textAlign: 'center'}}>Начни замер</h5></div>;
  }
>>>>>>> refs/remotes/origin/main

  return (
    <div className="line-tree">
      <ul className="line-list"> {/* Применяем стиль к списку */}
<<<<<<< HEAD
        {lines.filter(line => line.points.length <= 4).map((line, index) => {
          // Присваиваем значение String.fromCharCode(65 + index) полю line.text
          line.text = String.fromCharCode(65 + index);

          return (
            <li key={index} className="line-list-item" onClick={() => onSelectLine(line, index)}> {/* Применяем стиль к элементам списка */}
              <div>{line.text}</div> {/* Отображаем значение line.text */}
            </li>
          );
        })}
=======
        {lines.filter(line => line.points.length <= 4).map((line, index) => (
          <li key={index} className="line-list-item" onClick={() => onSelectLine(line, index)}> {/* Применяем стиль к элементам списка */}
            <div> {String.fromCharCode(65 + index)}</div> {/* Преобразовываем индекс в латинскую букву */}
          </li>
        ))}
>>>>>>> refs/remotes/origin/main
      </ul>
    </div>
  );
};

export default LineTree;

