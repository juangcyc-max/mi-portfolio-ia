import Link from 'next/link'
import Image from 'next/image'

const DOWNLOAD_URL = 'https://github.com/juangcyc-max/mindbridge-desktop/releases/download/v1.0.1/Mindbridge.IA.Setup.1.0.1.exe'

// ── Data ────────────────────────────────────────────────────────────────────

type Feature = { icon: string; title: string; desc: string }
type Plan     = { name: string; price: string; period?: string; badge?: string; color: string; textColor: string; features: string[]; cta: string; ctaStyle: string; href: string }

const FEATURES: Feature[] = [
  { icon: 'M8.625 12a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H8.25m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0H12m4.125 0a.375.375 0 11-.75 0 .375.375 0 01.75 0zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 01-2.555-.337A5.972 5.972 0 015.41 20.97a5.969 5.969 0 01-.474-.065 4.48 4.48 0 00.978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25z', title: 'Chat IA ilimitado',           desc: 'Conversa con Claude directamente desde tu escritorio. Sin abrir el navegador.' },
  { icon: 'M9 17.25v1.007a3 3 0 01-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0115 18.257V17.25m6-12V15a2.25 2.25 0 01-2.25 2.25H5.25A2.25 2.25 0 013 15V5.25m18 0A2.25 2.25 0 0018.75 3H5.25A2.25 2.25 0 003 5.25m18 0H3', title: 'Control total de Windows',     desc: 'Volumen, fondo de pantalla, apps, capturas — todo con lenguaje natural.' },
  { icon: 'M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 001.5-1.5V6a1.5 1.5 0 00-1.5-1.5H3.75A1.5 1.5 0 002.25 6v12a1.5 1.5 0 001.5 1.5zm10.5-11.25h.008v.008h-.008V8.25zm.375 0a.375.375 0 11-.75 0 .375.375 0 01.75 0z', title: 'Generación de imágenes IA',    desc: 'Crea imágenes profesionales con DALL·E desde la misma app.' },
  { icon: 'M12 6v6h4.5m4.5 0a9 9 0 11-18 0 9 9 0 0118 0z', title: 'Automatizaciones programadas', desc: 'Define tareas que se ejecutan solas: limpieza, actualizaciones, seguridad.' },
  { icon: 'M9 12.75L11.25 15 15 9.75m-3-7.036A11.959 11.959 0 013.598 6 11.99 11.99 0 003 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285z', title: 'Privacidad local',             desc: 'La app corre en tu PC. Tus archivos y pantalla no salen de tu máquina.' },
  { icon: 'M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z', title: 'Siempre disponible',         desc: 'Vive en la barra de tareas. Un clic y tienes tu asistente listo.' },
]

const PLANS: Plan[] = [
  { name: 'Gratuito', price: '€0',   period: '',     color: 'border-slate-200 bg-white',          textColor: 'text-slate-500',   features: ['5 consultas Chat IA al día', '3 acciones del Asistente al día', '3 imágenes IA al mes'],                                                              cta: 'Descargar gratis',    ctaStyle: 'bg-slate-100 hover:bg-slate-200 text-slate-700',   href: DOWNLOAD_URL },
  { name: 'Base',     price: '€21',  period: '/mes', color: 'border-emerald-200 bg-emerald-50/50', textColor: 'text-emerald-600', features: ['Chat IA ilimitado', 'Asistente completo', '20 imágenes IA al mes', 'Automatizaciones básicas', 'Soporte por email'],                                  cta: 'Empezar con Base',    ctaStyle: 'bg-emerald-600 hover:bg-emerald-500 text-white',   href: '/descargar' },
  { name: 'Medio',    price: '€60',  period: '/mes', color: 'border-violet-200 bg-violet-50/50',  textColor: 'text-violet-600',  features: ['Todo lo de Base', '50 imágenes IA al mes', 'Automatizaciones avanzadas', 'Control total de Windows vía IA', 'Soporte prioritario'], badge: 'Más popular', cta: 'Empezar con Medio',   ctaStyle: 'bg-violet-600 hover:bg-violet-500 text-white',     href: '/descargar' },
  { name: 'Total',    price: '€150', period: '/mes', color: 'border-amber-200 bg-amber-50/50',    textColor: 'text-amber-600',   features: ['Todo sin restricciones', '180 imágenes IA al mes', 'Automatizaciones sin límite', 'Acceso anticipado a funciones', 'Soporte dedicado 24/7'],           cta: 'Empezar con Total',   ctaStyle: 'bg-amber-600 hover:bg-amber-500 text-white',       href: '/descargar' },
]

