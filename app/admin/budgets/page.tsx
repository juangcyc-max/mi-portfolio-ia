'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getSupabaseClient } from '@/lib/supabaseAdmin'
import ReplyForm from '@/components/admin/ReplyForm'

const supabase = getSupabaseClient()

// ── Solicitudes (budget_requests) ──────────────────────────────────────────

const REQ_STATUS_LABELS: Record<string, string> = {
  pending: 'Pendiente', processing: 'Procesando', sent: 'Enviado',
  accepted: 'Aceptado', rejected: 'Rechazado',
}
const REQ_STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-500/20 text-yellow-600',
  processing: 'bg-blue-500/20 text-blue-600',
  sent: 'bg-purple-500/20 text-purple-600',
  accepted: 'bg-emerald-500/20 text-emerald-600',
  rejected: 'bg-red-500/20 text-red-500',
}

// ── Presupuestos definitivos (custom_budgets) ───────────────────────────────

const BUD_STATUS_LABELS: Record<string, string> = {
  draft: 'Borrador', sent: 'Enviado', accepted: 'Aceptado', rejected: 'Rechazado',
}
const BUD_STATUS_COLORS: Record<string, string> = {
  draft: 'bg-slate-200 text-slate-600',
  sent: 'bg-blue-500/20 text-blue-600',
  accepted: 'bg-emerald-500/20 text-emerald-600',
  rejected: 'bg-red-500/20 text-red-500',
}

const SERVICE_PRESETS = [
  { description: 'Plan Lanzamiento — Setup', price: 990 },
  { description: 'Plan Lanzamiento — Cuota mensual', price: 79 },
  { description: 'Plan Negocio — Setup', price: 2490 },
  { description: 'Plan Negocio — Cuota mensual', price: 149 },
  { description: 'Plan Empresa — Setup', price: 4990 },
  { description: 'Plan Empresa — Cuota mensual', price: 299 },
  { description: 'Landing page', price: 990 },
  { description: 'Web multipágina', price: 2490 },
  { description: 'Chatbot con IA', price: 600 },
  { description: 'SEO avanzado', price: 400 },
  { description: 'Analytics avanzado', price: 300 },
  { description: 'CMS personalizado', price: 500 },
  { description: 'Soporte multiidioma', price: 450 },
  { description: 'Integración IA avanzada', price: 1000 },
  { description: 'Integración WhatsApp', price: 300 },
  { description: 'Integración CRM', price: 400 },
  { description: '1 Automatización', price: 250 },
  { description: 'Pack 3 Automatizaciones', price: 600 },
  { description: 'Automatizaciones ilimitadas', price: 1200 },
]

type LineItem = { description: string; price: string }
type CustomBudget = {
  id: string; client_name: string; client_email: string; status: string;
  total: number; items: LineItem[]; notes: string; created_at: string;
}

const EMPTY_FORM = { clientName: '', clientEmail: '', notes: '', items: [{ description: '', price: '' }] as LineItem[] }

function getTotal(items: LineItem[]) {
  return items.reduce((s, i) => s + (parseFloat(i.price) || 0), 0)
}

