'use client'

import { useState, useEffect, useCallback } from 'react'
import { getSupabaseClient } from '@/lib/supabaseAdmin'
import { Plus, Printer, ArrowLeft, Trash2, CheckCircle, Circle, FileText } from 'lucide-react'

const supabase = getSupabaseClient()

/* ─── EMISOR (datos fijos) ─────────────────────────────────── */
const EMISOR = {
  nombre: 'Juan Gutiérrez de la Concha de la Cuesta',
  nif: '72173348S',
  web: 'mindbride.net',
  email: 'juangutierrezdelaconcha@mindbride.net',
  iban: 'ES57 1576 1212 1010 1070 3674',
  bizum: '+34 605 190 561',
}

/* ─── TIPOS ────────────────────────────────────────────────── */
interface Concepto {
  descripcion: string
  cantidad: number
  precio: number
}

interface Pago {
  fecha: string
  importe: number
  pagado: boolean
}

interface Factura {
  id: string
  numero: string
  fecha: string
  tipo_cliente: 'particular' | 'empresa'
  cliente_nombre: string
  cliente_nif: string
  cliente_contacto: string
  cliente_direccion: string
  cliente_email: string
  conceptos: Concepto[]
  base_imponible: number
  iva_porcentaje: number
  iva_importe: number
  total: number
  fraccionamiento: number
  pagos: Pago[]
  notas: string
  created_at: string
}

type Vista = 'lista' | 'form' | 'preview'

/* ─── HELPERS ──────────────────────────────────────────────── */
const eur = (n: number) =>
  n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })

function addDays(dateStr: string, days: number) {
  const d = new Date(dateStr)
  d.setDate(d.getDate() + days)
  return d.toISOString().split('T')[0]
}

function calcPagos(total: number, fracc: number, fechaBase: string): Pago[] {
  if (fracc === 1) return [{ fecha: fechaBase, importe: total, pagado: false }]
  if (fracc === 2) {
    const m = Math.round(total * 50) / 100
    return [
      { fecha: fechaBase, importe: m, pagado: false },
      { fecha: addDays(fechaBase, 30), importe: +(total - m).toFixed(2), pagado: false },
    ]
  }
  const t = Math.round((total / 3) * 100) / 100
  return [
    { fecha: fechaBase, importe: t, pagado: false },
    { fecha: addDays(fechaBase, 30), importe: t, pagado: false },
    { fecha: addDays(fechaBase, 60), importe: +(total - t * 2).toFixed(2), pagado: false },
  ]
}

function estadoPagos(pagos: Pago[]) {
  const pagados = pagos.filter(p => p.pagado).length
  if (pagados === pagos.length) return { label: 'Pagada', color: 'text-emerald-600 bg-emerald-50' }
  if (pagados > 0) return { label: 'Parcial', color: 'text-yellow-600 bg-yellow-50' }
  return { label: 'Pendiente', color: 'text-red-600 bg-red-50' }
}

const today = () => new Date().toISOString().split('T')[0]

const emptyForm = {
  fecha: today(),
  tipo_cliente: 'particular' as 'particular' | 'empresa',
  cliente_nombre: '',
  cliente_nif: '',
  cliente_contacto: '',
  cliente_direccion: '',
  cliente_email: '',
  conceptos: [{ descripcion: '', cantidad: 1, precio: 0 }] as Concepto[],
  iva_porcentaje: 21,
  fraccionamiento: 1,
  notas: '',
}

