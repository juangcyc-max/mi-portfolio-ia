import Link from 'next/link'
import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'Política de Privacidad | Mindbridge IA',
  description: 'Política de privacidad de Mindbridge IA conforme al Reglamento General de Protección de Datos (RGPD) y la LOPDGDD.',
  robots: { index: false, follow: false },
}

export default function Privacidad() {
  return (
    <div className="min-h-screen bg-white text-slate-800">
      <div className="max-w-3xl mx-auto px-6 py-16">
        <Link href="/" className="text-sm text-emerald-600 hover:underline mb-8 inline-block">
          ← Volver a la web
        </Link>

        <h1 className="text-3xl font-bold text-slate-900 mb-2">Política de Privacidad</h1>
        <p className="text-sm text-slate-400 mb-10">Última actualización: abril de 2026</p>

        <section className="space-y-8 text-sm leading-relaxed">

          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">1. Responsable del tratamiento</h2>
            <ul className="space-y-1 text-slate-600">
              <li><strong>Responsable:</strong> Juan Gutiérrez de la Concha</li>
              <li><strong>NIF:</strong> 72173348S</li>
              <li><strong>Domicilio:</strong> C/ Daoiz y Velarde 23, 5ºC, 39003 Santander, Cantabria</li>
              <li><strong>Email:</strong> <a href="mailto:juangutierrezdelaconcha@mindbride.net" className="text-emerald-600 hover:underline">juangutierrezdelaconcha@mindbride.net</a></li>
            </ul>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">2. Datos que recogemos y finalidad</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-xs border border-slate-200 rounded-lg overflow-hidden">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Dato</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Finalidad</th>
                    <th className="text-left px-4 py-3 font-semibold text-slate-700">Base legal</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  <tr>
                    <td className="px-4 py-3">Nombre y email (formulario de contacto)</td>
                    <td className="px-4 py-3">Responder a tu consulta y gestionar la relación comercial</td>
                    <td className="px-4 py-3">Consentimiento / Interés legítimo</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Mensajes del chat</td>
                    <td className="px-4 py-3">Atención al usuario y mejora del servicio</td>
                    <td className="px-4 py-3">Consentimiento</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Datos de solicitud de presupuesto</td>
                    <td className="px-4 py-3">Elaborar y enviar propuesta comercial</td>
                    <td className="px-4 py-3">Ejecución de precontrato</td>
                  </tr>
                  <tr>
                    <td className="px-4 py-3">Dirección IP (logs)</td>
                    <td className="px-4 py-3">Seguridad y prevención de abusos</td>
                    <td className="px-4 py-3">Interés legítimo</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">3. Conservación de los datos</h2>
            <p>Los datos se conservan durante el tiempo necesario para la finalidad para la que fueron recogidos y, en todo caso, durante los plazos legalmente exigidos. Los datos de contacto y presupuestos se conservan durante un máximo de 5 años desde el último contacto, conforme a las obligaciones fiscales y mercantiles.</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">4. Destinatarios y transferencias internacionales</h2>
            <p>Tus datos pueden ser tratados por los siguientes proveedores de servicios, con los que se han suscrito los acuerdos de tratamiento correspondientes:</p>
            <ul className="mt-3 space-y-2 text-slate-600">
              <li><strong>Supabase Inc.</strong> — Almacenamiento de datos (servidores en la Unión Europea)</li>
              <li><strong>Vercel Inc.</strong> — Alojamiento web (servidores en la UE y EEUU con cláusulas contractuales tipo)</li>
              <li><strong>Resend Inc.</strong> — Envío de emails transaccionales</li>
              <li><strong>Anthropic PBC</strong> — Procesamiento de mensajes del chat por inteligencia artificial (EEUU, cláusulas contractuales tipo)</li>
            </ul>
            <p className="mt-3">No se ceden datos a terceros con fines comerciales.</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">5. Tus derechos</h2>
            <p>Puedes ejercer en cualquier momento los siguientes derechos enviando un email a <a href="mailto:juangutierrezdelaconcha@mindbride.net" className="text-emerald-600 hover:underline">juangutierrezdelaconcha@mindbride.net</a> con copia de tu documento de identidad:</p>
            <ul className="mt-3 space-y-1 text-slate-600 list-disc list-inside">
              <li><strong>Acceso:</strong> conocer qué datos tenemos sobre ti</li>
              <li><strong>Rectificación:</strong> corregir datos inexactos</li>
              <li><strong>Supresión:</strong> solicitar el borrado de tus datos</li>
              <li><strong>Limitación:</strong> restringir el tratamiento</li>
              <li><strong>Portabilidad:</strong> recibir tus datos en formato estructurado</li>
              <li><strong>Oposición:</strong> oponerte al tratamiento basado en interés legítimo</li>
            </ul>
            <p className="mt-3">También tienes derecho a presentar una reclamación ante la <strong>Agencia Española de Protección de Datos</strong> (AEPD) en <a href="https://www.aepd.es" className="text-emerald-600 hover:underline" target="_blank" rel="noopener noreferrer">www.aepd.es</a>.</p>
          </div>

          <div>
            <h2 className="text-lg font-semibold text-slate-900 mb-3">6. Seguridad</h2>
            <p>Aplicamos medidas técnicas y organizativas apropiadas para proteger tus datos: cifrado en tránsito (HTTPS), acceso restringido a la base de datos, autenticación segura y control de acceso por roles.</p>
          </div>

        </section>

        <div className="mt-12 pt-8 border-t border-slate-100 flex gap-6 text-xs text-slate-400">
          <Link href="/aviso-legal" className="hover:text-emerald-600">Aviso Legal</Link>
          <Link href="/cookies" className="hover:text-emerald-600">Política de Cookies</Link>
        </div>
      </div>
    </div>
  )
}
