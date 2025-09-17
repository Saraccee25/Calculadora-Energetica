import styles from "./HomePage.module.css"

const HomePage = () => {
  return (
    <div className={styles.homePage}>
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Optimiza tu <span className={styles.highlight}>Consumo Energético</span> con CalcuLuz
            </h1>
            <p className={styles.heroDescription}>
              La calculadora inteligente que te ayuda a reducir costos y mejorar la eficiencia energética de tu hogar o
              negocio
            </p>
            <div className={styles.heroButtons}>
              <button className={styles.primaryBtn}>Calcular Ahora</button>
              <button className={styles.secondaryBtn}>Ver Demo</button>
            </div>
          </div>
          <div className={styles.heroVisual}>
            <div className={styles.energyIcon}>⚡</div>
            <div className={styles.orbits}>
              <div className={styles.orbit}></div>
              <div className={styles.orbit}></div>
              <div className={styles.orbit}></div>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.features}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>¿Por qué elegir CalcuLuz?</h2>
          <div className={styles.featuresGrid}>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>📊</div>
              <h3>Análisis Preciso</h3>
              <p>Cálculos exactos basados en tus patrones de consumo reales</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>💰</div>
              <h3>Ahorro Garantizado</h3>
              <p>Identifica oportunidades de ahorro y reduce tu factura eléctrica</p>
            </div>
            <div className={styles.featureCard}>
              <div className={styles.featureIcon}>🌱</div>
              <h3>Eco-Friendly</h3>
              <p>Contribuye al medio ambiente optimizando tu huella energética</p>
            </div>
          </div>
        </div>
      </section>

      <section className={styles.cta}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2>¿Listo para optimizar tu energía?</h2>
            <p>Únete a miles de usuarios que ya están ahorrando con CalcuLuz</p>
            <button className={styles.ctaBtn}>Comenzar Gratis</button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default HomePage
