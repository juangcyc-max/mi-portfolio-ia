import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Aviso Legal | Mindbridge IA',
  description: 'Aviso legal de Mindbridge IA conforme a la Ley 34/2002 de Servicios de la Sociedad de la Información.',
  robots: { index: false, follow: false },
}

export default function AvisoLegal() {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-sm text-emerald-600 hover:underline mb-8 inline-block">
          ← Volver a la web
        </Link>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">Aviso Legal</h1>
        <p className="text-sm text-slate-400 mb-10">Última actualización: abril de 2026</p>

        <section className="space-y-8 text-sm leading-relaxed">

          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">1. Datos identificativos del titular</h2>
            <p>En cumplimiento de la Ley 34/2002, de 11 de julio, de Servicios de la Sociedad de la Información y Comercio Electrónico (LSSI-CE), se facilitan los siguientes datos de identificación del titular del sitio web:</p>
            <ul className="mt-3 space-y-1 text-slate-600">
              <li><strong>Titular:</strong> Juan Gutiérrez de la Concha</li>
              <li><strong>NIF:</strong> 72173348S</li>
              <li><strong>Actividad:</strong> Desarrollo web, servicios cloud e inteligencia artificial</li>
              <li><strong>Domicilio:</strong> C/ Daoiz y Velarde 23, 5ºC, 39003 Santander, Cantabria</li>
              <li><strong>Email de contacto:</strong> <a href="mailto:juangutierrezdelaconcha@mindbride.net" className="text-emerald-600 hover:underline">juangutierrezdelaconcha@mindbride.net</a></li>
              <li><strong>Sitio web:</strong> <a href="https://mindbride.net" className="text-emerald-600 hover:underline">https://mindbride.net</a></li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">2. Objeto y ámbito de aplicación</h2>
            <p>El presente Aviso Legal regula el uso del sitio web <strong>mindbride.net</strong> (en adelante, "el Sitio Web"), del que es titular Juan Gutiérrez de la Concha, con marca comercial <strong>Mindbridge IA</strong>. El acceso y uso del Sitio Web atribuye la condición de usuario e implica la aceptación plena y sin reservas de todas las disposiciones incluidas en este Aviso Legal.</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">3. Propiedad intelectual e industrial</h2>
            <p>Todos los contenidos del Sitio Web (textos, imágenes, logotipos, diseño gráfico, código fuente y cualquier otro elemento) son propiedad exclusiva de Juan Gutiérrez de la Concha o de terceros que han autorizado su uso. Queda prohibida su reproducción, distribución, comunicación pública o transformación sin autorización expresa y escrita del titular.</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">4. Responsabilidad y exención</h2>
            <p>El titular no se hace responsable de los daños derivados del uso del Sitio Web, interrupciones del servicio, errores en los contenidos ni de los sitios web enlazados desde este. El Sitio Web puede contener enlaces a terceros sobre los cuales el titular no ejerce ningún control.</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">5. Legislación aplicable y jurisdicción</h2>
            <p>Este Aviso Legal se rige por la legislación española. Para la resolución de cualquier controversia derivada del acceso o uso del Sitio Web, las partes se someten a los Juzgados y Tribunales de Santander (Cantabria), con renuncia expresa a cualquier otro fuero.</p>
          </div>

        </section>

        <div className="mt-12 pt-8 border-t border-slate-100 flex gap-6 text-xs text-slate-400">
          <Link href="/privacidad" className="hover:text-emerald-600">Política de Privacidad</Link>
          <Link href="/cookies" className="hover:text-emerald-600">Política de Cookies</Link>
        </div>
      </div>
    </div>
  )
}
