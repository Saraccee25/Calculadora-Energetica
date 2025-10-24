"use client"
import { useEffect, useState, useMemo } from "react"
import Swal from "sweetalert2"
import ui from "../AdminUI.module.css"
import preloadedDevices from "../../../data/devices_preloaded.json" 

export default function AdminDevices() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [q, setQ] = useState("")
  const [showModal, setShowModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [form, setForm] = useState({
    nombre: "",
    categoria: "Cocina",
    potenciaWatts: "",
    horasUsoDiario: 1,
    diasUsoMensual: 30,
  })
  const [editForm, setEditForm] = useState(null)

  
  const fetchDevices = async () => {
    setLoading(true)
    try {
      const res = await fetch("http://localhost:8081/api/devices")
      const data = await res.json()

      if (!Array.isArray(data)) throw new Error("Respuesta inesperada del servidor")


      const combined = [
        ...preloadedDevices.map((d, i) => ({
          id: `local-${i}`,
          nombre: d.nombre,
          categoria: d.categoria,
          potenciaWatts: d.potenciaWatts,
          horasUsoDiario: d.horasUsoDiario ?? 1,
          diasUsoMensual: d.diasUsoMensual ?? 30,
          origen: "predefinido",
        })),
        ...data.map((d) => ({ ...d, origen: "servidor" })),
      ]

      setRows(combined)
    } catch (err) {
      console.error("Error al obtener dispositivos:", err)
      setError("No se pudieron cargar los dispositivos.")
      Swal.fire({
        title: "❌ Error",
        text: "No se pudieron cargar los dispositivos desde el servidor.",
        icon: "error",
        confirmButtonText: "Aceptar",
      })
      setRows(preloadedDevices) 
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchDevices()
  }, [])

 
  const validateForm = (f) => {
    if (!f.nombre || !f.nombre.trim()) {
      Swal.fire("⚠️ Campo requerido", "El nombre es obligatorio.", "warning")
      return false
    }
    if (!isNaN(f.nombre)) {
      Swal.fire("⚠️ Nombre inválido", "El nombre no puede ser solo un número.", "warning")
      return false
    }
    if (!f.categoria.trim()) {
      Swal.fire("⚠️ Campo requerido", "Debe seleccionar una categoría.", "warning")
      return false
    }
    const potencia = Number(f.potenciaWatts)
    if (isNaN(potencia) || potencia <= 0) {
      Swal.fire("⚠️ Valor inválido", "La potencia debe ser un número positivo.", "warning")
      return false
    }
    return true
  }


  const handleCreate = async () => {
    if (!validateForm(form)) return

    try {
      const res = await fetch("http://localhost:8081/api/devices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      if (res.ok) {
        Swal.fire({
          title: "✅ Dispositivo agregado",
          text: "El dispositivo fue registrado correctamente.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
        setShowModal(false)
        setForm({
          nombre: "",
          categoria: "Cocina",
          potenciaWatts: "",
          horasUsoDiario: 1,
          diasUsoMensual: 30,
        })
        fetchDevices()
      } else {
        const data = await res.json()
        Swal.fire("❌ Error", data.error || "No se pudo agregar el dispositivo.", "error")
      }
    } catch {
      Swal.fire("❌ Error de conexión", "No se pudo conectar con el servidor.", "error")
    }
  }

  
  const handleDelete = async (id, nombre, origen) => {
    if (origen === "predefinido") {
      return Swal.fire("⚠️ No permitido", "Los dispositivos predefinidos no pueden eliminarse.", "info")
    }

    const confirm = await Swal.fire({
      title: "¿Estás seguro?",
      text: `Se eliminará el dispositivo "${nombre}"`,
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Sí, eliminar",
      cancelButtonText: "Cancelar",
    })
    if (!confirm.isConfirmed) return

    try {
      const res = await fetch(`http://localhost:8081/api/devices/${id}`, { method: "DELETE" })
      if (res.ok) {
        Swal.fire("🗑️ Eliminado", "El dispositivo fue eliminado correctamente.", "success")
        fetchDevices()
      } else {
        const data = await res.json()
        Swal.fire("❌ Error", data.error || "No se pudo eliminar el dispositivo.", "error")
      }
    } catch {
      Swal.fire("❌ Error de conexión", "No se pudo conectar con el servidor.", "error")
    }
  }

 
  const handleEdit = async () => {
    if (!validateForm(editForm)) return

    if (editForm.origen === "predefinido") {
      Swal.fire("⚠️ No permitido", "Los dispositivos predefinidos no pueden editarse.", "info")
      return
    }

    try {
      const res = await fetch(`http://localhost:8081/api/devices/${editForm.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })

      if (res.ok) {
        Swal.fire("✅ Actualizado", "El dispositivo fue actualizado correctamente.", "success")
        setShowEditModal(false)
        fetchDevices()
      } else {
        const data = await res.json()
        Swal.fire("❌ Error", data.error || "No se pudo actualizar el dispositivo.", "error")
      }
    } catch {
      Swal.fire("❌ Error de conexión", "No se pudo conectar con el servidor.", "error")
    }
  }

  const filtered = useMemo(() => {
    return rows.filter((r) => {
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
          placeholder="🔍 Buscar dispositivo o categoría"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className={`${ui.button} ${ui.primary}`} onClick={() => setShowModal(true)}>
          ➕ Nuevo Dispositivo
        </button>
      </div>

      
      <div className={ui.tableWrap}>
        <table className={ui.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Potencia (W)</th>
              <th>Origen</th>
              <th>Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.length > 0 ? (
              filtered.map((d) => (
                <tr key={d.id}>
                  <td>{d.nombre}</td>
                  <td>{d.categoria}</td>
                  <td>{d.potenciaWatts}</td>
                  <td>{d.origen === "predefinido" ? "📘 Predeterminado" : "☁️ Servidor"}</td>
                  <td>
                    <div className={ui.contentButtons}>
                      <button
                        className={`${ui.button} ${ui.secondary}`}
                        onClick={() => {
                          setEditForm(d)
                          setShowEditModal(true)
                        }}
                      >
                        ✏️ Editar
                      </button>
                      <button
                        className={`${ui.button} ${ui.danger}`}
                        onClick={() => handleDelete(d.id, d.nombre, d.origen)}
                      >
                        🗑️ Eliminar
                      </button>
                    </div>
                  </td>
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

      
      {showModal && (
        <div className={ui.modalOverlay}>
          <div className={ui.modal}>
            <h2>🆕 Nuevo dispositivo</h2>

            <label>Nombre del dispositivo</label>
            <input
              className={ui.input}
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              placeholder="Ej: Refrigerador Samsung"
            />

            <label>Categoría</label>
            <select
              className={ui.select}
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
            >
              <option value="Cocina">🍳 Cocina</option>
              <option value="Sala">🛋️ Sala</option>
              <option value="Dormitorio">🛏️ Dormitorio</option>
              <option value="Baño">🚿 Baño</option>
              <option value="Lavandería">🧺 Lavandería</option>
            </select>

            <label>Potencia (Watts)</label>
            <input
              className={ui.input}
              type="number"
              value={form.potenciaWatts}
              onChange={(e) => setForm({ ...form, potenciaWatts: e.target.value })}
              placeholder="Ej: 800"
            />

            <label>Horas de uso diario</label>
            <input className={ui.input} type="number" value={form.horasUsoDiario} readOnly />

            <label>Días de uso mensual</label>
            <input className={ui.input} type="number" value={form.diasUsoMensual} readOnly />

            <p className={ui.note}>
              ⚙️ Las horas y días son predeterminados. El cliente podrá modificarlos desde su cuenta.
            </p>

            <div className={ui.modalActions}>
              <button className={ui.button} onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button className={`${ui.button} ${ui.primary}`} onClick={handleCreate}>
                💾 Guardar
              </button>
            </div>
          </div>
        </div>
      )}

     
      {showEditModal && editForm && (
        <div className={ui.modalOverlay}>
          <div className={ui.modal}>
            <h2>✏️ Editar dispositivo</h2>

            <label>Nombre del dispositivo</label>
            <input
              className={ui.input}
              value={editForm.nombre}
              onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
            />

            <label>Categoría</label>
            <select
              className={ui.select}
              value={editForm.categoria}
              onChange={(e) => setEditForm({ ...editForm, categoria: e.target.value })}
            >
              <option value="Cocina">🍳 Cocina</option>
              <option value="Sala">🛋️ Sala</option>
              <option value="Dormitorio">🛏️ Dormitorio</option>
              <option value="Baño">🚿 Baño</option>
              <option value="Lavandería">🧺 Lavandería</option>
            </select>

            <label>Potencia (Watts)</label>
            <input
              className={ui.input}
              type="number"
              value={editForm.potenciaWatts}
              onChange={(e) => setEditForm({ ...editForm, potenciaWatts: e.target.value })}
            />

            <div className={ui.modalActions}>
              <button className={ui.button} onClick={() => setShowEditModal(false)}>
                Cancelar
              </button>
              <button className={`${ui.button} ${ui.primary}`} onClick={handleEdit}>
                💾 Actualizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
