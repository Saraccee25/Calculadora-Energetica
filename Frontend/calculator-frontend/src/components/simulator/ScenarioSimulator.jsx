"use client"

import { useState } from "react"
import { FaChartBar, FaDollarSign, FaBolt, FaLeaf, FaArrowRight, FaLightbulb } from "react-icons/fa"
import styles from "./ScenarioSimulator.module.css"

const ScenarioSimulator = () => {
  const [selectedOptimizations, setSelectedOptimizations] = useState([])

  const currentScenario = {
    monthlyConsumption: 2450,
    monthlyCost: 485000,
    co2Emissions: 1225,
    devices: [
      { name: "Refrigerador Samsung", consumption: 720, cost: 142800 },
      { name: "Aire Acondicionado LG", consumption: 980, cost: 194600 },
      { name: "Televisor Sony", consumption: 350, cost: 69500 },
      { name: "Lavadora Whirlpool", consumption: 400, cost: 79400 },
    ],
  }

  const optimizations = [
    {
      id: 1,
      title: "Cambiar a refrigerador eficiente",
      device: "Refrigerador Samsung",
      savingsKwh: 180,
      savingsCost: 35700,
      co2Reduction: 90,
      investment: 1200000,
      paybackMonths: 34,
    },
    {
      id: 2,
      title: "Usar aire acondicionado inteligente",
      device: "Aire Acondicionado LG",
      savingsKwh: 245,
      savingsCost: 48650,
      co2Reduction: 122,
      investment: 800000,
      paybackMonths: 16,
    },
    {
      id: 3,
      title: "Televisor LED de bajo consumo",
      device: "Televisor Sony",
      savingsKwh: 140,
      savingsCost: 27800,
      co2Reduction: 70,
      investment: 600000,
      paybackMonths: 22,
    },
    {
      id: 4,
      title: "Lavadora con certificación A+++",
      device: "Lavadora Whirlpool",
      savingsKwh: 120,
      savingsCost: 23800,
      co2Reduction: 60,
      investment: 900000,
      paybackMonths: 38,
    },
  ]

  const calculateOptimizedScenario = () => {
    const totalSavingsKwh = selectedOptimizations.reduce((sum, opt) => sum + opt.savingsKwh, 0)
    const totalSavingsCost = selectedOptimizations.reduce((sum, opt) => sum + opt.savingsCost, 0)
    const totalCo2Reduction = selectedOptimizations.reduce((sum, opt) => sum + opt.co2Reduction, 0)
    const totalInvestment = selectedOptimizations.reduce((sum, opt) => sum + opt.investment, 0)

    return {
      monthlyConsumption: currentScenario.monthlyConsumption - totalSavingsKwh,
      monthlyCost: currentScenario.monthlyCost - totalSavingsCost,
      co2Emissions: currentScenario.co2Emissions - totalCo2Reduction,
      totalSavingsKwh,
      totalSavingsCost,
      totalCo2Reduction,
      totalInvestment,
    }
  }

  const optimizedScenario = calculateOptimizedScenario()

  const toggleOptimization = (optimization) => {
    setSelectedOptimizations((prev) => {
      const exists = prev.find((opt) => opt.id === optimization.id)
      if (exists) {
        return prev.filter((opt) => opt.id !== optimization.id)
      } else {
        return [...prev, optimization]
      }
    })
  }

  return (
    <div className={styles.simulatorContainer}>
      <div className={styles.sectionHeader}>
        <h2>Simulador de Escenarios</h2>
        <p>Compara tu consumo actual con escenarios optimizados</p>
      </div>

      {/* Optimizations Selection */}
      <div className={styles.optimizationsSection}>
        <h3>Selecciona las optimizaciones que deseas simular:</h3>
        <div className={styles.optimizationsList}>
          {optimizations.map((optimization) => (
            <div
              key={optimization.id}
              className={`${styles.optimizationCard} ${
                selectedOptimizations.find((opt) => opt.id === optimization.id) ? styles.selected : ""
              }`}
              onClick={() => toggleOptimization(optimization)}
            >
              <div className={styles.optimizationHeader}>
                <h4>{optimization.title}</h4>
                <div className={styles.checkbox}>
                  {selectedOptimizations.find((opt) => opt.id === optimization.id) && "✓"}
                </div>
              </div>
              <p className={styles.deviceName}>{optimization.device}</p>
              <div className={styles.optimizationMetrics}>
                <div className={styles.metric}>
                  <FaBolt />
                  <span>-{optimization.savingsKwh} kWh/mes</span>
                </div>
                <div className={styles.metric}>
                  <FaDollarSign />
                  <span>-${optimization.savingsCost.toLocaleString()}/mes</span>
                </div>
                <div className={styles.metric}>
                  <FaLeaf />
                  <span>-{optimization.co2Reduction} kg CO₂</span>
                </div>
              </div>
              <div className={styles.investment}>
                <span>Inversión: ${optimization.investment.toLocaleString()}</span>
                <span>Retorno: {optimization.paybackMonths} meses</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Comparison */}
      <div className={styles.comparisonSection}>
        <div className={styles.scenarioComparison}>
          {/* Current Scenario */}
          <div className={styles.scenarioCard}>
            <div className={styles.scenarioHeader}>
              <h3>Escenario Actual</h3>
              <div className={styles.scenarioIcon}>
                <FaChartBar />
              </div>
            </div>
            <div className={styles.scenarioMetrics}>
              <div className={styles.mainMetric}>
                <FaBolt />
                <div>
                  <span className={styles.value}>{currentScenario.monthlyConsumption.toLocaleString()}</span>
                  <span className={styles.unit}>kWh/mes</span>
                </div>
              </div>
              <div className={styles.mainMetric}>
                <FaDollarSign />
                <div>
                  <span className={styles.value}>${currentScenario.monthlyCost.toLocaleString()}</span>
                  <span className={styles.unit}>/mes</span>
                </div>
              </div>
              <div className={styles.mainMetric}>
                <FaLeaf />
                <div>
                  <span className={styles.value}>{currentScenario.co2Emissions.toLocaleString()}</span>
                  <span className={styles.unit}>kg CO₂</span>
                </div>
              </div>
            </div>
          </div>

          {/* Arrow */}
          <div className={styles.comparisonArrow}>
            <FaArrowRight />
          </div>

          {/* Optimized Scenario */}
          <div className={styles.scenarioCard}>
            <div className={styles.scenarioHeader}>
              <h3>Escenario Optimizado</h3>
              <div className={styles.scenarioIcon}>
                <FaLightbulb />
              </div>
            </div>
            <div className={styles.scenarioMetrics}>
              <div className={styles.mainMetric}>
                <FaBolt />
                <div>
                  <span className={styles.value}>{optimizedScenario.monthlyConsumption.toLocaleString()}</span>
                  <span className={styles.unit}>kWh/mes</span>
                  {optimizedScenario.totalSavingsKwh > 0 && (
                    <span className={styles.savings}>-{optimizedScenario.totalSavingsKwh} kWh</span>
                  )}
                </div>
              </div>
              <div className={styles.mainMetric}>
                <FaDollarSign />
                <div>
                  <span className={styles.value}>${optimizedScenario.monthlyCost.toLocaleString()}</span>
                  <span className={styles.unit}>/mes</span>
                  {optimizedScenario.totalSavingsCost > 0 && (
                    <span className={styles.savings}>-${optimizedScenario.totalSavingsCost.toLocaleString()}</span>
                  )}
                </div>
              </div>
              <div className={styles.mainMetric}>
                <FaLeaf />
                <div>
                  <span className={styles.value}>{optimizedScenario.co2Emissions.toLocaleString()}</span>
                  <span className={styles.unit}>kg CO₂</span>
                  {optimizedScenario.totalCo2Reduction > 0 && (
                    <span className={styles.savings}>-{optimizedScenario.totalCo2Reduction} kg</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Summary */}
        {selectedOptimizations.length > 0 && (
          <div className={styles.summaryCard}>
            <h3>Resumen de Optimización</h3>
            <div className={styles.summaryGrid}>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Ahorro mensual total:</span>
                <span className={styles.summaryValue}>${optimizedScenario.totalSavingsCost.toLocaleString()}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Ahorro anual estimado:</span>
                <span className={styles.summaryValue}>
                  ${(optimizedScenario.totalSavingsCost * 12).toLocaleString()}
                </span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Inversión total:</span>
                <span className={styles.summaryValue}>${optimizedScenario.totalInvestment.toLocaleString()}</span>
              </div>
              <div className={styles.summaryItem}>
                <span className={styles.summaryLabel}>Tiempo de retorno:</span>
                <span className={styles.summaryValue}>
                  {Math.ceil(optimizedScenario.totalInvestment / optimizedScenario.totalSavingsCost)} meses
                </span>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ScenarioSimulator