function openPDF(budget: CustomBudget) {
  const rows = (budget.items || []).map(i => `
    <tr>
      <td style="padding:12px;border-bottom:1px solid #e2e8f0;font-size:14px;">${i.description}</td>
      <td style="padding:12px;border-bottom:1px solid #e2e8f0;font-size:14px;text-align:right;">${parseFloat(i.price).toFixed(2)} €</td>
    </tr>`).join('')
  const base = budget.total
  const iva = base * 0.21
  const total = base * 1.21
  const date = new Date(budget.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'long', year: 'numeric' })

  const html = `<!DOCTYPE html><html lang="es"><head><meta charset="UTF-8">
<title>Presupuesto — ${budget.client_name}</title>
<style>
  @media print { @page { margin: 30px; } body { -webkit-print-color-adjust: exact; print-color-adjust: exact; } }
  body { font-family: Arial, sans-serif; padding: 40px; color: #1e293b; max-width: 800px; margin: 0 auto; }
  .header { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 40px; }
  .logo { font-size: 26px; font-weight: 900; color: #10b981; }
  .logo span { color: #1e293b; }
  .badge { background: #10b981; color: white; padding: 6px 16px; border-radius: 6px; font-size: 13px; font-weight: 700; }
  .client-box { background: #f8fafc; border-radius: 10px; padding: 20px; margin-bottom: 30px; }
  .client-box h2 { margin: 0 0 4px; font-size: 20px; }
  .client-box p { margin: 2px 0; color: #475569; font-size: 14px; }
  table { width: 100%; border-collapse: collapse; margin-bottom: 0; }
  th { background: #0f172a; color: white; padding: 12px; text-align: left; font-size: 13px; }
  th:last-child { text-align: right; }
  .subtotal td { color: #475569; background: #f8fafc; padding: 10px 12px; font-size: 13px; }
  .subtotal td:last-child { text-align: right; }
  .total-row td { background: #f0fdf4; font-weight: 900; font-size: 18px; color: #10b981; padding: 14px 12px; border-top: 2px solid #10b981; }
  .total-row td:last-child { text-align: right; }
  .notes { background: #f8fafc; border-left: 4px solid #10b981; padding: 16px; border-radius: 4px; font-size: 13px; color: #64748b; margin-top: 24px; }
  .footer { margin-top: 60px; text-align: center; color: #94a3b8; font-size: 12px; border-top: 1px solid #e2e8f0; padding-top: 20px; }
  .print-btn { position: fixed; top: 20px; right: 20px; background: #10b981; color: white; border: none; padding: 10px 20px; border-radius: 8px; font-size: 14px; font-weight: 700; cursor: pointer; }
  @media print { .print-btn { display: none; } }
</style></head><body>
<button class="print-btn" onclick="window.print()">Imprimir / Guardar PDF</button>
<div class="header">
  <div>
    <div class="logo">Mindbridge <span>IA</span></div>
    <p style="color:#64748b;font-size:13px;margin-top:6px;">mindbride.net · juangutierrezdelaconcha@mindbride.net</p>
  </div>
  <div class="badge">PRESUPUESTO</div>
</div>
<div class="client-box">
  <h2>${budget.client_name}</h2>
  <p>${budget.client_email}</p>
  <p>Fecha: ${date}</p>
</div>
<table>
  <thead><tr><th>Descripción del servicio</th><th style="text-align:right">Importe</th></tr></thead>
  <tbody>
    ${rows}
    <tr class="subtotal"><td>Base imponible</td><td>${base.toFixed(2)} €</td></tr>
    <tr class="subtotal"><td>IVA (21%)</td><td>${iva.toFixed(2)} €</td></tr>
    <tr class="total-row"><td>TOTAL CON IVA</td><td>${total.toFixed(2)} €</td></tr>
  </tbody>
</table>
<div style="margin-top:30px;border:1px solid #e2e8f0;border-radius:10px;overflow:hidden;">
  <div style="background:#0f172a;padding:12px 16px;">
    <span style="color:white;font-size:13px;font-weight:700;letter-spacing:0.05em;text-transform:uppercase;">Condiciones de Pago</span>
  </div>
  <table style="width:100%;border-collapse:collapse;">
    <thead>
      <tr style="background:#f8fafc;">
        <th style="padding:10px 16px;text-align:left;font-size:12px;color:#64748b;font-weight:600;border-bottom:1px solid #e2e8f0;">Concepto</th>
        <th style="padding:10px 16px;text-align:right;font-size:12px;color:#64748b;font-weight:600;border-bottom:1px solid #e2e8f0;">Importe (IVA incl.)</th>
        <th style="padding:10px 16px;text-align:right;font-size:12px;color:#64748b;font-weight:600;border-bottom:1px solid #e2e8f0;">Vencimiento</th>
      </tr>
    </thead>
    <tbody>
      <tr>
        <td style="padding:12px 16px;font-size:13px;color:#1e293b;border-bottom:1px solid #e2e8f0;">Pago inicial (60%)</td>
        <td style="padding:12px 16px;font-size:14px;color:#10b981;font-weight:700;text-align:right;border-bottom:1px solid #e2e8f0;">${(total * 0.6).toFixed(2)} €</td>
        <td style="padding:12px 16px;font-size:13px;color:#475569;text-align:right;border-bottom:1px solid #e2e8f0;">Antes del inicio</td>
      </tr>
      <tr>
        <td style="padding:12px 16px;font-size:13px;color:#1e293b;">Pago final (40%)</td>
        <td style="padding:12px 16px;font-size:14px;color:#10b981;font-weight:700;text-align:right;">${(total * 0.4).toFixed(2)} €</td>
        <td style="padding:12px 16px;font-size:13px;color:#475569;text-align:right;">A la entrega del trabajo</td>
      </tr>
    </tbody>
  </table>
  <div style="padding:14px 16px;background:#f8fafc;border-top:1px solid #e2e8f0;font-size:11px;color:#94a3b8;line-height:1.7;">
    La aceptación de este presupuesto implica la aceptación de las presentes condiciones de pago. El pago inicial (60%) tiene carácter no reembolsable una vez iniciados los trabajos, constituyendo compensación por el tiempo reservado y los trabajos ya realizados. En caso de cancelación por parte del cliente tras el inicio del proyecto, dicho importe quedará retenido en su totalidad.
  </div>
</div>
${budget.notes ? `<div class="notes"><strong>Notas:</strong> ${budget.notes}</div>` : ''}
<div class="footer">Mindbridge IA · NIF: 72173348S · C/ Daoiz y Velarde 23 5ºC, 39003 Santander<br/>Este presupuesto tiene una validez de 30 días desde su emisión.</div>
</body></html>`

  const win = window.open('', '_blank')
  if (win) { win.document.write(html); win.document.close() }
}

