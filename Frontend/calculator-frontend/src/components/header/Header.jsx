import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

import Profile from "../profile/Profile";
import ConfirmModal from "../ConfirmModal/ConfirmModal";

import styles from "./Header.module.css";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ------------------------------------
  // 🔥 Obtener correctamente la inicial del usuario
  // ------------------------------------
  const getUserInitial = (user) => {
    if (!user) return "U";

    const name =
      user.name ||
      user.displayName ||
      user.fullName ||
      user.username ||
      user.email?.split("@")[0];

    return name?.charAt(0).toUpperCase() || "U";
  };

  const userInitial = getUserInitial(user);

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleUserMenu = () => setMenuOpen(!menuOpen);

  const handleConfirmModalConfirm = () => {
    setOpenConfirmModal(false);
    logout();
    navigate("/login");
  };

  return (
    <>
      <header className={styles.header}>
        <div className={styles.container}>
          {/* LOGO */}
          <div className={styles.logo}>
            <Link to="/" className={styles.logo}>
              <span className={styles.logoIcon}>⚡</span>
              <span className={styles.logoText}>CalcuLuz</span>
            </Link>
          </div>

          <div className={styles.rightSection}>
            {/* NAV */}
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

              {/* AUTH MOBILE */}
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

                    <button
                      onClick={() => {
                        setIsProfileOpen(true);
                        setIsOpen(false);
                      }}
                    >
                      Gestionar perfil
                    </button>

                    <button
                      onClick={() => setOpenConfirmModal(true)}
                      className={styles.logoutBtn}
                    >
                      Cerrar sesión
                    </button>
                  </div>
                )}
              </div>
            </nav>

            {/* AUTH DESKTOP */}
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
                  <div
                    className={styles.userIconCircle}
                    onClick={toggleUserMenu}
                  >
                    {userInitial}
                  </div>

                  {menuOpen && (
                    <div className={styles.userDropdown}>
                      <button
                        onClick={() => {
                          setIsProfileOpen(true);
                          setMenuOpen(false);
                        }}
                      >
                        Gestionar perfil
                      </button>

                      <button
                        onClick={() => setOpenConfirmModal(true)}
                        className={styles.logoutBtn}
                      >
                        Cerrar sesión
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          </div>

          {/* HAMBURGER */}
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

      {/* PROFILE MODAL */}
      <Profile
        isOpen={isProfileOpen}
        onClose={() => setIsProfileOpen(false)}
      />

      {/* CONFIRM LOGOUT MODAL */}
      <ConfirmModal
        isOpen={openConfirmModal}
        title="Cerrar sesión"
        message="¿Está seguro?"
        confirmText="Sí"
        cancelText="No"
        onConfirm={handleConfirmModalConfirm}
        onCancel={() => setOpenConfirmModal(false)}
      />
    </>
  );
};

export default Header;
