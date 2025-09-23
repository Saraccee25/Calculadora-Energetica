"use client";

import { useState } from "react";
import styles from "./Recover.module.css";

const Recover = () => {
  const [email, setEmail] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errors, setErrors] = useState({});
  const [ok, setOk] = useState("");

  const validateEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrors({});
    setOk("");

    const err = {};
    if (!email) err.email = "El correo electrónico es requerido";
    else if (!validateEmail(email)) err.email = "Por favor ingresa un correo electrónico válido";

    setErrors(err);
    if (Object.keys(err).length) return;

    try {
      setIsLoading(true);
      // Reemplaza por tu endpoint real:
      // await fetch("/api/auth/reset-password", {
      //   method: "POST",
      //   headers: { "Content-Type": "application/json" },
      //   body: JSON.stringify({ email }),
      // });

      await new Promise((r) => setTimeout(r, 1200));
      setOk("Si tu correo está registrado, te enviaremos un enlace para restablecer tu contraseña.");
    } catch {
      setErrors({ email: "Ocurrió un error. Intenta nuevamente." });
    } finally {
      setIsLoading(false);
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
            {ok && <span className={styles.success}>{ok}</span>}
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
        </form>
      </div>
    </div>
  );
};

export default Recover;
