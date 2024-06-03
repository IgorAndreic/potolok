import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import DrawingStageOrder from './editor/DrawingStageOrder'; 
import useLineCreator from './hooks/useLineCreator';
import 'bootstrap/dist/css/bootstrap.min.css';

const BlueprintOrder = () => {
  const location = useLocation();
  const { folderName, folderId, blueprintId, blueprintName } = location.state;

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const stageRef = useRef();
  const { lines, shapes, setShapes, setLines } = useLineCreator(stageRef);

  useEffect(() => {
    const fetchBlueprintData = async () => {
      if (!blueprintId) return;
      
      setLoading(true);
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}blueprints/${blueprintId}`);
        console.log("Received blueprint data:", response.data);
        setLines(response.data.lines);
        setShapes(response.data.shapes);
      } catch (err) {
        console.error('Failed to load blueprint:', err);
        setError('Failed to load blueprint');
      } finally {
        setLoading(false);
      }
    };

    fetchBlueprintData();
  }, [blueprintId, setLines, setShapes]);

  if (loading) return <div>Loading blueprint...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className='container'>
      <h3 className="text-center mt-3">{`${folderName} / ${blueprintName}`}</h3>
      <DrawingStageOrder
        lines={lines}
        shapes={shapes}
        setLines={setLines}
        setShapes={setShapes}
        stageRef={stageRef}
        folderId={folderId}
      />
    </div>
  );
};

export default BlueprintOrder;
