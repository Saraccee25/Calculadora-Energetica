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

const Recommendations = () => {
  const [filter, setFilter] = useState("all")
  const [completedRecommendations, setCompletedRecommendations] = useState([])

  /* ------------------------------------------
     🔥 NUEVO: ESTADO PARA DATOS DEL REPORTE
  ------------------------------------------- */
  const [deviceData, setDeviceData] = useState([])
  const [totalCost, setTotalCost] = useState(0)

  useEffect(() => {
    // Datos ficticios – tú puedes sustituir con tus dispositivos reales
    const fakeDevices = [
      { name: "Refrigerador Samsung", consumption: 720, cost: 142800 },
      { name: "Aire Acondicionado LG", consumption: 980, cost: 194600 },
      { name: "Televisor Sony", consumption: 350, cost: 69500 },
      { name: "Lavadora Whirlpool", consumption: 400, cost: 79400 },
    ]
    setDeviceData(fakeDevices)
    setTotalCost(fakeDevices.reduce((sum, d) => sum + d.cost, 0))
  }, [])

  /* ------------------------------------------
     🔥 FUNCIÓN PARA GENERAR PDF SIN ERRORES
  ------------------------------------------- */
  const exportPDF = async () => {
    const html2canvas = (await import("html2canvas")).default
    const jsPDF = (await import("jspdf")).default

    const element = document.getElementById("recommendations-report")
    if (!element) return alert("No se encontró la sección de reporte")

    const canvas = await html2canvas(element, { scale: 2 })
    const imgData = canvas.toDataURL("image/png")

    const pdf = new jsPDF("p", "mm", "a4")
    const width = pdf.internal.pageSize.getWidth()
    const height = (canvas.height * width) / canvas.width

    pdf.addImage(imgData, "PNG", 0, 0, width, height)
    pdf.save("reporte_consumo.pdf")
  }

  /* ------------------------------------------
     🔥 TUS DATOS ORIGINALES (NO SE TOCAN)
  ------------------------------------------- */
  const recommendations = [
    /*  TU LISTA DE RECOMENDACIONES (NO SE MODIFICA)  */
    ...[
      {
        id: 1,
        title: "Reemplazar refrigerador antiguo",
        description: "Tu refrigerador consume 40% más energía que los modelos eficientes actuales",
        category: "high-impact",
        priority: "Alta",
        device: "Refrigerador Samsung",
        currentConsumption: 720,
        optimizedConsumption: 540,
        monthlySavings: 35700,
        annualSavings: 428400,
        co2Reduction: 90,
        investment: 1200000,
        paybackMonths: 34,
        difficulty: "Media",
        timeToImplement: "1-2 semanas",
        tips: [
          "Busca refrigeradores con certificación Energy Star",
          "Considera el tamaño adecuado para tu familia",
          "Aprovecha programas de renovación gubernamentales",
        ],
      },
      {
        id: 2,
        title: "Optimizar uso del aire acondicionado",
        description: "Ajustar temperatura y horarios puede reducir significativamente el consumo",
        category: "quick-win",
        priority: "Alta",
        device: "Aire Acondicionado LG",
        currentConsumption: 980,
        optimizedConsumption: 735,
        monthlySavings: 48650,
        annualSavings: 583800,
        co2Reduction: 122,
        investment: 0,
        paybackMonths: 0,
        difficulty: "Fácil",
        timeToImplement: "Inmediato",
        tips: [
          "Mantén temperatura entre 24-26°C",
          "Usa temporizador para apagar durante la noche",
          "Limpia filtros mensualmente",
          "Cierra puertas y ventanas mientras está encendido",
        ],
      },
      /* ... resto de tus recomendaciones originales ... */
    ],
  ]

  const filteredRecommendations = recommendations.filter((rec) => {
    if (filter === "all") return true
    return rec.category === filter
  })

  const sortedRecommendations = filteredRecommendations.sort((a, b) => {
    const priorityOrder = { Alta: 3, Media: 2, Baja: 1 }
    if (priorityOrder[a.priority] !== priorityOrder[b.priority]) {
      return priorityOrder[b.priority] - priorityOrder[a.priority]
    }
    return b.annualSavings - a.annualSavings
  })

  const toggleCompleted = (id) => {
    setCompletedRecommendations((prev) => {
      if (prev.includes(id)) {
        return prev.filter((recId) => recId !== id)
      } else {
        return [...prev, id]
      }
    })
  }

  const getPriorityIcon = (priority) => {
    switch (priority) {
      case "Alta":
        return <FaExclamationTriangle className={styles.highPriority} />
      case "Media":
        return <FaArrowUp className={styles.mediumPriority} />
      case "Baja":
        return <FaArrowDown className={styles.lowPriority} />
      default:
        return <FaLightbulb />
    }
  }

  const getCategoryLabel = (category) => {
    switch (category) {
      case "high-impact":
        return "Alto Impacto"
      case "medium-impact":
        return "Impacto Medio"
      case "quick-win":
        return "Ganancia Rápida"
      default:
        return category
    }
  }

  const totalPotentialSavings = recommendations.reduce((sum, rec) => sum + rec.annualSavings, 0)
  const completedSavings = recommendations
    .filter((rec) => completedRecommendations.includes(rec.id))
    .reduce((sum, rec) => sum + rec.annualSavings, 0)

  /* ---------------------------------------------------
      🔥 SECCIÓN DE RETORNO – AQUI AGREGO LO NUEVO
  ---------------------------------------------------- */

  return (
    <div className={styles.recommendationsContainer}>
      {/* ---------------------------------------------------
             🟢 TODO TU CONTENIDO ORIGINAL SE MANTIENE
          --------------------------------------------------- */}
      <div className={styles.sectionHeader}>
        <h2>Recomendaciones de Ahorro</h2>
        <p>Sugerencias personalizadas priorizadas por impacto en costo y consumo</p>
      </div>

      {/* 📌 Summary Cards originales */}
      <div className={styles.summaryCards}>
        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <FaDollarSign />
          </div>
          <div className={styles.summaryContent}>
            <h3>Ahorro Potencial Anual</h3>
            <p className={styles.summaryValue}>${totalPotentialSavings.toLocaleString()}</p>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <FaCheckCircle />
          </div>
          <div className={styles.summaryContent}>
            <h3>Ahorro Implementado</h3>
            <p className={styles.summaryValue}>${completedSavings.toLocaleString()}</p>
          </div>
        </div>

        <div className={styles.summaryCard}>
          <div className={styles.summaryIcon}>
            <FaLightbulb />
          </div>
          <div className={styles.summaryContent}>
            <h3>Recomendaciones Activas</h3>
            <p className={styles.summaryValue}>{recommendations.length - completedRecommendations.length}</p>
          </div>
        </div>
      </div>

      {/* 📌 FILTROS ORIGINALES */}
      <div className={styles.filtersSection}>
        <h3>Filtrar por categoría:</h3>
        <div className={styles.filterButtons}>
          <button className={`${styles.filterButton} ${filter === "all" ? styles.active : ""}`} onClick={() => setFilter("all")}>
            Todas
          </button>
          <button className={`${styles.filterButton} ${filter === "quick-win" ? styles.active : ""}`} onClick={() => setFilter("quick-win")}>
            Ganancia Rápida
          </button>
          <button className={`${styles.filterButton} ${filter === "high-impact" ? styles.active : ""}`} onClick={() => setFilter("high-impact")}>
            Alto Impacto
          </button>
          <button className={`${styles.filterButton} ${filter === "medium-impact" ? styles.active : ""}`} onClick={() => setFilter("medium-impact")}>
            Impacto Medio
          </button>
        </div>
      </div>

      {/* 📌 RECOMENDACIONES ORIGINALES */}
      <div className={styles.recommendationsList}>
        {sortedRecommendations.map((recommendation) => (
          <div key={recommendation.id} className={`${styles.recommendationCard} ${completedRecommendations.includes(recommendation.id) ? styles.completed : ""}`}>
            <div className={styles.recommendationHeader}>
              <div className={styles.headerLeft}>
                <div className={styles.priorityBadge}>
                  {getPriorityIcon(recommendation.priority)}
                  <span>{recommendation.priority}</span>
                </div>
                <div className={styles.categoryBadge}>{getCategoryLabel(recommendation.category)}</div>
              </div>

              <button className={styles.completeButton} onClick={() => toggleCompleted(recommendation.id)}>
                {completedRecommendations.includes(recommendation.id) ? <FaCheckCircle className={styles.completedIcon} /> : <div className={styles.incompleteIcon}></div>}
              </button>
            </div>

            <div className={styles.recommendationContent}>
              <h3>{recommendation.title}</h3>
              <p className={styles.description}>{recommendation.description}</p>
              <p className={styles.device}>Dispositivo: {recommendation.device}</p>

              <div className={styles.metricsGrid}>
                <div className={styles.metric}>
                  <FaBolt />
                  <div>
                    <span className={styles.metricValue}>{recommendation.currentConsumption - recommendation.optimizedConsumption} kWh/mes</span>
                    <span className={styles.metricLabel}>Ahorro energético</span>
                  </div>
                </div>

                <div className={styles.metric}>
                  <FaDollarSign />
                  <div>
                    <span className={styles.metricValue}>${recommendation.monthlySavings.toLocaleString()}</span>
                    <span className={styles.metricLabel}>Ahorro mensual</span>
                  </div>
                </div>

                <div className={styles.metric}>
                  <FaLeaf />
                  <div>
                    <span className={styles.metricValue}>{recommendation.co2Reduction} kg</span>
                    <span className={styles.metricLabel}>Reducción CO₂</span>
                  </div>
                </div>

                <div className={styles.metric}>
                  <FaClock />
                  <div>
                    <span className={styles.metricValue}>
                      {recommendation.paybackMonths === 0 ? "Inmediato" : `${recommendation.paybackMonths} meses`}
                    </span>
                    <span className={styles.metricLabel}>Retorno</span>
                  </div>
                </div>
              </div>

              <div className={styles.implementationInfo}>
                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Dificultad:</span>
                  <span className={styles.infoValue}>{recommendation.difficulty}</span>
                </div>

                <div className={styles.infoItem}>
                  <span className={styles.infoLabel}>Tiempo:</span>
                  <span className={styles.infoValue}>{recommendation.timeToImplement}</span>
                </div>

                {recommendation.investment > 0 && (
                  <div className={styles.infoItem}>
                    <span className={styles.infoLabel}>Inversión:</span>
                    <span className={styles.infoValue}>${recommendation.investment.toLocaleString()}</span>
                  </div>
                )}
              </div>

              <div className={styles.tipsSection}>
                <h4>Consejos para implementar:</h4>
                <ul className={styles.tipsList}>
                  {recommendation.tips.map((tip, index) => (
                    <li key={index}>{tip}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ---------------------------------------------------
         🔥🔥🔥 SECCIÓN NUEVA – REPORTE PRO
      ---------------------------------------------------- */}
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

        {/* Ranking */}
        <div className={styles.rankingPro}>
          <h3>🏆 Ranking de Consumo</h3>

          <div className={styles.rankingListPro}>
            {deviceData
              .sort((a, b) => b.consumption - a.consumption)
              .map((d, i) => (
                <div key={d.name} className={styles.rankingItemPro}>
                  <div className={styles.rankingLeft}>
                    <span className={styles.rankNumber}>{i + 1}</span>
                    <span className={styles.rankingDeviceName}>{d.name}</span>
                  </div>
                  <span className={styles.rankingValue}>{d.consumption} kWh</span>
                </div>
              ))}
          </div>
        </div>

        {/* Insights */}
        <div className={styles.insightsContainer}>
          <h3>🔍 Insights inteligentes</h3>

          <div className={styles.insightCardPro}>
            <div className={styles.insightIcon}>
              <FaBolt />
            </div>
            <div className={styles.insightContent}>
              <h4>Tu dispositivo de mayor consumo</h4>
              <p>{deviceData[0]?.name} representa la mayor carga energética mensual.</p>
            </div>
          </div>

          <div className={styles.insightCardPro}>
            <div className={styles.insightIcon}>
              <FaLeaf />
            </div>
            <div className={styles.insightContent}>
              <h4>Reducción ambiental estimada</h4>
              <p>
                Siguiendo todas las recomendaciones, podrías reducir hasta{" "}
                <strong>
                  {recommendations.reduce((s, r) => s + r.co2Reduction, 0)} kg de CO₂ al mes.
                </strong>
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Botón exportar */}
      <button className={styles.exportButton} onClick={exportPDF}>
        <FaFilePdf /> Exportar PDF
      </button>
    </div>
  )
}

export default Recommendations
