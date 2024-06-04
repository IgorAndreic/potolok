import React, { useState } from 'react';
import Modal from './modal/Modal';

const LineManager = ({ lines, setLines, lastLineEnds, setLastLineEnds, endPointSelection, setEndPointSelection, isModalOpenLineM, setIsModalOpenLineM, setAngleType, angleType}) => {
 
  
  const [tempLineDetails, setTempLineDetails] = useState({
    angle: 90,
    length: 100
  });
  const [errorMessage, setErrorMessage] = useState("");


  const handleAddLineClick = () => {
    if (lastLineEnds.length === 0) {
      setLastLineEnds([ 50, 450, 150, 450, 90]);
    }
    // Open the modal to add a new line if conditions are met
    setIsModalOpenLineM(true);
};

  const handleModalClose = () => {
    setIsModalOpenLineM(false);
  };

  const handleAddNewLine = () => {
    const { angle, length } = tempLineDetails;
    
    // Выбор координат в зависимости от выбранной точки
    let baseX, baseY, endX, endY;
    if (endPointSelection === "start") {
        baseX = lastLineEnds[0];
        baseY = lastLineEnds[1];
        endX = lastLineEnds[2];
        endY = lastLineEnds[3];
    } else {
        baseX = lastLineEnds[2]; // Конечная точка предыдущей линии используется как начальная точка новой линии
        baseY = lastLineEnds[3];
        endX = lastLineEnds[0]; // Начальная точка предыдущей линии (для рассчета направления вектора в случае необходимости)
        endY = lastLineEnds[1];
    }

    // Вычисление базового угла
    const baseAngle = Math.atan2(endY - baseY, endX - baseX);
    const angleRadians = angle * (Math.PI / 180);
    const newAngle = baseAngle + (angleType === "external" ? angleRadians : -angleRadians);

    // Вычисление новых координат
    const newX = baseX + length * Math.cos(newAngle);
    const newY = baseY + length * Math.sin(newAngle);

    const newLine = {
      points: [baseX, baseY, newX, newY],
      length,
      angle: angle, // Сохранить угол в градусах
      lengthmin: length,
      anglemin: angle,
      editable: false,
      text: `${Math.round(length)}`,
      textX: (baseX + newX) / 2,
      textY: (baseY + newY) / 2 - 10,
      textAngle: angle, 
      textAngleX: baseX - 20,
      textAngleY: baseY 
    };
    setLines([...lines, newLine]);
    setLastLineEnds([baseX, baseY, newX, newY, angle]); // Update the endpoint for the next line
    handleModalClose();
  };

  return (
    <>
        
        <button className="btn btn-outline-dark " onClick={handleAddLineClick}>
        <img src="icons/add.svg" alt="Открыть" />
        </button>
        {errorMessage && <div className="alert alert-danger">{errorMessage}</div>}
        
      {isModalOpenLineM && (
        <Modal isOpen={isModalOpenLineM} onClose={handleModalClose}>
          <form className="form-container" onSubmit={e => e.preventDefault()}>
            <label>Длина:</label>
            <input type="number" value={tempLineDetails.length} onChange={(e) => setTempLineDetails({ ...tempLineDetails, length: parseFloat(e.target.value) })} />
            <label>
                Начальная точка:
                <label>
                  <input
                    type="radio"
                    name="lineEnd"
                    value="start"
                    checked={endPointSelection === "start"}
                    onChange={() => setEndPointSelection("start")}
                  /> Начало
                </label>
                <label>
                  <input
                    type="radio"
                    name="lineEnd"
                    value="end"
                    checked={endPointSelection === "end"}
                    onChange={() => setEndPointSelection("end")}
                  /> Конец
                </label>
              </label>
              <label>Угол:</label>
                <input type="number" value={tempLineDetails.angle} onChange={(e) => setTempLineDetails({ ...tempLineDetails, angle: parseFloat(e.target.value) })} />
              <label>
                Тип угла:
                <label>
                  <input
                    type="radio"
                    name="angleType"
                    value="external"
                    checked={angleType === "external"}
                    onChange={() => setAngleType("external")}
                  /> Внешний
                </label>
                <label>
                  <input
                    type="radio"
                    name="angleType"
                    value="internal"
                    checked={angleType === "internal"}
                    onChange={() => setAngleType("internal")}
                  /> Внутренний
                </label>
              </label>
            <button type="button" className="btn btn-outline-dark mx-1 mt-2" onClick={handleAddNewLine}>
              Добавить
            </button>
          </form>
        </Modal>
      )}
    </>
  );
};

export default LineManager;
