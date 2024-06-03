import React from 'react';
import SaveButton from './SaveButton';
import UpdateButton from './UpdateButton';

const ToolBar = ({ lines, shapes, folderId, setIsLoaderModalOpen, blueprintId, blueprintName }) => {
    
    const handleOpenClick = () => {
        setIsLoaderModalOpen(true);
    };

    return (
        <>
            <button className="btn btn-outline-dark mx-1" onClick={handleOpenClick}>Открыть</button>
            <UpdateButton folderId={folderId} blueprintId={blueprintId} blueprintName={blueprintName} lines={lines} shapes={shapes} />
            <SaveButton lines={lines} shapes={shapes} folderId={folderId} />
        </>
    );
};

export default ToolBar;
