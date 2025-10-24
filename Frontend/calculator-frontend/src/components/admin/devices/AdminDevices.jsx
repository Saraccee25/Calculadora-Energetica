"use client"
import { useEffect, useState, useMemo } from "react"
import Swal from "sweetalert2"
import ui from "../AdminUI.module.css"

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

  // 🔹 Cargar dispositivos
  const fetchDevices = () => {
    setLoading(true)
    fetch("http://localhost:8081/api/devices")
      .then(async (res) => {
        const data = await res.json()
        if (Array.isArray(data)) setRows(data)
        else throw new Error("Respuesta inesperada del servidor")
      })
      .catch((err) => {
        console.error("Error al obtener dispositivos:", err)
        setError("No se pudieron cargar los dispositivos.")
        Swal.fire({
          title: "❌ Error",
          text: "No se pudieron cargar los dispositivos desde el servidor.",
          icon: "error",
          confirmButtonText: "Aceptar",
        })
      })
      .finally(() => setLoading(false))
  }

  useEffect(() => {
    fetchDevices()
  }, [])

  // 🔹 Validaciones (corregida)
  const validateForm = (f) => {
    if (!f.nombre || !f.nombre.toString().trim()) {
      Swal.fire("⚠️ Campo requerido", "El nombre es obligatorio.", "warning")
      return false
    }
    if (!isNaN(f.nombre)) {
      Swal.fire("⚠️ Nombre inválido", "El nombre no puede ser solo un número.", "warning")
      return false
    }
    if (!f.categoria || !f.categoria.toString().trim()) {
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

  // 🔹 Crear nuevo dispositivo
  const handleCreate = async () => {
    if (!validateForm(form)) return

    try {
      const res = await fetch("http://localhost:8081/api/devices", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(form),
      })

      const data = await res.text()

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
        Swal.fire("❌ Error", data.error || "No se pudo agregar el dispositivo.", "error")
      }
    } catch (err) {
      console.error("Error al crear dispositivo:", err)
      Swal.fire("❌ Error de conexión", "No se pudo conectar con el servidor.", "error")
    }
  }

  // 🔹 Eliminar dispositivo
  const handleDelete = async (id, nombre) => {
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
      const data = await res.json()

      if (res.ok) {
        Swal.fire({
          title: "🗑️ Eliminado",
          text: data.message || "El dispositivo fue eliminado correctamente.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
        fetchDevices()
      } else {
        Swal.fire("❌ Error", data.error || "No se pudo eliminar el dispositivo.", "error")
      }
    } catch (err) {
      console.error("Error al eliminar dispositivo:", err)
      Swal.fire("❌ Error de conexión", "No se pudo conectar con el servidor.", "error")
    }
  }

  // 🔹 Editar dispositivo
  const handleEdit = async () => {
    if (!validateForm(editForm)) return

    try {
      const res = await fetch(`http://localhost:8081/api/devices/${editForm.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(editForm),
      })

      const data = await res.text()

      if (res.ok) {
        Swal.fire({
          title: "✅ Actualizado",
          text: "El dispositivo fue actualizado correctamente.",
          icon: "success",
          timer: 2000,
          showConfirmButton: false,
        })
        setShowEditModal(false)
        fetchDevices()
      } else {
        Swal.fire("❌ Error", data.error || "No se pudo actualizar el dispositivo.", "error")
      }
    } catch (err) {
      console.error("Error al editar dispositivo:", err)
      Swal.fire("❌ Error de conexión", "No se pudo conectar con el servidor.", "error")
    }
  }

  // 🔹 Filtrado de búsqueda
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
          placeholder="Buscar dispositivo o categoría"
          value={q}
          onChange={(e) => setQ(e.target.value)}
        />
        <button className={`${ui.button} ${ui.primary}`} onClick={() => setShowModal(true)}>
          Nuevo
        </button>
      </div>

      {/* 🧩 Tabla de dispositivos */}
      <div className={ui.tableWrap}>
        <table className={ui.table}>
          <thead>
            <tr>
              <th>Nombre</th>
              <th>Categoría</th>
              <th>Potencia (W)</th>
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
                  <td>
                    <button
                      className={`${ui.button} ${ui.secondary}`}
                      onClick={() => {
                        setEditForm(d)
                        setShowEditModal(true)
                      }}
                    >
                      Editar
                    </button>
                    <button
                      className={`${ui.button} ${ui.danger}`}
                      onClick={() => handleDelete(d.id, d.nombre)}
                    >
                      Eliminar
                    </button>
                  </td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4} className={ui.empty}>
                  Sin resultados
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* 🪟 Modal de creación */}
      {showModal && (
        <div className={ui.modalOverlay}>
          <div className={ui.modal}>
            <h2>🆕 Nuevo dispositivo</h2>
            <label>Nombre</label>
            <input
              className={ui.input}
              value={form.nombre}
              onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              placeholder="Ej: Refrigerador"
            />

            <label>Categoría</label>
            <select
              className={ui.input}
              value={form.categoria}
              onChange={(e) => setForm({ ...form, categoria: e.target.value })}
            >
              <option value="Cocina">Cocina</option>
              <option value="Sala">Sala</option>
              <option value="Dormitorio">Dormitorio</option>
              <option value="Baño">Baño</option>
              <option value="Lavandería">Lavandería</option>
            </select>

            <label>Potencia (W)</label>
            <input
              className={ui.input}
              type="number"
              value={form.potenciaWatts}
              onChange={(e) => setForm({ ...form, potenciaWatts: e.target.value })}
              placeholder="Ej: 800"
            />

            <label>Horas de uso diario</label>
            <input
              className={ui.input}
              type="number"
              value={form.horasUsoDiario}
              readOnly
            />

            <label>Días de uso mensual</label>
            <input
              className={ui.input}
              type="number"
              value={form.diasUsoMensual}
              readOnly
            />

            <p className={ui.note}>
              ⚙️ Las horas y días son predeterminados (el cliente podrá modificarlos desde su cuenta).
            </p>

            <div className={ui.modalActions}>
              <button className={ui.button} onClick={() => setShowModal(false)}>
                Cancelar
              </button>
              <button className={`${ui.button} ${ui.primary}`} onClick={handleCreate}>
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 🪟 Modal de edición */}
      {showEditModal && editForm && (
        <div className={ui.modalOverlay}>
          <div className={ui.modal}>
            <h2>✏️ Editar dispositivo</h2>

            <label>Nombre</label>
            <input
              className={ui.input}
              value={editForm.nombre}
              onChange={(e) => setEditForm({ ...editForm, nombre: e.target.value })}
            />

            <label>Categoría</label>
            <select
              className={ui.input}
              value={editForm.categoria}
              onChange={(e) => setEditForm({ ...editForm, categoria: e.target.value })}
            >
              <option value="Cocina">Cocina</option>
              <option value="Sala">Sala</option>
              <option value="Dormitorio">Dormitorio</option>
              <option value="Baño">Baño</option>
              <option value="Lavandería">Lavandería</option>
            </select>

            <label>Potencia (W)</label>
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
                Actualizar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
