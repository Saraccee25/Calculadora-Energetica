"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import { useAuth } from "../../context/AuthContext"
import styles from "./Header.module.css"

const Header = () => {
  const [isOpen, setIsOpen] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false) // menú perfil
  const { user, logout } = useAuth()

  const toggleMenu = () => setIsOpen(!isOpen)
  const toggleUserMenu = () => setMenuOpen(!menuOpen)

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U"

  return (
    <header className={styles.header}>
      <div className={styles.container}>
   
        <div className={styles.logo}>
          <Link to="/" className={styles.logo}>
            <span className={styles.logoIcon}>⚡</span>
            <span className={styles.logoText}>CalcuLuz</span>
          </Link>
        </div>


        <nav className={`${styles.nav} ${isOpen ? styles.open : ""}`}>
          <Link to="/" className={styles.navLink} onClick={() => setIsOpen(false)}>
            Inicio
          </Link>
          <Link to="/calculadora" className={styles.navLink} onClick={() => setIsOpen(false)}>
            Calculadora
          </Link>
          <Link to="/sobre-nosotros" className={styles.navLink} onClick={() => setIsOpen(false)}>
            Sobre Nosotros
          </Link>
          <Link to="/contacto" className={styles.navLink} onClick={() => setIsOpen(false)}>
            Contacto
          </Link>


          <div className={styles.mobileAuthButtons}>
            {!user ? (
              <>
                <Link to="/login" onClick={() => setIsOpen(false)}>
                  <button className={styles.loginBtn}>Iniciar Sesión</button>
                </Link>
                <Link to="/signup" onClick={() => setIsOpen(false)}>
                  <button className={styles.signupBtn}>
                    <span>Registrarse</span>
                  </button>
                </Link>
              </>
            ) : (
              <div className={styles.userDropdownMobile}>
                <div className={styles.userIconCircle}>{userInitial}</div>
                <Link to="/perfil" onClick={() => setIsOpen(false)}>
                  Gestionar perfil
                </Link>
                <button onClick={logout} className={styles.logoutBtn}>
                  Cerrar sesión
                </button>
              </div>
            )}
          </div>
        </nav>


        <div className={styles.authButtons}>
          {!user ? (
            <>
              <Link to="/login">
                <button className={styles.loginBtn}>Iniciar Sesión</button>
              </Link>
              <Link to="/signup">
                <button className={styles.signupBtn}>
                  <span>Registrarse</span>
                </button>
              </Link>
            </>
          ) : (
            <div className={styles.userMenuDesktop}>
              <div className={styles.userIconCircle} onClick={toggleUserMenu}>
                {userInitial}
              </div>
              {menuOpen && (
                <div className={styles.userDropdown}>
                  <Link to="/perfil" onClick={() => setMenuOpen(false)}>
                    Gestionar perfil
                  </Link>
                  <button onClick={logout} className={styles.logoutBtn}>
                    Cerrar sesión
                  </button>
                </div>
              )}
            </div>
          )}
        </div>


        <div className={`${styles.hamburger} ${isOpen ? styles.active : ""}`} onClick={toggleMenu}>
          <span></span>
          <span></span>
          <span></span>
        </div>
      </div>
    </header>
  )
}

export default Header
