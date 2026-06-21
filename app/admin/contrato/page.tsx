'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { ArrowLeft, Save, FileDown, FileText } from 'lucide-react'
import {
  CONTRACT_FIELDS, fillTemplate, type ContractVars,
} from '@/lib/contractTemplate'
import { downloadContractPDF } from '@/lib/contractPdf'

export default function AdminContrato() {
  const [content, setContent] = useState('')
  const [updatedAt, setUpdatedAt] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [vars, setVars] = useState<Partial<ContractVars>>({})

  useEffect(() => {
    fetch('/api/admin/contract')
      .then(r => r.json())
      .then((data: { content: string; updatedAt: string | null }) => {
        setContent(data.content || '')
        setUpdatedAt(data.updatedAt)
      })
      .catch(() => setError('No se pudo cargar la plantilla'))
      .finally(() => setLoading(false))
  }, [])

  async function guardar() {
    setSaving(true)
    setError('')
    setSaved(false)
    try {
      const res = await fetch('/api/admin/contract', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ content }),
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.error || 'Error al guardar')
      setUpdatedAt(new Date().toISOString())
      setSaved(true)
      setTimeout(() => setSaved(false), 2500)
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Error al guardar')
    } finally {
      setSaving(false)
    }
  }

  function descargarPDF() {
    const filled = fillTemplate(content, vars)
    downloadContractPDF(filled, vars.cliente_nombre || 'cliente')
  }

  return (
    <div className="min-h-screen bg-slate-100 dark:bg-slate-950 text-slate-900 dark:text-slate-100">
      <header className="border-b border-slate-200 dark:border-slate-800 px-6 py-4 flex items-center gap-3 bg-white dark:bg-slate-900">
        <Link href="/admin" className="text-slate-400 hover:text-emerald-500 transition-colors">
          <ArrowLeft size={20} />
        </Link>
        <FileText size={20} className="text-emerald-500" />
        <h1 className="text-lg font-bold">Contrato de servicios</h1>
      </header>

      <div className="p-6 max-w-4xl mx-auto space-y-8">
        {loading ? (
          <p className="text-sm text-slate-400">Cargando plantilla…</p>
        ) : (
          <>
            {/* ── Editor de la plantilla ── */}
            <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div>
                  <h2 className="font-bold text-slate-800 dark:text-slate-100">Plantilla</h2>
                  <p className="text-xs text-slate-400">
                    Usa <code className="text-emerald-600 dark:text-emerald-400">{'{{clave}}'}</code> para los datos variables.
                    {updatedAt && ` · Última edición: ${new Date(updatedAt).toLocaleString('es-ES')}`}
                  </p>
                </div>
                <button
                  onClick={guardar}
                  disabled={saving}
                  className="inline-flex items-center gap-2 px-4 py-2 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-50 text-white text-sm font-bold rounded-xl transition-colors"
                >
                  <Save size={16} />
                  {saving ? 'Guardando…' : saved ? 'Guardado ✓' : 'Guardar'}
                </button>
              </div>

              <div className="flex flex-wrap gap-1.5">
                {CONTRACT_FIELDS.map(f => (
                  <span key={f.key} className="text-[11px] font-mono px-2 py-0.5 rounded-md bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400">
                    {`{{${f.key}}}`}
                  </span>
                ))}
              </div>

              <textarea
                value={content}
                onChange={e => setContent(e.target.value)}
                spellCheck={false}
                className="w-full h-[420px] resize-y font-mono text-[13px] leading-relaxed p-4 rounded-xl bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none focus:border-emerald-500"
              />

              {error && <p className="text-sm text-red-500">{error}</p>}
            </section>

            {/* ── Generar PDF ── */}
            <section className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl p-5 space-y-4">
              <div>
                <h2 className="font-bold text-slate-800 dark:text-slate-100">Generar contrato (PDF)</h2>
                <p className="text-xs text-slate-400">Rellena los datos del cliente. Los huecos vacíos saldrán subrayados para firmar a mano.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {CONTRACT_FIELDS.map(f => (
                  <div key={f.key} className={f.key === 'servicio' ? 'sm:col-span-2' : ''}>
                    <label className="block text-xs font-semibold text-slate-500 dark:text-slate-400 mb-1">{f.label}</label>
                    <input
                      value={vars[f.key] ?? ''}
                      onChange={e => setVars(v => ({ ...v, [f.key]: e.target.value }))}
                      placeholder={f.placeholder}
                      className="w-full px-3 py-2 text-sm rounded-lg bg-slate-50 dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-slate-800 dark:text-slate-200 placeholder-slate-400 focus:outline-none focus:border-emerald-500"
                    />
                  </div>
                ))}
              </div>

              <button
                onClick={descargarPDF}
                className="inline-flex items-center gap-2 px-4 py-2.5 bg-slate-900 dark:bg-slate-800 hover:bg-slate-700 text-white text-sm font-bold rounded-xl transition-colors"
              >
                <FileDown size={16} />
                Descargar PDF
              </button>
            </section>
          </>
        )}
      </div>
    </div>
  )
}