// ── Sub-components ───────────────────────────────────────────────────────────

function SectionHeading({ title, sub }: { title: string; sub?: string }) {
  return (
    <>
      <h2 className="text-3xl font-black text-center mb-3 text-slate-900">{title}</h2>
      {sub && <p className="text-slate-500 text-center mb-14">{sub}</p>}
    </>
  )
}

function FeatureCard({ icon, title, desc }: Feature) {
  return (
    <div className="bg-white border border-slate-200 rounded-2xl p-6 hover:shadow-md transition-shadow">
      <div className="w-11 h-11 rounded-xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 mb-4">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
          <path strokeLinecap="round" strokeLinejoin="round" d={icon} />
        </svg>
      </div>
      <h3 className="font-bold text-slate-900 text-base mb-2">{title}</h3>
      <p className="text-slate-500 text-sm leading-relaxed">{desc}</p>
    </div>
  )
}

function PlanCard({ name, price, period, badge, color, textColor, features, cta, ctaStyle, href }: Plan) {
  return (
    <div className={`relative rounded-2xl border p-6 flex flex-col ${color}`}>
      {badge && (
        <span className="absolute -top-3 left-1/2 -translate-x-1/2 bg-violet-500 text-white text-[10px] font-bold px-3 py-0.5 rounded-full uppercase tracking-wider">
          {badge}
        </span>
      )}
      <p className={`font-bold text-sm mb-1 ${textColor}`}>{name}</p>
      <div className="flex items-baseline gap-1 mb-5">
        <span className="text-3xl font-black text-slate-900">{price}</span>
        {period && <span className="text-slate-400 text-xs">{period}</span>}
      </div>
      <ul className="space-y-2 flex-1 mb-6">
        {features.map(f => (
          <li key={f} className="flex items-start gap-2 text-xs text-slate-500">
            <svg className={`w-3 h-3 mt-0.5 shrink-0 ${textColor}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
            </svg>
            {f}
          </li>
        ))}
      </ul>
      <a href={href} className={`text-center text-sm font-semibold py-2.5 rounded-xl transition-colors ${ctaStyle}`}>
        {cta}
      </a>
    </div>
  )
}

// ── Page ─────────────────────────────────────────────────────────────────────

export const metadata = {
  title: 'Mindbridge IA Desktop — Tu asistente de IA para Windows',
  description: 'Controla tu PC con lenguaje natural. Chat IA, automatizaciones, generación de imágenes y más desde tu escritorio Windows.',
}

export default function DesktopPage() {
  return (
    <main className="min-h-screen bg-slate-100 text-slate-900 relative overflow-hidden">

      <div className="absolute inset-0 pointer-events-none -z-0">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-[140px]" />
        <div className="absolute top-32 right-1/4 w-72 h-72 bg-cyan-400/8 rounded-full blur-[100px]" />
      </div>

      <nav className="relative z-10 sticky top-0 w-full border-b border-slate-200 bg-white/80 backdrop-blur-sm">
        <div className="max-w-6xl mx-auto px-8 py-4 flex items-center justify-between">
          <Link href="/"><Image src="/logo.svg" alt="Mindbridge IA" width={110} height={28} /></Link>
          <a href={DOWNLOAD_URL} className="px-4 py-2 bg-emerald-600 hover:bg-emerald-500 text-white text-sm font-semibold rounded-xl transition-colors">
            Descargar gratis
          </a>
        </div>
      </nav>

      <section className="relative z-10 max-w-4xl mx-auto px-8 pt-24 pb-20 text-center">
        <div className="inline-flex items-center gap-2 bg-emerald-500/10 border border-emerald-500/20 rounded-full px-4 py-1.5 text-emerald-600 text-sm font-medium mb-8">
          <span className="w-2 h-2 bg-emerald-500 rounded-full animate-pulse" />
          Windows 10 / 11 · v1.0.1
        </div>
        <h1 className="text-5xl sm:text-7xl font-black leading-none mb-6 tracking-tight">
          Tu asistente de IA<br /><span className="text-emerald-500">para Windows</span>
        </h1>
        <p className="text-slate-600 text-xl leading-relaxed mb-10 max-w-2xl mx-auto">
          Controla tu PC con lenguaje natural. Chat con IA, automatizaciones, generación de imágenes y mucho más — todo desde tu escritorio.
        </p>
        <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
          <a href={DOWNLOAD_URL} className="flex items-center gap-3 px-8 py-4 bg-emerald-500 hover:bg-emerald-400 text-white font-bold rounded-2xl transition-colors text-lg shadow-lg shadow-emerald-500/20">
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
            </svg>
            Descargar gratis
          </a>
          <p className="text-slate-400 text-sm">Windows 10 / 11 · 64-bit · 81 MB</p>
        </div>
      </section>

      {/* Screenshots */}
      <section className="relative z-10 py-20 border-t border-slate-200">
        <div className="max-w-6xl mx-auto px-8">
          <SectionHeading title="Vívelo en acción" />
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {[
              { src: '/screenshots/Screenshot_5.png',  caption: 'Chat IA — conversa con Claude desde el escritorio' },
              { src: '/screenshots/Screenshot_4.png',  caption: 'Asistente — controla tu PC con lenguaje natural' },
              { src: '/screenshots/Screenshot_14.png', caption: 'Imágenes IA — genera imágenes con inteligencia artificial' },
              { src: '/screenshots/Screenshot_7.png',  caption: 'Automatizaciones — tareas programadas en segundo plano' },
            ].map(({ src, caption }) => (
              <div key={src}>
                <div className="rounded-2xl overflow-hidden border border-slate-200 shadow-lg bg-slate-800">
                  <Image src={src} alt={caption} width={1280} height={800} className="w-full h-auto" />
                </div>
                <p className="text-slate-500 text-sm text-center mt-3">{caption}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="relative z-10 max-w-6xl mx-auto px-8 py-20 border-t border-slate-200">
        <SectionHeading title="Todo lo que necesitas" sub="Un asistente completo que vive en tu escritorio." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {FEATURES.map(f => <FeatureCard key={f.title} {...f} />)}
        </div>
      </section>

      <section className="relative z-10 max-w-6xl mx-auto px-8 py-20 border-t border-slate-200">
        <SectionHeading title="Planes y precios" sub="Empieza gratis. Escala cuando necesites más." />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {PLANS.map(p => <PlanCard key={p.name} {...p} />)}
        </div>
        <p className="text-center text-slate-400 text-xs mt-6">
          Pago seguro con Stripe · Recibirás la clave de licencia por email tras la compra.
        </p>
      </section>

      <footer className="relative z-10 border-t border-slate-200 bg-white py-10 text-center text-slate-400 text-sm">
        <Image src="/logo.svg" alt="Mindbridge IA" width={100} height={24} className="mx-auto mb-4 opacity-40" />
        <p>© 2026 Mindbridge IA · <Link href="/" className="hover:text-slate-600 transition-colors">Volver a la web</Link></p>
      </footer>

    </main>
  )
}
