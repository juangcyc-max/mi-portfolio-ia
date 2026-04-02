import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Cookies | Mindbridge IA',
  description: 'Política de cookies de Mindbridge IA conforme a la normativa española y europea.',
  robots: { index: false, follow: false },
}

export default function Cookies() {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-sm text-emerald-600 hover:underline mb-8 inline-block">
          ← Volver a la web
        </Link>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">Política de Cookies</h1>
        <p className="text-sm text-slate-400 mb-10">Última actualización: abril de 2026</p>

        <section className="space-y-8 text-sm leading-relaxed">

          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">1. ¿Qué son las cookies?</h2>
            <p>Las cookies son pequeños archivos de texto que los sitios web almacenan en tu dispositivo cuando los visitas. Sirven para que el sitio web funcione correctamente, recuerde tus preferencias y proporcione información sobre cómo se usa.</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">2. Cookies que utilizamos</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Cookie</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Tipo</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Finalidad</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Duración</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="px-4 py-3 font-mono">sb-*-auth-token</td>
                    <td className="px-4 py-3">Técnica esencial</td>
                    <td className="px-4 py-3">Gestión de sesión del panel de administración</td>
                    <td className="px-4 py-3">Sesión</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono">theme</td>
                    <td className="px-4 py-3">Preferencia</td>
                    <td className="px-4 py-3">Recordar el modo claro/oscuro seleccionado</td>
                    <td className="px-4 py-3">1 año</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono">lang</td>
                    <td className="px-4 py-3">Preferencia</td>
                    <td className="px-4 py-3">Recordar el idioma seleccionado (ES/EN)</td>
                    <td className="px-4 py-3">1 año</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3 font-mono">_vercel_*</td>
                    <td className="px-4 py-3">Técnica</td>
                    <td className="px-4 py-3">Funcionamiento de la infraestructura de Vercel</td>
                    <td className="px-4 py-3">Sesión</td>
                  </tr>
                </tbody>
              </table>
            </div>
            <p className="mt-4 text-slate-500">Este sitio web <strong>no utiliza cookies publicitarias ni de seguimiento de terceros</strong> (Google Analytics, Meta Pixel, etc.).</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">3. Cookies técnicas esenciales</h2>
            <p>Las cookies de sesión de autenticación son estrictamente necesarias para el funcionamiento del panel de administración. No requieren consentimiento previo conforme al artículo 22.2 de la LSSI-CE.</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">4. Cómo gestionar o eliminar las cookies</h2>
            <p>Puedes configurar tu navegador para bloquear o eliminar las cookies. Ten en cuenta que deshabilitar ciertas cookies puede afectar al funcionamiento del sitio web.</p>
            <ul className="mt-3 space-y-2 text-slate-600">
              <li><strong>Chrome:</strong> Configuración → Privacidad y seguridad → Cookies</li>
              <li><strong>Firefox:</strong> Opciones → Privacidad y seguridad → Cookies</li>
              <li><strong>Safari:</strong> Preferencias → Privacidad → Gestionar datos de sitios web</li>
              <li><strong>Edge:</strong> Configuración → Privacidad, búsqueda y servicios → Cookies</li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">5. Contacto</h2>
            <p>Para cualquier consulta sobre el uso de cookies, puedes contactarnos en: <a href="mailto:juangutierrezdelaconcha@mindbride.net" className="text-emerald-600 hover:underline">juangutierrezdelaconcha@mindbride.net</a></p>
          </div>

        </section>

        <div className="mt-12 pt-8 border-t border-slate-100 flex gap-6 text-xs text-slate-400">
          <Link href="/aviso-legal" className="hover:text-emerald-600">Aviso Legal</Link>
          <Link href="/privacidad" className="hover:text-emerald-600">Política de Privacidad</Link>
        </div>
      </div>
    </div>
  )
}
