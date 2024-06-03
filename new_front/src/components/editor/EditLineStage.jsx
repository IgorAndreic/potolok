import React, { useState } from 'react';
import { Stage, Layer, Line, Circle, Transformer } from 'react-konva';

const EditLineStage = () => {
  const [lines, setLines] = useState([]);
  const [selectedId, selectShape] = useState(null);
  const [anchors, setAnchors] = useState([]);

  const checkDeselect = (e) => {
    // Deselect when clicking on the empty area
    const clickedOnEmpty = e.target === e.target.getStage();
    if (clickedOnEmpty) {
      selectShape(null);
    }
  };

  const handleDragStart = (e) => {
    const id = e.target.id();
    selectShape(id);
  };

  const handleDragEnd = (e) => {
    const id = e.target.id();
    const line = lines.find(line => line.id === id);
    const idx = lines.indexOf(line);
    const newLines = lines.concat();
    newLines[idx] = {
      ...line,
      points: [e.target.x(), e.target.y(), e.target.attrs.x2, e.target.attrs.y2]
    };
    setLines(newLines);
  };

  const handleAnchorDragEnd = (index, pointIndex, e) => {
    const newLines = lines.map((line, idx) => {
      if (idx === index) {
        const newPoints = line.points.slice();
        newPoints[pointIndex] = e.target.x();
        newPoints[pointIndex + 1] = e.target.y();
        return { ...line, points: newPoints };
      }
      return line;
    });
    setLines(newLines);
  };

  const handleLineClick = (id) => {
    selectShape(id);
  };

  return (
    <Stage
      width={window.innerWidth}
      height={window.innerHeight}
      onMouseDown={checkDeselect}
      onTouchStart={checkDeselect}
    >
      <Layer>
        {lines.map((line, i) => (
          <React.Fragment key={line.id}>
            <Line
              id={line.id}
              points={line.points}
              stroke={line.color}
              strokeWidth={5}
              draggable
              onDragStart={handleDragStart}
              onDragEnd={handleDragEnd}
              onClick={() => handleLineClick(line.id)}
            />
            {line.points.map((point, index) => (
              index % 2 === 0 && (
                <Circle
                  key={index}
                  x={point}
                  y={line.points[index + 1]}
                  radius={5}
                  fill="red"
                  draggable
                  onDragEnd={(e) => handleAnchorDragEnd(i, index, e)}
                />
              )
            ))}
          </React.Fragment>
        ))}
        {selectedId && (
          <Transformer
            nodes={[lines.find(line => line.id === selectedId)]}
          />
        )}
      </Layer>
    </Stage>
  );
};

export default EditLineStage;
