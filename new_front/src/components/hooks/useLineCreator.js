import React from 'react';
import { useState } from 'react';
import { calculateLength, calculateAngle } from '../utils/mathUtils';
import { snapLines } from '../utils/snapUtils';
import { v4 as uuidv4 } from 'uuid'; 

function useLineCreator(_stageRef) {
    const [lines, setLines] = useState([]);
    const [shapes, setShapes] = useState([]);
    const [currentLine, setCurrentLine] = useState([]);
    const [drawing, setDrawing] = useState(false);
    const [lastLineEnds, setLastLineEnds] = useState([]); // Начальная точка для новой линии

    const [isPanning, setIsPanning] = useState(false);
    const [lastPosition, setLastPosition] = useState({ x: 0, y: 0 });

    const stageRef = _stageRef || React.createRef();

    const addArrow = () => {
        const arrowId = uuidv4();
        const arrowImageData = {
        shapeid: arrowId,
        x: 50,
        y: 60,
        width: 100, 
        height: 100,
        rotation: 0, // Initial rotation angle
        scaleX: 1,   // Initial scale X
        scaleY: 1,   // Initial scale Y
        type: 'arrow',
        draggable: true,
        editable: true,
        };
        setShapes(prevShapes => [...prevShapes, arrowImageData]);
    };
    
    const handleMouseDown = (e) => {
          const clickedOnEmpty = e.target === e.target.getStage();
          if (e.evt.ctrlKey) {
              setIsPanning(true);
              setLastPosition({ x: e.evt.clientX, y: e.evt.clientY });
              stageRef.current.container().style.cursor = 'grabbing';
              setDrawing(false);
          } else if (clickedOnEmpty) {
              if (stageRef.current) {
                console.log("Stage ref:", stageRef.current);
                  const pointer = stageRef.current.getPointerPosition(); 
                  console.log("Pointer:", pointer);
                  if (pointer) {
                      setCurrentLine([pointer.x, pointer.y, pointer.x, pointer.y]);

                      console.log("Current line:", currentLine);
                      setDrawing(true);
                  }
              }
          }
      };

    const handleMouseUp = () => {
        if (isPanning) {
            setIsPanning(false);
            stageRef.current.container().style.cursor = 'default';
            return;
        }   
        if (drawing && stageRef.current) {
            const { x, y } = stageRef.current.getPointerPosition();
            const length = calculateLength(currentLine[0], currentLine[1], x, y);
            if (length < 5) {
                setDrawing(false);
                return;
            }
            const angle = calculateAngle(currentLine[0], currentLine[1], x, y);

            let textAngle = 0;
            
            let newLine = {
                points: [currentLine[0], currentLine[1], x, y],
                length,
                lengthmin: length,
                angle,
                anglemin: textAngle,
                editable: false,
                text: `${Math.round(length)}`,
                textX: (currentLine[0] + x) / 2,
                textY: (currentLine[1] + y) / 2 - 10,
                textAngle: textAngle, 
                textAngleX: currentLine[0] - 20,
                textAngleY: currentLine[1],
            };
    
            let newLines = [...lines, newLine];
            const snapResult = snapLines (newLines, 20);
            newLines = snapResult;

            setLastLineEnds([currentLine[0], currentLine[1], x, y, newLine.angle]);
    
            setLines(newLines);
            setCurrentLine([]);
            setDrawing(false);
        }
    };

    const handleMouseMove = (e) => {
          if (isPanning) {
              const stage = stageRef.current;
              const deltaX = e.evt.clientX - lastPosition.x;
              const deltaY = e.evt.clientY - lastPosition.y;
              setLastPosition({ x: e.evt.clientX, y: e.evt.clientY });
      
              const newPos = {
                  x: stage.x() + deltaX,
                  y: stage.y() + deltaY
              };
              stage.position(newPos);
              stage.batchDraw();
      
              if (drawing) {
                  setDrawing(false); // Отключаем рисование, чтобы предотвратить ошибки во время панорамирования
              }
          } else if (drawing && stageRef.current) {
              const pointer = stageRef.current.getPointerPosition(); // Получаем координаты с учётом смещения и масштаба
              if (pointer) {
                  setCurrentLine([currentLine[0], currentLine[1], pointer.x, pointer.y]);
              }
          }
      };
  
    return { lines, shapes, currentLine, handleMouseDown, handleMouseUp, handleMouseMove, addArrow, setShapes, setDrawing, setLines, setLastLineEnds, lastLineEnds, setIsPanning, drawing};
}

export default useLineCreator;
