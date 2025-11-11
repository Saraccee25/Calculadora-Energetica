import React from "react";
import styles from "./ConfirmModal.module.css";

const ConfirmModal = ({
  isOpen,
  title = "Are you sure?",
  message = "Do you want to continue?",
  confirmText = "Yes",
  cancelText = "No",
  onConfirm,
  onCancel,
}) => {
  if (!isOpen) return null;

  return (
    <div className={styles.overlay} role="dialog" aria-modal="true">
      <div className={styles.backdrop} onClick={onCancel} />
      <div className={styles.modalCard}>
        <div className={styles.iconWrap}>
          <div className={styles.icon}>!</div>
        </div>
        <h2 className={styles.title}>{title}</h2>
        <p className={styles.message}>{message}</p>
        <div className={styles.actions}>
          <button className={styles.cancelBtn} type="button" onClick={onCancel}>
            {cancelText}
          </button>
          <button
            className={styles.confirmBtn}
            type="button"
            onClick={onConfirm}
          >
            {confirmText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmModal;
