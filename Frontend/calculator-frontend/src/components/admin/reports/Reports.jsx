"use client"
import { useMemo, useState } from "react"
import ui from "../AdminUI.module.css"

const MOCK = {
  users: [
    { role:"owner", active:1, inactive:0 },
    { role:"admin", active:3, inactive:1 },
    { role:"support", active:0, inactive:2 },
  ],
  devices: [
    { model:"Meter A1", active:2, inactive:1, maintenance:0 },
    { model:"Meter B2", active:1, inactive:0, maintenance:1 },
  ],
  assignments: [
    { device:"POCOX3-001", user:"Ana", from:"2024-06-01", to:"2024-06-30", hours:120 },
    { device:"POCOX3-003", user:"Luis", from:"2024-06-05", to:"2024-06-29", hours:90 },
  ],
  tariffs: [
    { stratum:1, price:350, from:"2024-01-01", to:"—" },
    { stratum:2, price:420, from:"2024-03-01", to:"—" },
  ]
}

export default function Reports(){
  const [from, setFrom] = useState("")
  const [to, setTo] = useState("")
  const [type, setType] = useState("users")

  const rows = useMemo(()=>{
    // En “mock” ignoramos fechas y devolvemos un dataset fijo por tipo
    return MOCK[type] || []
  },[type, from, to])

  const headers = rows[0] ? Object.keys(rows[0]) : ["Resultado"]

  const exportCSV = () => {
    const csv = [headers.join(","), ...rows.map(r=>headers.map(h=>JSON.stringify(r[h] ?? "")).join(","))].join("\n")
    const url = URL.createObjectURL(new Blob([csv], { type:"text/csv" }))
    const a = document.createElement("a")
    a.href = url; a.download = `${type}.csv`; a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div>
      <div className={ui.controls}>
        <select className={ui.select} value={type} onChange={e=>setType(e.target.value)}>
          <option value="users">Usuarios por rol/estado</option>
          <option value="devices">Dispositivos por estado/modelo</option>
          <option value="assignments">Asignaciones por periodo</option>
          <option value="tariffs">Tarifas (histórico)</option>
        </select>
        <input className={ui.input} type="date" value={from} onChange={e=>setFrom(e.target.value)} />
        <input className={ui.input} type="date" value={to} onChange={e=>setTo(e.target.value)} />
        <button className={ui.button} onClick={()=>{ /* en mock no hace nada */ }}>Generar</button>
        <button className={`${ui.button} ${ui.primary}`} onClick={exportCSV}>Exportar CSV</button>
      </div>

      <div className={ui.tableWrap}>
        <table className={ui.table}>
          <thead><tr>{headers.map(h=><th key={h}>{h}</th>)}</tr></thead>
          <tbody>
            {rows.map((r,i)=>(
              <tr key={i}>{headers.map(h=><td key={h}>{String(r[h])}</td>)}</tr>
            ))}
            {!rows.length && <tr><td className={ui.empty}>Sin datos</td></tr>}
          </tbody>
        </table>
      </div>
    </div>
  )
}
