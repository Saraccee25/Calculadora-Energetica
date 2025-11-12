import { useState } from "react";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";
import {
  recoverPassword,
  loginUserWithFirebaseAuth,
  migrateExistingUsersToFirebaseAuth,
} from "../../services/authService";
import styles from "./Login.module.css";

const Login = () => {
  const [formData, setFormData] = useState({ email: "", password: "" });
  const [errors, setErrors] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [successMessage, setSuccessMessage] = useState("");
  const [isRecoveryMode, setIsRecoveryMode] = useState(false);
  const [recoveryEmail, setRecoveryEmail] = useState("");
  const [recoveryLoading, setRecoveryLoading] = useState(false);
  const [recoveryMessage, setRecoveryMessage] = useState("");

  const { login } = useAuth();
  const navigate = useNavigate();
  const [migrationStatus, setMigrationStatus] = useState("");

  const validateEmail = (email) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
  const validatePassword = (password) => {
    const minLength = password.length >= 8;
    const hasUpperCase = /[A-Z]/.test(password);
    const hasLowerCase = /[a-z]/.test(password);
    const hasNumbers = /\d/.test(password);
    const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(password);
    return (
      minLength && hasUpperCase && hasLowerCase && hasNumbers && hasSpecialChar
    );
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((p) => ({ ...p, [name]: value }));
    if (errors[name]) setErrors((p) => ({ ...p, [name]: "" }));
  };

  // Actualizar el contexto de autenticación con el usuario logueado
  const handleSubmit = async (e) => {
    e.preventDefault();
    const newErrors = {};

    if (!formData.email) newErrors.email = "El correo electrónico es requerido";
    else if (!validateEmail(formData.email))
      newErrors.email = "Por favor ingresa un correo electrónico válido";

    if (!formData.password) newErrors.password = "La contraseña es requerida";
    else if (!validatePassword(formData.password))
      newErrors.password =
        "La contraseña debe tener mínimo 8 caracteres, incluir mayúsculas, minúsculas, números y caracteres especiales";

    setErrors(newErrors);
    if (Object.keys(newErrors).length) return;

    setIsLoading(true);
    setSuccessMessage("");

    try {
      const result = await loginUserWithFirebaseAuth(
        formData.email,
        formData.password
      );

      if (result.success) {
        // Actualizar el contexto de autenticación con el usuario logueado
        login(result.user);
        // Guardar ID token en localStorage
        try {
          const token = await result.firebaseUser.getIdToken();
          localStorage.setItem("authToken", token);
        } catch (e) {
          console.error("No se pudo guardar el ID token:", e);
        }
        setSuccessMessage(result.message);
        // Redirigir según rol: 1 admin, 2 cliente
        setTimeout(() => {
          navigate(result.user.role === 1 ? "/admin" : "/client");
        }, 1500);
      } else {
        setErrors(result.errors);
      }
    } catch (error) {
      console.error("Error durante el login:", error);
      setErrors({
        general:
          "Error inesperado durante el inicio de sesión. Por favor intenta de nuevo.",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handlePasswordRecovery = async (e) => {
    e.preventDefault();

    if (!recoveryEmail) {
      setRecoveryMessage("Por favor ingresa tu correo electrónico");
      return;
    }

    if (!validateEmail(recoveryEmail)) {
      setRecoveryMessage("Por favor ingresa un correo electrónico válido");
      return;
    }

    setRecoveryLoading(true);
    setRecoveryMessage("");

    try {
      const result = await recoverPassword(recoveryEmail);

      if (result.success) {
        setRecoveryMessage(result.message);
        setRecoveryEmail("");
        setTimeout(() => {
          setIsRecoveryMode(false);
          setRecoveryMessage("");
        }, 3000);
      } else {
        setRecoveryMessage(
          result.errors.email ||
            result.errors.general ||
            "Error al enviar correo de recuperación"
        );
      }
    } catch (error) {
      console.error("Error durante la recuperación:", error);
      setRecoveryMessage(
        "Error inesperado durante la recuperación. Por favor intenta de nuevo."
      );
    } finally {
      setRecoveryLoading(false);
    }
  };

  const toggleRecoveryMode = () => {
    setIsRecoveryMode(!isRecoveryMode);
    setRecoveryMessage("");
    setRecoveryEmail("");
    setErrors({});
    setSuccessMessage("");
  };

  const handleMigrateUsers = async () => {
    try {
      setMigrationStatus("🔄 Migrando usuarios existentes a Firebase Auth...");
      const result = await migrateExistingUsersToFirebaseAuth();

      if (result.success) {
        setMigrationStatus(`✅ ${result.message}`);
        console.log("Resultado de migración:", result);
      } else {
        setMigrationStatus(`❌ Error durante la migración: ${result.error}`);
      }
    } catch (error) {
      console.error("Error durante la migración:", error);
      setMigrationStatus("❌ Error inesperado durante la migración");
    }
  };

  return (
    <div className={styles.loginContainer}>
      <div className={styles.loginCard}>
        <div className={styles.header}>
          <h1 className={styles.title}>
            {isRecoveryMode ? "Recuperar Contraseña" : "Iniciar Sesión"}
          </h1>
          <p className={styles.subtitle}>
            {isRecoveryMode
              ? "Ingresa tu correo para recibir instrucciones de recuperación"
              : "Accede a tu cuenta de CalcuLuz"}
          </p>
        </div>

        {!isRecoveryMode ? (
          <form onSubmit={handleSubmit} className={styles.form}>
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
                className={`${styles.input} ${
                  errors.email ? styles.inputError : ""
                }`}
                placeholder="tu@email.com"
                autoComplete="email"
              />
              {errors.email && (
                <span className={styles.error}>{errors.email}</span>
              )}
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
                className={`${styles.input} ${
                  errors.password ? styles.inputError : ""
                }`}
                placeholder="••••••••"
                autoComplete="current-password"
              />
              {errors.password && (
                <span className={styles.error}>{errors.password}</span>
              )}

              <div className={styles.forgotPassword}>
                <button
                  type="button"
                  onClick={toggleRecoveryMode}
                  className={styles.link}
                >
                  ¿Olvidaste tu contraseña?
                </button>
              </div>
            </div>
            {/* Mantengo exactamente tus clases */}
            <button
              type="submit"
              disabled={isLoading}
              className={`${styles.submitButton} ${
                isLoading ? styles.loading : ""
              }`}
            >
              {isLoading ? "Iniciando sesión..." : "Iniciar Sesión"}
            </button>

            {successMessage && (
              <div className={styles.successMessage}>{successMessage}</div>
            )}

            {errors.general && (
              <div className={styles.errorMessage}>{errors.general}</div>
            )}
          </form>
        ) : (
          <form onSubmit={handlePasswordRecovery} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="recoveryEmail" className={styles.label}>
                Correo Electrónico
              </label>
              <input
                type="email"
                id="recoveryEmail"
                value={recoveryEmail}
                onChange={(e) => setRecoveryEmail(e.target.value)}
                className={`${styles.input} ${
                  recoveryMessage && !recoveryMessage.includes("enviado")
                    ? styles.inputError
                    : ""
                }`}
                placeholder="tu@email.com"
                autoComplete="email"
              />
            </div>

            <button
              type="submit"
              disabled={recoveryLoading}
              className={`${styles.submitButton} ${
                recoveryLoading ? styles.loading : ""
              }`}
            >
              {recoveryLoading
                ? "Enviando correo..."
                : "Enviar correo de recuperación"}
            </button>

            {recoveryMessage && (
              <div
                className={`${styles.successMessage} ${
                  !recoveryMessage.includes("enviado")
                    ? styles.errorMessage
                    : ""
                }`}
              >
                {recoveryMessage}
              </div>
            )}

            <div className={styles.footer}>
              <button
                type="button"
                onClick={toggleRecoveryMode}
                className={styles.link}
              >
                ← Volver al inicio de sesión
              </button>
            </div>
          </form>
        )}

        <div className={styles.footer}>
          <p>
            ¿No tienes cuenta?{" "}
            <a href="/signup" className={styles.link}>
              Regístrate aquí
            </a>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
