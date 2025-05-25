// components/Modal/Modal.tsx
'use client'
import styles from './Modal.module.css';
export default function Modal({ isOpen, onClose, children }) {
  if (!isOpen) return null;
  return (
    <div className={styles.modalContainer} onClick={onClose}>
      <div className={styles.modalContent} onClick={e => e.stopPropagation()}>
        <div className={styles.modalHeader}>
          {/* aqui você pode passar título via props ou como children */}
          <button className={styles.closeButton} onClick={onClose}>×</button>
        </div>
        <div className={styles.modalBody}>
          {children}
        </div>
      </div>
    </div>
  );
}
