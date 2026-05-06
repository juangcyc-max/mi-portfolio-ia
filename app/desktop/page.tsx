import Link from 'next/link'
import Image from 'next/image'

const FEATURES = [
  {
    icon: '🤖',
    title: 'Chat IA ilimitado',
    desc: 'Conversa con Claude directamente desde tu escritorio. Respuestas inteligentes sin abrir el navegador.',
  },
  {
    icon: '🖥️',
    title: 'Control total de Windows',
    desc: 'Cambia el volumen, fondo de pantalla, abre apps, toma capturas — todo con lenguaje natural.',
  },
  {
    icon: '🖼️',
    title: 'Generación de imágenes IA',
    desc: 'Crea imágenes profesionales con DALL·E desde la misma app. Sin cuentas extra.',
  },
  {
    icon: '⏰',
    title: 'Automatizaciones programadas',
    desc: 'Define tareas que se ejecutan solas: limpiar escritorio, revisar actualizaciones, auditorías de seguridad.',
  },
  {
    icon: '🛡️',
    title: 'Privacidad local',
    desc: 'La app corre en tu PC. Tus archivos y pantalla no salen de tu máquina.',
  },
  {
    icon: '⚡',
    title: 'Siempre disponible',
    desc: 'Vive en la barra de tareas. Un clic y tienes tu asistente de IA listo.',
  },
]

const PLANS = [
  {
    name: 'Gratuito',
    price: '€0',
    period: '',
    color: 'border-slate-700 bg-slate-800/50',
    textColor: 'text-slate-400',
    features: ['5 consultas Chat IA al día', '3 acciones del Asistente al día', '3 imágenes IA al mes'],
    cta: 'Descargar gratis',
    ctaStyle: 'bg-slate-700 hover:bg-slate-600 text-white',
    href: 'https://github.com/juangcyc-max/mindbridge-desktop/releases/download/v1.0.1/Mindbridge.IA.Setup.1.0.1.exe',
  },
  {
    name: 'Base',
    price: '€21',
    period: '/mes',
    color: 'border-emerald-500/40 bg-emerald-500/5',
    textColor: 'text-emerald-400',
    features: ['Chat IA ilimitado', 'Asistente completo', '20 imágenes IA al mes', 'Automatizaciones básicas', 'Soporte por email'],
    cta: 'Empezar con Base',
    ctaStyle: 'bg-emerald-600 hover:bg-emerald-500 text-white',
    href: '/descargar',
  },
  {
    name: 'Medio',
    price: '€60',
    period: '/mes',
    badge: 'Más popular',
    color: 'border-violet-500/40 bg-violet-500/5',
    textColor: 'text-violet-400',
    features: ['Todo lo de Base', '50 imágenes IA al mes', 'Automatizaciones avanzadas', 'Control total de Windows vía IA', 'Soporte prioritario'],
    cta: 'Empezar con Medio',
    ctaStyle: 'bg-violet-600 hover:bg-violet-500 text-white',
    href: '/descargar',
  },
  {
    name: 'Total',
    price: '€150',
    period: '/mes',
    color: 'border-amber-500/40 bg-amber-500/5',
    textColor: 'text-amber-400',
    features: ['Todo sin restricciones', '180 imágenes IA al mes', 'Automatizaciones sin límite', 'Acceso anticipado a funciones', 'Soporte dedicado 24/7'],
    cta: 'Empezar con Total',
    ctaStyle: 'bg-amber-600 hover:bg-amber-500 text-white',
    href: '/descargar',
  },
]

export const metadata = {
  title: 'Mindbridge IA Desktop — Tu asistente de IA para Windows',
  description: 'Controla tu PC con lenguaje natural. Chat IA, automatizaciones, generación de imágenes y más desde tu escritorio Windows.',
}

