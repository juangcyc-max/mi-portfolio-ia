'use client'

import { useState, useEffect, useCallback } from 'react'
import { getSupabaseClient } from '@/lib/supabaseAdmin'
import {
  Plus, Printer, ArrowLeft, Trash2, CheckCircle,
  Circle, FileText, Download, TrendingUp, Clock, BadgeCheck,
} from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

const supabase = getSupabaseClient()

/* ─── EMISOR ────────────────────────────────────────────────── */
const EMISOR = {
  nombre: 'Juan Gutiérrez de la Concha de la Cuesta',
  nif: '72173348S',
  web: 'mindbride.net',
  email: 'juangutierrezdelaconcha@mindbride.net',
  iban: 'ES57 1576 1212 1010 1070 3674',
  bizum: '+34 605 190 561',
}

/* ─── TIPOS ─────────────────────────────────────────────────── */
interface Concepto { descripcion: string; cantidad: number; precio: number }
interface Pago { fecha: string; importe: number; pagado: boolean }
interface Factura {
  id: string; numero: string; fecha: string
  tipo_cliente: 'particular' | 'empresa'
  cliente_nombre: string; cliente_nif: string; cliente_contacto: string
  cliente_direccion: string; cliente_email: string
  conceptos: Concepto[]; base_imponible: number; iva_porcentaje: number
  iva_importe: number; total: number; fraccionamiento: number
  pagos: Pago[]; notas: string; created_at: string
}
type Vista = 'lista' | 'form' | 'preview'

/* ─── HELPERS ───────────────────────────────────────────────── */
const eur = (n: number) => n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })
const addDays = (d: string, days: number) => {
  const date = new Date(d); date.setDate(date.getDate() + days)
  return date.toISOString().split('T')[0]
}
const today = () => new Date().toISOString().split('T')[0]

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
  if (pagados === pagos.length) return { label: 'Pagada', color: 'text-emerald-700 bg-emerald-50 border-emerald-200' }
  if (pagados > 0) return { label: 'Parcial', color: 'text-yellow-700 bg-yellow-50 border-yellow-200' }
  return { label: 'Pendiente', color: 'text-red-700 bg-red-50 border-red-200' }
}

