import { useState } from 'react';

function useLineEditor() {
    const [lines, setLines] = useState([]);
    const [selectedLineIndex, setSelectedLineIndex] = useState(null);

    const selectLine = (index) => {
        setSelectedLineIndex(index);
    };

    const updateLine = (index, newPoints) => {
        const updatedLines = lines.map((line, idx) => 
            idx === index ? { ...line, points: newPoints } : line
        );
        setLines(updatedLines);
    };

    const deleteLine = (index) => {
        const filteredLines = lines.filter((_, idx) => idx !== index);
        setLines(filteredLines);
    };

    return { lines, selectedLineIndex, selectLine, updateLine, deleteLine };
}

export default useLineEditor;