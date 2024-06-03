import React, { useState } from 'react';
import { Stage, Layer, Line, Text, Circle } from 'react-konva';
import TransformerComponent from './TransformerComponent';
import ImageComponent from './ImageComponent';
import axios from 'axios';
import Konva from 'konva';
import Modal from '../modal/Modal';
import '../css/DrawingCanvas.css';


const dataURLtoFile = (dataurl, filename) => {
    let arr = dataurl.split(','), mime = arr[0].match(/:(.*?);/)[1],
    bstr = atob(arr[1]), n = bstr.length, u8arr = new Uint8Array(n);
    while(n--){
        u8arr[n] = bstr.charCodeAt(n);
    }
    return new File([u8arr], filename, {type:mime});
};

const getCSRFToken = async () => {
  const response = await axios.get(`${process.env.REACT_APP_BASE_URL}csrf/`);
  console.log("CSRF token received:", response.data.csrfToken);
  return response.data.csrfToken;
};

const DrawingStage = ({
  lines,
  shapes,
  currentLine,
  setLines,
  setShapes,
  setLastLineEnds,
  lastLineEnds,
  endPointSelection,
  handleMouseDown,
  handleMouseUp,
  handleMouseMove,
  handleShapeSelect,
  selectedShapeId,
  stageRef,
  handleLineSelect,
  selectedLineIndex,
  folderId, 
  isModalOpenLineM,
  drawing,
  setIsPanning
}) => {

  const [isModalOpen, setModalOpen] = useState(false);
  const [fileName, setFileName] = useState('');
  const [scale, setScale] = useState(1);

  const handleShapeMouseDown = (e, line, index) => {
    handleLineSelect(line, index); // Передаем полный объект line и его индекс
    handleMouseDown(e);
  };

  const handleMouseEnter = () => {
    const stage = stageRef.current;
    if (stage) {
      stage.container().style.cursor = 'pointer';  // Изменение курсора на pointer
    }
  };

  const handleMouseLeave = () => {
    const stage = stageRef.current;
    if (stage) {
      stage.container().style.cursor = 'default';  // Возвращение курсора к стандартному виду
    }
  };

  const toggleModal = () => {
    setModalOpen(!isModalOpen);
  };

  const saveImage = async () => {
    if (!fileName.trim()) {
      alert('Please enter a valid file name.');
      return;
    }
  
    const stage = stageRef.current;
    const width = stage.width();
    const height = stage.height();
  
    // Создание белого фона и сохранение изображения
    const whiteLayer = new Konva.Layer();
    const whiteRect = new Konva.Rect({
      x: 0,
      y: 0,
      width: width,
      height: height,
      fill: 'white',
    });
    whiteLayer.add(whiteRect);
    stage.add(whiteLayer);
    whiteLayer.moveToBottom();
    stage.draw();
  
    const dataURL = stage.toDataURL({ mimeType: 'image/jpeg', quality: 1 });
    const file = dataURLtoFile(dataURL, `${fileName.trim()}.jpg`);
    const csrfToken = await getCSRFToken();
  
    whiteLayer.destroy();
    stage.draw();
  
    const formData = new FormData();
    formData.append('file', file);
    formData.append('folder', folderId);
    formData.append('name', file.name);
  
    try {
      const response = await axios.post(`${process.env.REACT_APP_BASE_URL}upload/`, formData, {
        headers: {
          'X-CSRFToken': csrfToken, 
          'Content-Type': 'multipart/form-data'
        }
      });
      console.log('File uploaded successfully:', response.data);
      toggleModal(); // Закрыть модальное окно после загрузки
    } catch (error) {
      console.error('Error uploading file:', error.response ? error.response.data : error.message);
    }
  };

  const handleTransformEnd = (id, newAttrs) => {
    // Update the shapes state with new attributes
    const updatedShapes = shapes.map((shape) => 
      shape.shapeid === id ? { ...shape, ...newAttrs } : shape
    );
    setShapes(updatedShapes);
  };

  const handleWheel = e => {
    if (!drawing) { // Проверяем, не активно ли сейчас рисование
        e.evt.preventDefault();
        const scaleBy = 1.1;
        const stage = e.target.getStage();
        const oldScale = stage.scaleX();
        const pointer = stage.getPointerPosition();

        const mousePointTo = {
          x: (pointer.x - stage.x()) / oldScale,
          y: (pointer.y - stage.y()) / oldScale,
        };

        const newScale = e.evt.deltaY > 0 ? oldScale * scaleBy : oldScale / scaleBy;

        stage.scale({ x: newScale, y: newScale });

        const newPos = {
          x: pointer.x - mousePointTo.x * newScale,
          y: pointer.y - mousePointTo.y * newScale,
        };
        stage.position(newPos);
        stage.batchDraw();
        setScale(newScale);
        console.log("Scale:", newScale);
    }
  };

  return (
    <div>
      <Stage
        width={window.innerWidth} 
        height={window.innerHeight} 
        onWheel={handleWheel} 
        scaleX={scale} 
        scaleY={scale}
        onMouseDown={handleMouseDown}
        onMouseUp={handleMouseUp}
        onMouseMove={handleMouseMove}
        onMouseLeave={() => {
          setIsPanning(false);
          stageRef.current.container().style.cursor = 'default'; 
        }}
        ref={stageRef}
      >
        <Layer>
          {lines.map((line, index) => {
            const length = line.length;
            const lengthmin = line.lengthmin;
            const anglemin = line.anglemin;
            const textAngle = line.textAngle;
            const isSelected = index === selectedLineIndex;

            return (
              <React.Fragment key={index}>
                <Line
                  id={line.id}
                  points={line.points}
                  stroke={isSelected ? "red" : "black"}
                  strokeWidth={2}
                  draggable
                  onDragEnd={(e) => {
                    const shape = e.target;
                    
                    // Get the current absolute position
                    const newX = shape.x();
                    const newY = shape.y();
                
                    // Reset the shape's position so that the point adjustment does not double the offset
                    shape.position({ x: 0, y: 0 });
                
                    // Adjust points based on the original position before the drag
                    const adjustedPoints = shape.points().map((value, index) => {
                        return index % 2 === 0 ? value + newX : value + newY;
                    });
                
                    // Apply the new points
                    shape.points(adjustedPoints);
                
                    // Optionally reset the position if needed (usually not necessary if points are adjusted)
                    // shape.position({ x: newX, y: newY });
                
                    // Update React state or similar to re-render the component
                    const updatedLines = lines.map((line, idx) => {
                        if (idx === index) {
                            return {...line, points: adjustedPoints};
                        }
                        return line;
                    });

                    setLastLineEnds([adjustedPoints[0], adjustedPoints[1], adjustedPoints[2], adjustedPoints[3]]);                
                    setLines(updatedLines);
                }}
                  onMouseDown={(e) => handleShapeMouseDown(e, line, index)}
                  onMouseEnter={handleMouseEnter}
                  onMouseLeave={handleMouseLeave}
                />
                { isModalOpenLineM && (
                  <Circle
                    x={lastLineEnds[endPointSelection === "start" ? 0 : 2]}
                    y={lastLineEnds[endPointSelection === "start" ? 1 : 3]}
                    radius={5}
                    fill="red"
                  />
                )}
                <Text
                  x={line.textX}
                  y={line.textY} // Чуть выше середины линии
                  text={length > lengthmin ? `${Math.round(lengthmin)} - ${Math.round(length)}` : `${Math.round(length)}`}
                  fontSize={15}
                  fill={length > lengthmin ? "black" : "red"} // Красный шрифт, если условие true
                  draggable
                  onDragEnd={(e) => {
                    // Обновить положение текста при перетаскивании
                    const newLines = [...lines];
                    newLines[index] = {
                      ...newLines[index],
                      textX: e.target.x(),
                      textY: e.target.y()
                    };
                    setLines(newLines);
                  }}
                />
                {line.editable && (
                  <Text
                    x={line.textAngleX}
                    y={line.textAngleY} // Чуть ниже середины линии
                    text={textAngle <= anglemin ? `${textAngle}` : `${anglemin} - ${textAngle}`}
                    fontSize={12}
                    fill={textAngle > anglemin ? "black" : "red"}
                    draggable
                    onDragEnd={(e) => {
                      const newLines = [...lines];
                      newLines[index] = {
                        ...newLines[index],
                        textAngleX: e.target.x(),
                        textAngleY: e.target.y()
                      };
                      setLines(newLines);
                    }}
                  />
                )}
              </React.Fragment>
            );
          })}
          {shapes.map((shape, index) => (
            <ImageComponent
              key={index}
              shapeProps={shape}
              isSelected={shape.shapeid === selectedShapeId}
              onSelect={() => handleShapeSelect(shape.shapeid)}
              onChange={(newAttrs) => {
                const newShapes = shapes.slice();
                newShapes[index] = newAttrs;
                setShapes(newShapes);
              }}
            />
          ))}
          {currentLine.length > 0 && (
            <Line
              points={currentLine}
              stroke="black"
              strokeWidth={2}
            />
          )}
          <TransformerComponent selectedShapeId={selectedShapeId} onTransformEnd={handleTransformEnd} />
        </Layer>
      </Stage>
      <button onClick={toggleModal}>Save as JPG</button>
      <Modal isOpen={isModalOpen} onClose={toggleModal}>
        <div>
          <h4>Enter file name:</h4>
          <input
            type="text"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            placeholder="File name"
          />
          <button onClick={saveImage}>Save File</button>
        </div>
      </Modal>
    </div>
  );
};

export default DrawingStage;
