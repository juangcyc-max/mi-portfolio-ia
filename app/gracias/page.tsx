'use client'

import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Suspense } from 'react'

function GraciasContent() {
  const params = useSearchParams()
  const sessionId = params.get('session_id')

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-6 py-20">
      <Link href="/" className="mb-12">
        <img src="/logo.svg" alt="Mindbridge IA" className="h-12" />
      </Link>

      {/* Icono check */}
      <div className="w-20 h-20 rounded-full bg-emerald-500/20 flex items-center justify-center mb-8">
        <svg className="w-10 h-10 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
        </svg>
      </div>

      <h1 className="text-4xl sm:text-5xl font-black text-center mb-4">
        ¡Pago <span className="text-emerald-400">completado</span>!
      </h1>
      <p className="text-slate-400 text-center text-lg mb-10 max-w-md leading-relaxed">
        Tu licencia de <strong className="text-white">Mindbridge IA</strong> está activa.
        Recibirás un email con tu clave de licencia en los próximos minutos.
      </p>

      {/* Pasos */}
      <div className="w-full max-w-md bg-slate-900 border border-slate-800 rounded-2xl p-6 mb-8">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-5">Próximos pasos</h2>
        <div className="space-y-4">
          {[
            { n: '1', title: 'Revisa tu email', desc: 'Te enviamos la clave de licencia (MB-XXXX-XXXX-XXXX) a tu correo.' },
            { n: '2', title: 'Descarga la app', desc: 'Si aún no la tienes, descárgala para Windows.', link: '/descargar' },
            { n: '3', title: 'Activa tu licencia', desc: 'Abre la app → Configuración → Activar licencia e introduce la clave.' },
          ].map(step => (
            <div key={step.n} className="flex items-start gap-4">
              <span className="flex-shrink-0 w-7 h-7 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                {step.n}
              </span>
              <div>
                <p className="text-white font-semibold text-sm">{step.title}</p>
                <p className="text-slate-400 text-sm mt-0.5">
                  {step.desc}{' '}
                  {step.link && <Link href={step.link} className="text-emerald-400 hover:underline">Ir a descargas →</Link>}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Factura */}
      <p className="text-slate-500 text-sm text-center mb-8">
        Stripe te enviará la factura automáticamente a tu email de pago.
      </p>

      <Link
        href="/"
        className="px-6 py-3 bg-slate-800 hover:bg-slate-700 rounded-xl text-sm font-semibold text-white transition-colors"
      >
        Volver a la web
      </Link>

      {sessionId && (
        <p className="mt-6 text-slate-700 text-xs">ID de sesión: {sessionId.slice(0, 30)}…</p>
      )}
    </main>
  )
}

export default function GraciasPage() {
  return (
    <Suspense>
      <GraciasContent />
    </Suspense>
  )
}