/* ─── PDF GENERATOR ─────────────────────────────────────────── */
async function descargarPDF(f: Factura) {
  const [{ default: jsPDF }, { default: autoTable }] = await Promise.all([
    import('jspdf'),
    import('jspdf-autotable'),
  ])

  const doc = new jsPDF({ orientation: 'portrait', unit: 'mm', format: 'a4' })
  const W = doc.internal.pageSize.width
  const H = doc.internal.pageSize.height
  const emerald: [number, number, number] = [16, 185, 129]
  const slate900: [number, number, number] = [15, 23, 42]
  const slate600: [number, number, number] = [71, 85, 105]
  const slate50: [number, number, number] = [248, 250, 252]
  const white: [number, number, number] = [255, 255, 255]

  // ── Cabecera verde
  doc.setFillColor(...emerald)
  doc.rect(0, 0, W, 38, 'F')

  // Nombre empresa
  doc.setTextColor(...white)
  doc.setFontSize(18); doc.setFont('helvetica', 'bold')
  doc.text('Mindbridge IA', 15, 16)
  doc.setFontSize(8); doc.setFont('helvetica', 'normal')
  doc.text(EMISOR.web, 15, 23)
  doc.text(`NIF: ${EMISOR.nif}`, 15, 29)

  // Número y fecha (derecha)
  doc.setFontSize(22); doc.setFont('helvetica', 'bold')
  doc.text('FACTURA', W - 15, 16, { align: 'right' })
  doc.setFontSize(12); doc.setFont('helvetica', 'normal')
  doc.text(f.numero, W - 15, 24, { align: 'right' })
  doc.setFontSize(8)
  doc.text(`Fecha: ${f.fecha}`, W - 15, 30, { align: 'right' })

  // ── Bloque emisor
  let y = 48
  doc.setTextColor(...slate600); doc.setFontSize(7); doc.setFont('helvetica', 'bold')
  doc.text('EMISOR', 15, y)
  y += 4
  doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...slate900)
  doc.text(EMISOR.nombre, 15, y); y += 5
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(...slate600)
  doc.text(EMISOR.email, 15, y)

  // ── Bloque cliente (derecha)
  const cx = W / 2 + 5
  doc.setFillColor(...slate50)
  doc.roundedRect(W / 2, 44, W / 2 - 15, 34, 2, 2, 'F')
  doc.setTextColor(...slate600); doc.setFontSize(7); doc.setFont('helvetica', 'bold')
  doc.text('FACTURADO A', cx, 50)
  doc.setFont('helvetica', 'bold'); doc.setFontSize(9); doc.setTextColor(...slate900)
  doc.text(f.cliente_nombre, cx, 57)
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(...slate600)
  let cy = 63
  if (f.tipo_cliente === 'empresa' && f.cliente_contacto) { doc.text(`Attn: ${f.cliente_contacto}`, cx, cy); cy += 4 }
  if (f.cliente_nif) { doc.text(`${f.tipo_cliente === 'empresa' ? 'CIF' : 'NIF'}: ${f.cliente_nif}`, cx, cy); cy += 4 }
  if (f.cliente_email) { doc.text(f.cliente_email, cx, cy); cy += 4 }
  if (f.cliente_direccion) doc.text(f.cliente_direccion, cx, cy)

  // ── Tabla conceptos
  autoTable(doc, {
    startY: 86,
    head: [['Concepto', 'Uds.', 'Precio/ud.', 'Importe']],
    body: f.conceptos.map(c => [
      c.descripcion, String(c.cantidad), eur(c.precio), eur(c.cantidad * c.precio),
    ]),
    headStyles: { fillColor: emerald, textColor: white, fontStyle: 'bold', fontSize: 9 },
    bodyStyles: { textColor: slate900, fontSize: 9 },
    alternateRowStyles: { fillColor: slate50 },
    columnStyles: {
      0: { cellWidth: 'auto' },
      1: { halign: 'right', cellWidth: 18 },
      2: { halign: 'right', cellWidth: 35 },
      3: { halign: 'right', cellWidth: 35 },
    },
    margin: { left: 15, right: 15 },
  })

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const tableEnd = (doc as any).lastAutoTable.finalY + 6

  // ── Totales
  doc.setFillColor(...slate50)
  doc.roundedRect(W - 85, tableEnd, 70, 30, 2, 2, 'F')
  doc.setTextColor(...slate600); doc.setFontSize(8); doc.setFont('helvetica', 'normal')
  doc.text('Base imponible', W - 82, tableEnd + 8)
  doc.text(`IVA (${f.iva_porcentaje}%)`, W - 82, tableEnd + 15)
  doc.setDrawColor(...emerald); doc.line(W - 82, tableEnd + 18, W - 17, tableEnd + 18)
  doc.setFont('helvetica', 'bold'); doc.setFontSize(10); doc.setTextColor(...slate900)
  doc.text('TOTAL', W - 82, tableEnd + 26)
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(...slate600)
  doc.text(eur(f.base_imponible), W - 17, tableEnd + 8, { align: 'right' })
  doc.text(eur(f.iva_importe), W - 17, tableEnd + 15, { align: 'right' })
  doc.setFont('helvetica', 'bold'); doc.setFontSize(11); doc.setTextColor(...emerald)
  doc.text(eur(f.total), W - 17, tableEnd + 26, { align: 'right' })

  // ── Pagos
  const payY = tableEnd + 42
  doc.setTextColor(...slate900); doc.setFont('helvetica', 'bold'); doc.setFontSize(9)
  doc.text(f.fraccionamiento === 1 ? 'Forma de pago' : `Fraccionado en ${f.fraccionamiento} plazos`, 15, payY)
  doc.setFont('helvetica', 'normal'); doc.setFontSize(8); doc.setTextColor(...slate600)
  f.pagos.forEach((p, i) => {
    const label = f.fraccionamiento === 1 ? 'Pago único' : `Plazo ${i + 1}`
    const estado = p.pagado ? '✓ Pagado' : 'Pendiente'
    doc.text(`${label}  ·  ${p.fecha}  ·  ${eur(p.importe)}  ·  ${estado}`, 15, payY + 6 + i * 5)
  })

  const bankY = payY + 8 + f.pagos.length * 5
  doc.setFillColor(...slate50)
  doc.roundedRect(15, bankY, W - 30, 14, 2, 2, 'F')
  doc.setTextColor(...slate600); doc.setFontSize(8)
  doc.text(`Transferencia: ${EMISOR.iban}`, 20, bankY + 5)
  doc.text(`Bizum: ${EMISOR.bizum}`, 20, bankY + 11)

  // ── Notas
  if (f.notas) {
    const notaY = bankY + 20
    doc.setFont('helvetica', 'bold'); doc.setFontSize(8); doc.setTextColor(...slate900)
    doc.text('Notas:', 15, notaY)
    doc.setFont('helvetica', 'normal'); doc.setTextColor(...slate600)
    doc.text(f.notas, 15, notaY + 5, { maxWidth: W - 30 })
  }

  // ── Footer
  doc.setFillColor(...slate50)
  doc.rect(0, H - 14, W, 14, 'F')
  doc.setDrawColor(226, 232, 240); doc.line(0, H - 14, W, H - 14)
  doc.setTextColor(...slate600); doc.setFontSize(7); doc.setFont('helvetica', 'normal')
  doc.text(`${EMISOR.nombre}  ·  NIF ${EMISOR.nif}  ·  ${EMISOR.web}`, W / 2, H - 6, { align: 'center' })

  doc.save(`${f.numero}.pdf`)
}

