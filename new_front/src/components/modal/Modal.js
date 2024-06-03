import React, { useRef } from 'react';
import ReactDOM from 'react-dom';
import Draggable from 'react-draggable';
import '../css/Modal.css'; // Импорт стилей модального окна

const Modal = ({ isOpen, onClose, children }) => {
    const dragHandleRef = useRef(null);  // Create a ref for the draggable handle

    if (!isOpen) return null;

    return ReactDOM.createPortal(
        <div className="modal-overlay">
            <Draggable handle=".modal-handle" nodeRef={dragHandleRef}>
                <div className="modal-container" ref={dragHandleRef}>
                    <div className="modal-handle" style={{ cursor: 'move' }}>
                        <button onClick={onClose} className="close-button">&times;</button>
                    </div>
                    {children}
                </div>
            </Draggable>
        </div>,
        document.getElementById("modal-root")
    );
};
export default Modal;
