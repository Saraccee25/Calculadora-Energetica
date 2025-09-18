"use client"

import { useState } from "react"
import { FaChartBar, FaChartPie, FaTable, FaTrophy, FaCalendarAlt } from "react-icons/fa"
import styles from "./DataVisualization.module.css"

const DataVisualization = () => {
  const [activeChart, setActiveChart] = useState("bars")

  // Datos base (sin porcentaje manual)
  const baseDeviceData = [
    { name: "Aire Acondicionado", consumption: 864, cost: 561600 },
    { name: "Refrigerador", consumption: 208, cost: 135200 },
    { name: "Televisores", consumption: 156, cost: 101400 },
    { name: "Computadoras", consumption: 208, cost: 135200 },
    { name: "Lavadora", consumption: 130, cost: 84500 },
  ]

  // Calcular total y porcentajes dinámicamente
  const totalConsumption = baseDeviceData.reduce((sum, d) => sum + d.consumption, 0)
  const deviceData = baseDeviceData.map((d) => ({
    ...d,
    percentage: ((d.consumption / totalConsumption) * 100).toFixed(1),
  }))

  const monthlyData = [
    { month: "Ene", consumption: 1850, cost: 1202500 },
    { month: "Feb", consumption: 1920, cost: 1248000 },
    { month: "Mar", consumption: 2100, cost: 1365000 },
    { month: "Abr", consumption: 2250, cost: 1462500 },
    { month: "May", consumption: 2400, cost: 1560000 },
    { month: "Jun", consumption: 2350, cost: 1527500 },
  ]

  const chartTypes = [
    { id: "bars", label: "Gráfico de Barras", icon: FaChartBar },
    { id: "pie", label: "Gráfico de Torta", icon: FaChartPie },
    { id: "ranking", label: "Ranking", icon: FaTrophy },
    { id: "timeline", label: "Serie Temporal", icon: FaCalendarAlt },
  ]

  const renderChart = () => {
    switch (activeChart) {
      case "bars":
        return (
          <div className={styles.barChart}>
            <h4>Consumo por Dispositivo (kWh/mes)</h4>
            <div className={styles.barsContainer}>
              {deviceData.map((device, index) => (
                <div key={index} className={styles.barItem}>
                  <div className={styles.barLabel}>{device.name}</div>
                  <div className={styles.barWrapper}>
                    <div
                      className={styles.bar}
                      style={{
                        width: `${(device.consumption / Math.max(...deviceData.map((d) => d.consumption))) * 100}%`,
                      }}
                    ></div>
                    <span className={styles.barValue}>{device.consumption} kWh</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )

      case "pie":
        return (
          <div className={styles.pieChart}>
            <h4>Distribución del Consumo</h4>
            <div className={styles.pieContainer}>
              <div className={styles.pieVisualization}>
                <div className={styles.pieCircle}>
                  {deviceData.map((device, index) => (
                    <div
                      key={index}
                      className={`${styles.pieSlice} ${styles[`slice${index + 1}`]}`}
                      style={{ "--percentage": device.percentage }}
                    ></div>
                  ))}
                </div>
              </div>
              <div className={styles.pieLegend}>
                {deviceData.map((device, index) => (
                  <div key={index} className={styles.legendItem}>
                    <div className={`${styles.legendColor} ${styles[`color${index + 1}`]}`}></div>
                    <span>
                      {device.name}: {device.percentage}%
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )

      case "ranking":
        return (
          <div className={styles.ranking}>
            <h4>Ranking de Consumo</h4>
            <div className={styles.rankingList}>
              {deviceData
                .sort((a, b) => b.consumption - a.consumption)
                .map((device, index) => (
                  <div key={index} className={styles.rankingItem}>
                    <div className={styles.rankingPosition}>#{index + 1}</div>
                    <div className={styles.rankingInfo}>
                      <h5>{device.name}</h5>
                      <p>
                        {device.consumption} kWh/mes • ${device.cost.toLocaleString()}
                      </p>
                    </div>
                    <div className={styles.rankingPercentage}>{device.percentage}%</div>
                  </div>
                ))}
            </div>
          </div>
        )

      case "timeline":
        return (
          <div className={styles.timeline}>
            <h4>Evolución del Consumo Mensual</h4>
            <div className={styles.timelineChart}>
              {monthlyData.map((data, index) => (
                <div key={index} className={styles.timelineItem}>
                  <div className={styles.timelineMonth}>{data.month}</div>
                  <div className={styles.timelineBar}>
                    <div
                      className={styles.timelineValue}
                      style={{
                        height: `${(data.consumption / Math.max(...monthlyData.map((d) => d.consumption))) * 100}%`,
                      }}
                    ></div>
                  </div>
                  <div className={styles.timelineLabel}>{data.consumption} kWh</div>
                </div>
              ))}
            </div>
          </div>
        )
    }
  }

  return (
    <div className={styles.dataVisualization}>
      <div className={styles.header}>
        <h2>Visualización de Datos</h2>
        <p>Gráficas interactivas y tablas resumen con métricas agregadas</p>
      </div>

      {/* Selector de tipo de gráfico */}
      <div className={styles.chartSelector}>
        {chartTypes.map((chart) => {
          const IconComponent = chart.icon
          return (
            <button
              key={chart.id}
              className={`${styles.chartButton} ${activeChart === chart.id ? styles.active : ""}`}
              onClick={() => setActiveChart(chart.id)}
            >
              <IconComponent />
              <span>{chart.label}</span>
            </button>
          )
        })}
      </div>

      {/* Área del gráfico */}
      <div className={styles.chartArea}>{renderChart()}</div>

      {/* Tabla resumen */}
      <div className={styles.summaryTable}>
        <div className={styles.tableHeader}>
          <FaTable />
          <h3>Tabla Resumen - Métricas Agregadas</h3>
        </div>
        <div className={styles.tableContainer}>
          <table className={styles.table}>
            <thead>
              <tr>
                <th>Dispositivo</th>
                <th>Consumo (kWh/mes)</th>
                <th>Costo ($/mes)</th>
                <th>% del Total</th>
                <th>CO₂ (kg/mes)</th>
              </tr>
            </thead>
            <tbody>
              {deviceData.map((device, index) => (
                <tr key={index}>
                  <td className={styles.deviceName}>{device.name}</td>
                  <td>{device.consumption}</td>
                  <td>${device.cost.toLocaleString()}</td>
                  <td>{device.percentage}%</td>
                  <td>{(device.consumption * 0.164).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr className={styles.totalRow}>
                <td>
                  <strong>TOTAL</strong>
                </td>
                <td>
                  <strong>{totalConsumption}</strong>
                </td>
                <td>
                  <strong>${deviceData.reduce((sum, d) => sum + d.cost, 0).toLocaleString()}</strong>
                </td>
                <td>
                  <strong>100%</strong>
                </td>
                <td>
                  <strong>{(totalConsumption * 0.164).toFixed(2)}</strong>
                </td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>
    </div>
  )
}

export default DataVisualization
