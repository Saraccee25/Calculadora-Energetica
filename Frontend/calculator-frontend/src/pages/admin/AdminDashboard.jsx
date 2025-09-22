"use client"

import { useState } from "react"
import {
  FaHome,
  FaPlug,
  FaUsers,
  FaMoneyBillWave,
  FaExchangeAlt,
  FaClipboardList,
  FaChartBar,
  FaCogs,
} from "react-icons/fa"

import styles from "./AdminDashboard.module.css"

// Ajusta las rutas de import según tu estructura
import AdminDevices from "../../components/admin/devices/AdminDevices.jsx"
import AdminUsers from "../../components/admin/users/AdminUsers.jsx"
import Tariffs from "../../components/admin/tariffs/Tariffs.jsx"
import Assignments from "../../components/admin/assignments/Assignments.jsx"
import AuditLog from "../../components/admin/audit/AuditLog.jsx"
import Reports from "../../components/admin/reports/Reports.jsx"
import Settings from "../../components/admin/settings/Settings.jsx"

const AdminDashboard = () => {
  const [activeSection, setActiveSection] = useState("home")

  const menuItems = [
    { id: "home",        label: "Inicio",            icon: FaHome },
    { id: "devices",     label: "Dispositivos",      icon: FaPlug },
    { id: "users",       label: "Usuarios",          icon: FaUsers },
    { id: "tariffs",     label: "Tarifas (Estrato)", icon: FaMoneyBillWave },
    { id: "assignments", label: "Asignaciones",      icon: FaExchangeAlt },
    { id: "audit",       label: "Auditoría",         icon: FaClipboardList },
    { id: "reports",     label: "Reportes",          icon: FaChartBar },
    { id: "settings",    label: "Configuración",     icon: FaCogs },
  ]

  const renderSection = () => {
    switch (activeSection) {
      case "home":
        return (
          <div className={styles.homeSection}>
            <div className={styles.welcomeCard}>
              <div className={styles.welcomeContent}>
                <h2>Panel de Administración</h2>
                <p>Resumen operativo del sistema</p>
              </div>

              <div className={styles.kpiGrid}>
                <div className={styles.kpiCard}>
                  <span className={styles.kpiLabel}>Usuarios activos</span>
                  <span className={styles.kpiValue}> 22</span>
                  {/* <span className={styles.kpiDelta}> +3.2% 7d</span> */}
                </div>
                <div className={styles.kpiCard}>
                  <span className={styles.kpiLabel}>Dispositivos online</span>
                  <span className={styles.kpiValue}> 13 / 100</span>
                  {/* <span className={styles.kpiDelta}> +1.1% 24h</span> */}
                </div>
                <div className={styles.kpiCard}>
                  <span className={styles.kpiLabel}>Incidencias</span>
                  <span className={styles.kpiValue}> 7 </span>
                  {/* <span className={styles.kpiDeltaWarning}>-2 esta semana</span> */}
                </div>
                <div className={styles.kpiCard}>
                  <span className={styles.kpiLabel}>Tarifas vigentes</span>
                  <span className={styles.kpiValue}>Estratos 1–6</span>
                  {/* <span className={styles.kpiDeltaMuted}>últ. act. 2025-09-10</span> */}
                </div>
              </div>
            </div>
          </div>
        )
      case "devices":
        return <AdminDevices />
      case "users":
        return <AdminUsers />
      case "tariffs":
        return <Tariffs />
      case "assignments":
        return <Assignments />
      case "audit":
        return <AuditLog />
      case "reports":
        return <Reports />
      case "settings":
        return <Settings />
      default:
        return null
    }
  }

  return (
    <div className={styles.adminDashboard}>
      {/* Sidebar */}
      <aside className={styles.sidebar}>
        <nav className={styles.navigation}>
          <ul className={styles.menuList}>
            {menuItems.map((item) => {
              const Icon = item.icon
              return (
                <li
                  key={item.id}
                  className={`${styles.menuItem} ${activeSection === item.id ? styles.active : ""}`}
                  onClick={() => setActiveSection(item.id)}
                >
                  <Icon className={styles.menuIcon} />
                  <span>{item.label}</span>
                </li>
              )
            })}
          </ul>
        </nav>
      </aside>

      {/* Main */}
      <main className={styles.mainContent}>
        <header className={styles.dashboardHeader}>
          <div className={styles.headerContent}>
            <h1>Admin</h1>
            <p>Control total: usuarios, dispositivos, tarifas y más</p>
          </div>
        </header>

        <div className={styles.contentArea}>{renderSection()}</div>
      </main>
    </div>
  )
}

export default AdminDashboard
