"use client"
import { useMemo, useState } from "react"
import ui from "../AdminUI.module.css"

const MOCK = [
  { id:"d1", serial:"POCOX3-001", model:"Meter A1", status:"active", lastSeenAt: Date.now()-3_600_000, assignedToName:"Ana" },
  { id:"d2", serial:"POCOX3-002", model:"Meter A1", status:"inactive", lastSeenAt:null, assignedToName:null },
  { id:"d3", serial:"POCOX3-003", model:"Meter B2", status:"maintenance", lastSeenAt: Date.now()-86_400_000, assignedToName:"Luis" },
  { id:"d4", serial:"POCOX3-004", model:"Meter B2", status:"active", lastSeenAt: Date.now()-5_000, assignedToName:null },
]

export default function AdminDevices(){
  const [rows, setRows] = useState(MOCK)
  const [q, setQ] = useState("")
  const [status, setStatus] = useState("")
  const [open, setOpen] = useState(null)
  const [form, setForm] = useState({ status:"active" })

  const filtered = useMemo(()=>{
    return rows.filter(r=>{
      const text = `${r.serial} ${r.model}`.toLowerCase()
      const passQ = q ? text.includes(q.toLowerCase()) : true
      const passS = status ? r.status===status : true
      return passQ && passS
    })
  },[rows,q,status])

  const onCreate = () => {
    const id = crypto.randomUUID()
    setRows(rs=>[{...form, id}, ...rs])
    setOpen(null); setForm({ status:"active" })
  }
  const onUpdate = () => {
    setRows(rs=>rs.map(r=> r.id===form.id ? form : r))
    setOpen(null); setForm({ status:"active" })
  }
  const onDelete = (id) => {
    if (!confirm("¿Eliminar dispositivo?")) return
    setRows(rs=>rs.filter(r=>r.id!==id))
  }

  return (
    <div>
      <div className={ui.controls}>
        <input className={ui.input} placeholder="Buscar serial/modelo" value={q} onChange={e=>setQ(e.target.value)} />
        <select className={ui.select} value={status} onChange={e=>setStatus(e.target.value)}>
          <option value="">Todos</option>
          <option value="active">Activos</option>
          <option value="inactive">Inactivos</option>
          <option value="maintenance">Mantenimiento</option>
        </select>
        <button className={`${ui.button} ${ui.primary}`} onClick={()=>{ setForm({ status:"active" }); setOpen("create") }}>
          Nuevo
        </button>
      </div>

      <div className={ui.tableWrap}>
        <table className={ui.table}>
          <thead><tr><th>Serial</th><th>Modelo</th><th>Estado</th><th>Último ping</th><th>Asignado a</th><th>Acciones</th></tr></thead>
          <tbody>
            {filtered.map(d=>(
              <tr key={d.id}>
                <td>{d.serial}</td><td>{d.model}</td><td>{d.status}</td>
                <td>{d.lastSeenAt ? new Date(d.lastSeenAt).toLocaleString() : "—"}</td>
                <td>{d.assignedToName ?? "Libre"}</td>
                <td>
                  <button className={ui.button} onClick={()=>{ setForm(d); setOpen("edit") }}>Editar</button>
                  <button className={ui.button} onClick={()=>onDelete(d.id)}>Borrar</button>
                </td>
              </tr>
            ))}
            {!filtered.length && <tr><td colSpan={6} className={ui.empty}>Sin resultados</td></tr>}
          </tbody>
        </table>
      </div>

      {open && (
        <div className={ui.modalBackdrop}>
          <div className={ui.modalCard}>
            <div className={ui.modalHeader}>{open==="create" ? "Nuevo dispositivo" : `Editar ${form.serial}`}</div>
            <div className={ui.formGrid}>
              <input className={ui.input} placeholder="Serial" value={form.serial ?? ""} onChange={e=>setForm(f=>({...f, serial:e.target.value}))}/>
              <input className={ui.input} placeholder="Modelo" value={form.model ?? ""} onChange={e=>setForm(f=>({...f, model:e.target.value}))}/>
              <select className={ui.select} value={form.status ?? "active"} onChange={e=>setForm(f=>({...f, status:e.target.value}))}>
                <option value="active">Activo</option><option value="inactive">Inactivo</option><option value="maintenance">Mantenimiento</option>
              </select>
              <input className={ui.input} placeholder="Asignado a (opcional)" value={form.assignedToName ?? ""} onChange={e=>setForm(f=>({...f, assignedToName:e.target.value||null}))}/>
            </div>
            <div className={ui.footer}>
              <button className={ui.button} onClick={()=>{ setOpen(null); setForm({ status:"active" }) }}>Cancelar</button>
              <button className={`${ui.button} ${ui.primary}`} onClick={open==="create" ? onCreate : onUpdate}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
