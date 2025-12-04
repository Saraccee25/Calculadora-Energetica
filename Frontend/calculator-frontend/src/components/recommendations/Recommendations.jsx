"use client"

import { useState, useEffect } from "react"
import {
  FaLightbulb,
  FaExclamationTriangle,
  FaCheckCircle,
  FaDollarSign,
  FaBolt,
  FaLeaf,
  FaClock,
  FaArrowUp,
  FaArrowDown,
  FaChartBar,
  FaFilePdf,
} from "react-icons/fa"
import styles from "./Recommendations.module.css"
import apiClient from "../../api/ApiClient"
import preloadedDevices from "../../data/devices_preloaded.json"

const Recommendations = () => {
  const [filter, setFilter] = useState("all")
  const [completedRecommendations, setCompletedRecommendations] = useState([])

  const [deviceData, setDeviceData] = useState([])
  const [totalCost, setTotalCost] = useState(0)

  const [clientDevices, setClientDevices] = useState([])
  const [deviceCatalog, setDeviceCatalog] = useState([])
  const [recommendations, setRecommendations] = useState([])
  const [userTariff] = useState(600)

  const calculateMonthlyConsumption = (device) => {
    const rawPower = device.device?.potenciaWatts

    const powerW =
      typeof rawPower === "string"
        ? parseFloat(rawPower.replace(/[^0-9.]/g, ""))
        : Number(rawPower)

    const hours = Number(device.dailyHours) || 0
    const quantity = Number(device.quantity) || 0
    const days = Number(device.weeklyDays) || 0

    if (isNaN(powerW)) return 0

    const daysMonth = (days * 30) / 7
    const consumption = (powerW * hours * quantity * daysMonth) / 1000

    return Number(consumption.toFixed(2))
  }

  useEffect(() => {
    const fetchAllDevices = async () => {
      try {
        const res = await fetch("http://localhost:8081/api/devices")
        const server = await res.json()

        const combined = [
          ...preloadedDevices.map((d) => ({ ...d, id: `local-${d.nombre}` })),
          ...server,
        ]

        setDeviceCatalog(combined)
      } catch {}
    }

    fetchAllDevices()
  }, [])

  useEffect(() => {
    if (deviceCatalog.length === 0) return

    const load = async () => {
      try {
        const saved = await apiClient.getAsync("/user-devices", { requireAuth: true })

        const merged = saved
          .map((s) => {
            const full = deviceCatalog.find((d) => String(d.id) === String(s.deviceId))
            if (!full) return null
            return { ...s, device: full }
          })
          .filter(Boolean)

        setClientDevices(merged)
      } catch {}
    }

    load()
  }, [deviceCatalog])

  useEffect(() => {
    if (clientDevices.length === 0) {
      setDeviceData([])
      setRecommendations([])
      setTotalCost(0)
      return
    }

    const devices = clientDevices.map((d) => {
      const consumption = calculateMonthlyConsumption(d)
      const cost = Number((consumption * userTariff).toFixed(0)) || 0
      const co2 = Number((consumption * 0.164).toFixed(2)) || 0

      return {
        name: d.device?.nombre || "Sin nombre",
        consumption,
        cost,
        co2,
        raw: d,
      }
    })

    setDeviceData(devices)
    setTotalCost(devices.reduce((sum, d) => sum + d.cost, 0))

    const generated = devices.map((d, index) => {
      const current = d.consumption || 0
      const optimized = Number((current * 0.75).toFixed(2))
      const monthlySavings = Number((d.cost * 0.25).toFixed(0))
      const annualSavings = monthlySavings * 12
      const co2Reduction = Number((d.co2 * 0.25).toFixed(2))

      let category = "quick-win"
      let priority = "Baja"

      if (current > 60) {
        category = "high-impact"
        priority = "Alta"
      } else if (current >= 25) {
        category = "medium-impact"
        priority = "Media"
      }

      return {
        id: index + 1,
        title: `Optimizar uso de ${d.name}`,
        description: `Este dispositivo consume ${current} kWh/mes. Ajustar hábitos reduce su impacto energético.`,
        category,
        priority,
        device: d.name,
        currentConsumption: current,
        optimizedConsumption: optimized,
        monthlySavings,
        annualSavings,
        co2Reduction,
        investment: 0,
        paybackMonths: 0,
        difficulty: "Fácil",
        timeToImplement: "Inmediato",
        tips: [
          "Evita el uso innecesario",
          "Activa modos eco o ahorro",
          "Mantén el dispositivo en buenas condiciones",
        ],
      }
    })

    setRecommendations(generated)
  }, [clientDevices])

  const filteredRecommendations = recommendations.filter((rec) => {
    if (filter === "all") return true
    return rec.category === filter
  })

  const sortedRecommendations = filteredRecommendations.sort((a, b) => {
    const order = { Alta: 3, Media: 2, Baja: 1 }
    if (order[a.priority] !== order[b.priority]) {
      return order[b.priority] - order[a.priority]
    }
    return b.annualSavings - a.annualSavings
  })

  const toggleCompleted = (id) => {
    setCompletedRecommendations((prev) =>
      prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]
    )
  }

  const getPriorityIcon = (priority) => {
    if (priority === "Alta") return <FaExclamationTriangle className={styles.highPriority} />
    if (priority === "Media") return <FaArrowUp className={styles.mediumPriority} />
    if (priority === "Baja") return <FaArrowDown className={styles.lowPriority} />
    return <FaLightbulb />
  }

  const getCategoryLabel = (category) => {
    if (category === "high-impact") return "Alto Impacto"
    if (category === "medium-impact") return "Impacto Medio"
    if (category === "quick-win") return "Ganancia Rápida"
    return category
  }

  const totalPotentialSavings = recommendations.reduce(
    (sum, r) => sum + (r.annualSavings || 0),
    0
  )

  const completedSavings = recommendations
    .filter((r) => completedRecommendations.includes(r.id))
    .reduce((sum, r) => sum + (r.annualSavings || 0), 0)

  const currentTotalConsumption = deviceData.reduce((s, d) => s + d.consumption, 0)
  const optimizedTotalConsumption = deviceData.reduce(
    (s, d) => s + d.consumption * 0.75,
    0
  )

  const currentTotalCost = currentTotalConsumption * userTariff
  const optimizedTotalCost = optimizedTotalConsumption * userTariff

  const totalOptimizedSavings = currentTotalCost - optimizedTotalCost

  const exportPDF = async () => {
    const html2canvas = (await import("html2canvas")).default
    const jsPDF = (await import("jspdf")).default
    const element = document.getElementById("recommendations-report")
    const canvas = await html2canvas(element, { scale: 2 })
    const imgData = canvas.toDataURL("image/png")
    const pdf = new jsPDF("p", "mm", "a4")
    const width = pdf.internal.pageSize.getWidth()
    const height = (canvas.height * width) / canvas.width
    pdf.addImage(imgData, "PNG", 0, 0, width, height)
    pdf.save("reporte_consumo.pdf")
  }

  return (
    <div className={styles.recommendationsContainer}>
      
      <div className={styles.sectionHeader}>
        <h2>Recomendaciones de Ahorro</h2>
        <p>Sugerencias personalizadas priorizadas por impacto en costo y consumo</p>
      </div>

      <div className={styles.summaryCards}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}><FaDollarSign /></div>
          <div className={styles.summaryContent}>
            <h3>Ahorro Potencial Anual</h3>
            <p className={styles.summaryValue}>$
              {totalPotentialSavings.toLocaleString()}
            </p>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}><FaCheckCircle /></div>
          <div className={styles.summaryContent}>
            <h3>Ahorro Implementado</h3>
            <p className={styles.summaryValue}>$
              {completedSavings.toLocaleString()}
            </p>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}><FaLightbulb /></div>
          <div className={styles.summaryContent}>
            <h3>Recomendaciones Activas</h3>
            <p className={styles.summaryValue}>
              {recommendations.length - completedRecommendations.length}
            </p>
          </div>
        </div>
      </div>

      <div className={styles.filtersSection}>
        <h3>Filtrar por categoría:</h3>
        <div className={styles.filterButtons}>
          <button className={`${styles.filterButton} ${
            filter === "all" ? styles.active : ""
          }`} onClick={() => setFilter("all")}>Todas</button>

          <button className={`${styles.filterButton} ${
            filter === "quick-win" ? styles.active : ""
          }`} onClick={() => setFilter("quick-win")}>Ganancia Rápida</button>

          <button className={`${styles.filterButton} ${
            filter === "high-impact" ? styles.active : ""
          }`} onClick={() => setFilter("high-impact")}>Alto Impacto</button>

          <button className={`${styles.filterButton} ${
            filter === "medium-impact" ? styles.active : ""
          }`} onClick={() => setFilter("medium-impact")}>Impacto Medio</button>
        </div>
      </div>

      <div className={styles.recommendationsList}>
        {sortedRecommendations.map((r) => (
          <div key={r.id} 
            className={`${styles.recommendationCard} ${
              completedRecommendations.includes(r.id) ? styles.completed : ""
            }`}
          >
            <div className={styles.recommendationHeader}>
              <div className={styles.headerLeft}>
                <div className={styles.priorityBadge}>
                  {getPriorityIcon(r.priority)}
                  <span>{r.priority}</span>
                </div>
                <div className={styles.categoryBadge}>
                  {getCategoryLabel(r.category)}
                </div>
              </div>

              <button 
                className={styles.completeButton}
                onClick={() => toggleCompleted(r.id)}
              >
                {completedRecommendations.includes(r.id)
                  ? <FaCheckCircle className={styles.completedIcon} />
                  : <div className={styles.incompleteIcon}></div>
                }
              </button>
            </div>

            <div className={styles.recommendationContent}>
              <h3>{r.title}</h3>
              <p className={styles.description}>{r.description}</p>
              <p className={styles.device}>Dispositivo: {r.device}</p>

              <div className={styles.metricsGrid}>
                
                <div className={styles.metric}>
                  <FaBolt />
                  <div>
                    <span className={styles.metricValue}>
                      {(r.currentConsumption - r.optimizedConsumption).toFixed(1)} kWh/mes
                    </span>
                    <span className={styles.metricLabel}>Ahorro energético</span>
                  </div>
                </div>

                <div className={styles.metric}>
                  <FaDollarSign />
                  <div>
                    <span className={styles.metricValue}>
                      ${r.monthlySavings.toLocaleString()}
                    </span>
                    <span className={styles.metricLabel}>Ahorro mensual</span>
                  </div>
                </div>

                <div className={styles.metric}>
                  <FaLeaf />
                  <div>
                    <span className={styles.metricValue}>
                      {r.co2Reduction} kg
                    </span>
                    <span className={styles.metricLabel}>Reducción CO₂</span>
                  </div>
                </div>

                <div className={styles.metric}>
                  <FaClock />
                  <div>
                    <span className={styles.metricValue}>
                      {r.paybackMonths === 0 ? "Inmediato" : `${r.paybackMonths} meses`}
                    </span>
                    <span className={styles.metricLabel}>Retorno</span>
                  </div>
                </div>

              </div>

              <div className={styles.implementationInfo}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Dificultad:</span>
                  <span className={styles.infoValue}>{r.difficulty}</span>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Tiempo:</span>
                  <span className={styles.infoValue}>{r.timeToImplement}</span>
                </div>

                {r.investment > 0 && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Inversión:</span>
                    <span className={styles.infoValue}>
                      ${r.investment.toLocaleString()}
                    </span>
                  </div>
                )}
              </div>

              <div className={styles.tipsSection}>
                <h4>Consejos para implementar:</h4>
                <ul className={styles.tipsList}>
                  {r.tips.map((t, i) => (
                    <li key={i}>{t}</li>
                  ))}
                </ul>
              </div>

            </div>
          </div>
        ))}
      </div>

      <div className={styles.reportSection} id="recommendations-report">

        <h3><FaChartBar /> Reporte de Consumo y Análisis</h3>

        <div className={styles.reportGrid}>
          <div className={styles.reportCard}>
            <h4>Dispositivos monitoreados</h4>
            <p>{deviceData.length}</p>
          </div>

          <div className={styles.reportCard}>
            <h4>Costo total mensual</h4>
            <p>${totalCost.toLocaleString()}</p>
          </div>

          <div className={styles.reportCard}>
            <h4>Ahorro potencial anual</h4>
            <p>${totalPotentialSavings.toLocaleString()}</p>
          </div>

          <div className={styles.reportCard}>
            <h4>Ahorro implementado</h4>
            <p>${completedSavings.toLocaleString()}</p>
          </div>
        </div>

        <div className={styles.vsSection}>
          <h3>📉 Comparación de Escenario Actual vs Optimizado</h3>

          <div className={styles.vsGrid}>
            <div className={styles.vsCard}>
              <h4>Escenario Actual</h4>
              <p><strong>{currentTotalConsumption.toFixed(1)}</strong> kWh/mes</p>
              <p><strong>${currentTotalCost.toLocaleString()}</strong> / mes</p>
            </div>

            <div className={styles.vsArrow}>➡️</div>

            <div className={styles.vsCard}>
              <h4>Escenario Optimizado</h4>
              <p><strong>{optimizedTotalConsumption.toFixed(1)}</strong> kWh/mes</p>
              <p><strong>${optimizedTotalCost.toLocaleString()}</strong> / mes</p>
            </div>
          </div>

          <div className={styles.vsSummary}>
            <p>Si implementas todas las recomendaciones, podrías ahorrar aproximadamente:</p>
            <h3 className={styles.vsSavings}>
              💰 ${totalOptimizedSavings.toLocaleString()} / mes
            </h3>
            <p>
              Equivalente a <strong>${(totalOptimizedSavings * 12).toLocaleString()}</strong> al año.
            </p>
          </div>
        </div>

        <div className={styles.acceptedSection}>
          <h3>✅ Recomendaciones Aplicadas</h3>

          {completedRecommendations.length === 0 ? (
            <p>No has marcado recomendaciones como completadas.</p>
          ) : (
            <ul className={styles.acceptedList}>
              {recommendations
                .filter((r) => completedRecommendations.includes(r.id))
                .map((r) => (
                  <li key={r.id}>
                    <strong>{r.title}</strong> — Ahorro: ${r.monthlySavings.toLocaleString()} / mes
                  </li>
                ))}
            </ul>
          )}
        </div>

        <div className={styles.insightsContainer}>
          <h3>🔍 Insights inteligentes</h3>

          <div className={styles.insightCardPro}>
            <div className={styles.insightIcon}><FaBolt /></div>
            <div className={styles.insightContent}>
              <h4>Tu dispositivo de mayor consumo</h4>
              <p>{deviceData[0]?.name || "Sin datos"} representa la mayor carga energética mensual.</p>
            </div>
          </div>

          <div className={styles.insightCardPro}>
            <div className={styles.insightIcon}><FaLeaf /></div>
            <div className={styles.insightContent}>
              <h4>Reducción ambiental estimada</h4>
              <p>
                Siguiendo todas las recomendaciones, podrías reducir hasta{" "}
                <strong>
                  {recommendations.reduce((s, r) => s + (r.co2Reduction || 0), 0)} kg de CO₂ al mes.
                </strong>
              </p>
            </div>
          </div>
        </div>

      </div>

      <button className={styles.exportButton} onClick={exportPDF}>
        <FaFilePdf /> Exportar PDF
      </button>
    </div>
  )
}

export default Recommendations
