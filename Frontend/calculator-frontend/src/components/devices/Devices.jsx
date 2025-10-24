"use client";

import { useEffect, useState } from "react";
import { FaPlus, FaTrash, FaTv, FaSnowflake, FaFire, FaWater, FaDesktop, FaLaptop, FaPlug } from "react-icons/fa";
import styles from "./Devices.module.css";

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

  // 🔹 Cargar los dispositivos del backend
  useEffect(() => {
    fetch("http://localhost:8081/api/devices")
      .then((res) => {
        if (!res.ok) throw new Error("Error al obtener dispositivos");
        return res.json();
      })
      .then((data) => {
        const devicesWithIcons = data.map((device) => ({
          ...device,
          icon: iconMap[device.categoria] || FaPlug,
        }));
        setDeviceCatalog(devicesWithIcons);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error al cargar dispositivos:", err);
        setLoading(false);
      });
  }, []);

  const addDevice = () => {
    if (!selectedDevice) return;
    const device = deviceCatalog.find((d) => d.id === selectedDevice);
    const newDevice = {
      id: Date.now(),
      deviceId: device.id,
      device: device,
      quantity: deviceForm.quantity,
      dailyHours: deviceForm.dailyHours,
      weeklyDays: deviceForm.weeklyDays,
    };
    setClientDevices([...clientDevices, newDevice]);
    setSelectedDevice("");
    setDeviceForm({ quantity: 1, dailyHours: 1, weeklyDays: 7 });
  };

  const removeDevice = (deviceId) => {
    setClientDevices(clientDevices.filter((d) => d.id !== deviceId));
  };

  const calculateMonthlyConsumption = (device) => {
    const dailyConsumption = (device.device.potenciaWatts * device.dailyHours * device.quantity) / 1000;
    const weeklyConsumption = dailyConsumption * device.weeklyDays;
    const monthlyConsumption = (weeklyConsumption * 52) / 12;
    return monthlyConsumption.toFixed(2);
  };

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

          <button onClick={addDevice} disabled={!selectedDevice} className={styles.addButton}>
            <FaPlus /> Agregar Dispositivo
          </button>
        </div>

        <div className={styles.devicesList}>
          <h3>Mis Dispositivos ({clientDevices.length})</h3>
          {clientDevices.length === 0 ? (
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
                          {calculateMonthlyConsumption(clientDevice)} kWh
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
      </div>
    </div>
  );
};

export default Devices;
