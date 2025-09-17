import styles from "./Footer.module.css"

const Footer = () => {
  return (
    <footer className={styles.footer}>
      <div className={styles.container}>
        <div className={styles.footerContent}>
          <div className={styles.logoSection}>
            <div className={styles.logo}>
              <span className={styles.logoIcon}>⚡</span>
              <span className={styles.logoText}>CalcuLuz</span>
            </div>
            <p className={styles.description}>
              Tu calculadora energética inteligente para optimizar el consumo eléctrico
            </p>
          </div>

          <div className={styles.linksSection}>
            <div className={styles.linkGroup}>
              <h4 className={styles.linkTitle}>Producto</h4>
              <ul className={styles.linkList}>
                <li>
                  <a href="#calculadora" className={styles.link}>
                    Calculadora
                  </a>
                </li>
                <li>
                  <a href="#funciones" className={styles.link}>
                    Funciones
                  </a>
                </li>
                <li>
                  <a href="#precios" className={styles.link}>
                    Precios
                  </a>
                </li>
              </ul>
            </div>

            <div className={styles.linkGroup}>
              <h4 className={styles.linkTitle}>Empresa</h4>
              <ul className={styles.linkList}>
                <li>
                  <a href="#sobre-nosotros" className={styles.link}>
                    Sobre Nosotros
                  </a>
                </li>
                <li>
                  <a href="#contacto" className={styles.link}>
                    Contacto
                  </a>
                </li>
                <li>
                  <a href="#blog" className={styles.link}>
                    Blog
                  </a>
                </li>
              </ul>
            </div>

            <div className={styles.linkGroup}>
              <h4 className={styles.linkTitle}>Soporte</h4>
              <ul className={styles.linkList}>
                <li>
                  <a href="#ayuda" className={styles.link}>
                    Ayuda
                  </a>
                </li>
                <li>
                  <a href="#faq" className={styles.link}>
                    FAQ
                  </a>
                </li>
                <li>
                  <a href="#privacidad" className={styles.link}>
                    Privacidad
                  </a>
                </li>
              </ul>
            </div>
          </div>
        </div>

        <div className={styles.footerBottom}>
          <p className={styles.copyright}>&copy; 2024 CalcuLuz. Todos los derechos reservados.</p>
          <div className={styles.socialLinks}>
            <a href="#" className={styles.socialLink} aria-label="Twitter">
              📱
            </a>
            <a href="#" className={styles.socialLink} aria-label="LinkedIn">
              💼
            </a>
            <a href="#" className={styles.socialLink} aria-label="GitHub">
              🔗
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}

export default Footer
