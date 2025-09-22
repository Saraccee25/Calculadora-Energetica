"use client"
import { useMemo, useState } from "react"
import ui from "../AdminUI.module.css"

const MOCK = [
  { id:"ev1", createdAt: Date.now()-1_000_000, actor:"ana@demo.com", action:"UPDATE", entity:"device", entityId:"d1", before:{status:"inactive"}, after:{status:"active"} },
  { id:"ev2", createdAt: Date.now()-3_000_000, actor:"luis@demo.com", action:"CREATE", entity:"tariff", entityId:"t4", before:null, after:{stratum:2, priceCents: 45000} },
]

export default function AuditLog(){
  const [rows] = useState(MOCK)
  const [q, setQ] = useState("")
  const [open, setOpen] = useState(null)

  const filtered = useMemo(()=>{
    return rows.filter(a=>{
      const text = `${a.actor} ${a.action} ${a.entity} ${a.entityId}`.toLowerCase()
      return q ? text.includes(q.toLowerCase()) : true
    })
  },[rows,q])

  return (
    <div>
      <div className={ui.controls}>
        <input className={ui.input} placeholder="Buscar actor/entidad/acción" value={q} onChange={e=>setQ(e.target.value)}/>
      </div>

      <div className={ui.tableWrap}>
        <table className={ui.table}>
          <thead><tr><th>Fecha</th><th>Actor</th><th>Acción</th><th>Entidad</th><th>ID</th><th>Detalle</th></tr></thead>
          <tbody>
            {filtered.map(a=>(
              <tr key={a.id}>
                <td>{new Date(a.createdAt).toLocaleString()}</td>
                <td>{a.actor}</td>
                <td>{a.action}</td>
                <td>{a.entity}</td>
                <td>{a.entityId}</td>
                <td><button className={ui.button} onClick={()=>setOpen(a)}>Ver</button></td>
              </tr>
            ))}
            {!filtered.length && <tr><td colSpan={6} className={ui.empty}>Sin resultados</td></tr>}
          </tbody>
        </table>
      </div>

      {open && (
        <div className={ui.modalBackdrop}>
          <div className={ui.modalCard}>
            <div className={ui.modalHeader}>Cambio en {open.entity} #{open.entityId}</div>
            <div className={ui.formGrid}>
              <pre style={{whiteSpace:"pre-wrap",margin:0}}>{JSON.stringify(open.before, null, 2)}</pre>
              <pre style={{whiteSpace:"pre-wrap",margin:0}}>{JSON.stringify(open.after, null, 2)}</pre>
            </div>
            <div className={ui.footer}>
              <button className={ui.button} onClick={()=>setOpen(null)}>Cerrar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
