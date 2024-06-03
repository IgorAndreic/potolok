import React, { useState, useEffect } from 'react';
import { calculateNewEndPoint } from './utils/mathUtils';
import Modal from './modal/Modal';
import './css/LineEditorForm.css';

const LineEditorForm = ({ isOpen, onClose, line, index, onUpdateLine, onDeleteLine, setLastLineEnds }) => {
  const [x1, setX1] = useState(Math.round(line.points[0]));
  const [y1, setY1] = useState(Math.round(line.points[1]));
  const [length, setLength] = useState(Math.round(line.length));
  const [lengthmin, setLengthmin] = useState(Math.round(line.lengthmin));
  const [angle, setAngle] = useState(Math.round(line.angle));
  const [anglemin, setAnglemin] = useState(Math.round(line.anglemin));
  const [textAngle, setTextAngle] = useState(line.textAngle);
  const [editable, setEditable] = useState(line.editable);
  const [error, setError] = useState(null);

  useEffect(() => {
    setX1(Math.round(line.points[0]));
    setY1(Math.round(line.points[1]));
    setLength(Math.round(line.length));
    setLengthmin(Math.round(line.lengthmin));
    setAngle(Math.round(line.angle));
    setAnglemin(Math.round(line.anglemin));
    setTextAngle(line.textAngle);
    setEditable(line.editable);
  }, [line]);

  const handleUpdate = () => {
    const { x2, y2, error } = calculateNewEndPoint(x1, y1, length, angle);
    if (error) {
      setError(error);
    } else {
      setError(null);
        const newLength = Math.sqrt(Math.pow(x2 - x1, 2) + Math.pow(y2 - y1, 2)); 
        // Создание обновленной линии с новыми данными
        const updatedLine = {
            ...line,
            points: [x1, y1, x2, y2],
            length: newLength,
            lengthmin: lengthmin > newLength ? newLength : lengthmin, 
            angle: angle,
            anglemin: anglemin, 
            editable: editable,
            text: `${Math.round(newLength)}`,
            textAngle: textAngle,
        };
        setLastLineEnds([x1, y1, x2, y2, angle]); // Обновляем конечную точку для новой линии
        onUpdateLine(updatedLine, index);
    }
};
  
  const handleDelete = () => {
    onDeleteLine(index);
  };
  

  return (
    <Modal isOpen={isOpen} onClose={onClose}>
      <form className="form-container">
        <h5>Редактирование линии</h5>
        <label>Длина:</label>
        <input
          type="number"
          value={length}
          onChange={(e) => setLength(parseFloat(e.target.value))}
        />
        <label>Мин. Длина:</label>
        <input
          type="number"
          value={lengthmin}
          onChange={(e) => setLengthmin(parseFloat(e.target.value))}
        />
        <label>Угол:</label>
        <input
          type="number"
          value={textAngle}
          onChange={(e) => setTextAngle(parseFloat(e.target.value))}
        />
        <label>Мин. Угол:</label>
        <input
          type="number"
          value={anglemin}
          onChange={(e) => setAnglemin(parseFloat(e.target.value))}
        />
        <label>
           Показать угол:
            <input
              type="checkbox"
              checked={editable}
              onChange={(e) => setEditable(e.target.checked)} // Toggle state on change
            />
          </label>
        {error && <div className="error-message">{error}</div>}
        <button type="button" className="btn btn-outline-dark mx-1 mt-2" onClick={handleUpdate}>
          Изменить
        </button>
        <button type="button" className="btn btn-outline-dark mx-1 mt-2" onClick={handleDelete}>
          Удалить
        </button>
      </form>
    </Modal>
  );
};

export default LineEditorForm;
