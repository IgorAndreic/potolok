import React, { useState } from 'react';
import axios from 'axios';

const BlueprintAction = ({ blueprintId }) => {
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    try {
      const url = blueprintId ? `${process.env.REACT_APP_BASE_URL}blueprints/${blueprintId}/` : `${process.env.REACT_APP_BASE_URL}blueprints/`;
      const method = blueprintId ? 'put' : 'post';

      const response = await axios[method](url, { name });
      console.log('Success:', response.data);
    } catch (err) {
      console.error('Error saving blueprint:', err);
      setError('Error saving blueprint');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <label>
        Blueprint Name:
        <input type="text" value={name} onChange={e => setName(e.target.value)} />
      </label>
      <button type="submit" disabled={loading}>
        {blueprintId ? 'Update Blueprint' : 'Create Blueprint'}
      </button>
      {error && <div>{error}</div>}
    </form>
  );
};

export default BlueprintAction;
