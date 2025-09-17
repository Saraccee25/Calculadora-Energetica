"use client"

import { useState } from "react"
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
} from "react-icons/fa"
import styles from "./Recommendations.module.css"

const Recommendations = () => {
  const [filter, setFilter] = useState("all")
  const [completedRecommendations, setCompletedRecommendations] = useState([])

  const recommendations = [
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
    {
      id: 3,
      title: "Cambiar a iluminación LED",
      description: "Las bombillas LED consumen 80% menos energía que las incandescentes",
      category: "quick-win",
      priority: "Media",
      device: "Iluminación general",
      currentConsumption: 180,
      optimizedConsumption: 36,
      monthlySavings: 28600,
      annualSavings: 343200,
      co2Reduction: 72,
      investment: 150000,
      paybackMonths: 5,
      difficulty: "Fácil",
      timeToImplement: "1 día",
      tips: [
        "Reemplaza primero las luces que más usas",
        "Elige LEDs con temperatura de color adecuada",
        "Considera LEDs regulables para mayor control",
      ],
    },
    {
      id: 4,
      title: "Instalar termostato inteligente",
      description: "Un termostato inteligente puede reducir el consumo de calefacción/refrigeración hasta 15%",
      category: "medium-impact",
      priority: "Media",
      device: "Sistema de climatización",
      currentConsumption: 1200,
      optimizedConsumption: 1020,
      monthlySavings: 35700,
      annualSavings: 428400,
      co2Reduction: 90,
      investment: 300000,
      paybackMonths: 8,
      difficulty: "Media",
      timeToImplement: "2-3 horas",
      tips: [
        "Programa horarios según tu rutina diaria",
        "Usa sensores de presencia si están disponibles",
        "Configura temperaturas diferentes para día/noche",
      ],
    },
    {
      id: 5,
      title: "Desconectar dispositivos en standby",
      description: "Los dispositivos en modo standby pueden representar hasta 10% del consumo total",
      category: "quick-win",
      priority: "Baja",
      device: "Dispositivos electrónicos",
      currentConsumption: 120,
      optimizedConsumption: 84,
      monthlySavings: 7140,
      annualSavings: 85680,
      co2Reduction: 18,
      investment: 50000,
      paybackMonths: 7,
      difficulty: "Fácil",
      timeToImplement: "30 minutos",
      tips: [
        "Usa regletas con interruptor",
        "Desconecta cargadores cuando no los uses",
        "Configura modo de ahorro en computadores y TVs",
      ],
    },
    {
      id: 6,
      title: "Mejorar aislamiento térmico",
      description: "Un mejor aislamiento reduce la carga de trabajo de sistemas de climatización",
      category: "high-impact",
      priority: "Media",
      device: "Sistema de climatización",
      currentConsumption: 1200,
      optimizedConsumption: 960,
      monthlySavings: 47600,
      annualSavings: 571200,
      co2Reduction: 120,
      investment: 800000,
      paybackMonths: 17,
      difficulty: "Alta",
      timeToImplement: "1-2 semanas",
      tips: [
        "Revisa puertas y ventanas en busca de filtraciones",
        "Considera cortinas térmicas",
        "Aísla tuberías de agua caliente",
      ],
    },
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

  return (
    <div className={styles.recommendationsContainer}>
      <div className={styles.sectionHeader}>
        <h2>Recomendaciones de Ahorro</h2>
        <p>Sugerencias personalizadas priorizadas por impacto en costo y consumo</p>
      </div>

      {/* Summary Cards */}
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

      {/* Filters */}
      <div className={styles.filtersSection}>
        <h3>Filtrar por categoría:</h3>
        <div className={styles.filterButtons}>
          <button
            className={`${styles.filterButton} ${filter === "all" ? styles.active : ""}`}
            onClick={() => setFilter("all")}
          >
            Todas
          </button>
          <button
            className={`${styles.filterButton} ${filter === "quick-win" ? styles.active : ""}`}
            onClick={() => setFilter("quick-win")}
          >
            Ganancia Rápida
          </button>
          <button
            className={`${styles.filterButton} ${filter === "high-impact" ? styles.active : ""}`}
            onClick={() => setFilter("high-impact")}
          >
            Alto Impacto
          </button>
          <button
            className={`${styles.filterButton} ${filter === "medium-impact" ? styles.active : ""}`}
            onClick={() => setFilter("medium-impact")}
          >
            Impacto Medio
          </button>
        </div>
      </div>

      {/* Recommendations List */}
      <div className={styles.recommendationsList}>
        {sortedRecommendations.map((recommendation) => (
          <div
            key={recommendation.id}
            className={`${styles.recommendationCard} ${
              completedRecommendations.includes(recommendation.id) ? styles.completed : ""
            }`}
          >
            <div className={styles.recommendationHeader}>
              <div className={styles.headerLeft}>
                <div className={styles.priorityBadge}>
                  {getPriorityIcon(recommendation.priority)}
                  <span>{recommendation.priority}</span>
                </div>
                <div className={styles.categoryBadge}>{getCategoryLabel(recommendation.category)}</div>
              </div>
              <button className={styles.completeButton} onClick={() => toggleCompleted(recommendation.id)}>
                {completedRecommendations.includes(recommendation.id) ? (
                  <FaCheckCircle className={styles.completedIcon} />
                ) : (
                  <div className={styles.incompleteIcon}></div>
                )}
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
                    <span className={styles.metricValue}>
                      {recommendation.currentConsumption - recommendation.optimizedConsumption} kWh/mes
                    </span>
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
                    <span className={styles.metricLabel}>Retorno inversión</span>
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
    </div>
  )
}

export default Recommendations
