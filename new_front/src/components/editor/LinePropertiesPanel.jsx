import React, { useState, useEffect } from 'react';

const LinePropertiesPanel = ({ currentLine }) => {
  const [values, setValues] = useState({
    startX: 0,
    startY: 0,
    endX: 0,
    endY: 0,
    length: 0,
    angle: 0
  });

  useEffect(() => {
    if (currentLine) {
      setValues({
        startX: currentLine.startX,
        startY: currentLine.startY,
        endX: currentLine.endX,
        endY: currentLine.endY,
        length: currentLine.length,
        angle: currentLine.angle
      });
    }
  }, [currentLine]);

  if (!currentLine) return null;  
  return (
    <div>
      <div>Start X: {values.startX}</div>
      <div>Start Y: {values.startY}</div>
      <div>End X: {values.endX}</div> 
      <div>End Y: {values.endY}</div>
      <div>Length: {values.length}</div>
      <div>Angle: {values.angle}</div>
    </div>
  );
};

export default LinePropertiesPanel;
