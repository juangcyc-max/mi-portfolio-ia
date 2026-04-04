'use client'

import Link from 'next/link'
import { useState } from 'react'

export default function DownloadPage() {
  const [copied, setCopied] = useState(false)

  function copyLink() {
    navigator.clipboard.writeText('https://mindbride.net/descargar')
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }

  return (
    <main className="min-h-screen bg-slate-950 text-white flex flex-col items-center justify-center px-6 py-20">
      {/* Logo */}
      <Link href="/" className="mb-12">
        <img src="/logo.svg" alt="Mindbridge IA" className="h-12" />
      </Link>

      <h1 className="text-4xl sm:text-5xl font-black text-center mb-4">
        Descarga la <span className="text-emerald-400">app</span>
      </h1>
      <p className="text-slate-400 text-center text-lg mb-14 max-w-md">
        Accede a Mindbridge IA desde tu móvil — chat con IA, presupuestos y soporte técnico en tu bolsillo.
      </p>

      <div className="w-full max-w-lg space-y-4">

        {/* Android */}
        <a
          href="/downloads/mindbridge.apk"
          download
          className="flex items-center gap-5 bg-emerald-500 hover:bg-emerald-400 transition-colors rounded-2xl px-6 py-5 w-full group"
        >
          <div className="flex-shrink-0">
            <svg className="w-10 h-10" viewBox="0 0 24 24" fill="white">
              <path d="M17.6 9.48l1.84-3.18c.16-.31.04-.69-.26-.85a.637.637 0 0 0-.83.22l-1.88 3.24a11.463 11.463 0 0 0-8.94 0L5.65 5.67a.643.643 0 0 0-.87-.2c-.28.18-.37.54-.22.83L6.4 9.48A10.78 10.78 0 0 0 1 18h22a10.78 10.78 0 0 0-5.4-8.52zM7 15.25a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5zm10 0a1.25 1.25 0 1 1 0-2.5 1.25 1.25 0 0 1 0 2.5z"/>
            </svg>
          </div>
          <div className="flex-1">
            <p className="font-bold text-white text-lg leading-tight">Descargar para Android</p>
            <p className="text-emerald-100 text-sm">Archivo APK · Instalación directa</p>
          </div>
          <svg className="w-6 h-6 text-white group-hover:translate-x-1 transition-transform" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
          </svg>
        </a>

        {/* iOS */}
        <div className="flex items-start gap-5 bg-slate-800/60 border border-slate-700 rounded-2xl px-6 py-5 w-full">
          <div className="flex-shrink-0 mt-1">
            <svg className="w-10 h-10 text-slate-400" viewBox="0 0 24 24" fill="currentColor">
              <path d="M18.71 19.5c-.83 1.24-1.71 2.45-3.05 2.47-1.34.03-1.77-.79-3.29-.79-1.53 0-2 .77-3.27.82-1.31.05-2.3-1.32-3.14-2.53C4.25 17 2.94 12.45 4.7 9.39c.87-1.52 2.43-2.48 4.12-2.51 1.28-.02 2.5.87 3.29.87.78 0 2.26-1.07 3.8-.91.65.03 2.47.26 3.64 1.98l-.09.06c-.22.14-2.15 1.26-2.13 3.75.03 2.99 2.6 3.99 2.63 4l.05.02zM13 3.5c.73-.83 1.94-1.46 2.94-1.5.13 1.17-.34 2.35-1.04 3.19-.69.85-1.83 1.51-2.95 1.42-.15-1.15.41-2.35 1.05-3.11z"/>
            </svg>
          </div>
          <div>
            <p className="font-bold text-white text-lg leading-tight mb-1">iPhone / iPad</p>
            <p className="text-slate-400 text-sm leading-relaxed">
              Abre <strong className="text-slate-300">Safari</strong> en tu iPhone, ve a{' '}
              <strong className="text-emerald-400">mindbride.net</strong> y pulsa{' '}
              <strong className="text-slate-300">Compartir → Añadir a pantalla de inicio</strong>.
              La app aparecerá como nativa.
            </p>
          </div>
        </div>

        {/* Share link */}
        <button
          onClick={copyLink}
          className="flex items-center justify-center gap-3 w-full border border-slate-700 hover:border-slate-500 rounded-2xl px-6 py-4 text-slate-400 hover:text-white transition-colors text-sm font-medium"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
          </svg>
          {copied ? '¡Enlace copiado!' : 'Copiar enlace de descarga'}
        </button>
      </div>

      {/* Install instructions */}
      <div className="mt-14 max-w-lg w-full">
        <h2 className="text-sm font-bold text-slate-400 uppercase tracking-wider mb-4">Cómo instalar en Android</h2>
        <div className="space-y-3">
          {[
            'Pulsa el botón verde para descargar el archivo APK',
            'Abre el archivo descargado desde notificaciones',
            'Si aparece un aviso de seguridad, pulsa "Instalar de todas formas"',
            'La app Mindbridge IA aparecerá en tu pantalla de inicio',
          ].map((step, i) => (
            <div key={i} className="flex items-start gap-3">
              <span className="flex-shrink-0 w-6 h-6 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center text-xs font-bold mt-0.5">
                {i + 1}
              </span>
              <p className="text-slate-400 text-sm leading-relaxed">{step}</p>
            </div>
          ))}
        </div>
      </div>

      <p className="mt-12 text-slate-600 text-xs text-center">
        Mindbridge IA · <Link href="/" className="hover:text-slate-400 transition-colors">Volver a la web</Link>
      </p>
    </main>
  )
}
