"use client"

import { useState } from "react"
import { registerUserWithFirebaseAuth } from "../../services/authService"
import styles from "./Register.module.css"

const Register = () => {
  const [formData, setFormData] = useState({
    cedula: "",
    nombre: "",
    apellido: "",
    estrato: "",
    email: "",
    password: "",
  })
  const [errors, setErrors] = useState({})
  const [isLoading, setIsLoading] = useState(false)
  const [successMessage, setSuccessMessage] = useState("")

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const validatePassword = (password) => {
    const minLength = password.length >= 8
    const hasUpperCase = /[A-Z]/.test(password)
    const hasLowerCase = /[a-z]/.test(password)
    const hasNumbers = /\d/.test(password)
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password)

    return minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
  }

  const validateName = (name) => {
    const nameRegex = /^[a-zA-ZáéíóúÁÉÍÓÚñÑ\s]+$/
    return nameRegex.test(name) && name.trim().length > 0
  }

  const validateCedula = (cedula) => {
    const cedulaRegex = /^\d+$/
    return cedulaRegex.test(cedula) && Number.parseInt(cedula) > 0
  }

  const handleChange = (e) => {
    const { name, value } = e.target

    if (name === "cedula") {
      const numericValue = value.replace(/[^0-9]/g, "")
      setFormData((prev) => ({
        ...prev,
        [name]: numericValue,
      }))
    }
    else if (name === "nombre" || name === "apellido") {
      const nameValue = value.replace(/[0-9]/g, "")
      setFormData((prev) => ({
        ...prev,
        [name]: nameValue,
      }))
    } else {
      setFormData((prev) => ({
        ...prev,
        [name]: value,
      }))
    }

    if (errors[name]) {
      setErrors((prev) => ({
        ...prev,
        [name]: "",
      }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    setErrors({})
    setSuccessMessage("")

    const newErrors = {}

    if (!validateCedula(formData.cedula)) {
      newErrors.cedula = "La cédula debe ser un número positivo válido"
    }

    if (!validateName(formData.nombre)) {
      newErrors.nombre = "El nombre solo puede contener letras y espacios"
    }

    if (!validateName(formData.apellido)) {
      newErrors.apellido = "El apellido solo puede contener letras y espacios"
    }

    if (!validateEmail(formData.email)) {
      newErrors.email = "Ingresa un correo electrónico válido"
    }

    if (!validatePassword(formData.password)) {
      newErrors.password = "La contraseña debe tener mínimo 8 caracteres, incluir mayúsculas, minúsculas, números y caracteres especiales"
    }

    if (!formData.estrato) {
      newErrors.estrato = "Selecciona tu estrato social"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    setIsLoading(true)

    try {
      const result = await registerUserWithFirebaseAuth(formData)

      if (result.success) {
        setSuccessMessage(result.message)
        setFormData({
          cedula: "",
          nombre: "",
          apellido: "",
          estrato: "",
          email: "",
          password: "",
        })
      } else {
        setErrors(result.errors)
      }
    } catch (error) {
      console.error("Error durante el registro:", error)
      setErrors({
        general: "Error inesperado durante el registro. Por favor intenta de nuevo."
      })
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Crear Cuenta</h1>
          <p className={styles.subtitle}>Únete a CalcuLuz y comienza a ahorrar energía</p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="cedula" className={styles.label}>
              Número de Cédula
            </label>
            <input
              type="text"
              id="cedula"
              name="cedula"
              value={formData.cedula}
              onChange={handleChange}
              className={`${styles.input} ${errors.cedula ? styles.inputError : ""}`}
              placeholder="12345678"
            />
            {errors.cedula && <span className={styles.error}>{errors.cedula}</span>}
          </div>

          <div className={styles.row}>
            <div className={styles.inputGroup}>
              <label htmlFor="nombre" className={styles.label}>
                Nombre
              </label>
              <input
                type="text"
                id="nombre"
                name="nombre"
                value={formData.nombre}
                onChange={handleChange}
                className={`${styles.input} ${errors.nombre ? styles.inputError : ""}`}
                placeholder="Juan"
              />
              {errors.nombre && <span className={styles.error}>{errors.nombre}</span>}
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="apellido" className={styles.label}>
                Apellido
              </label>
              <input
                type="text"
                id="apellido"
                name="apellido"
                value={formData.apellido}
                onChange={handleChange}
                className={`${styles.input} ${errors.apellido ? styles.inputError : ""}`}
                placeholder="Pérez"
              />
              {errors.apellido && <span className={styles.error}>{errors.apellido}</span>}
            </div>
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="estrato" className={styles.label}>
              Estrato Social (1-6)
            </label>
            <select
              id="estrato"
              name="estrato"
              value={formData.estrato}
              onChange={handleChange}
              className={`${styles.input} ${styles.select} ${errors.estrato ? styles.inputError : ""}`}
            >
              <option value="">Selecciona tu estrato</option>
              <option value="1">Estrato 1</option>
              <option value="2">Estrato 2</option>
              <option value="3">Estrato 3</option>
              <option value="4">Estrato 4</option>
              <option value="5">Estrato 5</option>
              <option value="6">Estrato 6</option>
            </select>
            {errors.estrato && <span className={styles.error}>{errors.estrato}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>
              Correo Electrónico
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
              placeholder="tu@email.com"
            />
            {errors.email && <span className={styles.error}>{errors.email}</span>}
          </div>

          <div className={styles.inputGroup}>
            <label htmlFor="password" className={styles.label}>
              Contraseña
            </label>
            <input
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleChange}
              className={`${styles.input} ${errors.password ? styles.inputError : ""}`}
              placeholder="••••••••"
            />
            {errors.password && <span className={styles.error}>{errors.password}</span>}
            <div className={styles.passwordHint}>
              Mínimo 8 caracteres, incluir mayúsculas, minúsculas, números y caracteres especiales
            </div>
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`${styles.submitButton} ${isLoading ? styles.loading : ""}`}
          >
            {isLoading ? "Creando cuenta..." : "Crear Cuenta"}
          </button>

          {successMessage && (
            <div className={styles.successMessage}>
              {successMessage}
            </div>
          )}

          {errors.general && (
            <div className={styles.errorMessage}>
              {errors.general}
            </div>
          )}
        </form>

        <div className={styles.footer}>
          <p>
            ¿Ya tienes cuenta?{" "}
            <a href="/login" className={styles.link}>
              Inicia sesión aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  )
}

export default Register
