import { useState } from "react";
import { Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

import Profile from "../profile/Profile";
import styles from "./Header.module.css";

import ConfirmModal from "../ConfirmModal/ConfirmModal";

const Header = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [openConfirmModal, setOpenConfirmModal] = useState(false);
  const { user, logout } = useAuth();

  const navigate = useNavigate();

  const toggleMenu = () => setIsOpen(!isOpen);
  const toggleUserMenu = () => setMenuOpen(!menuOpen);

  const userInitial = user?.name ? user.name.charAt(0).toUpperCase() : "U";

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
              <Link
                to="/"
                className={styles.navLink}
                onClick={() => setIsOpen(false)}
              >
                Inicio
              </Link>
              <Link
                to="/calculadora"
                className={styles.navLink}
                onClick={() => setIsOpen(false)}
              >
                Calculadora
              </Link>
              <Link
                to="/sobre-nosotros"
                className={styles.navLink}
                onClick={() => setIsOpen(false)}
              >
                Sobre Nosotros
              </Link>
              <Link
                to="/contacto"
                className={styles.navLink}
                onClick={() => setIsOpen(false)}
              >
                Contacto
              </Link>

              <div className={styles.mobileAuthButtons}>
                {!user ? (
                  <>
                    <Link to="/login" onClick={() => setIsOpen(false)}>
                      <button className={styles.loginBtn}>
                        Iniciar Sesión
                      </button>
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

      <Profile isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />

      <ConfirmModal
        isOpen={openConfirmModal}
        title="cerrar sesion"
        message="Esta seguro de cerrar sesion?"
        confirmText="Si"
        cancelText="No"
        onConfirm={handleConfirmModalConfirm}
        onCancel={() => setOpenConfirmModal(false)}
      />
      <Profile isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </>
  );
};

export default Header;
