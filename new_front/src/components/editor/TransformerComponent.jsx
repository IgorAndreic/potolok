import React, { useRef, useEffect } from 'react';
import { Transformer } from 'react-konva';

const TransformerComponent = ({ selectedShapeId, onTransformEnd }) => {
  const trRef = useRef();

  useEffect(() => {
    const transformer = trRef.current;
    if (!transformer) return;

    const stage = transformer.getStage();
    const layer = transformer.getLayer();

    let selectedNode = null;

    const handleTransformEnd = (e) => {
      const node = e.target;
      const newAttrs = {
        x: node.x(),
        y: node.y(),
        rotation: node.rotation(),
        scaleX: node.scaleX(),
        scaleY: node.scaleY(),
      };
      onTransformEnd(selectedShapeId, newAttrs);
    };

    if (selectedShapeId) {
      const selectedNode = stage.findOne(`#${selectedShapeId}`);
      if (selectedNode) {
        transformer.nodes([selectedNode]);
        layer.batchDraw();
        selectedNode.on('transformend', handleTransformEnd);
      }
    } else {
      transformer.nodes([]);
      layer.batchDraw();
    }

    return () => {
      if (selectedNode) {
        selectedNode.off('transformend', handleTransformEnd);
      }
    };
  }, [selectedShapeId, onTransformEnd]);

  return <Transformer ref={trRef} />;
};

export default TransformerComponent;
