"use client"
import { useState } from "react"
import ui from "../AdminUI.module.css"

export default function Settings(){
  const [data, setData] = useState({
    branding: { appName:"Calculadora Energética", primaryColor:"#15803d" },
    smtp: { host:"smtp.demo.com", port:587, user:"noreply@demo.com", from:"Demo <noreply@demo.com>" },
    flags: { simulator:true, reports:true }
  })

  const save = () => alert("Guardado (mock)")
  const testEmail = () => alert("Correo de prueba enviado (mock)")

  return (
    <div className={ui.formGrid} style={{maxWidth:820}}>
      <div className={ui.modalCard}>
        <div className={ui.modalHeader}>Branding</div>
        <div className={ui.formGrid}>
          <input className={ui.input} placeholder="Nombre de la app"
            value={data.branding.appName} onChange={e=>setData(d=>({ ...d, branding:{ ...d.branding, appName:e.target.value } }))}/>
          <input className={ui.input} placeholder="Color primario (hex)"
            value={data.branding.primaryColor} onChange={e=>setData(d=>({ ...d, branding:{ ...d.branding, primaryColor:e.target.value } }))}/>
        </div>
      </div>

      <div className={ui.modalCard}>
        <div className={ui.modalHeader}>Correo / SMTP</div>
        <div className={ui.formGrid}>
          <input className={ui.input} placeholder="Host" value={data.smtp.host} onChange={e=>setData(d=>({ ...d, smtp:{ ...d.smtp, host:e.target.value } }))}/>
          <input className={ui.input} type="number" placeholder="Puerto" value={data.smtp.port} onChange={e=>setData(d=>({ ...d, smtp:{ ...d.smtp, port:Number(e.target.value) } }))}/>
          <input className={ui.input} placeholder="Usuario" value={data.smtp.user} onChange={e=>setData(d=>({ ...d, smtp:{ ...d.smtp, user:e.target.value } }))}/>
          <input className={ui.input} placeholder="From (nombre@dominio)" value={data.smtp.from} onChange={e=>setData(d=>({ ...d, smtp:{ ...d.smtp, from:e.target.value } }))}/>
        </div>
        <div className={ui.footer}>
          <button className={ui.button} onClick={testEmail}>Enviar prueba</button>
        </div>
      </div>

      <div className={ui.modalCard}>
        <div className={ui.modalHeader}>Toggles / Features</div>
        <label style={{display:"flex",alignItems:"center",gap:8}}>
          <input type="checkbox" checked={!!data.flags.simulator} onChange={e=>setData(d=>({ ...d, flags:{ ...d.flags, simulator:e.target.checked } }))}/>
          Simulador
        </label>
        <label style={{display:"flex",alignItems:"center",gap:8}}>
          <input type="checkbox" checked={!!data.flags.reports} onChange={e=>setData(d=>({ ...d, flags:{ ...d.flags, reports:e.target.checked } }))}/>
          Reportes
        </label>
      </div>

      {/* Botón de guardar alineado al contenido */}
      <div style={{display:"flex", justifyContent:"flex-end", marginright:"303px"}}>
        <button className={`${ui.button} ${ui.primary}`} onClick={save}>Guardar</button>
      </div>
    </div>
  )
}
