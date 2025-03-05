import React from "react";
import { ConfirmationModal } from "../types";


const Modal: React.FC<ConfirmationModal> = ({ onCancel, onConfirm, title, message, showButtons = true }) => {
    return <div className="modal-overlay" onClick={onCancel}>
        <div className="modal-container" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header">
                <h3>{title}</h3>
                <button className="modal-close" onClick={onCancel}>×</button>
            </div>
            <div className="modal-content">
                <p>{message}</p>
            </div>
            {showButtons && (
                <div className="modal-actions">
                    <button onClick={onCancel}>Cancel</button>
                    <button className="danger-button" onClick={onConfirm}>Confirm</button>
                </div>
            )}
        </div>
    </div>
}


export default Modal;
