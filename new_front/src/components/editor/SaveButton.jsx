import React, { useState } from 'react';
import axios from 'axios';
import Modal from '../modal/Modal';

const getCSRFToken = async () => {
    const response = await axios.get(`${process.env.REACT_APP_BASE_URL}csrf/`);
    console.log("CSRF token received:", response.data.csrfToken);
    return response.data.csrfToken;
};

const SaveButton = ({ lines, shapes, folderId }) => {
    const [isModalOpen, setModalOpen] = useState(false);
    const [blueprintName, setBlueprintName] = useState("");

    const saveBlueprint = async () => {
        const csrfToken = await getCSRFToken();
        console.log("Starting to save the blueprint:", blueprintName);
        const payload = {
            name: blueprintName,
            folder: folderId,
            lines: lines.map(line => ({
                points: line.points,
                length: line.length,
                lengthmin: line.lengthmin,
                angle: line.angle,
                anglemin: line.anglemin || 0,
                editable: line.editable,
                text: line.text,
                textX: line.textX,
                textY: line.textY,
                textAngle: line.textAngle,
                textAngleX: line.textAngleX,
                textAngleY: line.textAngleY
            })),
            shapes: shapes.map(shape => ({
                shapeid: shape.shapeid,
                x: shape.x,
                y: shape.y,
                width: shape.width,
                height: shape.height,
                rotation: shape.rotation,
                scaleX: shape.scaleX,
                scaleY: shape.scaleY,
                type: shape.type,
                draggable: shape.draggable,
                editable: shape.editable
            }))
        };
        console.log("Payload prepared for saving:", payload);

        try {
            const response = await axios.post(`${process.env.REACT_APP_BASE_URL}blueprints/`, payload,  {
                headers: {
                    'X-CSRFToken': csrfToken // Set the CSRF token in headers
                }
            });

            console.log("Blueprint saved successfully", response.data);
            setModalOpen(false);
        } catch (error) {
            console.error("Error saving blueprint:", error.response ? error.response.data : error.message);
        }
    };

    const handleSaveClick = () => {
        console.log("Opening modal to save blueprint.");
        setModalOpen(true);
    };

    return (
        <>
            <button className="btn btn-outline-dark mx-1" onClick={handleSaveClick}>Сохранить как...</button>
            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={() => {
                    console.log("Closing modal.");
                    setModalOpen(false);
                }}>
                    <input
                        type="text"
                        placeholder="Введите имя схемы"
                        value={blueprintName}
                        onChange={(e) => setBlueprintName(e.target.value)}
                    />
                    <button onClick={saveBlueprint}>Сохранить Схему</button>
                </Modal>
            )}
        </>
    );
};

export default SaveButton;
