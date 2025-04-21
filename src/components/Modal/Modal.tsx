import React from "react";
import styles from "./Modal.module.css";

interface ModalProps {
    open: boolean;
    onClose: () => void;
    children: React.ReactNode;
    className?: string;
}

export function Modal({ open, onClose, children, className = "" }: ModalProps) {
    if (!open) return null;
    return (
        <div className={styles.modalOverlay} onClick={onClose}>
            <div
                className={`${styles.modal} ${className}`}
                onClick={e => e.stopPropagation()}
            >
                {children}
            </div>
        </div>
    );
}