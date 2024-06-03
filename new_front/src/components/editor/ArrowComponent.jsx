import React, { useRef, useEffect } from 'react';
import { Arrow, Transformer } from 'react-konva';

const ArrowComponent = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef();
  const trRef = useRef();

  useEffect(() => {
    if (isSelected) {
      // attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Arrow
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        {...shapeProps}
        draggable
        onDragEnd={(e) => {
          onChange({
            ...shapeProps,
            points: [
              e.target.points()[0],
              e.target.points()[1],
              e.target.points()[2],
              e.target.points()[3]
            ],
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          onChange({
            ...shapeProps,
            points: node.points(),
          });
        }}
      />
      {isSelected && (
        <Transformer
          ref={trRef}
          boundBoxFunc={(oldBox, newBox) => {
            // limit resize
            if (Math.abs(newBox.width) < 5 || Math.abs(newBox.height) < 5) {
              return oldBox;
            }
            return newBox;
          }}
        />
      )}
    </React.Fragment>
  );
};

export default ArrowComponent;
