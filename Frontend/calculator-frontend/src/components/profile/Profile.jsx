"use client"

import { useState } from "react"
import { useAuth } from "../../context/AuthContext"
import styles from "./Profile.module.css"

const Profile = ({ isOpen, onClose }) => {
  const { user, updateProfile } = useAuth()
  const [activeTab, setActiveTab] = useState("personal")
  const [showConfirmation, setShowConfirmation] = useState(false)
  const [confirmationType, setConfirmationType] = useState("")
  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({ ...prev, [name]: value }))
    if (errors[name]) {
      setErrors((prev) => ({ ...prev, [name]: "" }))
    }
  }

  const validateForm = () => {
    const newErrors = {}

    if (!formData.name.trim()) {
      newErrors.name = "El nombre es requerido"
    } else if (!/^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/.test(formData.name)) {
      newErrors.name = "El nombre solo puede contener letras"
    }

    if (!formData.email.trim()) {
      newErrors.email = "El email es requerido"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Email inválido"
    }

    if (activeTab === "password") {
      if (!formData.currentPassword) {
        newErrors.currentPassword = "La contraseña actual es requerida"
      }

      if (!formData.newPassword) {
        newErrors.newPassword = "La nueva contraseña es requerida"
      } else if (formData.newPassword.length < 8) {
        newErrors.newPassword = "Debe tener al menos 8 caracteres"
      } else if (
        !/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])/.test(formData.newPassword)
      ) {
        newErrors.newPassword =
          "Debe incluir mayúsculas, minúsculas, números y caracteres especiales"
      }

      if (formData.newPassword !== formData.confirmPassword) {
        newErrors.confirmPassword = "Las contraseñas no coinciden"
      }
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    if (!validateForm()) return

    if (activeTab === "password" || formData.email !== user?.email) {
      setConfirmationType(activeTab === "password" ? "password" : "email")
      setShowConfirmation(true)
      return
    }

    saveChanges()
  }

  const saveChanges = async () => {
    setIsLoading(true)
    try {
      await updateProfile(formData)
      onClose()
    } catch (error) {
      setErrors({ general: "Error al actualizar el perfil" })
    } finally {
      setIsLoading(false)
      setShowConfirmation(false)
    }
  }

  const handleConfirmation = (confirmed) => {
    if (confirmed) {
      saveChanges()
    } else {
      setShowConfirmation(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className={styles.modalOverlay} onClick={onClose}>
      <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
        
        {/* Header */}
        <div className={styles.modalHeader}>
          <h2 className={styles.modalTitle}>Gestionar Perfil</h2>
          <button className={styles.closeButton} onClick={onClose}>
            <span>×</span>
          </button>
        </div>

        {/* Tabs */}
        <div className={styles.tabContainer}>
          <button
            className={`${styles.tab} ${activeTab === "personal" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("personal")}
          >
            Información Personal
          </button>
          <button
            className={`${styles.tab} ${activeTab === "password" ? styles.activeTab : ""}`}
            onClick={() => setActiveTab("password")}
          >
            Cambiar Contraseña
          </button>
        </div>

        {/* Form */}
        <form className={styles.form} onSubmit={handleSubmit}>
          {activeTab === "personal" && (
            <div className={styles.tabContent}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Nombre</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.name ? styles.inputError : ""}`}
                  placeholder="Tu nombre completo"
                />
                {errors.name && <span className={styles.errorText}>{errors.name}</span>}
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Email</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
                  placeholder="tu@email.com"
                />
                {errors.email && <span className={styles.errorText}>{errors.email}</span>}
              </div>
            </div>
          )}

          {activeTab === "password" && (
            <div className={styles.tabContent}>
              <div className={styles.inputGroup}>
                <label className={styles.label}>Contraseña Actual</label>
                <input
                  type="password"
                  name="currentPassword"
                  value={formData.currentPassword}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.currentPassword ? styles.inputError : ""}`}
                  placeholder="Tu contraseña actual"
                />
                {errors.currentPassword && (
                  <span className={styles.errorText}>{errors.currentPassword}</span>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Nueva Contraseña</label>
                <input
                  type="password"
                  name="newPassword"
                  value={formData.newPassword}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.newPassword ? styles.inputError : ""}`}
                  placeholder="Nueva contraseña"
                />
                {errors.newPassword && (
                  <span className={styles.errorText}>{errors.newPassword}</span>
                )}
              </div>

              <div className={styles.inputGroup}>
                <label className={styles.label}>Confirmar Nueva Contraseña</label>
                <input
                  type="password"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  className={`${styles.input} ${errors.confirmPassword ? styles.inputError : ""}`}
                  placeholder="Confirma tu nueva contraseña"
                />
                {errors.confirmPassword && (
                  <span className={styles.errorText}>{errors.confirmPassword}</span>
                )}
              </div>
            </div>
          )}

          {errors.general && <div className={styles.generalError}>{errors.general}</div>}

          {/* Actions */}
          <div className={styles.modalActions}>
            <button type="button" className={styles.cancelButton} onClick={onClose}>
              Cancelar
            </button>
            <button type="submit" className={styles.saveButton} disabled={isLoading}>
              {isLoading ? "Guardando..." : "Guardar Cambios"}
            </button>
          </div>
        </form>

        {/* Confirmation Modal */}
        {showConfirmation && (
          <div className={styles.confirmationOverlay}>
            <div className={styles.confirmationModal}>
              <h3 className={styles.confirmationTitle}>Confirmar Cambios</h3>
              <p className={styles.confirmationText}>
                {confirmationType === "password"
                  ? "¿Estás seguro de que deseas cambiar tu contraseña? Esto requerirá que inicies sesión nuevamente."
                  : "¿Estás seguro de que deseas cambiar tu email? Esto podría afectar tu acceso a la cuenta."}
              </p>
              <div className={styles.confirmationActions}>
                <button
                  className={styles.confirmationCancel}
                  onClick={() => handleConfirmation(false)}
                >
                  Cancelar
                </button>
                <button
                  className={styles.confirmationConfirm}
                  onClick={() => handleConfirmation(true)}
                >
                  Confirmar
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default Profile
