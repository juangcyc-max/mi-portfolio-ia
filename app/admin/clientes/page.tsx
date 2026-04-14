'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { getSupabaseClient } from '@/lib/supabaseAdmin'
import { Users, Building2, User, Mail, MapPin, Hash, Calendar } from 'lucide-react'

const supabase = getSupabaseClient()

interface Cliente {
  id: string
  nombre: string
  email: string | null
  nif: string | null
  tipo_cliente: 'particular' | 'empresa'
  contacto: string | null
  direccion: string | null
  ultima_factura: string | null
  created_at: string
}

export default function ClientesPage() {
  const [clientes, setClientes] = useState<Cliente[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')

  useEffect(() => { loadClientes() }, [])

  async function loadClientes() {
    const { data } = await supabase
      .from('clientes')
      .select('*')
      .order('ultima_factura', { ascending: false })
    setClientes(data || [])
    setLoading(false)
  }

  const filtered = clientes.filter(c =>
    c.nombre.toLowerCase().includes(search.toLowerCase()) ||
    c.email?.toLowerCase().includes(search.toLowerCase()) ||
    c.nif?.toLowerCase().includes(search.toLowerCase())
  )

  const empresas = clientes.filter(c => c.tipo_cliente === 'empresa').length
  const particulares = clientes.filter(c => c.tipo_cliente === 'particular').length

  return (
    <div className="min-h-screen bg-slate-100 text-slate-900">
      <header className="border-b border-slate-200 px-6 py-4 flex items-center gap-4">
        <Link href="/admin" className="text-slate-500 hover:text-slate-900 text-sm">← Volver</Link>
        <h1 className="text-lg font-bold">Clientes</h1>
        <span className="text-sm text-slate-500">{clientes.length} total</span>
      </header>

      <div className="p-6 max-w-5xl mx-auto space-y-6">

        {/* Stats */}
        <div className="grid grid-cols-3 gap-4">
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-emerald-50 rounded-lg flex items-center justify-center">
              <Users size={18} className="text-emerald-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{clientes.length}</p>
              <p className="text-xs text-slate-500">Total clientes</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-blue-50 rounded-lg flex items-center justify-center">
              <Building2 size={18} className="text-blue-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{empresas}</p>
              <p className="text-xs text-slate-500">Empresas</p>
            </div>
          </div>
          <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center gap-3">
            <div className="w-10 h-10 bg-violet-50 rounded-lg flex items-center justify-center">
              <User size={18} className="text-violet-600" />
            </div>
            <div>
              <p className="text-2xl font-bold text-slate-900">{particulares}</p>
              <p className="text-xs text-slate-500">Particulares</p>
            </div>
          </div>
        </div>

        {/* Buscador */}
        <input
          type="text"
          placeholder="Buscar por nombre, email o NIF..."
          value={search}
          onChange={e => setSearch(e.target.value)}
          className="w-full bg-white border border-slate-200 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-emerald-500"
        />

        {/* Lista */}
        {loading ? (
          <p className="text-slate-500 text-sm">Cargando...</p>
        ) : filtered.length === 0 ? (
          <div className="bg-white rounded-xl border border-slate-200 p-10 text-center">
            <Users size={32} className="text-slate-300 mx-auto mb-3" />
            <p className="text-slate-500 text-sm">
              {search ? 'No hay resultados para tu búsqueda.' : 'Los clientes aparecerán aquí cuando generes facturas.'}
            </p>
          </div>
        ) : (
          <div className="space-y-3">
            {filtered.map(c => (
              <div key={c.id} className="bg-white border border-slate-200 rounded-xl p-5">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 ${c.tipo_cliente === 'empresa' ? 'bg-blue-50' : 'bg-violet-50'}`}>
                      {c.tipo_cliente === 'empresa'
                        ? <Building2 size={18} className="text-blue-600" />
                        : <User size={18} className="text-violet-600" />
                      }
                    </div>
                    <div>
                      <p className="font-semibold text-slate-900">{c.nombre}</p>
                      {c.contacto && c.contacto !== c.nombre && (
                        <p className="text-xs text-slate-500">{c.contacto}</p>
                      )}
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full font-medium flex-shrink-0 ${c.tipo_cliente === 'empresa' ? 'bg-blue-50 text-blue-700' : 'bg-violet-50 text-violet-700'}`}>
                    {c.tipo_cliente === 'empresa' ? 'Empresa' : 'Particular'}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {c.email && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Mail size={13} className="text-slate-400 flex-shrink-0" />
                      <a href={`mailto:${c.email}`} className="hover:text-emerald-600 truncate">{c.email}</a>
                    </div>
                  )}
                  {c.nif && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Hash size={13} className="text-slate-400 flex-shrink-0" />
                      <span>{c.nif}</span>
                    </div>
                  )}
                  {c.direccion && (
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <MapPin size={13} className="text-slate-400 flex-shrink-0" />
                      <span className="truncate">{c.direccion}</span>
                    </div>
                  )}
                  {c.ultima_factura && (
                    <div className="flex items-center gap-2 text-sm text-slate-500">
                      <Calendar size={13} className="text-slate-400 flex-shrink-0" />
                      <span>Última factura: {new Date(c.ultima_factura).toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })}</span>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