export default function DesktopPage() {
  return (
    <main className="min-h-screen bg-slate-950 text-white">

      {/* Nav */}
      <nav className="flex items-center justify-between px-8 py-5 border-b border-slate-800/50 max-w-6xl mx-auto">
        <Link href="/">
          <Image src="/logo.svg" alt="Mindbridge IA" width={140} height={32} />
        </Link>
        <a
          href="https://github.com/juangcyc-max/mindbridge-desktop/releases/download/v1.0.1/Mindbridge.IA.Setup.1.0.1.exe"
          className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-colors"
        >
          Descargar gratis
        </a>
      </nav>

      {/* Hero */}
      <section className="max-w-4xl mx-auto px-8 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-emerald-400 text-sm font-medium mb-8">
          <span className="w-2 h-2 bg-emerald-400 rounded-full animate-pulse" />
          Windows 10 / 11 · v1.0.1
        </div>

        <h1 className="text-5xl sm:text-7xl font-black leading-none mb-6">
          Tu asistente de IA<br />
          <span className="text-emerald-400">para Windows</span>
        </h1>

        <p className="text-slate-400 text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
          Controla tu PC con lenguaje natural. Chat con IA, automatizaciones, generación de imágenes y mucho más — todo desde tu escritorio.
        </p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a
            href="https://github.com/juangcyc-max/mindbridge-desktop/releases/download/v1.0.1/Mindbridge.IA.Setup.1.0.1.exe"
            className="flex items-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-2xl transition-colors text-lg"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Descargar gratis
          </a>
          <p className="text-slate-500 text-sm">Windows 10 / 11 · 64-bit · 81 MB</p>
        </div>
      </section>

      {/* Features */}
      <section className="max-w-6xl mx-auto px-8 py-20 border-t border-slate-800/50">
        <h2 className="text-3xl font-black text-center mb-3">Todo lo que necesitas</h2>
        <p className="text-slate-400 text-center mb-14">Un asistente completo que vive en tu escritorio.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {FEATURES.map(f => (
            <div key={f.title} className="bg-slate-900 border border-slate-800 rounded-2xl p-6">
              <span className="text-3xl mb-4 block">{f.icon}</span>
              <h3 className="font-bold text-white text-lg mb-2">{f.title}</h3>
              <p className="text-slate-400 text-sm leading-relaxed">{f.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Plans */}
      <section className="max-w-6xl mx-auto px-8 py-20 border-t border-slate-800/50">
        <h2 className="text-3xl font-black text-center mb-3">Planes y precios</h2>
        <p className="text-slate-400 text-center mb-14">Empieza gratis. Escala cuando necesites más.</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANS.map(p => (
            <div key={p.name} className={`relative rounded-2xl border p-6 flex flex-col ${p.color}`}>
              {p.badge && (
                <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-500 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
                  {p.badge}
                </span>
              )}
              <p className={`font-bold text-sm mb-1 ${p.textColor}`}>{p.name}</p>
              <div className="flex items-baseline gap-1 mb-5">
                <span className="text-3xl font-black text-white">{p.price}</span>
                {p.period && <span className="text-slate-500 text-xs">{p.period}</span>}
              </div>
              <ul className="space-y-2 flex-1 mb-6">
                {p.features.map(f => (
                  <li key={f} className="flex items-start gap-2 text-xs text-slate-400">
                    <svg className={`w-3 h-3 mt-0.5 shrink-0 ${p.textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                    </svg>
                    {f}
                  </li>
                ))}
              </ul>
              <a
                href={p.href}
                className={`text-center text-sm font-semibold py-2.5 rounded-xl transition-colors ${p.ctaStyle}`}
              >
                {p.cta}
              </a>
            </div>
          ))}
        </div>
        <p className="text-center text-slate-600 text-xs mt-6">
          Pago seguro con Stripe · Recibirás la clave de licencia por email tras la compra.
        </p>
      </section>

      {/* Footer */}
      <footer className="border-t border-slate-800/50 py-10 text-center text-slate-600 text-sm">
        <Image src="/logo.svg" alt="Mindbridge IA" width={100} height={24} className="mx-auto mb-4 opacity-40" />
        <p>© 2026 Mindbridge IA · <Link href="/" className="hover:text-slate-400 transition-colors">Volver a la web</Link></p>
      </footer>

    </main>
  )
}
