"use client"
import { useEffect, useState, useMemo } from "react"
import ui from "../AdminUI.module.css"

export default function AdminDevices() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [q, setQ] = useState("")
  const [open, setOpen] = useState(null)
  const [form, setForm] = useState({ categoria: "Cocina" })


  useEffect(() => {
    fetch("http://localhost:8081/api/devices")
      .then(async (res) => {
        const data = await res.json()
        if (Array.isArray(data)) {
          setRows(data)
        } else if (data.message) {
         
          setRows([])
        } else {
          throw new Error("Respuesta inesperada del servidor")
        }
      })
      .catch((err) => {
        console.error("Error al obtener dispositivos:", err)
        setError("No se pudieron cargar los dispositivos.")
      })
      .finally(() => setLoading(false))
  }, [])

  
  const filtered = useMemo(() => {
    return rows.filter(r => {
      const text = `${r.nombre} ${r.categoria}`.toLowerCase()
      return q ? text.includes(q.toLowerCase()) : true
    })
  }, [rows, q])

  if (loading) return <p className={ui.loading}>Cargando dispositivos...</p>
  if (error) return <p className={ui.error}>{error}</p>

  return (
    <div>
      <div className={ui.controls}>
        <input
          className={ui.input}
          placeholder="Buscar dispositivo o categoría"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button
          className={`${ui.button} ${ui.primary}`}
          onClick={() => {
            setForm({ categoria: "Cocina" })
            setOpen("create")
          }}
        >
          Nuevo
        </button>
      </div>

      <div className={ui.tableWrap}>
        <table className={ui.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Potencia (W)</th>
              <th>Horas diarias</th>
              <th>Días/mes</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((d) => (
                <tr key={d.id}>
                  <td>{d.nombre}</td>
                  <td>{d.categoria}</td>
                  <td>{d.potenciaWatts}</td>
                  <td>{d.horasUsoDiario}</td>
                  <td>{d.diasUsoMensual}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={5} className={ui.empty}>
                  Sin resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  )
}
