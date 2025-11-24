"use client";

import { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaTv, FaSnowflake, FaFire, FaWater, FaDesktop, FaLaptop, FaPlug } from "react-icons/fa";
import styles from "./Devices.module.css";
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

const Devices = () => {
  const [deviceCatalog, setDeviceCatalog] = useState([]);
  const [loading, setLoading] = useState(true);
  const [clientDevices, setClientDevices] = useState([]);
  const [selectedDevice, setSelectedDevice] = useState("");
  const [deviceForm, setDeviceForm] = useState({
    quantity: 1,
    dailyHours: 1,
    weeklyDays: 7,
  });
  const [userTariff, setUserTariff] = useState(600); // Tarifa por defecto en $/kWh
  const [loadingSavedDevices, setLoadingSavedDevices] = useState(true);
  const [savingDevice, setSavingDevice] = useState(false);

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
      } finally {
        setLoading(false);
      }
    };

    fetchAllDevices();
  }, []);

  useEffect(() => {
    // Aquí deberías obtener la tarifa del usuario activo desde tu API
    const fetchUserTariff = async () => {
      try {
        // Ejemplo: const res = await fetch("http://localhost:8081/api/user/tariff");
        // const data = await res.json();
        // setUserTariff(data.tariff);
        
        // Por ahora usamos la tarifa por defecto
        setUserTariff(600);
      } catch (err) {
        console.error("Error al obtener tarifa del usuario:", err);
      }
    };

    fetchUserTariff();
  }, []);

  // Cargar dispositivos guardados del usuario
  useEffect(() => {
    const loadSavedDevices = async () => {
      if (deviceCatalog.length === 0) {
        return; // Esperar a que se cargue el catálogo primero
      }

      try {
        setLoadingSavedDevices(true);
        const savedDevices = await apiClient.getAsync("/user-devices", { requireAuth: true });
        
        // Mapear los dispositivos guardados con los datos del catálogo
        const mappedDevices = savedDevices.map((savedDevice) => {
          const catalogDevice = deviceCatalog.find(
            (d) => d.id === savedDevice.deviceId
          );
          
          if (!catalogDevice) {
            console.warn(`Dispositivo ${savedDevice.deviceId} no encontrado en el catálogo`);
            return null;
          }

          return {
            id: savedDevice.id, // ID del documento en Firestore
            deviceId: savedDevice.deviceId,
            device: catalogDevice,
            quantity: savedDevice.quantity,
            dailyHours: savedDevice.dailyHours,
            weeklyDays: savedDevice.weeklyDays,
          };
        }).filter(d => d !== null); // Filtrar dispositivos no encontrados

        setClientDevices(mappedDevices);
      } catch (err) {
        console.error("Error al cargar dispositivos guardados:", err);
      } finally {
        setLoadingSavedDevices(false);
      }
    };

    loadSavedDevices();
  }, [deviceCatalog]);

  const addDevice = async () => {
    if (!selectedDevice || savingDevice) return;
    
    try {
      setSavingDevice(true);
      const device = deviceCatalog.find((d) => d.id === selectedDevice);
      
      // Crear el dispositivo en el backend
      const savedDevice = await apiClient.postAsync(
        "/user-devices",
        {
          deviceId: device.id,
          quantity: deviceForm.quantity,
          dailyHours: deviceForm.dailyHours,
          weeklyDays: deviceForm.weeklyDays,
        },
        { requireAuth: true }
      );

      // Agregar al estado local con el ID del backend
      const newDevice = {
        id: savedDevice.id, // ID del documento en Firestore
        deviceId: device.id,
        device: device,
        quantity: deviceForm.quantity,
        dailyHours: deviceForm.dailyHours,
        weeklyDays: deviceForm.weeklyDays,
      };
      
      setClientDevices([...clientDevices, newDevice]);
      setSelectedDevice("");
      setDeviceForm({ quantity: 1, dailyHours: 1, weeklyDays: 7 });
    } catch (err) {
      console.error("Error al guardar dispositivo:", err);
      alert("Error al guardar el dispositivo. Por favor intenta de nuevo.");
    } finally {
      setSavingDevice(false);
    }
  };

  const removeDevice = async (deviceId) => {
    try {
      // Eliminar del backend
      await apiClient.deleteAsync(`/user-devices/${deviceId}`, { requireAuth: true });
      
      // Eliminar del estado local
      setClientDevices(clientDevices.filter((d) => d.id !== deviceId));
    } catch (err) {
      console.error("Error al eliminar dispositivo:", err);
      alert("Error al eliminar el dispositivo. Por favor intenta de nuevo.");
    }
  };

  const calculateMonthlyConsumption = (device) => {
    const rawPower = device.device.potenciaWatts;
    const powerW =
      typeof rawPower === "string" ? parseFloat(rawPower) : Number(rawPower);

    const hoursPerDay = Number(device.dailyHours);
    const quantity = Number(device.quantity);
    const daysPerWeek = Number(device.weeklyDays);

    if (
      isNaN(powerW) ||
      isNaN(hoursPerDay) ||
      isNaN(quantity) ||
      isNaN(daysPerWeek)
    ) {
      return 0;
    }
    const daysPerMonth = (daysPerWeek * 30) / 7;

    const consumptionKwh =
      (powerW * hoursPerDay * quantity * daysPerMonth) / 1000;

    return consumptionKwh;
  };

  // CA1: Cálculo de costo (Consumo × Tarifa)
  const calculateMonthlyCost = (device) => {
    const consumption = calculateMonthlyConsumption(device);
    return consumption * userTariff;
  };

  // CA3: Formato de pesos colombianos
  const formatCOP = (amount) => {
    return new Intl.NumberFormat('es-CO', {
      style: 'currency',
      currency: 'COP',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(amount);
  };

  // Calcular totales
  const totalConsumption = clientDevices.reduce((sum, device) => {
    return sum + calculateMonthlyConsumption(device);
  }, 0);

  const totalCost = clientDevices.reduce((sum, device) => {
    return sum + calculateMonthlyCost(device);
  }, 0);

  return (
    <div className={styles.devicesSection}>
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h2>Configuración de Dispositivos</h2>
          <p>Selecciona tus dispositivos desde el catálogo y ajusta sus parámetros</p>
        </div>

        <div className={styles.addDeviceForm}>
          <h3>Agregar Nuevo Dispositivo</h3>

          {loading ? (
            <p>Cargando dispositivos...</p>
          ) : (
            <div className={styles.formGrid}>
              <div className={styles.formGroup}>
                <label>Dispositivo</label>
                <select
                  value={selectedDevice}
                  onChange={(e) => setSelectedDevice(e.target.value)}
                  className={styles.select}
                >
                  <option value="">Selecciona un dispositivo</option>
                  {deviceCatalog.map((device) => (
                    <option key={device.id} value={device.id}>
                      {device.nombre} ({device.potenciaWatts}W) - {device.categoria}
                    </option>
                  ))}
                </select>
              </div>

              <div className={styles.formGroup}>
                <label>Cantidad</label>
                <input
                  type="number"
                  min="1"
                  max="10"
                  value={deviceForm.quantity}
                  onChange={(e) => setDeviceForm({ ...deviceForm, quantity: Number(e.target.value) })}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Horas por día</label>
                <input
                  type="number"
                  min="1"
                  max="24"
                  value={deviceForm.dailyHours}
                  onChange={(e) => setDeviceForm({ ...deviceForm, dailyHours: Number(e.target.value) })}
                  className={styles.input}
                />
              </div>

              <div className={styles.formGroup}>
                <label>Días por semana</label>
                <input
                  type="number"
                  min="1"
                  max="7"
                  value={deviceForm.weeklyDays}
                  onChange={(e) => setDeviceForm({ ...deviceForm, weeklyDays: Number(e.target.value) })}
                  className={styles.input}
                />
              </div>
            </div>
          )}

          <button 
            onClick={addDevice} 
            disabled={!selectedDevice || savingDevice} 
            className={styles.addButton}
          >
            <FaPlus /> {savingDevice ? "Guardando..." : "Agregar Dispositivo"}
          </button>
        </div>

        <div className={styles.devicesList}>
          <h3>Mis Dispositivos ({clientDevices.length})</h3>
          {loadingSavedDevices ? (
            <div className={styles.emptyState}>
              <p>Cargando dispositivos guardados...</p>
            </div>
          ) : clientDevices.length === 0 ? (
            <div className={styles.emptyState}>
              <FaPlug className={styles.emptyIcon} />
              <p>No tienes dispositivos configurados</p>
              <span>Agrega dispositivos desde el catálogo para comenzar</span>
            </div>
          ) : (
            <div className={styles.devicesGrid}>
              {clientDevices.map((clientDevice) => {
                const IconComponent = clientDevice.device.icon;
                return (
                  <div key={clientDevice.id} className={styles.deviceCard}>
                    <div className={styles.deviceHeader}>
                      <div className={styles.deviceIcon}>
                        <IconComponent />
                      </div>
                      <div className={styles.deviceInfo}>
                        <h4>{clientDevice.device.nombre}</h4>
                        <span className={styles.category}>{clientDevice.device.categoria}</span>
                      </div>
                      <button onClick={() => removeDevice(clientDevice.id)} className={styles.removeButton}>
                        <FaTrash />
                      </button>
                    </div>

                    <div className={styles.deviceStats}>
                      <div className={styles.stat}>
                        <span className={styles.statLabel}>Cantidad</span>
                        <span className={styles.statValue}>{clientDevice.quantity}</span>
                      </div>
                      <div className={styles.stat}>
                        <span className={styles.statLabel}>Horas/día</span>
                        <span className={styles.statValue}>{clientDevice.dailyHours}h</span>
                      </div>
                      <div className={styles.stat}>
                        <span className={styles.statLabel}>Días/semana</span>
                        <span className={styles.statValue}>{clientDevice.weeklyDays}</span>
                      </div>
                    </div>

                    <div className={styles.deviceConsumption}>
                      <div className={styles.consumptionInfo}>
                        <span className={styles.consumptionLabel}>Consumo estimado mensual</span>
                        <span className={styles.consumptionValue}>
                          {calculateMonthlyConsumption(clientDevice).toFixed(2)} kWh
                        </span>
                      </div>
                      <div className={styles.powerInfo}>
                        <span>Potencia: {clientDevice.device.potenciaWatts}W</span>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {clientDevices.length > 0 && (
        <div className={styles.costSummary}>
          <div className={styles.summaryHeader}>
            <h3>Resumen de Costos Mensuales</h3>
            <div className={styles.tariffBadge}>
              <span className={styles.tariffLabel}>Tarifa actual:</span>
              <span className={styles.tariffValue}>{formatCOP(userTariff)}/kWh</span>
            </div>
          </div>

          <div className={styles.tableWrapper}>
            <table className={styles.costTable}>
              <thead>
                <tr>
                  <th>Dispositivo</th>
                  <th>Cantidad</th>
                  <th>Consumo Mensual</th>
                  <th>Costo Mensual</th>
                </tr>
              </thead>
              <tbody>
                {clientDevices.map((clientDevice) => (
                  <tr key={clientDevice.id}>
                    <td>
                      <div className={styles.tableDeviceInfo}>
                        <span className={styles.tableDeviceName}>{clientDevice.device.nombre}</span>
                        <span className={styles.tableDeviceCategory}>{clientDevice.device.categoria}</span>
                      </div>
                    </td>
                    <td className={styles.centerText}>{clientDevice.quantity}</td>
                    <td className={styles.rightText}>
                      {calculateMonthlyConsumption(clientDevice).toFixed(2)} kWh
                    </td>
                    <td className={styles.rightText + ' ' + styles.costValue}>
                      {formatCOP(calculateMonthlyCost(clientDevice))}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className={styles.totalRow}>
                  <td colSpan="2"><strong>Total Estimado</strong></td>
                  <td className={styles.rightText}>
                    <strong>{totalConsumption.toFixed(2)} kWh</strong>
                  </td>
                  <td className={styles.rightText + ' ' + styles.totalAmount}>
                    <strong>{formatCOP(totalCost)}</strong>
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
        )}
      </div>
    </div>
  );
};

export default Devices;