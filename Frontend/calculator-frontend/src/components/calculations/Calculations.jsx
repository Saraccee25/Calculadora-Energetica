"use client"

import { useState, useEffect } from "react"
import { FaBolt, FaDollarSign, FaHome, FaPlug, FaChartBar, FaLeaf } from "react-icons/fa"
import styles from "./Calculations.module.css"

const Calculations = () => {
  // Datos hardcodeados de dispositivos del usuario (simulando datos del backend)
  const [userDevices] = useState([
    {
      id: 1,
      name: "Televisor LED Samsung",
      power: 150,
      quantity: 2,
      hoursPerDay: 6,
      daysPerWeek: 7,
      category: "Entretenimiento",
    },
    {
      id: 2,
      name: "Refrigerador LG",
      power: 200,
      quantity: 1,
      hoursPerDay: 24,
      daysPerWeek: 7,
      category: "Electrodomésticos",
    },
    {
      id: 3,
      name: "Aire Acondicionado Split",
      power: 1200,
      quantity: 3,
      hoursPerDay: 8,
      daysPerWeek: 7,
      category: "Climatización",
    },
    {
      id: 4,
      name: "Lavadora Whirlpool",
      power: 500,
      quantity: 1,
      hoursPerDay: 2,
      daysPerWeek: 3,
      category: "Electrodomésticos",
    },
    {
      id: 5,
      name: "Computadora de Escritorio",
      power: 300,
      quantity: 2,
      hoursPerDay: 8,
      daysPerWeek: 5,
      category: "Tecnología",
    },
  ])

  const [calculations, setCalculations] = useState({
    deviceTotals: [],
    householdTotal: {
      dailyConsumption: 0,
      monthlyConsumption: 0,
      monthlyCost: 0,
      co2Emissions: 0,
    },
  })

  // Precio por kWh en pesos colombianos (aproximado)
  const PRICE_PER_KWH = 650
  // Factor de emisión CO2 por kWh en Colombia (kg CO2/kWh)
  const CO2_FACTOR = 0.164

  useEffect(() => {
    calculateTotals()
  }, [userDevices])

  const calculateTotals = () => {
    const deviceTotals = userDevices.map((device) => {
      const dailyConsumption = (device.power * device.hoursPerDay * device.quantity) / 1000 // kWh
      const weeklyConsumption = dailyConsumption * device.daysPerWeek
      const monthlyConsumption = weeklyConsumption * 4.33 // Promedio de semanas por mes
      const monthlyCost = monthlyConsumption * PRICE_PER_KWH
      const co2Emissions = monthlyConsumption * CO2_FACTOR

      return {
        ...device,
        dailyConsumption: dailyConsumption.toFixed(2),
        monthlyConsumption: monthlyConsumption.toFixed(2),
        monthlyCost: monthlyCost.toFixed(0),
        co2Emissions: co2Emissions.toFixed(2),
      }
    })

    const householdTotal = deviceTotals.reduce(
      (total, device) => ({
        dailyConsumption: total.dailyConsumption + Number.parseFloat(device.dailyConsumption),
        monthlyConsumption: total.monthlyConsumption + Number.parseFloat(device.monthlyConsumption),
        monthlyCost: total.monthlyCost + Number.parseFloat(device.monthlyCost),
        co2Emissions: total.co2Emissions + Number.parseFloat(device.co2Emissions),
      }),
      { dailyConsumption: 0, monthlyConsumption: 0, monthlyCost: 0, co2Emissions: 0 },
    )

    setCalculations({ deviceTotals, householdTotal })
  }

  const getCategoryIcon = (category) => {
    switch (category) {
      case "Entretenimiento":
        return <FaBolt />
      case "Electrodomésticos":
        return <FaHome />
      case "Climatización":
        return <FaLeaf />
      case "Tecnología":
        return <FaPlug />
      default:
        return <FaBolt />
    }
  }

  return (
    <div className={styles.calculations}>
      <div className={styles.header}>
        <h2>Cálculos Automáticos</h2>
        <p>Totales por dispositivo y del hogar</p>
      </div>

      {/* Resumen Total del Hogar */}
      <div className={styles.householdSummary}>
        <h3>Resumen Total del Hogar</h3>
        <div className={styles.summaryGrid}>
          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon}>
              <FaBolt />
            </div>
            <div className={styles.summaryContent}>
              <h4>Consumo Diario</h4>
              <p className={styles.summaryValue}>{calculations.householdTotal.dailyConsumption.toFixed(2)} kWh</p>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon}>
              <FaChartBar />
            </div>
            <div className={styles.summaryContent}>
              <h4>Consumo Mensual</h4>
              <p className={styles.summaryValue}>{calculations.householdTotal.monthlyConsumption.toFixed(2)} kWh</p>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon}>
              <FaDollarSign />
            </div>
            <div className={styles.summaryContent}>
              <h4>Costo Mensual</h4>
              <p className={styles.summaryValue}>
                ${Number.parseInt(calculations.householdTotal.monthlyCost).toLocaleString()}
              </p>
            </div>
          </div>

          <div className={styles.summaryCard}>
            <div className={styles.summaryIcon}>
              <FaLeaf />
            </div>
            <div className={styles.summaryContent}>
              <h4>Emisiones CO₂</h4>
              <p className={styles.summaryValue}>{calculations.householdTotal.co2Emissions.toFixed(2)} kg/mes</p>
            </div>
          </div>
        </div>
      </div>

      {/* Totales por Dispositivo */}
      <div className={styles.deviceTotals}>
        <h3>Totales por Dispositivo</h3>
        <div className={styles.devicesGrid}>
          {calculations.deviceTotals.map((device) => (
            <div key={device.id} className={styles.deviceCard}>
              <div className={styles.deviceHeader}>
                <div className={styles.deviceIcon}>{getCategoryIcon(device.category)}</div>
                <div className={styles.deviceInfo}>
                  <h4>{device.name}</h4>
                  <p className={styles.deviceDetails}>
                    {device.quantity} unidad{device.quantity > 1 ? "es" : ""} • {device.power}W • {device.hoursPerDay}
                    h/día
                  </p>
                </div>
              </div>

              <div className={styles.deviceMetrics}>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Consumo Diario</span>
                  <span className={styles.metricValue}>{device.dailyConsumption} kWh</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Consumo Mensual</span>
                  <span className={styles.metricValue}>{device.monthlyConsumption} kWh</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>Costo Mensual</span>
                  <span className={styles.metricValue}>${Number.parseInt(device.monthlyCost).toLocaleString()}</span>
                </div>
                <div className={styles.metric}>
                  <span className={styles.metricLabel}>CO₂ Mensual</span>
                  <span className={styles.metricValue}>{device.co2Emissions} kg</span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Calculations
