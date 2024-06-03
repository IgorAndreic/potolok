import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Modal from '../modal/Modal';

const BlueprintLoaderModal = ({ isOpen, onClose, loadBlueprint, folderId, setLines, setShapes }) => {
    const [blueprints, setBlueprints] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchBlueprints = async () => {
            setLoading(true);
            try {
                const response = await axios.get(`${process.env.REACT_APP_BASE_URL}folders/${folderId}/blueprints/`);
                setBlueprints(response.data);
            } catch (err) {
                setError("Ошибка при загрузке схем: " + err.message);
            } finally {
                setLoading(false);
            }
        };

        if (isOpen) {
            fetchBlueprints();
        }

    }, [isOpen, folderId]);

    const fetchLinesAndShapes = async (blueprintId) => {
        try {
            const response = await axios.get(`${process.env.REACT_APP_BASE_URL}blueprints/${blueprintId}/`);
            const { lines, shapes } = response.data;
            // Сохраняем линии и фигуры в объекте схемы
            setLines(lines);
            setShapes(shapes);
        } catch (err) {
            console.error("Ошибка при загрузке линий и фигур: " + err.message);
        }
    };

    const handleBlueprintClick = async (blueprint) => {
        await fetchLinesAndShapes(blueprint.id);
        loadBlueprint(blueprint);
    };

    return (
        <Modal isOpen={isOpen} onClose={onClose}>
            <h4>Выберите схему для загрузки</h4>
            {loading ? (
                <p>Загрузка...</p>
            ) : error ? (
                <p className="text-danger">{error}</p>
            ) : (
                <ul>
                    {blueprints.map((blueprint) => (
                        <li key={blueprint.id} onClick={() => handleBlueprintClick(blueprint)} style={{ cursor: 'pointer' }}>
                            {blueprint.name}
                        </li>
                    ))}
                </ul>
            )}
            <button onClick={onClose}>Закрыть</button>
        </Modal>
    );
};

export default BlueprintLoaderModal;
