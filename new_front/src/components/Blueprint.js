import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Blueprint = ({ blueprintId }) => {
  const [blueprint, setBlueprint] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchBlueprint = async () => {
      if (!blueprintId) return;

      setLoading(true);
      setError('');
      try {
        const response = await axios.get(`${process.env.REACT_APP_BASE_URL}blueprints/${blueprintId}/`);
        setBlueprint(response.data);
      } catch (err) {
        console.error('Failed to fetch blueprint:', err);
        setError('Failed to load blueprint');
      } finally {
        setLoading(false);
      }
    };

    fetchBlueprint();
  }, [blueprintId]);

  if (loading) return <div>Loading blueprint...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!blueprint) return <div>Blueprint not found.</div>;

  return (
    <div className='blueprint-details'>
      <h2>{blueprint.name}</h2>
      <ul>
        {blueprint.shapes.map(shape => (
          <li key={shape.id}>{shape.name}</li>
        ))}
      </ul>
    </div>
  );
};

export default Blueprint;
