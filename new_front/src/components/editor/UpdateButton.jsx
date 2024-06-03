import React, { useState } from 'react';
import axios from 'axios';
import Modal from '../modal/Modal';

const getCSRFToken = async () => {
    const response = await axios.get(`${process.env.REACT_APP_BASE_URL}csrf/`);
    console.log("CSRF token received:", response.data.csrfToken);
    return response.data.csrfToken;
};

const UpdateButton = ({ folderId, blueprintId, blueprintName, lines, shapes }) => {
    const [isModalOpen, setModalOpen] = useState(false);

    const deleteBlueprintContents = async (csrfToken) => {
        console.log("Deleting blueprint contents");
        try {
            await axios.delete(`${process.env.REACT_APP_BASE_URL}blueprints/${blueprintId}/contents/`, {
                headers: {
                    'X-CSRFToken': csrfToken // Set the CSRF token in headers
                }
            });
            console.log("Blueprint contents deleted successfully.");
        } catch (error) {
            console.error("Error deleting blueprint contents:", error.response ? error.response.data : error.message);
            throw error;  // Re-throw to handle it in the calling function
        }
    };

    const updateBlueprint = async () => {
        const csrfToken = await getCSRFToken();
        try {
            await deleteBlueprintContents(csrfToken); // Delete contents before updating
            console.log("Starting to update the blueprint:", blueprintName);
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
            console.log("Payload prepared for updating:", payload);

            const response = await axios.put(`${process.env.REACT_APP_BASE_URL}blueprints/${blueprintId}/`, payload, {
                headers: {
                    'X-CSRFToken': csrfToken // Set the CSRF token in headers
                }
            });
            console.log("Blueprint updated successfully", response.data);
            setModalOpen(false);
        } catch (error) {
            console.error("Error updating blueprint:", error.response ? error.response.data : error.message);
        }
    };

    const handleUpdateClick = () => {
        console.log("Opening modal to update blueprint.");
        setModalOpen(true);
    };

    return (
        <>
            <button className="btn btn-outline-dark mx-1" onClick={handleUpdateClick}>Сохранить</button>
            {isModalOpen && (
                <Modal isOpen={isModalOpen} onClose={() => {
                    console.log("Closing modal.");
                    setModalOpen(false);
                }}>
                    <p>Вы уверены, что хотите обновить схему "{blueprintName}"?</p>
                    <button onClick={updateBlueprint}>Обновить Схему</button>
                </Modal>
            )}
        </>
    );
};

export default UpdateButton;
