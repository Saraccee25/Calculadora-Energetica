"use client"
import { useMemo, useState } from "react"
import ui from "../AdminUI.module.css"

const MOCK = [
  { id:"t1", stratum:1, priceCents: 35000, validFrom:"2024-01-01", validTo:null,  active:true },
  { id:"t2", stratum:2, priceCents: 42000, validFrom:"2024-03-01", validTo:null,  active:true },
  { id:"t3", stratum:3, priceCents: 50000, validFrom:"2023-06-01", validTo:"2024-02-29", active:false },
]

export default function Tariffs(){
  const [rows, setRows] = useState(MOCK)
  const [estrato, setEstrato] = useState("")
  const [state, setState] = useState("")
  const [open, setOpen] = useState(null)
  const [form, setForm] = useState({ stratum:1, active:true })

  const filtered = useMemo(()=>{
    return rows.filter(t=>{
      const passE = estrato ? String(t.stratum)===String(estrato) : true
      const passS = state ? (state==="vigentes" ? t.active : !t.active) : true
      return passE && passS
    })
  },[rows,estrato,state])

  const onCreate = () => {
    setRows(rs=>[{...form, id:crypto.randomUUID()}, ...rs])
    setOpen(null); setForm({ stratum:1, active:true })
  }
  const onUpdate = () => {
    setRows(rs=>rs.map(r=> r.id===form.id ? form : r))
    setOpen(null); setForm({ stratum:1, active:true })
  }
  const onDelete = (id) => {
    if (!confirm("¿Eliminar tarifa?")) return
    setRows(rs=>rs.filter(r=>r.id!==id))
  }

  return (
    <div>
      <div className={ui.controls}>
        <select className={ui.select} value={estrato} onChange={e=>setEstrato(e.target.value)}>
          <option value="">Todos los estratos</option>
          {[1,2,3,4,5,6].map(s=><option key={s} value={s}>{s}</option>)}
        </select>
        <select className={ui.select} value={state} onChange={e=>setState(e.target.value)}>
          <option value="">Todas</option>
          <option value="vigentes">Vigentes</option>
          <option value="historicas">Históricas</option>
        </select>
        <button className={`${ui.button} ${ui.primary}`} onClick={()=>{ setForm({ stratum:1, active:true }); setOpen("create") }}>
          Nueva vigencia
        </button>
      </div>

      <div className={ui.tableWrap}>
        <table className={ui.table}>
          <thead>
            <tr><th>Estrato</th><th>Precio</th><th>Desde</th><th>Hasta</th><th>Estado</th><th>Acciones</th></tr>
          </thead>
          <tbody>
            {filtered.map(t=>(
              <tr key={t.id}>
                <td>{t.stratum}</td>
                <td>${(t.priceCents/100).toLocaleString()}</td>
                <td>{t.validFrom}</td>
                <td>{t.validTo ?? "—"}</td>
                <td>{t.active ? "Vigente" : "Histórica"}</td>
                <td>
                  <button className={ui.button} onClick={()=>{ setForm(t); setOpen("edit") }}>Editar</button>
                  <button className={ui.button} onClick={()=>onDelete(t.id)}>Borrar</button>
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
            <div className={ui.modalHeader}>{open==="create" ? "Nueva tarifa" : "Editar tarifa"}</div>
            <div className={ui.formGrid}>
              <select className={ui.select} value={form.stratum ?? 1} onChange={e=>setForm(f=>({...f, stratum:Number(e.target.value)}))}>
                {[1,2,3,4,5,6].map(s=><option key={s} value={s}>{s}</option>)}
              </select>
              <input className={ui.input} type="number" placeholder="Precio (COP)" value={form.priceCents ? form.priceCents/100 : ""} onChange={e=>setForm(f=>({...f, priceCents: Math.round(Number(e.target.value)*100)}))}/>
              <input className={ui.input} type="date" value={form.validFrom ?? ""} onChange={e=>setForm(f=>({...f, validFrom:e.target.value}))}/>
              <input className={ui.input} type="date" value={form.validTo ?? ""} onChange={e=>setForm(f=>({...f, validTo:e.target.value || null}))}/>
            </div>
            <div className={ui.footer}>
              <button className={ui.button} onClick={()=>{ setOpen(null); setForm({ stratum:1, active:true }) }}>Cancelar</button>
              <button className={`${ui.button} ${ui.primary}`} onClick={open==="create" ? onCreate : onUpdate}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
