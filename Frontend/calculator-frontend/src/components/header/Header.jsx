import { useState } from "react";
import { Link } from "react-router-dom";
import styles from "./Header.module.css";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);

  const toggleMenu = () => setIsOpen(!isOpen);

  return (
    <header className={styles.header}>
      <div className={styles.container}>
        <div className={styles.logo}>
          <span className={styles.logoIcon}>⚡</span>
          <span className={styles.logoText}>CalcuLuz</span>
        </div>
        <nav className={`${styles.nav} ${isOpen ? styles.open : ""}`}>
          <a href="#inicio" className={styles.navLink}>Inicio</a>
          <a href="#calculadora" className={styles.navLink}>Calculadora</a>
          <a href="#sobre-nosotros" className={styles.navLink}>Sobre Nosotros</a>
          <a href="#contacto" className={styles.navLink}>Contacto</a>
        </nav>
        <div className={styles.authButtons}>
          <Link to="/login">
            <button className={styles.loginBtn}>Iniciar Sesión</button>
          </Link>
           <Link to="/signup">
            <button className={styles.signupBtn}>
              <span>Registrarse</span>
            </button>
          </Link>
        </div>
        <div
          className={`${styles.hamburger} ${isOpen ? styles.active : ""}`}
          onClick={toggleMenu}
        >
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </header>
  );
};

export default Header;
