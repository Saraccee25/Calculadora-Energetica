"use client"
import { useMemo, useState } from "react"
import ui from "../AdminUI.module.css"

const USERS = [
  { id:"u1", name:"Ana López" }, { id:"u2", name:"Luis Pérez" }, { id:"u3", name:"Marta Ríos" },
]
const DEVICES = [
  { id:"d1", serial:"POCOX3-001", model:"Meter A1" },
  { id:"d2", serial:"POCOX3-002", model:"Meter A1" },
  { id:"d3", serial:"POCOX3-003", model:"Meter B2" },
]
const MOCK = [
  { id:"a1", deviceId:"d1", deviceSerial:"POCOX3-001", userId:"u1", userName:"Ana López", assignedAt: Date.now()-7200000, releasedAt:null },
  { id:"a2", deviceId:"d3", deviceSerial:"POCOX3-003", userId:"u2", userName:"Luis Pérez", assignedAt: Date.now()-86400000*2, releasedAt: Date.now()-3600000 },
]

export default function Assignments(){
  const [rows, setRows] = useState(MOCK)
  const [open, setOpen] = useState(false)
  const [form, setForm] = useState({ deviceId:"", userId:"", assignedAt:"" })
  const [q, setQ] = useState("")

  const filtered = useMemo(()=>{
    return rows.filter(r=>{
      const text = `${r.deviceSerial} ${r.userName}`.toLowerCase()
      return q ? text.includes(q.toLowerCase()) : true
    })
  },[rows,q])

  const onAssign = () => {
    if (!form.deviceId || !form.userId) return alert("Selecciona dispositivo y usuario")
    const dev = DEVICES.find(d=>d.id===form.deviceId)
    const usr = USERS.find(u=>u.id===form.userId)
    setRows(rs=>[
      { id: crypto.randomUUID(), deviceId: dev.id, deviceSerial: dev.serial, userId: usr.id, userName: usr.name, assignedAt: form.assignedAt ? new Date(form.assignedAt).getTime() : Date.now(), releasedAt:null },
      ...rs
    ])
    setOpen(false); setForm({ deviceId:"", userId:"", assignedAt:"" })
  }
  const onRelease = (id) => setRows(rs=>rs.map(r=> r.id===id ? {...r, releasedAt: Date.now()} : r))

  return (
    <div>
      <div className={ui.controls}>
        <input className={ui.input} placeholder="Buscar por dispositivo/usuario" value={q} onChange={e=>setQ(e.target.value)} />
        <button className={`${ui.button} ${ui.primary}`} onClick={()=>setOpen(true)}>Nueva asignación</button>
      </div>

      <div className={ui.tableWrap}>
        <table className={ui.table}>
          <thead><tr><th>Dispositivo</th><th>Usuario</th><th>Asignado</th><th>Liberado</th><th>Acciones</th></tr></thead>
          <tbody>
            {filtered.map(r=>(
              <tr key={r.id}>
                <td>{r.deviceSerial}</td>
                <td>{r.userName}</td>
                <td>{new Date(r.assignedAt).toLocaleString()}</td>
                <td>{r.releasedAt ? new Date(r.releasedAt).toLocaleString() : "—"}</td>
                <td>{!r.releasedAt && <button className={ui.button} onClick={()=>onRelease(r.id)}>Liberar</button>}</td>
              </tr>
            ))}
            {!filtered.length && <tr><td colSpan={5} className={ui.empty}>Sin resultados</td></tr>}
          </tbody>
        </table>
      </div>

      {open && (
        <div className={ui.modalBackdrop}>
          <div className={ui.modalCard}>
            <div className={ui.modalHeader}>Asignar dispositivo</div>
            <div className={ui.formGrid}>
              <select className={ui.select} value={form.deviceId} onChange={e=>setForm(f=>({...f, deviceId:e.target.value}))}>
                <option value="">Selecciona dispositivo</option>
                {DEVICES.map(d=><option key={d.id} value={d.id}>{d.serial} — {d.model}</option>)}
              </select>
              <select className={ui.select} value={form.userId} onChange={e=>setForm(f=>({...f, userId:e.target.value}))}>
                <option value="">Selecciona usuario</option>
                {USERS.map(u=><option key={u.id} value={u.id}>{u.name}</option>)}
              </select>
              <input className={ui.input} type="datetime-local" value={form.assignedAt} onChange={e=>setForm(f=>({...f, assignedAt:e.target.value}))}/>
            </div>
            <div className={ui.footer}>
              <button className={ui.button} onClick={()=>{ setOpen(false); setForm({ deviceId:"", userId:"", assignedAt:"" }) }}>Cancelar</button>
              <button className={`${ui.button} ${ui.primary}`} onClick={onAssign}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
