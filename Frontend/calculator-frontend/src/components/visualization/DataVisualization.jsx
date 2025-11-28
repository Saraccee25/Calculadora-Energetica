"use client"

import { useState, useEffect } from "react"
import { FaChartBar, FaChartPie, FaTrophy, FaCalendarAlt, FaPlug, FaMedal } from "react-icons/fa"
import styles from "./DataVisualization.module.css"
import preloadedDevices from "../../data/devices_preloaded.json"
import apiClient from "../../api/ApiClient"

const iconMap = {
  cocina: FaPlug,
  lavanderia: FaPlug,
  entretenimiento: FaPlug,
  climatizacion: FaPlug,
  iluminacion: FaPlug,
  otros: FaPlug,
}

const DataVisualization = () => {
  const [activeChart, setActiveChart] = useState("bars")
  const [clientDevices, setClientDevices] = useState([])
  const [deviceCatalog, setDeviceCatalog] = useState([])
  const [loading, setLoading] = useState(true)
  const [userTariff, setUserTariff] = useState(600)

  useEffect(() => {
    const fetchAllDevices = async () => {
      try {
        const res = await fetch("http://localhost:8081/api/devices")
        if (!res.ok) throw new Error("Error al obtener dispositivos del servidor")

        const serverDevices = await res.json()
        const localDevices = preloadedDevices

        const combined = [
          ...localDevices.map((d) => ({
            ...d,
            id: `local-${d.nombre}`,
          })),
          ...serverDevices,
        ]

        const devicesWithIcons = combined.map((device) => ({
          ...device,
          icon: iconMap[device.categoria] || FaPlug,
        }))

        setDeviceCatalog(devicesWithIcons)
      } catch (err) {
        console.error("Error al cargar dispositivos combinados:", err)
      } finally {
        setLoading(false)
      }
    }

    fetchAllDevices()
  }, [])

  useEffect(() => {
    if (deviceCatalog.length === 0) return

    const loadSavedDevices = async () => {
      try {
        const savedDevices = await apiClient.getAsync("/user-devices", {
          requireAuth: true,
        })

        const merged = savedDevices
          .map((saved) => {
            const full = deviceCatalog.find((d) => String(d.id) === String(saved.deviceId))

            if (!full) {
              console.warn(`⚠ Device ${saved.deviceId} no existe en catálogo`)
              return null
            }

            return {
              ...saved,
              device: full,
              quantity: Number(saved.quantity) || 0,
              dailyHours: Number(saved.dailyHours) || 0,
              weeklyDays: Number(saved.weeklyDays) || 0,
            }
          })
          .filter(Boolean)

        setClientDevices(merged)
      } catch (error) {
        console.error("Error cargando saved-devices:", error)
      }
    }

    loadSavedDevices()
  }, [deviceCatalog])

  const calculateMonthlyConsumption = (device) => {
    const rawPower = device.device.potenciaWatts
    const powerW = typeof rawPower === "string" ? parseFloat(rawPower) : Number(rawPower)

    const hoursPerDay = Number(device.dailyHours)
    const quantity = Number(device.quantity)
    const daysPerWeek = Number(device.weeklyDays)

    if (isNaN(powerW) || isNaN(hoursPerDay) || isNaN(quantity) || isNaN(daysPerWeek)) {
      return 0
    }

    const daysPerMonth = (daysPerWeek * 30) / 7
    const consumptionKwh = (powerW * hoursPerDay * quantity * daysPerMonth) / 1000

    return consumptionKwh
  }

  const deviceData = clientDevices
    .map((d) => {
      if (!d.device) return null

      const consumption = calculateMonthlyConsumption(d)

      return {
        name: d.device.nombre || "Sin nombre",
        consumption: +consumption.toFixed(2),
        cost: +(consumption * userTariff).toFixed(2),
        co2: +(consumption * 0.164).toFixed(3),
      }
    })
    .filter(Boolean)

  const totalConsumption = deviceData.reduce((sum, d) => sum + d.consumption, 0)

  const deviceDataWithPercentage = deviceData.map((d) => ({
    ...d,
    percentage: totalConsumption ? +((d.consumption / totalConsumption) * 100).toFixed(1) : 0,
  }))

  const chartTypes = [
    { id: "bars", label: "Barras", icon: FaChartBar },
    { id: "pie", label: "Torta", icon: FaChartPie },
    { id: "ranking", label: "Ranking", icon: FaTrophy },
    { id: "timeline", label: "Temporal", icon: FaCalendarAlt },
  ]

  const renderChart = () => {
    if (loading) {
      return <div className={styles.loadingState}>⏳ Cargando datos...</div>
    }

    if (deviceDataWithPercentage.length === 0) {
      return (
        <div className={styles.emptyState}>
          <FaPlug className={styles.emptyIcon} />
          <p>No hay dispositivos configurados</p>
          <span>Agrega dispositivos desde el catálogo</span>
        </div>
      )
    }

    switch (activeChart) {
      case "bars":
        const maxValue = Math.max(...deviceDataWithPercentage.map((x) => x.consumption))

        return (
          <div className={styles.barChart}>
            <h4>📊 Consumo por Dispositivo (kWh/mes)</h4>
            <div className={styles.barsContainer}>
              {deviceDataWithPercentage.map((device, index) => (
                <div key={index} className={styles.barItem}>
                  <div className={styles.barLabel}>{device.name}</div>

                  <div className={styles.barWrapper}>
                    <div
                      className={styles.bar}
                      style={{
                        width: `${(device.consumption / maxValue) * 100}%`,
                        background: `hsl(${220 - index * 20}, 70%, 60%)`
                      }}
                    ></div>
                    <span className={styles.barValue}>
                      {device.consumption.toFixed(2)} kWh
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "pie":
        const colors = [
          "#6366f1", "#8b5cf6", "#ec4899", "#f59e0b", 
          "#10b981", "#3b82f6", "#ef4444", "#06b6d4"
        ]

        return (
          <div className={styles.pieChart}>
            <h4>🥧 Distribución del Consumo</h4>
            
            <div className={styles.pieWrapper}>
              <svg viewBox="0 0 200 200" className={styles.pieSvg}>
                {deviceDataWithPercentage.map((device, index) => {
                  const startAngle = deviceDataWithPercentage
                    .slice(0, index)
                    .reduce((sum, d) => sum + (d.percentage / 100) * 360, 0)
                  
                  const angle = (device.percentage / 100) * 360
                  
                  const startRad = (startAngle - 90) * Math.PI / 180
                  const endRad = (startAngle + angle - 90) * Math.PI / 180
                  
                  const x1 = 100 + 80 * Math.cos(startRad)
                  const y1 = 100 + 80 * Math.sin(startRad)
                  const x2 = 100 + 80 * Math.cos(endRad)
                  const y2 = 100 + 80 * Math.sin(endRad)
                  
                  const largeArc = angle > 180 ? 1 : 0
                  
                  const pathData = [
                    `M 100 100`,
                    `L ${x1} ${y1}`,
                    `A 80 80 0 ${largeArc} 1 ${x2} ${y2}`,
                    `Z`
                  ].join(" ")

                  return (
                    <path
                      key={index}
                      d={pathData}
                      fill={colors[index % colors.length]}
                      stroke="white"
                      strokeWidth="2"
                    />
                  )
                })}
              </svg>

              <div className={styles.pieLegend}>
                {deviceDataWithPercentage.map((device, index) => (
                  <div key={index} className={styles.legendItem}>
                    <div
                      className={styles.legendColor}
                      style={{
                        background: colors[index % colors.length]
                      }}
                    ></div>
                    <span className={styles.legendText}>
                      {device.name}: <strong>{device.percentage}%</strong>
                      <br />
                      <small>{device.consumption.toFixed(2)} kWh</small>
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case "ranking":
        const sortedDevices = [...deviceDataWithPercentage].sort(
          (a, b) => b.consumption - a.consumption
        )

        const medals = ["🥇", "🥈", "🥉"]

        return (
          <div className={styles.ranking}>
            <h4>🏆 Ranking de Mayor Consumo</h4>
            <div className={styles.rankingList}>
              {sortedDevices.map((device, index) => (
                <div 
                  key={index} 
                  className={styles.rankingItem}
                  style={{
                    background: index < 3 ? "#fef3c7" : "#f8fafc"
                  }}
                >
                  <span className={styles.rankingPosition}>
                    {index < 3 ? medals[index] : `#${index + 1}`}
                  </span>
                  <div className={styles.rankingInfo}>
                    <div className={styles.rankingName}>{device.name}</div>
                    <div className={styles.rankingDetails}>
                      <span className={styles.rankingConsumption}>
                        ⚡ {device.consumption.toFixed(2)} kWh/mes
                      </span>
                      <span className={styles.rankingCost}>
                        💰 ${device.cost.toLocaleString()}
                      </span>
                      <span className={styles.rankingCO2}>
                        🌱 {device.co2} kg CO₂
                      </span>
                    </div>
                  </div>
                  <div className={styles.rankingPercentage}>
                    {device.percentage}%
                  </div>
                </div>
              ))}
            </div>
            
            <div className={styles.totalSummary}>
              <div className={styles.summaryCard}>
                <div className={styles.summaryLabel}>Total Mensual</div>
                <div className={styles.summaryValue}>{totalConsumption.toFixed(2)} kWh</div>
              </div>
              <div className={styles.summaryCard}>
                <div className={styles.summaryLabel}>Costo Total</div>
                <div className={styles.summaryValue}>
                  ${(totalConsumption * userTariff).toLocaleString()}
                </div>
              </div>
              <div className={styles.summaryCard}>
                <div className={styles.summaryLabel}>Emisiones CO₂</div>
                <div className={styles.summaryValue}>
                  {(totalConsumption * 0.164).toFixed(2)} kg
                </div>
              </div>
            </div>
          </div>
        )

      case "timeline":
        const months = ["Jun", "Jul", "Ago", "Sep", "Oct", "Nov"]
        const monthlyData = months.map((month, index) => {
          const variation = 0.85 + (Math.random() * 0.3)
          return {
            month,
            consumption: +(totalConsumption * variation).toFixed(2),
            cost: +((totalConsumption * variation) * userTariff).toFixed(2)
          }
        })

        const maxMonthly = Math.max(...monthlyData.map(d => d.consumption))

        return (
          <div className={styles.timeline}>
            <h4>📅 Serie Temporal (últimos 6 meses)</h4>
            
            <div className={styles.timelineChart}>
              <div className={styles.timelineGrid}>
                {[100, 75, 50, 25, 0].map((percentage, i) => (
                  <div key={i} className={styles.gridLine}>
                    <span className={styles.gridLabel}>
                      {((maxMonthly * percentage) / 100).toFixed(0)} kWh
                    </span>
                  </div>
                ))}
              </div>

              <div className={styles.timelineBars}>
                {monthlyData.map((data, index) => (
                  <div key={index} className={styles.timelineBarContainer}>
                    <div
                      className={styles.timelineBar}
                      style={{
                        height: `${(data.consumption / maxMonthly) * 100}%`,
                        background: `linear-gradient(to top, #6366f1, #8b5cf6)`
                      }}
                    >
                      <div className={styles.timelineTooltip}>
                        {data.consumption} kWh
                        <br />
                        ${data.cost.toLocaleString()}
                      </div>
                    </div>
                    <div className={styles.timelineLabel}>{data.month}</div>
                  </div>
                ))}
              </div>
            </div>

            <div className={styles.timelineInsights}>
              <div className={styles.insightCard}>
                <div className={styles.insightIcon}>📈</div>
                <div>
                  <div className={styles.insightTitle}>Promedio Mensual</div>
                  <div className={styles.insightValue}>
                    {(monthlyData.reduce((s, d) => s + d.consumption, 0) / 6).toFixed(2)} kWh
                  </div>
                </div>
              </div>
              
              <div className={styles.insightCard}>
                <div className={styles.insightIcon}>💡</div>
                <div>
                  <div className={styles.insightTitle}>Mes Actual</div>
                  <div className={styles.insightValue}>{totalConsumption.toFixed(2)} kWh</div>
                </div>
              </div>
            </div>
          </div>
        )

      default:
        return <div>Gráfico no implementado</div>
    }
  }

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <h2>📊 Visualización de Consumo Energético</h2>
      </div>

      <div className={styles.chartSelector}>
        {chartTypes.map((chart) => (
          <button
            key={chart.id}
            className={`${styles.chartButton} ${
              activeChart === chart.id ? styles.active : ""
            }`}
            onClick={() => setActiveChart(chart.id)}
          >
            <chart.icon style={{ marginRight: "8px" }} />
            {chart.label}
          </button>
        ))}
      </div>

      <div className={styles.chartArea}>{renderChart()}</div>
    </div>
  )
}

export default DataVisualization