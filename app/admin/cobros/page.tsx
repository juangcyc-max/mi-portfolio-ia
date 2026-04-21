'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getSupabaseClient } from '@/lib/supabaseAdmin'
import { CheckCircle, Circle, Upload, ExternalLink } from 'lucide-react'

const supabase = getSupabaseClient()

const eur = (n: number) => n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' })

interface Plazo {
  facturaId: string
  numero: string
  clienteNombre: string
  idx: number
  fecha: string
  importe: number
  pagado: boolean
  justificante_path?: string
}

interface AnalisisResult {
  signedUrl: string | null
  extracted: any
  coincide: boolean
}

export default function CobrosPage() {
  const [plazos, setPlazos] = useState<Plazo[]>([])
  const [loading, setLoading] = useState(true)
  const [filtro, setFiltro] = useState<'pendientes' | 'todos'>('pendientes')
  const [analizando, setAnalizando] = useState<string | null>(null)
  const [analisis, setAnalisis] = useState<Record<string, AnalisisResult>>({})

  useEffect(() => { cargar() }, [])

  async function cargar() {
    const { data } = await supabase
      .from('facturas')
      .select('id, numero, cliente_nombre, pagos')
      .order('created_at', { ascending: false })

    if (!data) { setLoading(false); return }

    const todos: Plazo[] = []
    for (const f of data) {
      for (let i = 0; i < f.pagos.length; i++) {
        const p = f.pagos[i]
        todos.push({
          facturaId: f.id,
          numero: f.numero,
          clienteNombre: f.cliente_nombre,
          idx: i,
          fecha: p.fecha,
          importe: p.importe,
          pagado: p.pagado,
          justificante_path: p.justificante_path,
        })
      }
    }

    // Ordenar: primero pendientes por fecha más próxima, luego pagados
    todos.sort((a, b) => {
      if (a.pagado !== b.pagado) return a.pagado ? 1 : -1
      return a.fecha.localeCompare(b.fecha)
    })

    setPlazos(todos)
    setLoading(false)
  }

  async function marcarPagado(plazo: Plazo) {
    const { data } = await supabase.from('facturas').select('pagos').eq('id', plazo.facturaId).single()
    if (!data) return
    const pagos = data.pagos.map((p: any, i: number) =>
      i === plazo.idx ? { ...p, pagado: !p.pagado } : p
    )
    await supabase.from('facturas').update({ pagos }).eq('id', plazo.facturaId)
    setPlazos(prev => prev.map(p =>
      p.facturaId === plazo.facturaId && p.idx === plazo.idx
        ? { ...p, pagado: !p.pagado }
        : p
    ))
  }

  async function subirJustificante(plazo: Plazo, file: File) {
    const key = `${plazo.facturaId}-${plazo.idx}`
    setAnalizando(key)
    const fd = new FormData()
    fd.append('file', file)
    fd.append('factura_id', plazo.facturaId)
    fd.append('plazo_idx', String(plazo.idx))
    fd.append('plazo_importe', String(plazo.importe))
    const res = await fetch('/api/admin/analizar-justificante', { method: 'POST', body: fd })
    const data = await res.json()
    setAnalizando(null)
    if (data.ok) {
      setAnalisis(prev => ({ ...prev, [key]: { signedUrl: data.signedUrl, extracted: data.extracted, coincide: data.coincide } }))
    }
  }

  async function confirmarPago(plazo: Plazo) {
    await marcarPagado(plazo)
    const key = `${plazo.facturaId}-${plazo.idx}`
    setAnalisis(prev => { const n = { ...prev }; delete n[key]; return n })
  }

  const filtrados = filtro === 'pendientes' ? plazos.filter(p => !p.pagado) : plazos
  const totalPendiente = plazos.filter(p => !p.pagado).reduce((s, p) => s + p.importe, 0)
  const totalCobrado = plazos.filter(p => p.pagado).reduce((s, p) => s + p.importe, 0)
  const hoy = new Date().toISOString().split('T')[0]

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 px-6 py-4 flex items-center gap-4">
        <Link href="/admin" className="text-slate-500 hover:text-slate-900 text-sm">← Volver</Link>
        <h1 className="text-lg font-bold">Cobros</h1>
        <span className="text-sm text-red-500 font-medium">
          {plazos.filter(p => !p.pagado).length} pendientes
        </span>
      </header>

      <div className="p-6 max-w-5xl mx-auto space-y-5">

        {/* Resumen */}
        <div className="grid grid-cols-2 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-xs text-slate-500 font-medium mb-1">Pendiente de cobro</p>
            <p className="text-2xl font-bold text-red-500">{eur(totalPendiente)}</p>
            <p className="text-xs text-slate-400 mt-1">{plazos.filter(p => !p.pagado).length} plazos</p>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-5">
            <p className="text-xs text-slate-500 font-medium mb-1">Total cobrado</p>
            <p className="text-2xl font-bold text-emerald-500">{eur(totalCobrado)}</p>
            <p className="text-xs text-slate-400 mt-1">{plazos.filter(p => p.pagado).length} plazos</p>
          </div>
        </div>

        {/* Filtro */}
        <div className="flex gap-2">
          {(['pendientes', 'todos'] as const).map(f => (
            <button key={f} onClick={() => setFiltro(f)}
              className={`px-4 py-1.5 rounded-lg text-sm font-semibold border transition-all
                ${filtro === f ? 'bg-slate-900 text-white border-slate-900' : 'bg-white text-slate-600 border-slate-200 hover:border-slate-400'}`}>
              {f === 'pendientes' ? 'Pendientes' : 'Todos'}
            </button>
          ))}
        </div>

        {/* Tabla */}
        {loading ? (
          <p className="text-slate-500 text-sm">Cargando...</p>
        ) : filtrados.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-12 text-center">
            <CheckCircle size={36} className="text-emerald-400 mx-auto mb-3" />
            <p className="text-slate-500 text-sm font-medium">Todo cobrado. Sin plazos pendientes.</p>
          </div>
        ) : (
          <div className="bg-white rounded-xl border border-slate-200 overflow-hidden">
            <table className="w-full text-sm">
              <thead className="bg-slate-50 border-b border-slate-200 text-xs uppercase tracking-wide">
                <tr>
                  <th className="text-left px-4 py-3 font-semibold text-slate-500">Estado</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-500">Cliente</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-500">Factura</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-500">Plazo</th>
                  <th className="text-left px-4 py-3 font-semibold text-slate-500">Vencimiento</th>
                  <th className="text-right px-4 py-3 font-semibold text-slate-500">Importe</th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {filtrados.map(plazo => {
                  const key = `${plazo.facturaId}-${plazo.idx}`
                  const vencido = !plazo.pagado && plazo.fecha < hoy
                  const resultado = analisis[key]
                  return (
                    <>
                      <tr key={key} className={`transition-colors ${plazo.pagado ? 'opacity-50' : vencido ? 'bg-red-50/50' : 'hover:bg-slate-50'}`}>
                        <td className="px-4 py-3">
                          <button onClick={() => marcarPagado(plazo)} className="transition-colors">
                            {plazo.pagado
                              ? <CheckCircle size={20} className="text-emerald-500" />
                              : <Circle size={20} className="text-slate-300 hover:text-slate-400" />}
                          </button>
                        </td>
                        <td className="px-4 py-3 font-medium text-slate-800">{plazo.clienteNombre}</td>
                        <td className="px-4 py-3">
                          <Link href="/admin/facturas" className="font-mono text-xs text-emerald-600 hover:underline flex items-center gap-1">
                            {plazo.numero} <ExternalLink size={10} />
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-slate-500">Plazo {plazo.idx + 1}</td>
                        <td className="px-4 py-3">
                          <span className={`text-xs font-medium ${vencido ? 'text-red-500 font-semibold' : 'text-slate-500'}`}>
                            {vencido && '⚠ '}{new Date(plazo.fecha).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right font-bold text-slate-800">{eur(plazo.importe)}</td>
                        <td className="px-4 py-3">
                          {!plazo.pagado && (
                            <label className="cursor-pointer">
                              <input type="file" accept="image/*,application/pdf" className="hidden"
                                onChange={e => { const f = e.target.files?.[0]; if (f) subirJustificante(plazo, f); e.target.value = '' }} />
                              <span className={`flex items-center gap-1.5 text-xs px-3 py-1.5 rounded-lg border font-medium transition-colors whitespace-nowrap
                                ${analizando === key
                                  ? 'border-slate-200 text-slate-400 cursor-wait'
                                  : 'border-slate-200 text-slate-600 hover:border-emerald-400 hover:text-emerald-600 cursor-pointer'}`}>
                                <Upload size={12} />
                                {analizando === key ? 'Analizando...' : 'Justificante'}
                              </span>
                            </label>
                          )}
                        </td>
                      </tr>
                      {resultado && (
                        <tr key={`${key}-result`}>
                          <td colSpan={7} className="px-4 pb-3">
                            <div className={`rounded-lg p-3 text-xs border ${resultado.coincide ? 'bg-emerald-50 border-emerald-200' : 'bg-yellow-50 border-yellow-200'}`}>
                              <p className={`font-semibold mb-1 ${resultado.coincide ? 'text-emerald-700' : 'text-yellow-700'}`}>
                                {resultado.coincide ? '✓ Importe coincide' : '⚠ Importe no coincide — revisa'}
                              </p>
                              {resultado.extracted && (
                                <p className="text-slate-600">
                                  {resultado.extracted.importe != null && eur(resultado.extracted.importe)}
                                  {resultado.extracted.fecha && ` · ${resultado.extracted.fecha}`}
                                  {resultado.extracted.remitente && ` · ${resultado.extracted.remitente}`}
                                </p>
                              )}
                              {resultado.signedUrl && (
                                <a href={resultado.signedUrl} target="_blank" rel="noopener noreferrer"
                                  className="text-blue-600 underline mt-1 inline-block">Ver documento</a>
                              )}
                              <div className="flex gap-2 mt-2">
                                <button onClick={() => confirmarPago(plazo)}
                                  className="px-3 py-1 bg-emerald-500 hover:bg-emerald-600 text-white rounded-lg font-semibold transition-colors">
                                  Confirmar pago
                                </button>
                                <button onClick={() => setAnalisis(prev => { const n = { ...prev }; delete n[key]; return n })}
                                  className="px-3 py-1 border border-slate-200 text-slate-500 hover:text-slate-700 rounded-lg transition-colors">
                                  Cancelar
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </>
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
