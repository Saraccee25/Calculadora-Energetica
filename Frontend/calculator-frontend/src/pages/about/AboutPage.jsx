import styles from "./AboutPage.module.css"

const AboutPage = () => {
  const teamMembers = [
    {
      name: "Mateo Berrío Cardona",
      role: "Líder de Proyecto",
      description: "Especialista en gestión de proyectos tecnológicos y análisis de sistemas energéticos.",
    },
    {
      name: "Sara Castañeda Echeverri",
      role: "Desarrolladora Frontend",
      description: "Experta en interfaces de usuario y experiencia del usuario para aplicaciones web.",
    },
    {
      name: "Mateo Betancur Gómez",
      role: "Desarrollador Backend",
      description: "Especialista en arquitectura de sistemas y bases de datos para aplicaciones escalables.",
    },
    {
      name: "Jhonatan Damian Arredondo",
      role: "Desarrollador Frontend",
      description: "Experto en análisis de consumo energético y algoritmos de optimización.",
    },
    {
      name: "Andrés Felipe Cañaveral Posada",
      role: "Ingeniero de Calidad",
      description: "Especialista en testing, validación de sistemas y aseguramiento de calidad.",
    },
  ]

  return (
    <div className={styles.aboutPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Sobre <span className={styles.highlight}>CalcuLuz</span>
            </h1>
            <p className={styles.heroDescription}>
              Somos un equipo apasionado por la eficiencia energética y la tecnología sostenible, comprometidos con
              ayudar a los hogares colombianos a optimizar su consumo eléctrico.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className={styles.missionVision}>
        <div className={styles.container}>
          <div className={styles.mvGrid}>
            <div className={styles.missionCard}>
              <div className={styles.cardIcon}>🎯</div>
              <h3>Nuestra Misión</h3>
              <p>
                Desarrollar y proporcionar una plataforma web intuitiva y accesible que permita a los usuarios calcular,
                visualizar y analizar el consumo energético de sus dispositivos domésticos, facilitando la toma de
                decisiones informadas para optimizar el uso de la energía, reducir costos y promover prácticas
                sostenibles en el hogar.
              </p>
            </div>
            <div className={styles.visionCard}>
              <div className={styles.cardIcon}>🌟</div>
              <h3>Nuestra Visión</h3>
              <p>
                Ser la herramienta digital de referencia en Colombia para la gestión inteligente del consumo energético
                doméstico, contribuyendo a la formación de una cultura de eficiencia energética que impulse la
                sostenibilidad ambiental y el ahorro económico en los hogares colombianos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Problem & Solution */}
      <section className={styles.problemSolution}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>El Problema que Resolvemos</h2>
          <div className={styles.problemGrid}>
            <div className={styles.problemCard}>
              <div className={styles.problemIcon}>❓</div>
              <h4>Falta de Información</h4>
              <p>Los hogares no poseen información detallada sobre cuánta energía consume cada electrodoméstico.</p>
            </div>
            <div className={styles.problemCard}>
              <div className={styles.problemIcon}>📄</div>
              <h4>Facturas Poco Claras</h4>
              <p>
                Las facturas eléctricas proporcionan información histórica agregada, sin detallar patrones específicos.
              </p>
            </div>
            <div className={styles.problemCard}>
              <div className={styles.problemIcon}>💸</div>
              <h4>Sistemas Costosos</h4>
              <p>Los sistemas de monitoreo comerciales resultan inaccesibles para la mayoría de hogares.</p>
            </div>
            <div className={styles.problemCard}>
              <div className={styles.problemIcon}>🧠</div>
              <h4>Falta de Conocimiento</h4>
              <p>Existe una brecha significativa en el conocimiento sobre prácticas de conservación energética.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className={styles.team}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Nuestro Equipo</h2>
          <p className={styles.teamDescription}>
            Un grupo multidisciplinario de profesionales comprometidos con la innovación tecnológica y la sostenibilidad
            energética.
          </p>
          <div className={styles.teamGrid}>
            {teamMembers.map((member, index) => (
              <div key={index} className={styles.memberCard}>
                <div className={styles.memberAvatar}>
                  {member.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")
                    .slice(0, 2)}
                </div>
                <h4 className={styles.memberName}>{member.name}</h4>
                <p className={styles.memberRole}>{member.role}</p>
                <p className={styles.memberDescription}>{member.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Impact Section */}
      <section className={styles.impact}>
        <div className={styles.container}>
          <h2 className={styles.sectionTitle}>Nuestro Impacto</h2>
          <div className={styles.impactGrid}>
            <div className={styles.impactCard}>
              <div className={styles.impactNumber}>7-15%</div>
              <h4>Reducción de Consumo</h4>
              <p>Los sistemas de monitoreo energético pueden reducir el consumo eléctrico hasta un 15%</p>
            </div>
            <div className={styles.impactCard}>
              <div className={styles.impactNumber}>26.2%</div>
              <h4>Sector Residencial</h4>
              <p>Representa el porcentaje del consumo final de energía a nivel global</p>
            </div>
            <div className={styles.impactCard}>
              <div className={styles.impactNumber}>4.39%</div>
              <h4>Crecimiento en Colombia</h4>
              <p>Incremento del sector residencial en Colombia durante 2024</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className={styles.cta}>
        <div className={styles.container}>
          <div className={styles.ctaContent}>
            <h2>¿Listo para optimizar tu consumo energético?</h2>
            <p>Únete a la revolución de la eficiencia energética con CalcuLuz</p>
            <button className={styles.ctaBtn}>Comenzar Ahora</button>
          </div>
        </div>
      </section>
    </div>
  )
}

export default AboutPage
