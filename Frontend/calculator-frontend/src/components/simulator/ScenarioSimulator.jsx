"use client"

import { useState, useEffect } from "react"
import { FaChartBar, FaDollarSign, FaBolt, FaLeaf, FaArrowRight, FaLightbulb, FaPlay, FaUndo } from "react-icons/fa"
import styles from "./ScenarioSimulator.module.css"

const ScenarioSimulator = () => {
  const [selectedOptimizations, setSelectedOptimizations] = useState([])
  const [isAnimating, setIsAnimating] = useState(false)
  const [animatedValues, setAnimatedValues] = useState({
    consumption: 2450,
    cost: 485000,
    co2: 1225,
  })
  const [simulationSpeed, setSimulationSpeed] = useState(1)

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

  useEffect(() => {
    const optimizedScenario = calculateOptimizedScenario()

    if (isAnimating) {
      const duration = 1500 / simulationSpeed
      const steps = 60
      const stepDuration = duration / steps

      const startValues = { ...animatedValues }
      const endValues = {
        consumption: optimizedScenario.monthlyConsumption,
        cost: optimizedScenario.monthlyCost,
        co2: optimizedScenario.co2Emissions,
      }

      let currentStep = 0

      const animate = () => {
        currentStep++
        const progress = currentStep / steps
        const easeProgress = 1 - Math.pow(1 - progress, 3) // Ease out cubic

        setAnimatedValues({
          consumption: Math.round(
            startValues.consumption + (endValues.consumption - startValues.consumption) * easeProgress,
          ),
          cost: Math.round(startValues.cost + (endValues.cost - startValues.cost) * easeProgress),
          co2: Math.round(startValues.co2 + (endValues.co2 - startValues.co2) * easeProgress),
        })

        if (currentStep < steps) {
          setTimeout(animate, stepDuration)
        } else {
          setIsAnimating(false)
        }
      }

      animate()
    } else {
      setAnimatedValues({
        consumption: optimizedScenario.monthlyConsumption,
        cost: optimizedScenario.monthlyCost,
        co2: optimizedScenario.co2Emissions,
      })
    }
  }, [selectedOptimizations, isAnimating, simulationSpeed])

  const toggleOptimization = (optimization) => {
    setSelectedOptimizations((prev) => {
      const exists = prev.find((opt) => opt.id === optimization.id)
      if (exists) {
        return prev.filter((opt) => opt.id !== optimization.id)
      } else {
        return [...prev, optimization]
      }
    })
    setIsAnimating(true)
  }

  const startAnimation = () => {
    setIsAnimating(true)
  }

  const resetSimulation = () => {
    setSelectedOptimizations([])
    setAnimatedValues({
      consumption: currentScenario.monthlyConsumption,
      cost: currentScenario.monthlyCost,
      co2: currentScenario.co2Emissions,
    })
  }

  return (
    <div className={styles.simulatorContainer}>
      <div className={styles.sectionHeader}>
        <h2>Simulador de Escenarios</h2>
        <p>Compara tu consumo actual con escenarios optimizados</p>
        <div className={styles.simulationControls}>
          <button
            className={styles.controlButton}
            onClick={startAnimation}
            disabled={isAnimating || selectedOptimizations.length === 0}
          >
            <FaPlay /> Animar
          </button>
          <button className={styles.controlButton} onClick={resetSimulation}>
            <FaUndo /> Reiniciar
          </button>
          <div className={styles.speedControl}>
            <label>Velocidad:</label>
            <input
              type="range"
              min="0.5"
              max="3"
              step="0.5"
              value={simulationSpeed}
              onChange={(e) => setSimulationSpeed(Number.parseFloat(e.target.value))}
              className={styles.speedSlider}
            />
            <span>{simulationSpeed}x</span>
          </div>
        </div>
      </div>

      <div className={styles.optimizationsSection}>
        <h3>Selecciona las optimizaciones que deseas simular:</h3>
        <div className={styles.optimizationsList}>
          {optimizations.map((optimization, index) => (
            <div
              key={optimization.id}
              className={`${styles.optimizationCard} ${
                selectedOptimizations.find((opt) => opt.id === optimization.id) ? styles.selected : ""
              } ${isAnimating ? styles.animating : ""}`}
              onClick={() => toggleOptimization(optimization)}
              style={{ animationDelay: `${index * 0.1}s` }}
            >
              <div className={styles.optimizationHeader}>
                <h4>{optimization.title}</h4>
                <div
                  className={`${styles.checkbox} ${selectedOptimizations.find((opt) => opt.id === optimization.id) ? styles.checked : ""}`}
                >
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
              <div className={styles.progressIndicator}></div>
            </div>
          ))}
        </div>
      </div>

      <div className={styles.comparisonSection}>
        <div className={styles.scenarioComparison}>
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

          <div className={`${styles.comparisonArrow} ${isAnimating ? styles.pulsing : ""}`}>
            <FaArrowRight />
          </div>

          <div className={`${styles.scenarioCard} ${styles.optimizedCard}`}>
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
                  <span className={`${styles.value} ${isAnimating ? styles.counting : ""}`}>
                    {animatedValues.consumption.toLocaleString()}
                  </span>
                  <span className={styles.unit}>kWh/mes</span>
                  {optimizedScenario.totalSavingsKwh > 0 && (
                    <span className={styles.savings}>-{optimizedScenario.totalSavingsKwh} kWh</span>
                  )}
                </div>
              </div>
              <div className={styles.mainMetric}>
                <FaDollarSign />
                <div>
                  <span className={`${styles.value} ${isAnimating ? styles.counting : ""}`}>
                    ${animatedValues.cost.toLocaleString()}
                  </span>
                  <span className={styles.unit}>/mes</span>
                  {optimizedScenario.totalSavingsCost > 0 && (
                    <span className={styles.savings}>-${optimizedScenario.totalSavingsCost.toLocaleString()}</span>
                  )}
                </div>
              </div>
              <div className={styles.mainMetric}>
                <FaLeaf />
                <div>
                  <span className={`${styles.value} ${isAnimating ? styles.counting : ""}`}>
                    {animatedValues.co2.toLocaleString()}
                  </span>
                  <span className={styles.unit}>kg CO₂</span>
                  {optimizedScenario.totalCo2Reduction > 0 && (
                    <span className={styles.savings}>-{optimizedScenario.totalCo2Reduction} kg</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {selectedOptimizations.length > 0 && (
          <div className={`${styles.summaryCard} ${styles.fadeIn}`}>
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
            <div className={styles.roiProgress}>
              <div className={styles.roiBar}>
                <div
                  className={styles.roiBarFill}
                  style={{
                    width: `${Math.min(100, ((optimizedScenario.totalSavingsCost * 12) / optimizedScenario.totalInvestment) * 100)}%`,
                  }}
                ></div>
              </div>
              <span className={styles.roiLabel}>
                ROI Anual:{" "}
                {(((optimizedScenario.totalSavingsCost * 12) / optimizedScenario.totalInvestment) * 100).toFixed(1)}%
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ScenarioSimulator
