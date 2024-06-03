import React from 'react';
import { Text } from 'react-konva';

const TextLine = ({ text, x, y, onDragMove }) => {
    return (
        <Text
            text={text}
            x={x}
            y={y}
            fontSize={14}
            draggable
            fill="black"
            onDragMove={onDragMove}
        />
    );
};

export default TextLine;
