import React, { useRef, useEffect, useState } from 'react';
import { Image, Transformer } from 'react-konva';

const ImageComponent = ({ shapeProps, isSelected, onSelect, onChange }) => {
  const shapeRef = useRef();
  const trRef = useRef();
  const [image, setImage] = useState(null);

  useEffect(() => {
    const img = new window.Image();
    img.src = '/arrow.svg';
    img.onload = () => {
      setImage(img);
    };
  }, []);

  useEffect(() => {
    if (isSelected) {
      // attach transformer manually
      trRef.current.nodes([shapeRef.current]);
      trRef.current.getLayer().batchDraw();
    }
  }, [isSelected]);

  return (
    <React.Fragment>
      <Image
        onClick={onSelect}
        onTap={onSelect}
        ref={shapeRef}
        image={image}
        {...shapeProps}
        draggable
        onDragEnd={(e) => {
          const node = shapeRef.current;
          onChange({
            ...shapeProps,
            x: e.target.x(),
            y: e.target.y(),
            rotation: node.rotation(),
          });
        }}
        onTransformEnd={(e) => {
          const node = shapeRef.current;
          const scaleX = node.scaleX();
          const scaleY = node.scaleY();
          node.scaleX(1);
          node.scaleY(1);
          onChange({
            ...shapeProps,
            x: node.x(),
            y: node.y(),
            width: Math.max(5, node.width() * scaleX),
            height: Math.max(5, node.height() * scaleY),
            rotation: node.rotation(),
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

export default ImageComponent;