function budgetEmailBody(budget: CustomBudget) {
  const base = budget.total
  const iva = (base * 0.21).toFixed(2)
  const total = (base * 1.21).toFixed(2)
  const lines = (budget.items || []).map(i => `• ${i.description}: ${parseFloat(i.price).toFixed(2)} €`).join('\n')
  const pago60 = (base * 1.21 * 0.6).toFixed(2)
  const pago40 = (base * 1.21 * 0.4).toFixed(2)
  return `Te adjunto el presupuesto personalizado que hemos preparado para ti:\n\n${lines}\n\nBase imponible: ${base.toFixed(2)} €\nIVA (21%): ${iva} €\nTOTAL: ${total} €\n\n— CONDICIONES DE PAGO —\n• Pago inicial (60%): ${pago60} € — antes del inicio de los trabajos\n• Pago final (40%): ${pago40} € — a la entrega del trabajo\n\nEl pago inicial tiene carácter no reembolsable una vez iniciados los trabajos. En caso de cancelación tras el inicio del proyecto, dicho importe quedará retenido en su totalidad.\n\n${budget.notes ? `Notas: ${budget.notes}\n\n` : ''}Este presupuesto tiene una validez de 30 días. Si tienes cualquier duda o quieres ajustar algo, escríbeme y lo vemos.\n\nUn saludo,`
}

// ── Componente principal ────────────────────────────────────────────────────

