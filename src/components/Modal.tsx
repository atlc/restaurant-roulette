import { useModalStore } from "../store";

const Modal = () => {
    const { title, isOpen, message, onCancel, onConfirm, showButtons, setIsOpen } = useModalStore();

    if (!isOpen) return <></>;

    const handleClose = (e: React.KeyboardEvent<HTMLDivElement>) => {
        if (e.key === 'Escape') {
            setIsOpen(false);
        }
    };

    return <div onKeyDown={handleClose} className="modal-overlay" onClick={onCancel}>
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
