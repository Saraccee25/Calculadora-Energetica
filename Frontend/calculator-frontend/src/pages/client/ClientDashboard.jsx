import { useState } from "react"
import { FaHome, FaPlug, FaChartPie, FaCalculator, FaLightbulb, FaBolt, FaLeaf, FaDollarSign } from "react-icons/fa"
import styles from "./ClientDashboard.module.css"
import Devices from "../../components/devices/Devices"
import DataVisualization from "../../components/visualization/DataVisualization"
import DeviceAlternatives from "../../components/alternatives/DeviceAlternatives"
import Recommendations from "../../components/recommendations/Recommendations"

const ClientDashboard = () => {
  const [activeSection, setActiveSection] = useState("home")

  const menuItems = [
    { id: "home", label: "Inicio", icon: FaHome },
    { id: "devices", label: "Dispositivos", icon: FaPlug },
    { id: "visualization", label: "Visualización", icon: FaChartPie },
    { id: "simulator", label: "Simulador", icon: FaCalculator },
    { id: "recommendations", label: "Recomendaciones", icon: FaLightbulb },
  ]

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return (
          <div className={styles.homeSection}>
            <div className={styles.welcomeCard}>
              <div className={styles.welcomeContent}>
                <h2>¡Bienvenido de vuelta!</h2>
                <p>Aquí tienes un resumen de tu consumo energético actual</p>
              </div>
              <div className={styles.welcomeIcon}>
                <FaBolt />
              </div>
            </div>

            <div className={styles.statsGrid}>
              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <FaBolt />
                </div>
                <div className={styles.statContent}>
                  <h3>Consumo Actual</h3>
                  <p className={styles.statValue}>2,450 kWh</p>
                  <span className={styles.statChange}>-12% vs mes anterior</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <FaDollarSign />
                </div>
                <div className={styles.statContent}>
                  <h3>Costo Estimado</h3>
                  <p className={styles.statValue}>$485,000</p>
                  <span className={styles.statChange}>-8% vs mes anterior</span>
                </div>
              </div>

              <div className={styles.statCard}>
                <div className={styles.statIcon}>
                  <FaLeaf />
                </div>
                <div className={styles.statContent}>
                  <h3>Ahorro CO₂</h3>
                  <p className={styles.statValue}>125 kg</p>
                  <span className={styles.statChange}>+15% vs mes anterior</span>
                </div>
              </div>
            </div>
          </div>
        )
      case "devices":
        return <Devices />
      case "visualization":
        return <DataVisualization />
      case "simulator":
        return <DeviceAlternatives />
      case "recommendations":
        return <Recommendations />
    }
  }

  return (
    <div className={styles.clientDashboard}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <nav className={styles.navigation}>
          <ul className={styles.menuList}>
            {menuItems.map((item) => {
              const IconComponent = item.icon
              return (
                <li
                  key={item.id}
                  className={`${styles.menuItem} ${activeSection === item.id ? styles.active : ""}`}
                  onClick={() => setActiveSection(item.id)}
                >
                  <IconComponent className={styles.menuIcon} />
                  <span>{item.label}</span>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>

      {/* Main Content */}
      <main className={styles.mainContent}>
        <header className={styles.dashboardHeader}>
          <div className={styles.headerContent}>
            <h1>Dashboard</h1>
            <p>Gestiona tu consumo energético de manera inteligente</p>
          </div>
        </header>

        <div className={styles.contentArea}>{renderSection()}</div>
      </main>
    </div>
  )
}

export default ClientDashboard