/* ─── COMPONENTE PRINCIPAL ─────────────────────────────────── */
export default function FacturasPage() {
  const [vista, setVista] = useState<Vista>('lista')
  const [facturas, setFacturas] = useState<Factura[]>([])
  const [seleccionada, setSeleccionada] = useState<Factura | null>(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [guardando, setGuardando] = useState(false)

  const cargarFacturas = useCallback(async () => {
    const { data } = await supabase
      .from('facturas')
      .select('*')
      .order('created_at', { ascending: false })
    if (data) setFacturas(data as Factura[])
  }, [])

  useEffect(() => { cargarFacturas() }, [cargarFacturas])

  /* — Totales calculados — */
  const base = +form.conceptos
    .reduce((s, c) => s + c.cantidad * c.precio, 0)
    .toFixed(2)
  const ivaImporte = +(base * form.iva_porcentaje / 100).toFixed(2)
  const total = +(base + ivaImporte).toFixed(2)

  /* — Guardar factura — */
  async function guardar() {
    if (!form.cliente_nombre || base === 0) return
    setGuardando(true)
    const numero = `MB-${new Date().getFullYear()}-${String(facturas.length + 1).padStart(3, '0')}`
    const pagos = calcPagos(total, form.fraccionamiento, form.fecha)
    const { data, error } = await supabase.from('facturas').insert({
      numero,
      fecha: form.fecha,
      tipo_cliente: form.tipo_cliente,
      cliente_nombre: form.cliente_nombre,
      cliente_nif: form.cliente_nif,
      cliente_contacto: form.cliente_contacto,
      cliente_direccion: form.cliente_direccion,
      cliente_email: form.cliente_email,
      conceptos: form.conceptos,
      base_imponible: base,
      iva_porcentaje: form.iva_porcentaje,
      iva_importe: ivaImporte,
      total,
      fraccionamiento: form.fraccionamiento,
      pagos,
      notas: form.notas,
    }).select().single()
    setGuardando(false)
    if (!error && data) {
      await cargarFacturas()
      setSeleccionada(data as Factura)
      setVista('preview')
      setForm({ ...emptyForm })
    }
  }

  /* — Marcar pago — */
  async function togglePago(factura: Factura, idx: number) {
    const pagos = factura.pagos.map((p, i) =>
      i === idx ? { ...p, pagado: !p.pagado } : p
    )
    await supabase.from('facturas').update({ pagos }).eq('id', factura.id)
    const updated = { ...factura, pagos }
    setFacturas(prev => prev.map(f => f.id === factura.id ? updated : f))
    if (seleccionada?.id === factura.id) setSeleccionada(updated)
  }

  /* — Eliminar factura — */
  async function eliminar(id: string) {
    if (!confirm('¿Eliminar esta factura?')) return
    await supabase.from('facturas').delete().eq('id', id)
    await cargarFacturas()
    if (seleccionada?.id === id) { setSeleccionada(null); setVista('lista') }
  }

  /* ── VISTA: LISTA ── */
  if (vista === 'lista') return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-xl font-bold text-slate-900">Facturas</h1>
            <p className="text-sm text-slate-500">Mindbridge IA · {EMISOR.nif}</p>
          </div>
          <button
            onClick={() => { setForm({ ...emptyForm, fecha: today() }); setVista('form') }}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
          >
            <Plus size={16} /> Nueva factura
          </button>
        </div>

        {facturas.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
            <FileText size={40} className="mx-auto text-slate-300 mb-3" />
            <p className="text-slate-400 text-sm">No hay facturas todavía</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Nº</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Fecha</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Cliente</th>
                  <th className="text-right px-4 py-3 font-medium text-slate-600">Total</th>
                  <th className="text-left px-4 py-3 font-medium text-slate-600">Estado</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {facturas.map(f => {
                  const estado = estadoPagos(f.pagos)
                  return (
                    <tr key={f.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-4 py-3 font-mono text-xs text-slate-500">{f.numero}</td>
                      <td className="px-4 py-3 text-slate-600">{f.fecha}</td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-slate-800">{f.cliente_nombre}</p>
                        {f.tipo_cliente === 'empresa' && f.cliente_contacto && (
                          <p className="text-xs text-slate-400">{f.cliente_contacto}</p>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-semibold text-slate-800">{eur(f.total)}</td>
                      <td className="px-4 py-3">
                        <span className={`text-xs font-medium px-2 py-1 rounded-full ${estado.color}`}>
                          {estado.label}
                        </span>
                      </td>
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2 justify-end">
                          <button
                            onClick={() => { setSeleccionada(f); setVista('preview') }}
                            className="text-xs text-slate-500 hover:text-emerald-600 transition-colors px-2 py-1"
                          >
                            Ver
                          </button>
                          <button
                            onClick={() => eliminar(f.id)}
                            className="text-xs text-slate-300 hover:text-red-500 transition-colors px-2 py-1"
                          >
                            <Trash2 size={14} />
                          </button>
                        </div>
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  )

  /* ── VISTA: FORMULARIO ── */
  if (vista === 'form') return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => setVista('lista')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors">
          <ArrowLeft size={16} /> Volver a facturas
        </button>
        <h1 className="text-xl font-bold text-slate-900 mb-6">Nueva factura</h1>

        <div className="space-y-6">

          {/* Cabecera */}
          <Section title="Datos de la factura">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Fecha</label>
                <input type="date" className="input" value={form.fecha}
                  onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} />
              </div>
              <div>
                <label className="label">IVA</label>
                <select className="input" value={form.iva_porcentaje}
                  onChange={e => setForm(f => ({ ...f, iva_porcentaje: +e.target.value }))}>
                  <option value={0}>0% (exento)</option>
                  <option value={4}>4%</option>
                  <option value={10}>10%</option>
                  <option value={21}>21%</option>
                </select>
              </div>
            </div>
          </Section>

          {/* Tipo de cliente */}
          <Section title="Datos del cliente">
            <div className="flex gap-3 mb-4">
              {(['particular', 'empresa'] as const).map(tipo => (
                <button key={tipo} onClick={() => setForm(f => ({ ...f, tipo_cliente: tipo }))}
                  className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-colors capitalize
                    ${form.tipo_cliente === tipo
                      ? 'bg-emerald-500 text-white border-emerald-500'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'}`}>
                  {tipo === 'particular' ? 'Particular' : 'Empresa'}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="label">
                  {form.tipo_cliente === 'empresa' ? 'Razón social' : 'Nombre completo'}
                </label>
                <input className="input" placeholder={form.tipo_cliente === 'empresa' ? 'Acme S.L.' : 'María García López'}
                  value={form.cliente_nombre}
                  onChange={e => setForm(f => ({ ...f, cliente_nombre: e.target.value }))} />
              </div>

              {form.tipo_cliente === 'empresa' && (
                <div className="sm:col-span-2">
                  <label className="label">Persona de contacto</label>
                  <input className="input" placeholder="Nombre del contacto"
                    value={form.cliente_contacto}
                    onChange={e => setForm(f => ({ ...f, cliente_contacto: e.target.value }))} />
                </div>
              )}

              <div>
                <label className="label">{form.tipo_cliente === 'empresa' ? 'CIF' : 'NIF / DNI'}</label>
                <input className="input" placeholder={form.tipo_cliente === 'empresa' ? 'B12345678' : '12345678A'}
                  value={form.cliente_nif}
                  onChange={e => setForm(f => ({ ...f, cliente_nif: e.target.value }))} />
              </div>

              <div>
                <label className="label">Email</label>
                <input type="email" className="input" placeholder="email@empresa.com"
                  value={form.cliente_email}
                  onChange={e => setForm(f => ({ ...f, cliente_email: e.target.value }))} />
              </div>

              <div className="sm:col-span-2">
                <label className="label">Dirección fiscal</label>
                <input className="input" placeholder="Calle, número, ciudad, CP"
                  value={form.cliente_direccion}
                  onChange={e => setForm(f => ({ ...f, cliente_direccion: e.target.value }))} />
              </div>
            </div>
          </Section>

          {/* Conceptos */}
          <Section title="Conceptos">
            <div className="space-y-2">
              {form.conceptos.map((c, i) => (
                <div key={i} className="grid grid-cols-12 gap-2 items-start">
                  <div className="col-span-6">
                    {i === 0 && <label className="label">Descripción</label>}
                    <input className="input" placeholder="Servicio o producto"
                      value={c.descripcion}
                      onChange={e => {
                        const conceptos = [...form.conceptos]
                        conceptos[i] = { ...c, descripcion: e.target.value }
                        setForm(f => ({ ...f, conceptos }))
                      }} />
                  </div>
                  <div className="col-span-2">
                    {i === 0 && <label className="label">Uds.</label>}
                    <input type="number" min={1} className="input text-right" value={c.cantidad}
                      onChange={e => {
                        const conceptos = [...form.conceptos]
                        conceptos[i] = { ...c, cantidad: +e.target.value }
                        setForm(f => ({ ...f, conceptos }))
                      }} />
                  </div>
                  <div className="col-span-3">
                    {i === 0 && <label className="label">Precio/ud. (€)</label>}
                    <input type="number" min={0} step={0.01} className="input text-right" value={c.precio}
                      onChange={e => {
                        const conceptos = [...form.conceptos]
                        conceptos[i] = { ...c, precio: +e.target.value }
                        setForm(f => ({ ...f, conceptos }))
                      }} />
                  </div>
                  <div className="col-span-1 flex items-end justify-center pb-1">
                    {i === 0 && <div className="h-5" />}
                    <button onClick={() => {
                      const conceptos = form.conceptos.filter((_, j) => j !== i)
                      if (conceptos.length === 0) return
                      setForm(f => ({ ...f, conceptos }))
                    }} className="text-slate-300 hover:text-red-400 transition-colors mt-1">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>
            <button onClick={() => setForm(f => ({ ...f, conceptos: [...f.conceptos, { descripcion: '', cantidad: 1, precio: 0 }] }))}
              className="mt-3 text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors">
              <Plus size={14} /> Añadir línea
            </button>

            {/* Totales */}
            <div className="mt-4 border-t border-slate-100 pt-4 space-y-1 text-sm">
              <div className="flex justify-between text-slate-600">
                <span>Base imponible</span><span>{eur(base)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>IVA ({form.iva_porcentaje}%)</span><span>{eur(ivaImporte)}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 text-base pt-1 border-t border-slate-200">
                <span>Total</span><span>{eur(total)}</span>
              </div>
            </div>
          </Section>

          {/* Fraccionamiento */}
          <Section title="Forma de pago">
            <div className="grid grid-cols-3 gap-3 mb-4">
              {[1, 2, 3].map(n => (
                <button key={n} onClick={() => setForm(f => ({ ...f, fraccionamiento: n }))}
                  className={`py-3 rounded-lg text-sm font-medium border transition-colors
                    ${form.fraccionamiento === n
                      ? 'bg-emerald-500 text-white border-emerald-500'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'}`}>
                  {n === 1 ? 'Pago único' : `${n} plazos`}
                </button>
              ))}
            </div>

            {total > 0 && (
              <div className="bg-slate-50 rounded-lg p-3 space-y-2">
                {calcPagos(total, form.fraccionamiento, form.fecha).map((p, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-slate-500">
                      {form.fraccionamiento === 1 ? 'Al firmar' : `Plazo ${i + 1} · ${p.fecha}`}
                    </span>
                    <span className="font-medium text-slate-800">{eur(p.importe)}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="mt-3 p-3 bg-slate-50 rounded-lg text-xs text-slate-500 space-y-1">
              <p><span className="font-medium">Transferencia:</span> {EMISOR.iban}</p>
              <p><span className="font-medium">Bizum:</span> {EMISOR.bizum}</p>
            </div>
          </Section>

          {/* Notas */}
          <Section title="Notas (opcional)">
            <textarea className="input resize-none h-20" placeholder="Condiciones, observaciones..."
              value={form.notas}
              onChange={e => setForm(f => ({ ...f, notas: e.target.value }))} />
          </Section>

          {/* Acciones */}
          <div className="flex gap-3 pb-10">
            <button onClick={() => setVista('lista')}
              className="flex-1 py-2 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
              Cancelar
            </button>
            <button onClick={guardar} disabled={guardando || !form.cliente_nombre || base === 0}
              className="flex-1 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 text-white text-sm font-semibold rounded-lg transition-colors">
              {guardando ? 'Guardando...' : 'Guardar factura'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  /* ── VISTA: PREVIEW / IMPRESIÓN ── */
  const f = seleccionada!
  return (
    <div className="min-h-screen bg-slate-100 print:bg-white">
      {/* Barra acciones (oculta al imprimir) */}
      <div className="print:hidden flex items-center justify-between px-6 py-3 bg-white border-b border-slate-200">
        <button onClick={() => setVista('lista')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft size={16} /> Volver
        </button>
        <button onClick={() => window.print()} className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors">
          <Printer size={16} /> Imprimir / PDF
        </button>
      </div>

      {/* Documento */}
      <div className="max-w-3xl mx-auto my-8 print:my-0 bg-white rounded-xl print:rounded-none shadow-sm print:shadow-none border border-slate-200 print:border-0 p-10">

        {/* Cabecera */}
        <div className="flex justify-between items-start mb-10">
          <div>
            <h1 className="text-2xl font-bold text-slate-900">FACTURA</h1>
            <p className="text-emerald-600 font-mono font-semibold mt-1">{f.numero}</p>
            <p className="text-sm text-slate-400 mt-1">Fecha: {f.fecha}</p>
          </div>
          <div className="text-right text-sm text-slate-600">
            <p className="font-bold text-slate-900">{EMISOR.nombre}</p>
            <p>NIF: {EMISOR.nif}</p>
            <p>{EMISOR.web}</p>
            <p>{EMISOR.email}</p>
          </div>
        </div>

        {/* Emisor → Cliente */}
        <div className="bg-slate-50 rounded-lg p-5 mb-8">
          <p className="text-xs text-slate-400 uppercase tracking-wide mb-2">Facturado a</p>
          <p className="font-bold text-slate-900">{f.cliente_nombre}</p>
          {f.tipo_cliente === 'empresa' && f.cliente_contacto && (
            <p className="text-sm text-slate-500">Attn: {f.cliente_contacto}</p>
          )}
          {f.cliente_nif && <p className="text-sm text-slate-600">{f.tipo_cliente === 'empresa' ? 'CIF' : 'NIF'}: {f.cliente_nif}</p>}
          {f.cliente_direccion && <p className="text-sm text-slate-600">{f.cliente_direccion}</p>}
          {f.cliente_email && <p className="text-sm text-slate-600">{f.cliente_email}</p>}
        </div>

        {/* Conceptos */}
        <table className="w-full text-sm mb-6">
          <thead>
            <tr className="border-b-2 border-slate-200">
              <th className="text-left py-2 text-slate-600 font-medium">Concepto</th>
              <th className="text-right py-2 text-slate-600 font-medium w-16">Uds.</th>
              <th className="text-right py-2 text-slate-600 font-medium w-28">Precio/ud.</th>
              <th className="text-right py-2 text-slate-600 font-medium w-28">Importe</th>
            </tr>
          </thead>
          <tbody>
            {f.conceptos.map((c, i) => (
              <tr key={i} className="border-b border-slate-100">
                <td className="py-3 text-slate-800">{c.descripcion}</td>
                <td className="py-3 text-right text-slate-600">{c.cantidad}</td>
                <td className="py-3 text-right text-slate-600">{eur(c.precio)}</td>
                <td className="py-3 text-right font-medium text-slate-800">{eur(c.cantidad * c.precio)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Totales */}
        <div className="flex justify-end mb-8">
          <div className="w-64 space-y-1 text-sm">
            <div className="flex justify-between text-slate-600">
              <span>Base imponible</span><span>{eur(f.base_imponible)}</span>
            </div>
            <div className="flex justify-between text-slate-600">
              <span>IVA ({f.iva_porcentaje}%)</span><span>{eur(f.iva_importe)}</span>
            </div>
            <div className="flex justify-between font-bold text-slate-900 text-base pt-2 border-t border-slate-300">
              <span>Total</span><span>{eur(f.total)}</span>
            </div>
          </div>
        </div>

        {/* Pagos */}
        <div className="border border-slate-200 rounded-lg overflow-hidden mb-8">
          <div className="bg-slate-50 px-4 py-2 border-b border-slate-200">
            <p className="text-xs font-semibold text-slate-600 uppercase tracking-wide">
              {f.fraccionamiento === 1 ? 'Forma de pago' : `Fraccionado en ${f.fraccionamiento} plazos`}
            </p>
          </div>
          <div className="divide-y divide-slate-100">
            {f.pagos.map((p, i) => (
              <div key={i} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <button onClick={() => togglePago(f, i)} className="print:hidden text-slate-400 hover:text-emerald-500 transition-colors">
                    {p.pagado ? <CheckCircle size={18} className="text-emerald-500" /> : <Circle size={18} />}
                  </button>
                  <div className="print:hidden w-0" />
                  <div>
                    <p className="text-sm text-slate-700 font-medium">
                      {f.fraccionamiento === 1 ? 'Pago único' : `Plazo ${i + 1}`}
                    </p>
                    <p className="text-xs text-slate-400">{p.fecha}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-slate-800">{eur(p.importe)}</p>
                  <p className={`text-xs ${p.pagado ? 'text-emerald-500' : 'text-slate-400'}`}>
                    {p.pagado ? 'Pagado' : 'Pendiente'}
                  </p>
                </div>
              </div>
            ))}
          </div>
          <div className="px-4 py-3 bg-slate-50 border-t border-slate-200 text-xs text-slate-500 space-y-0.5">
            <p><span className="font-medium">Transferencia:</span> {EMISOR.iban}</p>
            <p><span className="font-medium">Bizum:</span> {EMISOR.bizum}</p>
          </div>
        </div>

        {/* Notas */}
        {f.notas && (
          <div className="text-sm text-slate-500 border-t border-slate-100 pt-6">
            <p className="font-medium text-slate-700 mb-1">Notas</p>
            <p>{f.notas}</p>
          </div>
        )}

        <div className="mt-10 pt-6 border-t border-slate-100 text-center text-xs text-slate-300">
          {EMISOR.nombre} · NIF {EMISOR.nif} · {EMISOR.web}
        </div>
      </div>
    </div>
  )
}

/* ─── SUB-COMPONENTES ─────────────────────────────────────── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h2 className="text-sm font-semibold text-slate-700 mb-4">{title}</h2>
      {children}
    </div>
  )
}