export default function BudgetsPage() {
  const [tab, setTab] = useState<'requests' | 'budgets'>('requests')

  // Solicitudes
  const [requests, setRequests] = useState<any[]>([])
  const [reqLoading, setReqLoading] = useState(true)
  const [reqExpanded, setReqExpanded] = useState<string | null>(null)

  // Presupuestos definitivos
  const [budgets, setBudgets] = useState<CustomBudget[]>([])
  const [budLoading, setBudLoading] = useState(true)
  const [budExpanded, setBudExpanded] = useState<string | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [form, setForm] = useState(EMPTY_FORM)
  const [saving, setSaving] = useState(false)

  useEffect(() => { loadRequests(); loadBudgets() }, [])

  async function loadRequests() {
    const { data } = await supabase.from('budget_requests').select('*').order('created_at', { ascending: false })
    setRequests(data || [])
    setReqLoading(false)
  }

  async function loadBudgets() {
    const { data } = await supabase.from('custom_budgets').select('*').order('created_at', { ascending: false })
    setBudgets(data || [])
    setBudLoading(false)
  }

  async function updateReqStatus(id: string, status: string) {
    await supabase.from('budget_requests').update({ status }).eq('id', id)
    setRequests(prev => prev.map(r => r.id === id ? { ...r, status } : r))
  }

  async function updateBudStatus(id: string, status: string) {
    await supabase.from('custom_budgets').update({ status }).eq('id', id)
    setBudgets(prev => prev.map(b => b.id === id ? { ...b, status } : b))
  }

  async function deleteBudget(id: string) {
    if (!confirm('¿Borrar este presupuesto?')) return
    await supabase.from('custom_budgets').delete().eq('id', id)
    setBudgets(prev => prev.filter(b => b.id !== id))
  }

  function updateItem(index: number, field: keyof LineItem, value: string) {
    const updated = [...form.items]
    updated[index] = { ...updated[index], [field]: value }
    setForm(f => ({ ...f, items: updated }))
  }

  function addItem() {
    setForm(f => ({ ...f, items: [...f.items, { description: '', price: '' }] }))
  }

  function removeItem(index: number) {
    setForm(f => ({ ...f, items: f.items.filter((_, i) => i !== index) }))
  }

  function addPreset(p: { description: string; price: number }) {
    setForm(f => ({
      ...f,
      items: [...f.items.filter(i => i.description !== ''), { description: p.description, price: String(p.price) }]
    }))
  }

  function prefillFromRequest(req: any) {
    setForm({ clientName: req.name || '', clientEmail: req.email || '', notes: req.additional_info || '', items: [{ description: '', price: '' }] })
    setTab('budgets')
    setShowForm(true)
  }

  async function saveBudget() {
    if (!form.clientName || !form.clientEmail) return alert('Nombre y email obligatorios')
    const validItems = form.items.filter(i => i.description)
    if (validItems.length === 0) return alert('Añade al menos un servicio')
    setSaving(true)
    const { error } = await supabase.from('custom_budgets').insert({
      client_name: form.clientName,
      client_email: form.clientEmail,
      notes: form.notes,
      items: validItems,
      total: getTotal(validItems),
      status: 'draft',
    })
    if (error) { alert(error.message) }
    else { setShowForm(false); setForm(EMPTY_FORM); loadBudgets() }
    setSaving(false)
  }

  const total = getTotal(form.items)

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 px-6 py-4 flex items-center gap-4">
        <Link href="/admin" className="text-slate-500 hover:text-slate-900 text-sm">← Volver</Link>
        <h1 className="text-lg font-bold">Presupuestos</h1>
      </header>

      {/* Tabs */}
      <div className="px-6 pt-4 flex gap-2 max-w-5xl mx-auto">
        <button
          onClick={() => setTab('requests')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${tab === 'requests' ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 hover:text-slate-900'}`}
        >
          Solicitudes recibidas
          {requests.filter(r => r.status === 'pending').length > 0 && (
            <span className="ml-2 bg-yellow-400 text-slate-900 text-xs px-1.5 py-0.5 rounded-full font-bold">
              {requests.filter(r => r.status === 'pending').length}
            </span>
          )}
        </button>
        <button
          onClick={() => setTab('budgets')}
          className={`px-4 py-2 rounded-xl text-sm font-semibold transition-colors ${tab === 'budgets' ? 'bg-slate-900 text-white' : 'bg-white text-slate-500 hover:text-slate-900'}`}
        >
          Presupuestos definitivos
          <span className="ml-2 text-xs text-slate-400 font-normal">{budgets.length}</span>
        </button>
      </div>

      <div className="p-6 max-w-5xl mx-auto space-y-3">

        {/* ── SOLICITUDES ── */}
        {tab === 'requests' && (
          reqLoading ? <p className="text-slate-500">Cargando...</p>
          : requests.length === 0 ? <p className="text-slate-500">No hay solicitudes todavía.</p>
          : requests.map(req => (
            <div key={req.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
              <div
                className="p-5 flex flex-col sm:flex-row sm:items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors"
                onClick={() => setReqExpanded(reqExpanded === req.id ? null : req.id)}
              >
                <div className="flex-1">
                  <p className="font-semibold text-slate-900">{req.name}</p>
                  <p className="text-sm text-slate-500">{req.email}</p>
                  {req.company && <p className="text-sm text-slate-400">{req.company}</p>}
                  <p className="text-xs text-slate-400 mt-1">
                    {req.project_type && `${req.project_type} · `}
                    {req.budget_range && `Presupuesto: ${req.budget_range} · `}
                    {new Date(req.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                  </p>
                </div>
                <div className="flex items-center gap-2 flex-shrink-0">
                  <span className={`text-xs px-3 py-1 rounded-full font-medium ${REQ_STATUS_COLORS[req.status] || 'bg-slate-200 text-slate-500'}`}>
                    {REQ_STATUS_LABELS[req.status] || req.status}
                  </span>
                  <select
                    value={req.status}
                    onChange={e => { e.stopPropagation(); updateReqStatus(req.id, e.target.value) }}
                    onClick={e => e.stopPropagation()}
                    className="text-xs bg-slate-100 border border-slate-300 text-slate-600 rounded-lg px-2 py-1 focus:outline-none"
                  >
                    {Object.entries(REQ_STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                  </select>
                </div>
              </div>

              {reqExpanded === req.id && (
                <div className="px-5 pb-5 border-t border-slate-200 pt-4 space-y-4 text-sm">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-slate-400 text-xs mb-1">Tipo de proyecto</p>
                      <p className="text-slate-700">{req.project_type || '—'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs mb-1">Plazo</p>
                      <p className="text-slate-700">{req.timeline || '—'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs mb-1">Presupuesto estimado</p>
                      <p className="text-slate-700">{req.budget_range || '—'}</p>
                    </div>
                    <div>
                      <p className="text-slate-400 text-xs mb-1">Teléfono</p>
                      <p className="text-slate-700">{req.phone || '—'}</p>
                    </div>
                    {req.additional_info && (
                      <div className="col-span-2">
                        <p className="text-slate-400 text-xs mb-1">Info adicional</p>
                        <p className="text-slate-700 whitespace-pre-wrap">{req.additional_info}</p>
                      </div>
                    )}
                  </div>
                  <div className="flex gap-3 pt-1">
                    <button
                      onClick={() => prefillFromRequest(req)}
                      className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-colors"
                    >
                      Crear presupuesto definitivo →
                    </button>
                  </div>
                  <div>
                    <p className="text-xs text-slate-400 mb-2">Responder directamente</p>
                    <ReplyForm to={req.email} name={req.name} defaultSubject="Presupuesto Mindbridge IA" />
                  </div>
                </div>
              )}
            </div>
          ))
        )}

        {/* ── PRESUPUESTOS DEFINITIVOS ── */}
        {tab === 'budgets' && (
          <>
            <button
              onClick={() => setShowForm(!showForm)}
              className="w-full py-3 rounded-xl border-2 border-dashed border-slate-300 text-slate-500 hover:border-emerald-500 hover:text-emerald-600 text-sm font-semibold transition-colors"
            >
              + Nuevo presupuesto
            </button>

            {/* Formulario de creación */}
            {showForm && (
              <div className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
                <h2 className="font-bold text-slate-900">Nuevo presupuesto definitivo</h2>

                {/* Cliente */}
                <div className="grid grid-cols-2 gap-3">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Nombre del cliente</label>
                    <input
                      value={form.clientName}
                      onChange={e => setForm(f => ({ ...f, clientName: e.target.value }))}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                      placeholder="Juan García"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block">Email del cliente</label>
                    <input
                      value={form.clientEmail}
                      onChange={e => setForm(f => ({ ...f, clientEmail: e.target.value }))}
                      className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                      placeholder="cliente@email.com"
                      type="email"
                    />
                  </div>
                </div>

                {/* Presets */}
                <div>
                  <p className="text-xs text-slate-400 mb-2">Servicios rápidos — clic para añadir</p>
                  <div className="flex flex-wrap gap-2">
                    {SERVICE_PRESETS.map((p, i) => (
                      <button
                        key={i}
                        onClick={() => addPreset(p)}
                        className="px-3 py-1.5 bg-slate-100 hover:bg-emerald-50 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 rounded-lg text-xs font-medium transition-colors"
                      >
                        {p.description} — <span className="font-bold">{p.price} €</span>
                      </button>
                    ))}
                  </div>
                </div>

                {/* Líneas */}
                <div>
                  <p className="text-xs text-slate-400 mb-2">Líneas del presupuesto</p>
                  <div className="space-y-2">
                    {form.items.map((item, i) => (
                      <div key={i} className="flex gap-2 items-center">
                        <input
                          value={item.description}
                          onChange={e => updateItem(i, 'description', e.target.value)}
                          className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                          placeholder="Descripción del servicio"
                        />
                        <input
                          value={item.price}
                          onChange={e => updateItem(i, 'price', e.target.value)}
                          className="w-24 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500"
                          placeholder="€"
                          type="number"
                        />
                        {form.items.length > 1 && (
                          <button onClick={() => removeItem(i)} className="text-red-400 hover:text-red-600 px-1 text-lg leading-none">×</button>
                        )}
                      </div>
                    ))}
                  </div>
                  <button onClick={addItem} className="mt-2 text-sm text-emerald-600 hover:text-emerald-500 font-medium">+ Añadir línea</button>
                </div>

                {/* Totales */}
                <div className="bg-slate-50 border border-slate-200 rounded-xl p-4 space-y-1 text-sm">
                  <div className="flex justify-between text-slate-500">
                    <span>Base imponible</span><span>{total.toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between text-slate-500">
                    <span>IVA (21%)</span><span>{(total * 0.21).toFixed(2)} €</span>
                  </div>
                  <div className="flex justify-between font-bold text-emerald-600 text-base border-t border-slate-200 pt-2 mt-2">
                    <span>TOTAL</span><span>{(total * 1.21).toFixed(2)} €</span>
                  </div>
                </div>

                {/* Notas */}
                <div>
                  <label className="text-xs text-slate-400 mb-1 block">Notas (opcional)</label>
                  <textarea
                    value={form.notes}
                    onChange={e => setForm(f => ({ ...f, notes: e.target.value }))}
                    className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:border-emerald-500 resize-none"
                    rows={3}
                    placeholder="Condiciones, plazos, observaciones..."
                  />
                </div>

                <div className="flex gap-3">
                  <button
                    onClick={saveBudget}
                    disabled={saving}
                    className="px-5 py-2.5 bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-colors"
                  >
                    {saving ? 'Guardando...' : 'Guardar presupuesto'}
                  </button>
                  <button
                    onClick={() => { setShowForm(false); setForm(EMPTY_FORM) }}
                    className="px-5 py-2.5 bg-slate-100 hover:bg-slate-200 text-slate-600 text-sm font-semibold rounded-xl transition-colors"
                  >
                    Cancelar
                  </button>
                </div>
              </div>
            )}

            {/* Lista de presupuestos definitivos */}
            {budLoading ? <p className="text-slate-500">Cargando...</p>
            : budgets.length === 0 ? <p className="text-slate-500">No hay presupuestos definitivos todavía.</p>
            : budgets.map(bud => (
              <div key={bud.id} className="bg-white border border-slate-200 rounded-xl overflow-hidden">
                <div
                  className="p-5 flex flex-col sm:flex-row sm:items-center gap-3 cursor-pointer hover:bg-slate-50 transition-colors"
                  onClick={() => setBudExpanded(budExpanded === bud.id ? null : bud.id)}
                >
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">{bud.client_name}</p>
                    <p className="text-sm text-slate-500">{bud.client_email}</p>
                    <p className="text-xs text-slate-400 mt-1">
                      {new Date(bud.created_at).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                    </p>
                  </div>
                  <div className="flex items-center gap-3 flex-shrink-0">
                    <p className="text-lg font-bold text-emerald-600">{(bud.total * 1.21).toFixed(0)} €</p>
                    <span className={`text-xs px-3 py-1 rounded-full font-medium ${BUD_STATUS_COLORS[bud.status] || 'bg-slate-200 text-slate-500'}`}>
                      {BUD_STATUS_LABELS[bud.status] || bud.status}
                    </span>
                    <select
                      value={bud.status}
                      onChange={e => { e.stopPropagation(); updateBudStatus(bud.id, e.target.value) }}
                      onClick={e => e.stopPropagation()}
                      className="text-xs bg-slate-100 border border-slate-300 text-slate-600 rounded-lg px-2 py-1 focus:outline-none"
                    >
                      {Object.entries(BUD_STATUS_LABELS).map(([v, l]) => <option key={v} value={v}>{l}</option>)}
                    </select>
                  </div>
                </div>

                {budExpanded === bud.id && (
                  <div className="px-5 pb-5 border-t border-slate-200 pt-4 space-y-4">
                    {/* Líneas */}
                    <div className="space-y-1">
                      {(bud.items || []).map((line, i) => (
                        <div key={i} className="flex justify-between text-sm">
                          <span className="text-slate-600">{line.description}</span>
                          <span className="font-medium text-slate-800">{parseFloat(line.price).toFixed(2)} €</span>
                        </div>
                      ))}
                      <div className="border-t border-slate-200 pt-2 mt-2 space-y-1 text-sm">
                        <div className="flex justify-between text-slate-400">
                          <span>Base</span><span>{bud.total.toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between text-slate-400">
                          <span>IVA 21%</span><span>{(bud.total * 0.21).toFixed(2)} €</span>
                        </div>
                        <div className="flex justify-between font-bold text-emerald-600">
                          <span>TOTAL</span><span>{(bud.total * 1.21).toFixed(2)} €</span>
                        </div>
                      </div>
                    </div>
                    {bud.notes && (
                      <p className="text-sm text-slate-500 bg-slate-50 rounded-lg p-3 border-l-4 border-emerald-400">{bud.notes}</p>
                    )}
                    {/* Acciones */}
                    <div className="flex flex-wrap gap-3 pt-1">
                      <button
                        onClick={() => openPDF(bud)}
                        className="px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white text-sm font-semibold rounded-xl transition-colors"
                      >
                        Ver / Imprimir PDF
                      </button>
                      <button
                        onClick={() => deleteBudget(bud.id)}
                        className="px-4 py-2 bg-red-50 hover:bg-red-100 text-red-500 text-sm font-semibold rounded-xl transition-colors"
                      >
                        Borrar
                      </button>
                    </div>
                    <div>
                      <p className="text-xs text-slate-400 mb-2">Enviar presupuesto por email</p>
                      <ReplyForm
                        to={bud.client_email}
                        name={bud.client_name}
                        defaultSubject={`Presupuesto Mindbridge IA — ${(bud.total * 1.21).toFixed(0)} € con IVA`}
                        defaultBody={budgetEmailBody(bud)}
                      />
                    </div>
                  </div>
                )}
              </div>
            ))}
          </>
        )}
      </div>
    </div>
  )
}
