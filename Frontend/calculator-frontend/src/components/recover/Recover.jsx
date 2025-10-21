"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { recoverPassword, checkFirebaseAuthStatus, getPasswordResetTroubleshootingInfo } from "../../services/authService";
import styles from "./Recover.module.css";

const Recover = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [successMessage, setSuccessMessage] = useState("");
  const [showTroubleshooting, setShowTroubleshooting] = useState(false);
  const [authStatus, setAuthStatus] = useState(null);

  const navigate = useNavigate();

  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setSuccessMessage("");

    const err = {};
    if (!email) err.email = "El correo electrónico es requerido";
    else if (!validateEmail(email)) err.email = "Por favor ingresa un correo electrónico válido";

    setErrors(err);
    if (Object.keys(err).length) return;

    try {
      setIsLoading(true);

      const result = await recoverPassword(email);

      if (result.success) {
        setSuccessMessage(result.message);
        // Redirigir al login después de 3 segundos
        setTimeout(() => {
          navigate('/login');
        }, 3000);
      } else {
        setErrors({
          email: result.errors.email || result.errors.general || "Error al enviar correo de recuperación"
        });
      }
    } catch (error) {
      console.error("Error durante la recuperación:", error);
      setErrors({
        email: "Error inesperado durante la recuperación. Por favor intenta de nuevo."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const checkAuthStatus = async () => {
    try {
      const status = await checkFirebaseAuthStatus();
      setAuthStatus(status);
      setShowTroubleshooting(true);
    } catch (error) {
      console.error('Error al verificar estado de autenticación:', error);
      setAuthStatus({
        success: false,
        issue: 'check_failed',
        message: 'Error al verificar el estado de Firebase Auth'
      });
      setShowTroubleshooting(true);
    }
  };

  const toggleTroubleshooting = () => {
    setShowTroubleshooting(!showTroubleshooting);
    if (!showTroubleshooting) {
      checkAuthStatus();
    }
  };

  return (
    <div className={styles.registerContainer}>
      <div className={styles.registerCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>Recuperar Contraseña</h1>
          <p className={styles.subtitle}>
            Ingresa tu correo y te enviaremos un enlace para restablecerla.
          </p>
        </div>

        <form onSubmit={handleSubmit} className={styles.form}>
          <div className={styles.inputGroup}>
            <label htmlFor="email" className={styles.label}>Correo Electrónico</label>
            <input
              type="email" id="email" name="email"
              value={email} onChange={(e) => setEmail(e.target.value)}
              className={`${styles.input} ${errors.email ? styles.inputError : ""}`}
              placeholder="tu@email.com"
              autoComplete="email"
            />
            {errors.email && <span className={styles.error}>{errors.email}</span>}
            {successMessage && <span className={styles.success}>{successMessage}</span>}
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className={`${styles.submitButton} ${isLoading ? styles.loading : ""}`}
          >
            {isLoading ? "Enviando..." : "Enviar enlace"}
          </button>

          <div className={styles.footer} style={{ marginTop: 12 }}>
            <a href="/login" className={styles.link}>Volver a iniciar sesión</a>
          </div>

          {/* Botón de diagnóstico */}
          <div className={styles.footer} style={{ marginTop: 8 }}>
            <button
              type="button"
              onClick={toggleTroubleshooting}
              className={styles.link}
              style={{
                background: 'none',
                border: 'none',
                padding: '8px 0',
                fontSize: '14px',
                color: '#666',
                textDecoration: 'underline',
                cursor: 'pointer'
              }}
            >
              {showTroubleshooting ? 'Ocultar' : 'Mostrar'} diagnóstico y solución de problemas
            </button>
          </div>

          {/* Panel de troubleshooting */}
          {showTroubleshooting && (
            <div className={styles.troubleshootingPanel}>
              <h3>🔧 Diagnóstico de Firebase Auth</h3>

              {authStatus && (
                <div className={`${styles.statusMessage} ${authStatus.success ? styles.success : styles.error}`}>
                  {authStatus.message}
                </div>
              )}

              <div className={styles.troubleshootingInfo}>
                <h4>❗ Problemas comunes y soluciones:</h4>
                <ul>
                  <li>
                    <strong>Correos deshabilitados:</strong> Ve a Firebase Console → Authentication → Sign-in method → Authorized domains y habilita el envío de correos
                  </li>
                  <li>
                    <strong>Dominio no autorizado:</strong> Agrega "localhost" en Firebase Console → Authentication → Settings → Authorized domains
                  </li>
                  <li>
                    <strong>Usuario no existe:</strong> Asegúrate de que el usuario esté registrado en la colección "users" de Firestore
                  </li>
                  <li>
                    <strong>Problemas de red:</strong> Verifica tu conexión a internet y que los servicios de Firebase estén disponibles
                  </li>
                </ul>

                <h4>🔍 Pasos para debugging:</h4>
                <ol>
                  <li>Abre las herramientas de desarrollador (F12) en tu navegador</li>
                  <li>Ve a la pestaña Console</li>
                  <li>Intenta recuperar contraseña y observa los mensajes de log</li>
                  <li>Busca errores específicos de Firebase Auth</li>
                  <li>Verifica que no haya errores de red en la pestaña Network</li>
                </ol>
              </div>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default Recover;
