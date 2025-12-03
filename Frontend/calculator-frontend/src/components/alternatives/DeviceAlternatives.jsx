"use client";

import { useEffect, useState } from "react";
import { 
  FaExchangeAlt, 
  FaBolt, 
  FaDollarSign, 
  FaLeaf, 
  FaArrowDown,
  FaCheckCircle,
  FaPlug,
  FaTv,
  FaSnowflake,
  FaFire,
  FaWater,
  FaLaptop,
  FaDesktop,
  FaTimes,
  FaArrowRight
} from "react-icons/fa";
import styles from "./DeviceAlternatives.module.css";
import preloadedDevices from "../../data/devices_preloaded.json";
import apiClient from "../../api/ApiClient";

const iconMap = {
  "Entretenimiento": FaTv,
  "Clima": FaSnowflake,
  "Cocina": FaFire,
  "Lavandería": FaWater,
  "Tecnología": FaLaptop,
  "Iluminación": FaPlug,
  "Otros": FaDesktop
};

const DeviceAlternatives = () => {
  const [deviceCatalog, setDeviceCatalog] = useState([]);
  const [clientDevices, setClientDevices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userTariff, setUserTariff] = useState(600); // Tarifa por defecto en $/kWh
  const [alternatives, setAlternatives] = useState([]);
  const [selectedComparison, setSelectedComparison] = useState(null);

  // Cargar catálogo de dispositivos
  useEffect(() => {
    const fetchAllDevices = async () => {
      try {
        const res = await fetch("http://localhost:8081/api/devices");
        if (!res.ok) throw new Error("Error al obtener dispositivos del servidor");
        const serverDevices = await res.json();

        const localDevices = preloadedDevices;

        const combined = [
          ...localDevices.map((d) => ({
            ...d,
            id: `local-${d.nombre}`,
          })),
          ...serverDevices,
        ];

        const devicesWithIcons = combined.map((device) => ({
          ...device,
          icon: iconMap[device.categoria] || FaPlug,
        }));

        setDeviceCatalog(devicesWithIcons);
      } catch (err) {
        console.error("Error al cargar dispositivos combinados:", err);
      }
    };

    fetchAllDevices();
  }, []);

  // Cargar dispositivos del usuario
  useEffect(() => {
    const loadUserDevices = async () => {
      if (deviceCatalog.length === 0) {
        return;
      }

      try {
        const savedDevices = await apiClient.getAsync("/user-devices", { requireAuth: true });
        
        const mappedDevices = savedDevices.map((savedDevice) => {
          const catalogDevice = deviceCatalog.find(
            (d) => d.id === savedDevice.deviceId
          );
          
          if (!catalogDevice) {
            console.warn(`Dispositivo ${savedDevice.deviceId} no encontrado en el catálogo`);
            return null;
          }

          return {
            id: savedDevice.id,
            deviceId: savedDevice.deviceId,
            device: catalogDevice,
            quantity: savedDevice.quantity,
            dailyHours: savedDevice.dailyHours,
            weeklyDays: savedDevice.weeklyDays,
          };
        }).filter(d => d !== null);

        setClientDevices(mappedDevices);
      } catch (err) {
        console.error("Error al cargar dispositivos del usuario:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUserDevices();
  }, [deviceCatalog]);

  // Calcular consumo mensual
  const calculateMonthlyConsumption = (potenciaWatts, dailyHours, quantity, weeklyDays) => {
    const powerW = typeof potenciaWatts === "string" ? parseFloat(potenciaWatts) : Number(potenciaWatts);
    const hoursPerDay = Number(dailyHours);
    const qty = Number(quantity);
    const daysPerWeek = Number(weeklyDays);

    if (isNaN(powerW) || isNaN(hoursPerDay) || isNaN(qty) || isNaN(daysPerWeek)) {
      return 0;
    }
    
    const daysPerMonth = (daysPerWeek * 30) / 7;
    const consumptionKwh = (powerW * hoursPerDay * qty * daysPerMonth) / 1000;

    return consumptionKwh;
  };

  // Calcular costo mensual
  const calculateMonthlyCost = (consumption) => {
    return consumption * userTariff;
  };

  // Formato de pesos colombianos
  const formatCOP = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Extraer el tipo de dispositivo del nombre
  const getDeviceType = (deviceName) => {
    const name = deviceName.toLowerCase();
    
    // Tipos de dispositivos comunes
    const deviceTypes = [
      'nevera', 'refrigerador', 'nevecon', 'congelador',
      'lavadora', 'secadora',
      'plancha',
      'aire acondicionado', 'ventilador', 'calefactor', 'calentador',
      'televisor', 'tv', 'smart tv',
      'computador', 'computadora', 'laptop', 'pc',
      'microondas', 'horno',
      'licuadora', 'batidora',
      'cafetera',
      'sanduchera', 'tostadora',
      'freidora',
      'lavavajillas',
      'aspiradora',
      'bombillo', 'bombilla', 'foco', 'lámpara', 'lampara',
      'estufa', 'parrilla', 'vitrocerámica', 'vitroceramica',
      'olla arrocera', 'olla',
      'router', 'modem',
      'impresora',
      'monitor',
      'consola',
      'cargador',
      'secador de cabello', 'secador',
      'plancha de cabello'
    ];

    // Buscar el tipo de dispositivo en el nombre
    for (const type of deviceTypes) {
      if (name.includes(type)) {
        return type;
      }
    }

    // Si no se encuentra un tipo específico, retornar el nombre completo
    return name;
  };

  // Buscar alternativas para cada dispositivo del usuario
  useEffect(() => {
    if (clientDevices.length === 0 || deviceCatalog.length === 0) {
      return;
    }

    const findAlternatives = () => {
      const allAlternatives = [];

      clientDevices.forEach((userDevice) => {
        const currentConsumption = calculateMonthlyConsumption(
          userDevice.device.potenciaWatts,
          userDevice.dailyHours,
          userDevice.quantity,
          userDevice.weeklyDays
        );
        const currentCost = calculateMonthlyCost(currentConsumption);

        // Obtener el tipo de dispositivo actual
        const currentDeviceType = getDeviceType(userDevice.device.nombre);

        // Filtrar dispositivos del mismo tipo (no por categoría)
        const sameTypeDevices = deviceCatalog.filter(
          (catalogDevice) => {
            // Excluir el mismo dispositivo
            if (catalogDevice.id === userDevice.deviceId) {
              return false;
            }
            
            // Obtener tipo del dispositivo del catálogo
            const catalogDeviceType = getDeviceType(catalogDevice.nombre);
            
            // Comparar tipos
            return catalogDeviceType === currentDeviceType;
          }
        );

        // Calcular costo para cada alternativa y filtrar las más económicas
        const betterAlternatives = sameTypeDevices
          .map((altDevice) => {
            const altConsumption = calculateMonthlyConsumption(
              altDevice.potenciaWatts,
              userDevice.dailyHours,
              userDevice.quantity,
              userDevice.weeklyDays
            );
            const altCost = calculateMonthlyCost(altConsumption);
            const monthlySavings = currentCost - altCost;
            const annualSavings = monthlySavings * 12;
            const savingsPercentage = (monthlySavings / currentCost) * 100;

            return {
              alternative: altDevice,
              currentConsumption,
              currentCost,
              altConsumption,
              altCost,
              monthlySavings,
              annualSavings,
              savingsPercentage,
              powerDifference: Number(userDevice.device.potenciaWatts) - Number(altDevice.potenciaWatts)
            };
          })
          .filter((alt) => alt.monthlySavings > 0) // Solo alternativas que ahorran dinero
          .sort((a, b) => b.monthlySavings - a.monthlySavings) // Ordenar por mayor ahorro
          .slice(0, 3); // Tomar las 3 mejores

        // Siempre agregar el dispositivo, incluso si no tiene alternativas
        allAlternatives.push({
          userDevice,
          alternatives: betterAlternatives,
          hasAlternatives: betterAlternatives.length > 0
        });
      });

      setAlternatives(allAlternatives);
    };

    findAlternatives();
  }, [clientDevices, deviceCatalog, userTariff]);

  if (loading) {
    return (
      <div className={styles.alternativesSection}>
        <div className={styles.loadingState}>
          <FaBolt className={styles.loadingIcon} />
          <p>Cargando alternativas...</p>
        </div>
      </div>
    );
  }

  if (clientDevices.length === 0) {
    return (
      <div className={styles.alternativesSection}>
        <div className={styles.sectionHeader}>
          <h2>Alternativas de Dispositivos</h2>
          <p>Descubre dispositivos más eficientes para ahorrar energía y dinero</p>
        </div>
        <div className={styles.emptyState}>
          <FaPlug className={styles.emptyIcon} />
          <p>No tienes dispositivos configurados</p>
          <span>Agrega dispositivos en la sección "Dispositivos" para ver alternativas</span>
        </div>
      </div>
    );
  }


  return (
    <div className={styles.alternativesSection}>
      <div className={styles.sectionHeader}>
        <h2>Alternativas de Dispositivos</h2>
        <p>Descubre dispositivos más eficientes para ahorrar energía y dinero</p>
      </div>

      <div className={styles.tariffInfo}>
        <span className={styles.tariffLabel}>Tarifa actual:</span>
        <span className={styles.tariffValue}>{formatCOP(userTariff)}/kWh</span>
      </div>

      <div className={styles.alternativesList}>
        {alternatives.map(({ userDevice, alternatives: deviceAlternatives, hasAlternatives }) => {
          const IconComponent = userDevice.device.icon || FaPlug;
          
          return (
            <div key={userDevice.id} className={styles.alternativeGroup}>
              {/* Dispositivo Actual */}
              <div className={styles.currentDeviceCard}>
                <div className={styles.currentDeviceHeader}>
                  <div className={styles.deviceIcon}>
                    <IconComponent />
                  </div>
                  <div className={styles.deviceInfo}>
                    <h3>{userDevice.device.nombre}</h3>
                    <span className={styles.category}>{userDevice.device.categoria}</span>
                  </div>
                </div>

                <div className={styles.deviceDetails}>
                  <div className={styles.detail}>
                    <span className={styles.detailLabel}>Potencia:</span>
                    <span className={styles.detailValue}>{userDevice.device.potenciaWatts}W</span>
                  </div>
                  <div className={styles.detail}>
                    <span className={styles.detailLabel}>Cantidad:</span>
                    <span className={styles.detailValue}>{userDevice.quantity}</span>
                  </div>
                  <div className={styles.detail}>
                    <span className={styles.detailLabel}>Uso diario:</span>
                    <span className={styles.detailValue}>{userDevice.dailyHours}h/día</span>
                  </div>
                  <div className={styles.detail}>
                    <span className={styles.detailLabel}>Días/semana:</span>
                    <span className={styles.detailValue}>{userDevice.weeklyDays}</span>
                  </div>
                </div>

                <div className={styles.currentConsumption}>
                  <div className={styles.consumptionItem}>
                    <FaBolt className={styles.consumptionIcon} />
                    <div>
                      <span className={styles.consumptionValue}>
                        {hasAlternatives 
                          ? deviceAlternatives[0].currentConsumption.toFixed(2)
                          : calculateMonthlyConsumption(
                              userDevice.device.potenciaWatts,
                              userDevice.dailyHours,
                              userDevice.quantity,
                              userDevice.weeklyDays
                            ).toFixed(2)
                        } kWh
                      </span>
                      <span className={styles.consumptionLabel}>Consumo mensual</span>
                    </div>
                  </div>
                  <div className={styles.consumptionItem}>
                    <FaDollarSign className={styles.consumptionIcon} />
                    <div>
                      <span className={styles.consumptionValue}>
                        {hasAlternatives 
                          ? formatCOP(deviceAlternatives[0].currentCost)
                          : formatCOP(calculateMonthlyCost(
                              calculateMonthlyConsumption(
                                userDevice.device.potenciaWatts,
                                userDevice.dailyHours,
                                userDevice.quantity,
                                userDevice.weeklyDays
                              )
                            ))
                        }
                      </span>
                      <span className={styles.consumptionLabel}>Costo mensual</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Alternativas o Mensaje de No Disponible */}
              {hasAlternatives ? (
              <div className={styles.alternativesGrid}>
                {deviceAlternatives.map((alt, index) => {
                  const AltIconComponent = alt.alternative.icon || FaPlug;
                  
                  return (
                    <div 
                      key={alt.alternative.id} 
                      className={styles.alternativeCard}
                      onClick={() => setSelectedComparison({ userDevice, alternative: alt })}
                    >
                      <div className={styles.alternativeRank}>
                        #{index + 1} Mejor alternativa
                      </div>

                      <div className={styles.alternativeHeader}>
                        <div className={styles.alternativeIcon}>
                          <AltIconComponent />
                        </div>
                        <div className={styles.alternativeInfo}>
                          <h4>{alt.alternative.nombre}</h4>
                          <span className={styles.alternativeCategory}>
                            {alt.alternative.categoria}
                          </span>
                        </div>
                      </div>

                      <div className={styles.alternativeDetails}>
                        <div className={styles.alternativeDetail}>
                          <span className={styles.alternativeDetailLabel}>Potencia:</span>
                          <span className={styles.alternativeDetailValue}>
                            {alt.alternative.potenciaWatts}W
                            <span className={styles.powerDiff}>
                              <FaArrowDown className={styles.downIcon} />
                              {alt.powerDifference}W menos
                            </span>
                          </span>
                        </div>
                      </div>

                      <div className={styles.savingsSection}>
                        <div className={styles.savingsHeader}>
                          <FaLeaf className={styles.savingsIcon} />
                          <span>Ahorro Potencial</span>
                        </div>

                        <div className={styles.savingsGrid}>
                          <div className={styles.savingItem}>
                            <span className={styles.savingLabel}>Consumo:</span>
                            <span className={styles.savingValue}>
                              {alt.altConsumption.toFixed(2)} kWh/mes
                            </span>
                          </div>
                          <div className={styles.savingItem}>
                            <span className={styles.savingLabel}>Costo:</span>
                            <span className={styles.savingValue}>
                              {formatCOP(alt.altCost)}/mes
                            </span>
                          </div>
                          <div className={styles.savingItem + ' ' + styles.highlight}>
                            <span className={styles.savingLabel}>Ahorro mensual:</span>
                            <span className={styles.savingValue}>
                              {formatCOP(alt.monthlySavings)}
                            </span>
                          </div>
                          <div className={styles.savingItem + ' ' + styles.highlight}>
                            <span className={styles.savingLabel}>Ahorro anual:</span>
                            <span className={styles.savingValue}>
                              {formatCOP(alt.annualSavings)}
                            </span>
                          </div>
                        </div>

                        <div className={styles.savingsPercentage}>
                          <span className={styles.percentageLabel}>Reducción de costo:</span>
                          <span className={styles.percentageValue}>
                            {alt.savingsPercentage.toFixed(1)}%
                          </span>
                        </div>
                      </div>

                      <div className={styles.compareButton}>
                        <FaArrowRight />
                        <span>Ver comparación detallada</span>
                      </div>
                    </div>
                  );
                })}
              </div>
              ) : (
              <div className={styles.noAlternativesMessage}>
                <div className={styles.noAlternativesIcon}>
                  <FaCheckCircle />
                </div>
                <div className={styles.noAlternativesContent}>
                  <h4>¡Este dispositivo ya es eficiente!</h4>
                  <p>
                    No encontramos alternativas más económicas en nuestra base de datos para este tipo de dispositivo.
                    Tu dispositivo actual tiene un buen nivel de eficiencia energética.
                  </p>
                </div>
              </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Resumen Total - Solo mostrar si hay alternativas */}
      {alternatives.some(alt => alt.hasAlternatives) && (
      <div className={styles.totalSavings}>
        <h3>Resumen de Ahorros Potenciales</h3>
        <div className={styles.totalSavingsGrid}>
          <div className={styles.totalSavingCard}>
            <FaDollarSign className={styles.totalSavingIcon} />
            <div>
              <span className={styles.totalSavingLabel}>Ahorro mensual total</span>
              <span className={styles.totalSavingValue}>
                {formatCOP(
                  alternatives
                    .filter(alt => alt.hasAlternatives)
                    .reduce(
                      (sum, alt) => sum + alt.alternatives[0].monthlySavings,
                      0
                    )
                )}
              </span>
            </div>
          </div>
          <div className={styles.totalSavingCard}>
            <FaLeaf className={styles.totalSavingIcon} />
            <div>
              <span className={styles.totalSavingLabel}>Ahorro anual total</span>
              <span className={styles.totalSavingValue}>
                {formatCOP(
                  alternatives
                    .filter(alt => alt.hasAlternatives)
                    .reduce(
                      (sum, alt) => sum + alt.alternatives[0].annualSavings,
                      0
                    )
                )}
              </span>
            </div>
          </div>
        </div>
        <p className={styles.totalSavingsNote}>
          * Cálculos basados en las mejores alternativas disponibles
        </p>
      </div>
      )}

      {/* Modal de Comparación */}
      {selectedComparison && (
        <div className={styles.modalOverlay} onClick={() => setSelectedComparison(null)}>
          <div className={styles.modalContent} onClick={(e) => e.stopPropagation()}>
            <button className={styles.closeButton} onClick={() => setSelectedComparison(null)}>
              <FaTimes />
            </button>

            <h2 className={styles.modalTitle}>Comparación de Escenarios</h2>

            <div className={styles.comparisonGrid}>
              {/* Escenario Actual */}
              <div className={styles.scenarioCard + ' ' + styles.currentScenario}>
                <div className={styles.scenarioHeader}>
                  <h3>Escenario Actual</h3>
                  <span className={styles.scenarioBadge}>En uso</span>
                </div>

                <div className={styles.scenarioDevice}>
                  <div className={styles.scenarioDeviceIcon}>
                    {(() => {
                      const Icon = selectedComparison.userDevice.device.icon || FaPlug;
                      return <Icon />;
                    })()}
                  </div>
                  <div>
                    <h4>{selectedComparison.userDevice.device.nombre}</h4>
                    <span className={styles.scenarioCategory}>
                      {selectedComparison.userDevice.device.categoria}
                    </span>
                  </div>
                </div>

                <div className={styles.scenarioSpecs}>
                  <div className={styles.specItem}>
                    <span className={styles.specLabel}>Potencia</span>
                    <span className={styles.specValue}>
                      {selectedComparison.userDevice.device.potenciaWatts}W
                    </span>
                  </div>
                  <div className={styles.specItem}>
                    <span className={styles.specLabel}>Cantidad</span>
                    <span className={styles.specValue}>
                      {selectedComparison.userDevice.quantity}
                    </span>
                  </div>
                  <div className={styles.specItem}>
                    <span className={styles.specLabel}>Uso diario</span>
                    <span className={styles.specValue}>
                      {selectedComparison.userDevice.dailyHours}h/día
                    </span>
                  </div>
                  <div className={styles.specItem}>
                    <span className={styles.specLabel}>Días/semana</span>
                    <span className={styles.specValue}>
                      {selectedComparison.userDevice.weeklyDays}
                    </span>
                  </div>
                </div>

                <div className={styles.scenarioMetrics}>
                  <div className={styles.metricItem}>
                    <FaBolt className={styles.metricIcon} />
                    <div>
                      <span className={styles.metricLabel}>Consumo mensual</span>
                      <span className={styles.metricValue}>
                        {selectedComparison.alternative.currentConsumption.toFixed(2)} kWh
                      </span>
                    </div>
                  </div>
                  <div className={styles.metricItem}>
                    <FaDollarSign className={styles.metricIcon} />
                    <div>
                      <span className={styles.metricLabel}>Costo mensual</span>
                      <span className={styles.metricValue}>
                        {formatCOP(selectedComparison.alternative.currentCost)}
                      </span>
                    </div>
                  </div>
                  <div className={styles.metricItem}>
                    <FaDollarSign className={styles.metricIcon} />
                    <div>
                      <span className={styles.metricLabel}>Costo anual</span>
                      <span className={styles.metricValue}>
                        {formatCOP(selectedComparison.alternative.currentCost * 12)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Escenario Simulado */}
              <div className={styles.scenarioCard + ' ' + styles.simulatedScenario}>
                <div className={styles.scenarioHeader}>
                  <h3>Escenario Simulado</h3>
                  <span className={styles.scenarioBadge + ' ' + styles.simulatedBadge}>
                    Recomendado
                  </span>
                </div>

                <div className={styles.scenarioDevice}>
                  <div className={styles.scenarioDeviceIcon}>
                    {(() => {
                      const Icon = selectedComparison.alternative.alternative.icon || FaPlug;
                      return <Icon />;
                    })()}
                  </div>
                  <div>
                    <h4>{selectedComparison.alternative.alternative.nombre}</h4>
                    <span className={styles.scenarioCategory}>
                      {selectedComparison.alternative.alternative.categoria}
                    </span>
                  </div>
                </div>

                <div className={styles.scenarioSpecs}>
                  <div className={styles.specItem}>
                    <span className={styles.specLabel}>Potencia</span>
                    <span className={styles.specValue + ' ' + styles.highlightValue}>
                      {selectedComparison.alternative.alternative.potenciaWatts}W
                      <span className={styles.difference}>
                        <FaArrowDown />
                        {selectedComparison.alternative.powerDifference}W
                      </span>
                    </span>
                  </div>
                  <div className={styles.specItem}>
                    <span className={styles.specLabel}>Cantidad</span>
                    <span className={styles.specValue}>
                      {selectedComparison.userDevice.quantity}
                    </span>
                  </div>
                  <div className={styles.specItem}>
                    <span className={styles.specLabel}>Uso diario</span>
                    <span className={styles.specValue}>
                      {selectedComparison.userDevice.dailyHours}h/día
                    </span>
                  </div>
                  <div className={styles.specItem}>
                    <span className={styles.specLabel}>Días/semana</span>
                    <span className={styles.specValue}>
                      {selectedComparison.userDevice.weeklyDays}
                    </span>
                  </div>
                </div>

                <div className={styles.scenarioMetrics}>
                  <div className={styles.metricItem}>
                    <FaBolt className={styles.metricIcon + ' ' + styles.successIcon} />
                    <div>
                      <span className={styles.metricLabel}>Consumo mensual</span>
                      <span className={styles.metricValue + ' ' + styles.successValue}>
                        {selectedComparison.alternative.altConsumption.toFixed(2)} kWh
                      </span>
                    </div>
                  </div>
                  <div className={styles.metricItem}>
                    <FaDollarSign className={styles.metricIcon + ' ' + styles.successIcon} />
                    <div>
                      <span className={styles.metricLabel}>Costo mensual</span>
                      <span className={styles.metricValue + ' ' + styles.successValue}>
                        {formatCOP(selectedComparison.alternative.altCost)}
                      </span>
                    </div>
                  </div>
                  <div className={styles.metricItem}>
                    <FaDollarSign className={styles.metricIcon + ' ' + styles.successIcon} />
                    <div>
                      <span className={styles.metricLabel}>Costo anual</span>
                      <span className={styles.metricValue + ' ' + styles.successValue}>
                        {formatCOP(selectedComparison.alternative.altCost * 12)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            {/* Resumen de Diferencias */}
            <div className={styles.savingsSummary}>
              <h3>
                <FaLeaf /> Ahorros con el Cambio
              </h3>
              <div className={styles.savingsSummaryGrid}>
                <div className={styles.savingSummaryItem}>
                  <span className={styles.savingSummaryLabel}>Ahorro mensual</span>
                  <span className={styles.savingSummaryValue}>
                    {formatCOP(selectedComparison.alternative.monthlySavings)}
                  </span>
                  <span className={styles.savingSummaryPercentage}>
                    {selectedComparison.alternative.savingsPercentage.toFixed(1)}% menos
                  </span>
                </div>
                <div className={styles.savingSummaryItem}>
                  <span className={styles.savingSummaryLabel}>Ahorro anual</span>
                  <span className={styles.savingSummaryValue}>
                    {formatCOP(selectedComparison.alternative.annualSavings)}
                  </span>
                  <span className={styles.savingSummaryPercentage}>
                    {formatCOP(selectedComparison.alternative.annualSavings / 12)} por mes
                  </span>
                </div>
                <div className={styles.savingSummaryItem}>
                  <span className={styles.savingSummaryLabel}>Reducción de consumo</span>
                  <span className={styles.savingSummaryValue}>
                    {(selectedComparison.alternative.currentConsumption - selectedComparison.alternative.altConsumption).toFixed(2)} kWh/mes
                  </span>
                  <span className={styles.savingSummaryPercentage}>
                    Menos energía gastada
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default DeviceAlternatives;

