import { useModalStore } from "../store";
import { useEffect } from "react";

const Modal = () => {
    const { title, isOpen, message, onCancel, onConfirm, showButtons } = useModalStore();

    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape' && isOpen) {
                onCancel();
            }
        };

        window.addEventListener('keydown', handleKeyDown);
        
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
        };
    }, [isOpen, onCancel]);

    if (!isOpen) return <></>;

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
