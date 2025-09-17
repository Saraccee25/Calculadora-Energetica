"use client"

import { useState } from "react"
import { FaPlus, FaTrash, FaTv, FaSnowflake, FaFire, FaWater, FaDesktop, FaLaptop, FaPlug } from "react-icons/fa"
import styles from "./Devices.module.css"

const Devices = () => {
  const deviceCatalog = [
    {
      id: 1,
      name: 'Televisor LED 55"',
      brand: "Samsung",
      consumption: 150, // kWh
      category: "Entretenimiento",
      icon: FaTv,
    },
    {
      id: 2,
      name: 'Televisor LED 43"',
      brand: "LG",
      consumption: 120,
      category: "Entretenimiento",
      icon: FaTv,
    },
    {
      id: 3,
      name: "Refrigerador No Frost",
      brand: "Whirlpool",
      consumption: 350,
      category: "Electrodomésticos",
      icon: FaSnowflake,
    },
    {
      id: 4,
      name: "Aire Acondicionado 12000 BTU",
      brand: "Carrier",
      consumption: 1200,
      category: "Climatización",
      icon: FaSnowflake,
    },
    {
      id: 5,
      name: "Microondas",
      brand: "Panasonic",
      consumption: 800,
      category: "Electrodomésticos",
      icon: FaFire,
    },
    {
      id: 6,
      name: "Lavadora Automática",
      brand: "Electrolux",
      consumption: 500,
      category: "Electrodomésticos",
      icon: FaWater,
    },
    {
      id: 7,
      name: "Computador de Escritorio",
      brand: "HP",
      consumption: 300,
      category: "Tecnología",
      icon: FaDesktop,
    },
    {
      id: 8,
      name: "Laptop",
      brand: "Dell",
      consumption: 65,
      category: "Tecnología",
      icon: FaLaptop,
    },
  ]

  const [clientDevices, setClientDevices] = useState([
    {
      id: Date.now(),
      deviceId: 1,
      device: deviceCatalog[0],
      quantity: 2,
      dailyHours: 6,
      weeklyDays: 7,
    },
  ])

  const [selectedDevice, setSelectedDevice] = useState("")
  const [deviceForm, setDeviceForm] = useState({
    quantity: 1,
    dailyHours: 1,
    weeklyDays: 7,
  })

  const addDevice = () => {
    if (!selectedDevice) return

    const device = deviceCatalog.find((d) => d.id === Number.parseInt(selectedDevice))
    const newDevice = {
      id: Date.now(),
      deviceId: device.id,
      device: device,
      quantity: deviceForm.quantity,
      dailyHours: deviceForm.dailyHours,
      weeklyDays: deviceForm.weeklyDays,
    }

    setClientDevices([...clientDevices, newDevice])
    setSelectedDevice("")
    setDeviceForm({ quantity: 1, dailyHours: 1, weeklyDays: 7 })
  }

  const removeDevice = (deviceId) => {
    setClientDevices(clientDevices.filter((d) => d.id !== deviceId))
  }

  const calculateMonthlyConsumption = (device) => {
    const dailyConsumption = (device.device.consumption * device.dailyHours * device.quantity) / 1000
    const weeklyConsumption = dailyConsumption * device.weeklyDays
    const monthlyConsumption = (weeklyConsumption * 52) / 12
    return monthlyConsumption.toFixed(2)
  }

  return (
    <div className={styles.devicesSection}>
      <div className={styles.sectionCard}>
        <div className={styles.sectionHeader}>
          <h2>Configuración de Dispositivos</h2>
          <p>Selecciona tus dispositivos desde el catálogo y ajusta sus parámetros</p>
        </div>

        <div className={styles.addDeviceForm}>
          <h3>Agregar Nuevo Dispositivo</h3>
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
                    {device.name} - {device.brand} ({device.consumption}W)
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
                onChange={(e) => setDeviceForm({ ...deviceForm, quantity: Number.parseInt(e.target.value) })}
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
                onChange={(e) => setDeviceForm({ ...deviceForm, dailyHours: Number.parseInt(e.target.value) })}
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
                onChange={(e) => setDeviceForm({ ...deviceForm, weeklyDays: Number.parseInt(e.target.value) })}
                className={styles.input}
              />
            </div>
          </div>

          <button onClick={addDevice} disabled={!selectedDevice} className={styles.addButton}>
            <FaPlus />
            Agregar Dispositivo
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
                const IconComponent = clientDevice.device.icon
                return (
                  <div key={clientDevice.id} className={styles.deviceCard}>
                    <div className={styles.deviceHeader}>
                      <div className={styles.deviceIcon}>
                        <IconComponent />
                      </div>
                      <div className={styles.deviceInfo}>
                        <h4>{clientDevice.device.name}</h4>
                        <p>{clientDevice.device.brand}</p>
                        <span className={styles.category}>{clientDevice.device.category}</span>
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
                        <span className={styles.consumptionValue}>{calculateMonthlyConsumption(clientDevice)} kWh</span>
                      </div>
                      <div className={styles.powerInfo}>
                        <span>Potencia: {clientDevice.device.consumption}W</span>
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Devices
