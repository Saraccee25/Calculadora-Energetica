"use client"

import { useState } from "react"
import { Link } from "react-router-dom"
import styles from "./CalculatorPage.module.css"

const CalculatorPage = () => {
  const [selectedDevice, setSelectedDevice] = useState("")
  const [power, setPower] = useState("")
  const [hours, setHours] = useState("")
  const [days, setDays] = useState("")
  const [tariff, setTariff] = useState("580")
  const [result, setResult] = useState(null)

  const deviceCatalog = [
    { name: "Refrigerador", power: 150, category: "Cocina" },
    { name: 'Televisor LED 32"', power: 65, category: "Entretenimiento" },
    { name: "Aire Acondicionado", power: 1200, category: "Clima" },
    { name: "Lavadora", power: 500, category: "Lavandería" },
    { name: "Microondas", power: 800, category: "Cocina" },
    { name: "Computador Portátil", power: 65, category: "Entretenimiento" },
    { name: "Plancha", power: 1000, category: "Lavandería" },
    { name: "Ventilador", power: 75, category: "Clima" },
  ]

  const handleDeviceSelect = (device) => {
    setSelectedDevice(device.name)
    setPower(device.power.toString())
  }

  const calculateConsumption = () => {
    if (!power || !hours || !days) return

    const monthlyConsumption = (Number.parseFloat(power) * Number.parseFloat(hours) * Number.parseFloat(days)) / 1000
    const monthlyCost = monthlyConsumption * Number.parseFloat(tariff)
    const annualConsumption = monthlyConsumption * 12
    const annualCost = monthlyCost * 12

    setResult({
      monthlyConsumption: monthlyConsumption.toFixed(2),
      monthlyCost: monthlyCost.toFixed(0),
      annualConsumption: annualConsumption.toFixed(2),
      annualCost: annualCost.toFixed(0),
    })
  }

  return (
    <div className={styles.calculatorPage}>
      {/* Hero Section */}
      <section className={styles.hero}>
        <div className={styles.container}>
          <div className={styles.heroContent}>
            <h1 className={styles.heroTitle}>
              Calculadora de <span className={styles.highlight}>Consumo Energético</span>
            </h1>
            <p className={styles.heroDescription}>
              Calcula el consumo y costo energético de tus electrodomésticos de manera precisa y sencilla
            </p>
          </div>
        </div>
      </section>

      {/* Calculator Section */}
      <section className={styles.calculator}>
        <div className={styles.container}>
          <div className={styles.calculatorGrid}>
            {/* Device Catalog */}
            <div className={styles.catalogSection}>
              <h3 className={styles.sectionTitle}>Catálogo de Dispositivos</h3>
              <div className={styles.deviceGrid}>
                {deviceCatalog.map((device, index) => (
                  <div
                    key={index}
                    className={`${styles.deviceCard} ${selectedDevice === device.name ? styles.selected : ""}`}
                    onClick={() => handleDeviceSelect(device)}
                  >
                    <div className={styles.deviceIcon}>⚡</div>
                    <h4>{device.name}</h4>
                    <p>{device.power}W</p>
                    <span className={styles.category}>{device.category}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Calculator Form */}
            <div className={styles.formSection}>
              <h3 className={styles.sectionTitle}>Parámetros de Cálculo</h3>
              <div className={styles.calculatorForm}>
                <div className={styles.inputGroup}>
                  <label>Dispositivo Seleccionado</label>
                  <input
                    type="text"
                    value={selectedDevice}
                    onChange={(e) => setSelectedDevice(e.target.value)}
                    placeholder="Nombre del dispositivo"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Potencia (Watts)</label>
                  <input
                    type="number"
                    value={power}
                    onChange={(e) => setPower(e.target.value)}
                    placeholder="Ej: 150"
                    min="1"
                    max="5000"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Horas de uso diario</label>
                  <input
                    type="number"
                    value={hours}
                    onChange={(e) => setHours(e.target.value)}
                    placeholder="Ej: 8"
                    min="0.1"
                    max="24"
                    step="0.1"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Días de uso mensual</label>
                  <input
                    type="number"
                    value={days}
                    onChange={(e) => setDays(e.target.value)}
                    placeholder="Ej: 30"
                    min="1"
                    max="31"
                  />
                </div>

                <div className={styles.inputGroup}>
                  <label>Tarifa por kWh (COP)</label>
                  <select value={tariff} onChange={(e) => setTariff(e.target.value)}>
                    <option value="450">Estrato 1 - $450</option>
                    <option value="520">Estrato 2 - $520</option>
                    <option value="580">Estrato 3 - $580</option>
                    <option value="620">Estrato 4 - $620</option>
                    <option value="680">Estrato 5 - $680</option>
                    <option value="720">Estrato 6 - $720</option>
                  </select>
                </div>

                <button className={styles.calculateBtn} onClick={calculateConsumption}>
                  <span>Calcular Consumo</span>
                </button>
              </div>
            </div>
          </div>

          {/* Results Section */}
          {result && (
            <div className={styles.resultsSection}>
              <h3 className={styles.sectionTitle}>Resultados del Cálculo</h3>
              <div className={styles.resultsGrid}>
                <div className={styles.resultCard}>
                  <div className={styles.resultIcon}>📊</div>
                  <h4>Consumo Mensual</h4>
                  <p className={styles.resultValue}>{result.monthlyConsumption} kWh</p>
                </div>
                <div className={styles.resultCard}>
                  <div className={styles.resultIcon}>💰</div>
                  <h4>Costo Mensual</h4>
                  <p className={styles.resultValue}>${result.monthlyCost} COP</p>
                </div>
                <div className={styles.resultCard}>
                  <div className={styles.resultIcon}>📈</div>
                  <h4>Consumo Anual</h4>
                  <p className={styles.resultValue}>{result.annualConsumption} kWh</p>
                </div>
                <div className={styles.resultCard}>
                  <div className={styles.resultIcon}>💸</div>
                  <h4>Costo Anual</h4>
                  <p className={styles.resultValue}>${result.annualCost} COP</p>
                </div>
              </div>
            </div>
          )}

          {/* CTA Section */}
          <div className={styles.ctaSection}>
            <h3>¿Quieres un análisis más completo?</h3>
            <p>
              Accede a nuestro dashboard completo para gestionar múltiples dispositivos y obtener recomendaciones
              personalizadas
            </p>
            <Link to="/dashboard">
              <button className={styles.ctaBtn}>Ir al Dashboard</button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
}

export default CalculatorPage
