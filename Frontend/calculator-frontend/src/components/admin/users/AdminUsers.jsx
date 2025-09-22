"use client"
import { useMemo, useState } from "react"
import ui from "../AdminUI.module.css"

const MOCK = [
  { id:"u1", name:"Ana López", email:"ana@demo.com", role:"owner", active:true, createdAt: Date.now()-9_000_000 },
  { id:"u2", name:"Luis Pérez", email:"luis@demo.com", role:"admin", active:true, createdAt: Date.now()-20_000_000 },
  { id:"u3", name:"Marta Ríos", email:"marta@demo.com", role:"support", active:false, createdAt: Date.now()-40_000_000 },
]

export default function AdminUsers(){
  const [rows, setRows] = useState(MOCK)
  const [q, setQ] = useState("")
  const [role, setRole] = useState("")
  const [status, setStatus] = useState("")
  const [open, setOpen] = useState(null)
  const [form, setForm] = useState({ role:"admin", active:true })

  const filtered = useMemo(()=>{
    return rows.filter(u=>{
      const text = `${u.name} ${u.email}`.toLowerCase()
      const passQ = q ? text.includes(q.toLowerCase()) : true
      const passR = role ? u.role===role : true
      const passS = status ? (status==="active" ? u.active : !u.active) : true
      return passQ && passR && passS
    })
  },[rows,q,role,status])

  const onCreate = () => {
    const id = crypto.randomUUID()
    setRows(rs=>[{...form, id, createdAt: Date.now()}, ...rs])
    setOpen(null); setForm({ role:"admin", active:true })
  }
  const onUpdate = () => {
    setRows(rs=>rs.map(r=> r.id===form.id ? form : r))
    setOpen(null); setForm({ role:"admin", active:true })
  }
  const onToggleBlock = (u) => setRows(rs=>rs.map(r=> r.id===u.id ? {...r, active:!r.active} : r))
  const onDelete = (u) => {
    if (u.role==="owner") return alert("No se puede eliminar un OWNER")
    if (!confirm("¿Eliminar usuario?")) return
    setRows(rs=>rs.filter(r=>r.id!==u.id))
  }

  return (
    <div>
      <div className={ui.controls}>
        <input className={ui.input} placeholder="Buscar nombre/email" value={q} onChange={e=>setQ(e.target.value)} />
        <select className={ui.select} value={role} onChange={e=>setRole(e.target.value)}>
          <option value="">Todos los roles</option>
          <option value="owner">Owner</option><option value="admin">Admin</option>
          <option value="support">Support</option><option value="client-admin">Client Admin</option>
        </select>
        <select className={ui.select} value={status} onChange={e=>setStatus(e.target.value)}>
          <option value="">Todos</option><option value="active">Activos</option><option value="inactive">Inactivos</option>
        </select>
        <button className={`${ui.button} ${ui.primary}`} onClick={()=>{ setForm({ role:"admin", active:true }); setOpen("create") }}>Nuevo</button>
      </div>

      <div className={ui.tableWrap}>
        <table className={ui.table}>
          <thead><tr><th>Nombre</th><th>Email</th><th>Rol</th><th>Estado</th><th>Creado</th><th>Acciones</th></tr></thead>
          <tbody>
            {filtered.map(u=>(
              <tr key={u.id}>
                <td>{u.name}</td><td>{u.email}</td><td>{u.role}</td>
                <td>{u.active ? "Activo":"Bloqueado"}</td>
                <td>{new Date(u.createdAt).toLocaleDateString()}</td>
                <td>
                  <div className={ui.contentButtons}>
                    <button className={ui.button} onClick={()=>{ setForm(u); setOpen("edit") }}>Editar</button>
                    <button className={ui.button} onClick={()=>onToggleBlock(u)}>{u.active ? "Bloquear":"Desbloquear"}</button>
                    <button className={ui.button} onClick={()=>onDelete(u)}>Borrar</button>
                  </div>
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
            <div className={ui.modalHeader}>{open==="create"?"Nuevo usuario":`Editar ${form.name ?? ""}`}</div>
            <div className={ui.formGrid}>
              <input className={ui.input} placeholder="Nombre" value={form.name ?? ""} onChange={e=>setForm(f=>({...f, name:e.target.value}))}/>
              <input className={ui.input} placeholder="Email" value={form.email ?? ""} onChange={e=>setForm(f=>({...f, email:e.target.value}))}/>
              <select className={ui.select} value={form.role ?? "admin"} onChange={e=>setForm(f=>({...f, role:e.target.value}))}>
                <option value="owner">Owner</option><option value="admin">Admin</option>
                <option value="support">Support</option><option value="client-admin">Client Admin</option>
              </select>
              <label style={{display:"flex",alignItems:"center",gap:8}}>
                <input type="checkbox" checked={!!form.active} onChange={e=>setForm(f=>({...f, active:e.target.checked}))}/>
                Activo
              </label>
            </div>
            <div className={ui.footer}>
              <button className={ui.button} onClick={()=>{ setOpen(null); setForm({ role:"admin", active:true }) }}>Cancelar</button>
              <button className={`${ui.button} ${ui.primary}`} onClick={open==="create" ? onCreate : onUpdate}>Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
