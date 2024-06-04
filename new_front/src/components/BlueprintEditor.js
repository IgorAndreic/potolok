import React, { useRef, useCallback, useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import useLineCreator from './hooks/useLineCreator';
import ToolBar from './editor/ToolBar';
import LineTree from './LineTree';
import LineEditorForm from './LineEditorForm';
import DrawingStage from './editor/DrawingStage';
import BlueprintLoaderModal from './editor/BlueprintLoaderModal';
import LineManager from './LineManager';
import 'bootstrap/dist/css/bootstrap.min.css';
import './css/BlueprintEditor.css';

const BlueprintEditor = () => {
  const location = useLocation();
  const folderName = location.state.folderName;
  const folderId = location.state.folderId;

  const [selectedLine, setSelectedLine] = useState(null);
  const [selectedLineIndex, setSelectedLineIndex] = useState(null);
  const [endPointSelection, setEndPointSelection] = useState("end");
  const [angleType, setAngleType] = useState("external");
  
  const [selectedShapeId, setSelectedShapeId] = useState(null);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalOpenLineM, setIsModalOpenLineM] = useState(false);

  const [isLoaderModalOpen, setIsLoaderModalOpen] = useState(false);
  const [blueprintName, setBlueprintName] = useState('');
  const [blueprintId, setBlueprintId] = useState(null);

  const stageRef = useRef();
  const { lines, shapes, currentLine, handleMouseDown, handleMouseUp, handleMouseMove, addArrow, setShapes, setLines, setLastLineEnds, lastLineEnds, setIsPanning, drawing } = useLineCreator(stageRef);

  
  const handleMouseDownWrapped = useCallback((e) => {
    if (stageRef.current) {
      const clickedOnEmpty = e.target === e.target.getStage();
      if (clickedOnEmpty) {
        // Если кликнули по пустому месту и есть выбранный элемент
        if (selectedShapeId || selectedLineIndex !== null) {
          if (selectedShapeId) {
            setSelectedShapeId(null);
          }
          if (selectedLineIndex !== null) {
            setSelectedLine(null);      // Сбросить выбранную линию
            setSelectedLineIndex(null); // Сбросить индекс выбранной линии
          }
        } else {
          handleMouseDown(e);
        }
      }
    }
  }, [handleMouseDown, selectedShapeId, selectedLineIndex, setSelectedShapeId, setSelectedLine, setSelectedLineIndex]);

  const handleMouseUpWrapped = useCallback((e) => {
    console.log("Mouse up");
    handleMouseUp(e);
  }, [handleMouseUp]);

  const handleMouseMoveWrapped = useCallback((e) => {
    handleMouseMove(e);
  }, [handleMouseMove]);

  const handleLineSelect = (line, index) => {
    setSelectedLine({ ...line });
    setLastLineEnds([line.points[0], line.points[1], line.points[2], line.points[3], line.angle]);
    setSelectedLineIndex(index);
    setSelectedShapeId(null);
    setIsModalOpen(true);
  };

  const handleShapeSelect = (id) => {
    console.log("Shape selected:", id);
    setSelectedShapeId(id);
  };

  const handleAddArrow = () => {addArrow()
    console.log("Arrow added");
  };

  const handleUpdateLine = (updatedLine, index) => {
    const newLines = [...lines];
    const oldEndX = newLines[index].points[2]; // Старая координата X конечной точки
    const oldEndY = newLines[index].points[3]; // Старая координата Y конечной точки

    newLines[index] = updatedLine;

    const newEndX = updatedLine.points[2]; // Новая координата X конечной точки
    const newEndY = updatedLine.points[3]; // Новая координата Y конечной точки

    const deltaX = newEndX - oldEndX; // Разница по X
    const deltaY = newEndY - oldEndY; // Разница по Y

    // Применяем сдвиг ко всем последующим линиям
    for (let i = index + 1; i < newLines.length; i++) {
        newLines[i].points[0] += deltaX;
        newLines[i].points[1] += deltaY;
        newLines[i].points[2] += deltaX;
        newLines[i].points[3] += deltaY;
        newLines[i].textX += deltaX;
        newLines[i].textY += deltaY;
        newLines[i].textAngleX += deltaX;
        newLines[i].textAngleY += deltaY;
    }

    setLines(newLines);
    setLastLineEnds([updatedLine.points[0], updatedLine.points[1], updatedLine.points[2], updatedLine.points[3], updatedLine.angle]); 
    setSelectedLine(null); // Сбрасываем выбранную линию 
    setSelectedLineIndex(null);
};

const handleDeleteLine = (index) => {
  const isLastSelected = index === lines.length - 1;
  const newLines = lines.filter((_, i) => i !== index);

  if (isLastSelected && newLines.length > 0) {
      // Если удаляем последнюю линию и в массиве ещё есть линии
      const lastLine = newLines[newLines.length - 1];
      const lastPoints = lastLine.points;
      const lastAngle = lastLine.angle; // Предполагаем, что угол сохранён в объекте линии
      setLastLineEnds([lastPoints[0], lastPoints[1], lastPoints[2], lastPoints[3], lastAngle]);
  } else if (newLines.length === 0) {
      // Если все линии удалены
      setLastLineEnds(null);
  }

  setLines(newLines);
  setSelectedLine(null); // Сбрасываем выбранную линию после удаления
  setSelectedLineIndex(null);
};

  const handleDeleteArrow = () => {
    const newShapes = shapes.filter(shape => shape.type !== 'arrow'); 
    setShapes(newShapes);
  };

  const hasArrows = shapes.some(shape => shape.type === 'arrow');
  const closeModal = () => {
    setIsModalOpen(false);
  };

  const loadBlueprint = (blueprint) => {
    // Здесь ваш код для загрузки данных выбранной схемы
    console.log("Loaded Blueprint:", blueprint);
    setBlueprintId(blueprint.id);
    setBlueprintName(blueprint.name);
    setIsLoaderModalOpen(false); // Закрыть модальное окно после выбора схемы
  };

  return (
    <>
      <h1 className="text-center mt-3">{blueprintName ? `${folderName} / ${blueprintName}` : `${folderName}/ Новая`}</h1>
    <div className="container">
      <div className="row">
        <div className="col-2">
          <LineManager 
            setLines={setLines} 
            lines={lines} 
            lastLineEnds={lastLineEnds} 
            setLastLineEnds={setLastLineEnds}
            endPointSelection={endPointSelection}
            setEndPointSelection={setEndPointSelection}
            setIsModalOpenLineM={setIsModalOpenLineM}
            isModalOpenLineM={isModalOpenLineM}
            setAngleType={setAngleType}
            angleType={angleType}
            /> 
          <button className="btn btn-outline-dark " onClick={handleAddArrow}>
          <img src="icons/arrow_forward.svg" alt="Открыть" />
          </button>
          {hasArrows && (
          <button className="btn btn-outline-dark " onClick={handleDeleteArrow}>
            <img src="icons/delete.svg" alt="Открыть" />
          </button>
          )}
          {selectedLine && (
            <LineEditorForm
              isOpen={isModalOpen}
              onClose={closeModal}
              line={selectedLine}
              index={selectedLineIndex}
              onUpdateLine={handleUpdateLine}
              onDeleteLine={handleDeleteLine}
              setLines={setLines}
              setLastLineEnds={setLastLineEnds}
              lines={lines}
            />
          )}
          <LineTree 
            lines={lines} 
            onSelectLine={(line, index) => handleLineSelect(line, index)} 
          />
          <ToolBar 
            lines={lines} 
            shapes={shapes}
            folderId={folderId} 
            setIsLoaderModalOpen={setIsLoaderModalOpen}
            blueprintId={blueprintId}
            blueprintName={blueprintName}
          />
          <BlueprintLoaderModal 
            isOpen={isLoaderModalOpen}
            onClose={() => setIsLoaderModalOpen(false)} 
            folderId={folderId}
            loadBlueprint={loadBlueprint}
            setLines={setLines}
            setShapes={setShapes} 
          />  
              <Link to="/" className="btn btn-outline-dark mx-1">На главную</Link>
        </div>
        <div className="col-10">
          <DrawingStage
            lines={lines}
            shapes={shapes}
            currentLine={currentLine}
            handleMouseDown={handleMouseDownWrapped}
            handleMouseUp={handleMouseUpWrapped}
            handleMouseMove={handleMouseMoveWrapped}
            handleShapeSelect={handleShapeSelect}
            handleLineSelect={(line, index) => { setSelectedLineIndex(index); setSelectedLine(line); setIsModalOpen(true);}}
            isModalOpenLineM={isModalOpenLineM}
            setShapes={setShapes}
            setLines={setLines}
            setLastLineEnds={setLastLineEnds}
            lastLineEnds={lastLineEnds}
            endPointSelection={endPointSelection}
            selectedLineIndex={selectedLineIndex}
            selectedShapeId={selectedShapeId}
            setIsPanning={setIsPanning}
            drawing={drawing}
            stageRef={stageRef}
            folderId={folderId}
            />
        </div>
      </div> 
    </div>
    </>
  );
};

export default BlueprintEditor;