/* ─── FORM VACÍO ────────────────────────────────────────────── */
const emptyForm = {
  fecha: today(),
  tipo_cliente: 'particular' as 'particular' | 'empresa',
  cliente_nombre: '', cliente_nif: '', cliente_contacto: '',
  cliente_direccion: '', cliente_email: '',
  conceptos: [{ descripcion: '', cantidad: 1, precio: 0 }] as Concepto[],
  iva_porcentaje: 21, fraccionamiento: 1, notas: '',
}

/* ═══════════════════════════════════════════════════════════════
   COMPONENTE PRINCIPAL
═══════════════════════════════════════════════════════════════ */
export default function FacturasPage() {
  const [vista, setVista] = useState<Vista>('lista')
  const [facturas, setFacturas] = useState<Factura[]>([])
  const [seleccionada, setSeleccionada] = useState<Factura | null>(null)
  const [form, setForm] = useState({ ...emptyForm })
  const [guardando, setGuardando] = useState(false)

  const cargarFacturas = useCallback(async () => {
    const { data } = await supabase.from('facturas').select('*').order('created_at', { ascending: false })
    if (data) setFacturas(data as Factura[])
  }, [])

  useEffect(() => { cargarFacturas() }, [cargarFacturas])

  const base = +form.conceptos.reduce((s, c) => s + c.cantidad * c.precio, 0).toFixed(2)
  const ivaImporte = +(base * form.iva_porcentaje / 100).toFixed(2)
  const total = +(base + ivaImporte).toFixed(2)

  async function guardar() {
    if (!form.cliente_nombre || base === 0) return
    setGuardando(true)
    const numero = `MB-${new Date().getFullYear()}-${String(facturas.length + 1).padStart(3, '0')}`
    const pagos = calcPagos(total, form.fraccionamiento, form.fecha)
    const { data, error } = await supabase.from('facturas').insert({
      numero, fecha: form.fecha, tipo_cliente: form.tipo_cliente,
      cliente_nombre: form.cliente_nombre, cliente_nif: form.cliente_nif,
      cliente_contacto: form.cliente_contacto, cliente_direccion: form.cliente_direccion,
      cliente_email: form.cliente_email, conceptos: form.conceptos,
      base_imponible: base, iva_porcentaje: form.iva_porcentaje, iva_importe: ivaImporte,
      total, fraccionamiento: form.fraccionamiento, pagos, notas: form.notas,
    }).select().single()
    setGuardando(false)
    if (!error && data) {
      await cargarFacturas()
      setSeleccionada(data as Factura)
      setVista('preview')
      setForm({ ...emptyForm, fecha: today() })
    }
  }

  async function togglePago(factura: Factura, idx: number) {
    const pagos = factura.pagos.map((p, i) => i === idx ? { ...p, pagado: !p.pagado } : p)
    await supabase.from('facturas').update({ pagos }).eq('id', factura.id)
    const updated = { ...factura, pagos }
    setFacturas(prev => prev.map(f => f.id === factura.id ? updated : f))
    if (seleccionada?.id === factura.id) setSeleccionada(updated)
  }

  async function eliminar(id: string) {
    if (!confirm('¿Eliminar esta factura? Esta acción no se puede deshacer.')) return
    await supabase.from('facturas').delete().eq('id', id)
    await cargarFacturas()
    if (seleccionada?.id === id) { setSeleccionada(null); setVista('lista') }
  }

  /* ══ VISTA: LISTA / REGISTRO ══ */
  if (vista === 'lista') {
    const totalFacturado = facturas.reduce((s, f) => s + f.total, 0)
    const totalCobrado = facturas.reduce((s, f) => s + f.pagos.filter(p => p.pagado).reduce((a, p) => a + p.importe, 0), 0)
    const totalPendiente = totalFacturado - totalCobrado

    return (
      <div className="min-h-screen bg-slate-100 p-6">
        <div className="max-w-5xl mx-auto space-y-6">

          {/* Header */}
          <div className="flex items-center justify-between">
            <div>
              <Link href="/admin" className="text-xs text-slate-400 hover:text-emerald-600 transition-colors flex items-center gap-1 mb-1">
                <ArrowLeft size={12} /> Panel admin
              </Link>
              <h1 className="text-xl font-bold text-slate-900">Facturas</h1>
              <p className="text-sm text-slate-400">Mindbridge IA · {EMISOR.nif}</p>
            </div>
            <button
              onClick={() => { setForm({ ...emptyForm, fecha: today() }); setVista('form') }}
              className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm"
            >
              <Plus size={16} /> Nueva factura
            </button>
          </div>

          {/* Resumen */}
          <div className="grid grid-cols-3 gap-4">
            <SummaryCard icon={<TrendingUp size={18} />} label="Total facturado" value={eur(totalFacturado)} color="blue" />
            <SummaryCard icon={<BadgeCheck size={18} />} label="Total cobrado" value={eur(totalCobrado)} color="emerald" />
            <SummaryCard icon={<Clock size={18} />} label="Pendiente de cobro" value={eur(totalPendiente)} color="amber" />
          </div>

          {/* Tabla */}
          {facturas.length === 0 ? (
            <div className="bg-white rounded-xl border border-slate-200 p-16 text-center">
              <FileText size={40} className="mx-auto text-slate-200 mb-3" />
              <p className="text-slate-400 text-sm">No hay facturas todavía</p>
            </div>
          ) : (
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wide">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-slate-500">Nº factura</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-500">Fecha</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-500">Cliente</th>
                    <th className="text-right px-4 py-3 font-semibold text-slate-500">Total</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-500">Estado</th>
                    <th className="px-4 py-3" />
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {facturas.map(f => {
                    const estado = estadoPagos(f.pagos)
                    return (
                      <tr key={f.id} className="hover:bg-slate-50 transition-colors group">
                        <td className="px-4 py-3 font-mono text-xs text-emerald-600 font-semibold">{f.numero}</td>
                        <td className="px-4 py-3 text-slate-500 text-xs">{f.fecha}</td>
                        <td className="px-4 py-3">
                          <p className="font-medium text-slate-800">{f.cliente_nombre}</p>
                          <p className="text-xs text-slate-400">
                            {f.tipo_cliente === 'empresa' ? 'Empresa' : 'Particular'}
                            {f.cliente_nif ? ` · ${f.cliente_nif}` : ''}
                          </p>
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-slate-800">{eur(f.total)}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-semibold px-2 py-1 rounded-full border ${estado.color}`}>
                            {estado.label}
                          </span>
                        </td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-1 justify-end opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setSeleccionada(f); setVista('preview') }}
                              className="text-xs text-slate-500 hover:text-emerald-600 transition-colors px-2 py-1 rounded hover:bg-emerald-50">
                              Ver
                            </button>
                            <button onClick={() => descargarPDF(f)}
                              className="text-xs text-slate-500 hover:text-blue-600 transition-colors px-2 py-1 rounded hover:bg-blue-50">
                              <Download size={13} />
                            </button>
                            <button onClick={() => eliminar(f.id)}
                              className="text-xs text-slate-300 hover:text-red-500 transition-colors px-2 py-1 rounded hover:bg-red-50">
                              <Trash2 size={13} />
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
  }

  /* ══ VISTA: FORMULARIO ══ */
  if (vista === 'form') return (
    <div className="min-h-screen bg-slate-100 p-6">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => setVista('lista')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 mb-6 transition-colors">
          <ArrowLeft size={16} /> Volver
        </button>
        <div className="flex items-center gap-3 mb-6">
          <Image src="/logo.png" alt="Mindbridge IA" width={32} height={32} />
          <h1 className="text-xl font-bold text-slate-900">Nueva factura</h1>
        </div>

        <div className="space-y-5">

          {/* Datos factura */}
          <Section title="Datos de la factura">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="label">Fecha</label>
                <input type="date" className="input" value={form.fecha}
                  onChange={e => setForm(f => ({ ...f, fecha: e.target.value }))} />
              </div>
              <div>
                <label className="label">IVA aplicable</label>
                <select className="input" value={form.iva_porcentaje}
                  onChange={e => setForm(f => ({ ...f, iva_porcentaje: +e.target.value }))}>
                  <option value={0}>0% — Exento</option>
                  <option value={4}>4% — Superreducido</option>
                  <option value={10}>10% — Reducido</option>
                  <option value={21}>21% — General</option>
                </select>
              </div>
            </div>
          </Section>

          {/* Datos cliente */}
          <Section title="Datos del cliente">
            <div className="flex gap-2 mb-4">
              {(['particular', 'empresa'] as const).map(tipo => (
                <button key={tipo} onClick={() => setForm(f => ({ ...f, tipo_cliente: tipo }))}
                  className={`flex-1 py-2 rounded-lg text-sm font-semibold border transition-all
                    ${form.tipo_cliente === tipo
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'}`}>
                  {tipo === 'particular' ? 'Particular' : 'Empresa'}
                </button>
              ))}
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="sm:col-span-2">
                <label className="label">{form.tipo_cliente === 'empresa' ? 'Razón social' : 'Nombre completo'}</label>
                <input className="input"
                  placeholder={form.tipo_cliente === 'empresa' ? 'Empresa S.L.' : 'María García López'}
                  value={form.cliente_nombre}
                  onChange={e => setForm(f => ({ ...f, cliente_nombre: e.target.value }))} />
              </div>

              {form.tipo_cliente === 'empresa' && (
                <div className="sm:col-span-2">
                  <label className="label">Persona de contacto</label>
                  <input className="input" placeholder="Nombre del contacto en la empresa"
                    value={form.cliente_contacto}
                    onChange={e => setForm(f => ({ ...f, cliente_contacto: e.target.value }))} />
                </div>
              )}

              <div>
                <label className="label">{form.tipo_cliente === 'empresa' ? 'CIF' : 'NIF / DNI'}</label>
                <input className="input"
                  placeholder={form.tipo_cliente === 'empresa' ? 'B12345678' : '12345678A'}
                  value={form.cliente_nif}
                  onChange={e => setForm(f => ({ ...f, cliente_nif: e.target.value }))} />
              </div>

              <div>
                <label className="label">Email</label>
                <input type="email" className="input" placeholder="contacto@empresa.com"
                  value={form.cliente_email}
                  onChange={e => setForm(f => ({ ...f, cliente_email: e.target.value }))} />
              </div>

              <div className="sm:col-span-2">
                <label className="label">Dirección fiscal</label>
                <input className="input" placeholder="Calle, número, CP, ciudad, provincia"
                  value={form.cliente_direccion}
                  onChange={e => setForm(f => ({ ...f, cliente_direccion: e.target.value }))} />
              </div>
            </div>
          </Section>

          {/* Conceptos */}
          <Section title="Conceptos">
            <div className="space-y-2">
              {form.conceptos.map((c, i) => (
                <div key={i} className="grid grid-cols-12 gap-2">
                  <div className="col-span-6">
                    {i === 0 && <label className="label">Descripción</label>}
                    <input className="input" placeholder="Descripción del servicio o producto"
                      value={c.descripcion}
                      onChange={e => {
                        const arr = [...form.conceptos]; arr[i] = { ...c, descripcion: e.target.value }
                        setForm(f => ({ ...f, conceptos: arr }))
                      }} />
                  </div>
                  <div className="col-span-2">
                    {i === 0 && <label className="label">Uds.</label>}
                    <input type="number" min={1} className="input text-right" value={c.cantidad}
                      onChange={e => {
                        const arr = [...form.conceptos]; arr[i] = { ...c, cantidad: +e.target.value }
                        setForm(f => ({ ...f, conceptos: arr }))
                      }} />
                  </div>
                  <div className="col-span-3">
                    {i === 0 && <label className="label">Precio/ud. (€)</label>}
                    <input type="number" min={0} step={0.01} className="input text-right" value={c.precio}
                      onChange={e => {
                        const arr = [...form.conceptos]; arr[i] = { ...c, precio: +e.target.value }
                        setForm(f => ({ ...f, conceptos: arr }))
                      }} />
                  </div>
                  <div className="col-span-1 flex items-end justify-center pb-1">
                    {i === 0 && <div className="h-5" />}
                    <button onClick={() => {
                      const arr = form.conceptos.filter((_, j) => j !== i)
                      if (arr.length > 0) setForm(f => ({ ...f, conceptos: arr }))
                    }} className="text-slate-300 hover:text-red-400 transition-colors mt-1">
                      <Trash2 size={14} />
                    </button>
                  </div>
                </div>
              ))}
            </div>

            <button onClick={() => setForm(f => ({ ...f, conceptos: [...f.conceptos, { descripcion: '', cantidad: 1, precio: 0 }] }))}
              className="mt-3 text-sm text-emerald-600 hover:text-emerald-700 flex items-center gap-1 transition-colors font-medium">
              <Plus size={14} /> Añadir línea
            </button>

            <div className="mt-4 border-t border-slate-100 pt-4 space-y-1.5 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Base imponible</span><span className="font-medium">{eur(base)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>IVA ({form.iva_porcentaje}%)</span><span className="font-medium">{eur(ivaImporte)}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 text-base pt-2 border-t border-slate-200">
                <span>Total</span><span className="text-emerald-600">{eur(total)}</span>
              </div>
            </div>
          </Section>

          {/* Forma de pago */}
          <Section title="Forma de pago">
            <div className="grid grid-cols-3 gap-3 mb-4">
              {([1, 2, 3] as const).map(n => (
                <button key={n} onClick={() => setForm(f => ({ ...f, fraccionamiento: n }))}
                  className={`py-3 rounded-lg text-sm font-semibold border transition-all
                    ${form.fraccionamiento === n
                      ? 'bg-emerald-500 text-white border-emerald-500 shadow-sm'
                      : 'bg-white text-slate-600 border-slate-200 hover:border-emerald-300'}`}>
                  {n === 1 ? 'Pago único' : `${n} plazos`}
                </button>
              ))}
            </div>

            {total > 0 && (
              <div className="bg-slate-50 rounded-lg p-4 space-y-2 mb-3">
                {calcPagos(total, form.fraccionamiento, form.fecha).map((p, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-slate-500">
                      {form.fraccionamiento === 1 ? 'Al firmar contrato' : `Plazo ${i + 1} · ${p.fecha}`}
                    </span>
                    <span className="font-semibold text-slate-800">{eur(p.importe)}</span>
                  </div>
                ))}
              </div>
            )}

            <div className="p-3 bg-slate-50 rounded-lg text-xs text-slate-500 space-y-1">
              <p><span className="font-semibold text-slate-600">Transferencia:</span> {EMISOR.iban}</p>
              <p><span className="font-semibold text-slate-600">Bizum:</span> {EMISOR.bizum}</p>
            </div>
          </Section>

          {/* Notas */}
          <Section title="Notas (opcional)">
            <textarea className="input resize-none h-24"
              placeholder="Condiciones de pago, observaciones, notas para el cliente..."
              value={form.notas}
              onChange={e => setForm(f => ({ ...f, notas: e.target.value }))} />
          </Section>

          <div className="flex gap-3 pb-10">
            <button onClick={() => setVista('lista')}
              className="flex-1 py-2.5 border border-slate-200 rounded-lg text-sm text-slate-600 hover:bg-slate-50 transition-colors">
              Cancelar
            </button>
            <button onClick={guardar} disabled={guardando || !form.cliente_nombre || base === 0}
              className="flex-1 py-2.5 bg-emerald-500 hover:bg-emerald-600 disabled:opacity-40 disabled:cursor-not-allowed text-white text-sm font-bold rounded-lg transition-colors shadow-sm">
              {guardando ? 'Guardando...' : 'Crear factura'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )

  /* ══ VISTA: PREVIEW / IMPRESIÓN ══ */
  const f = seleccionada!
  return (
    <div className="min-h-screen bg-slate-200 print:bg-white">

      {/* Barra acciones */}
      <div className="print:hidden sticky top-0 z-10 flex items-center justify-between px-6 py-3 bg-white border-b border-slate-200 shadow-sm">
        <button onClick={() => setVista('lista')} className="flex items-center gap-2 text-sm text-slate-500 hover:text-slate-800 transition-colors">
          <ArrowLeft size={16} /> Volver al registro
        </button>
        <div className="flex items-center gap-2">
          <button onClick={() => descargarPDF(f)}
            className="flex items-center gap-2 border border-slate-200 hover:border-slate-300 text-slate-600 hover:text-slate-800 text-sm font-medium px-4 py-2 rounded-lg transition-colors">
            <Download size={15} /> Descargar PDF
          </button>
          <button onClick={() => window.print()}
            className="flex items-center gap-2 bg-emerald-500 hover:bg-emerald-600 text-white text-sm font-semibold px-4 py-2 rounded-lg transition-colors shadow-sm">
            <Printer size={15} /> Imprimir
          </button>
        </div>
      </div>

      {/* Documento A4 */}
      <div className="max-w-3xl mx-auto my-8 print:my-0 bg-white rounded-2xl print:rounded-none shadow-xl print:shadow-none border border-slate-200 print:border-0 overflow-hidden">

        {/* Cabecera verde */}
        <div className="bg-emerald-500 px-10 py-8 flex justify-between items-start">
          <div className="flex items-center gap-3">
            <div className="bg-white rounded-xl p-2 shadow-sm">
              <Image src="/logo.png" alt="Mindbridge IA" width={40} height={40} />
            </div>
            <div>
              <p className="text-white font-bold text-lg leading-tight">Mindbridge IA</p>
              <p className="text-emerald-100 text-sm">{EMISOR.web}</p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-white/70 text-xs uppercase tracking-widest mb-1">Factura</p>
            <p className="text-white font-mono font-bold text-xl">{f.numero}</p>
            <p className="text-emerald-100 text-sm mt-1">{f.fecha}</p>
          </div>
        </div>

        <div className="px-10 py-8 space-y-8">

          {/* Emisor / Cliente */}
          <div className="grid grid-cols-2 gap-8">
            <div>
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Emisor</p>
              <p className="font-bold text-slate-900">{EMISOR.nombre}</p>
              <p className="text-sm text-slate-500">NIF: {EMISOR.nif}</p>
              <p className="text-sm text-slate-500">{EMISOR.web}</p>
              <p className="text-sm text-slate-500">{EMISOR.email}</p>
            </div>
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-100">
              <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-2">Facturado a</p>
              <p className="font-bold text-slate-900">{f.cliente_nombre}</p>
              {f.tipo_cliente === 'empresa' && f.cliente_contacto && (
                <p className="text-sm text-slate-500">Attn: {f.cliente_contacto}</p>
              )}
              {f.cliente_nif && <p className="text-sm text-slate-500">{f.tipo_cliente === 'empresa' ? 'CIF' : 'NIF'}: {f.cliente_nif}</p>}
              {f.cliente_direccion && <p className="text-sm text-slate-500">{f.cliente_direccion}</p>}
              {f.cliente_email && <p className="text-sm text-slate-500">{f.cliente_email}</p>}
            </div>
          </div>

          {/* Conceptos */}
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-900 text-white rounded-lg overflow-hidden">
                <th className="text-left px-4 py-3 rounded-l-lg font-semibold">Concepto</th>
                <th className="text-right px-4 py-3 font-semibold w-16">Uds.</th>
                <th className="text-right px-4 py-3 font-semibold w-28">Precio/ud.</th>
                <th className="text-right px-4 py-3 rounded-r-lg font-semibold w-28">Importe</th>
              </tr>
            </thead>
            <tbody>
              {f.conceptos.map((c, i) => (
                <tr key={i} className={i % 2 === 0 ? 'bg-white' : 'bg-slate-50'}>
                  <td className="px-4 py-3 text-slate-800">{c.descripcion}</td>
                  <td className="px-4 py-3 text-right text-slate-500">{c.cantidad}</td>
                  <td className="px-4 py-3 text-right text-slate-500">{eur(c.precio)}</td>
                  <td className="px-4 py-3 text-right font-semibold text-slate-800">{eur(c.cantidad * c.precio)}</td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* Totales */}
          <div className="flex justify-end">
            <div className="w-64 bg-slate-50 rounded-xl p-4 border border-slate-100 space-y-2 text-sm">
              <div className="flex justify-between text-slate-500">
                <span>Base imponible</span><span>{eur(f.base_imponible)}</span>
              </div>
              <div className="flex justify-between text-slate-500">
                <span>IVA ({f.iva_porcentaje}%)</span><span>{eur(f.iva_importe)}</span>
              </div>
              <div className="flex justify-between font-bold text-slate-900 text-base pt-2 border-t border-slate-200">
                <span>Total</span>
                <span className="text-emerald-600">{eur(f.total)}</span>
              </div>
            </div>
          </div>

          {/* Plazos de pago */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <div className="bg-slate-900 px-5 py-3">
              <p className="text-white text-sm font-semibold">
                {f.fraccionamiento === 1 ? 'Forma de pago' : `Fraccionado en ${f.fraccionamiento} plazos`}
              </p>
            </div>
            <div className="divide-y divide-slate-100">
              {f.pagos.map((p, i) => (
                <div key={i} className="flex items-center justify-between px-5 py-4">
                  <div className="flex items-center gap-3">
                    <button onClick={() => togglePago(f, i)} className="print:hidden transition-colors">
                      {p.pagado
                        ? <CheckCircle size={20} className="text-emerald-500" />
                        : <Circle size={20} className="text-slate-300 hover:text-slate-400" />}
                    </button>
                    <div>
                      <p className="font-semibold text-slate-800 text-sm">
                        {f.fraccionamiento === 1 ? 'Pago único' : `Plazo ${i + 1}`}
                      </p>
                      <p className="text-xs text-slate-400">{p.fecha}</p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="font-bold text-slate-800">{eur(p.importe)}</p>
                    <p className={`text-xs font-medium ${p.pagado ? 'text-emerald-500' : 'text-slate-400'}`}>
                      {p.pagado ? 'Pagado ✓' : 'Pendiente'}
                    </p>
                  </div>
                </div>
              ))}
            </div>
            <div className="bg-slate-50 px-5 py-3 border-t border-slate-100 text-xs text-slate-500 space-y-1">
              <p><span className="font-semibold text-slate-600">Transferencia:</span> {EMISOR.iban}</p>
              <p><span className="font-semibold text-slate-600">Bizum:</span> {EMISOR.bizum}</p>
            </div>
          </div>

          {f.notas && (
            <div className="bg-amber-50 border border-amber-100 rounded-xl px-5 py-4 text-sm text-amber-800">
              <p className="font-semibold mb-1">Notas</p>
              <p>{f.notas}</p>
            </div>
          )}

          {/* Pie */}
          <div className="text-center text-xs text-slate-300 pt-4 border-t border-slate-100">
            {EMISOR.nombre} · NIF {EMISOR.nif} · {EMISOR.web}
          </div>
        </div>
      </div>
    </div>
  )
}

/* ─── SUB-COMPONENTES ───────────────────────────────────────── */
function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <h2 className="text-sm font-bold text-slate-700 mb-4 uppercase tracking-wide">{title}</h2>
      {children}
    </div>
  )
}

function SummaryCard({ icon, label, value, color }: {
  icon: React.ReactNode; label: string; value: string; color: string
}) {
  const colors: Record<string, string> = {
    blue: 'text-blue-500 bg-blue-50',
    emerald: 'text-emerald-500 bg-emerald-50',
    amber: 'text-amber-500 bg-amber-50',
  }
  return (
    <div className="bg-white rounded-xl border border-slate-200 p-5">
      <div className={`w-8 h-8 rounded-lg flex items-center justify-center mb-3 ${colors[color]}`}>
        {icon}
      </div>
      <p className="text-xs text-slate-400 mb-1">{label}</p>
      <p className="text-lg font-bold text-slate-800">{value}</p>
    </div>
  )
}
