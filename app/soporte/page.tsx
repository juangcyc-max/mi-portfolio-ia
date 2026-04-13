'use client'

import { useState, useRef, useEffect } from 'react'

type ChatMessage = { role: 'user' | 'assistant'; content: string }

const GREETING = `Hola 👋 Soy el asistente de soporte de **Mindbridge IA**.

Cuéntame qué problema tienes y trataré de resolverlo ahora mismo. Si no puedo, lo escalaré directamente a Juan.`

export default function SoportePage() {
  const [tab, setTab] = useState<'chat' | 'form'>('chat')
  const [messages, setMessages] = useState<ChatMessage[]>([
    { role: 'assistant', content: GREETING }
  ])
  const [input, setInput] = useState('')
  const [typing, setTyping] = useState(false)
  const [chatEmail, setChatEmail] = useState('')
  const [chatName, setChatName] = useState('')
  const [identified, setIdentified] = useState(false)
  const bottomRef = useRef<HTMLDivElement>(null)

  // Form state
  const [form, setForm] = useState({ name: '', email: '', service: '', description: '', priority: 'normal' })
  const [sending, setSending] = useState(false)
  const [sent, setSent] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, typing])

  async function sendChat() {
    if (!input.trim() || typing) return

    if (!identified) {
      // Pedir nombre y email primero
      const userText = input.trim()
      setMessages(prev => [...prev, { role: 'user', content: userText }])
      setInput('')

      if (!chatName) {
        setChatName(userText)
        setMessages(prev => [...prev, { role: 'assistant', content: `Gracias, **${userText}**. ¿Cuál es tu email para poder contactarte si es necesario?` }])
        return
      }
      if (!chatEmail) {
        setChatEmail(userText)
        setIdentified(true)
        setMessages(prev => [...prev, { role: 'assistant', content: `Perfecto. Ahora cuéntame qué problema tienes con tu servicio de Mindbridge IA.` }])
        return
      }
    }

    const userMsg = input.trim()
    setInput('')
    setMessages(prev => [...prev, { role: 'user', content: userMsg }])
    setTyping(true)

    try {
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: chatName,
          email: chatEmail,
          description: userMsg,
          priority: 'normal',
          source: 'support_chat',
        }),
      })
      const data = await res.json()
      setTyping(false)

      if (data.success) {
        if (data.resolvedByAI && data.aiResponse) {
          setMessages(prev => [...prev, { role: 'assistant', content: data.aiResponse }])
        } else {
          setMessages(prev => [...prev, {
            role: 'assistant',
            content: `He registrado tu incidencia y **Juan te contactará en breve** en ${chatEmail}.\n\nSi es urgente, escríbenos a juangutierrezdelaconcha@mindbride.net.`
          }])
        }
      } else {
        setMessages(prev => [...prev, { role: 'assistant', content: 'Ha ocurrido un error. Por favor usa el formulario de contacto.' }])
      }
    } catch {
      setTyping(false)
      setMessages(prev => [...prev, { role: 'assistant', content: 'No he podido procesar tu solicitud. Usa el formulario o escríbenos a juangutierrezdelaconcha@mindbride.net.' }])
    }
  }

  async function handleFormSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSending(true)
    setError('')
    try {
      const res = await fetch('/api/incidents', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (data.success) setSent(true)
      else setError(data.error || 'Error al enviar la incidencia')
    } catch {
      setError('Error de conexión.')
    }
    setSending(false)
  }

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-6">
      <div className="w-full max-w-lg">
        <div className="text-center mb-6">
          <h1 className="text-2xl font-bold text-white mb-1">Soporte técnico</h1>
          <p className="text-slate-400 text-sm">Resolvemos tu problema al instante</p>
        </div>

        {/* Tabs */}
        <div className="flex bg-slate-900 rounded-xl p-1 mb-4 border border-slate-800">
          <button
            onClick={() => setTab('chat')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === 'chat' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Chat con IA
          </button>
          <button
            onClick={() => setTab('form')}
            className={`flex-1 py-2 rounded-lg text-sm font-semibold transition-colors ${tab === 'form' ? 'bg-emerald-600 text-white' : 'text-slate-400 hover:text-white'}`}
          >
            Formulario
          </button>
        </div>

        {tab === 'chat' ? (
          <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden flex flex-col" style={{ height: '520px' }}>
            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3">
              {messages.map((msg, i) => (
                <div key={i} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs px-4 py-2.5 rounded-2xl text-sm leading-relaxed ${
                    msg.role === 'user'
                      ? 'bg-emerald-600 text-white'
                      : 'bg-slate-800 text-slate-200'
                  }`}>
                    {msg.content.split('**').map((part, j) =>
                      j % 2 === 1 ? <strong key={j}>{part}</strong> : <span key={j}>{part}</span>
                    )}
                  </div>
                </div>
              ))}
              {typing && (
                <div className="flex justify-start">
                  <div className="bg-slate-800 px-4 py-2.5 rounded-2xl">
                    <div className="flex gap-1">
                      <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                      <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                      <span className="w-2 h-2 bg-slate-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                    </div>
                  </div>
                </div>
              )}
              <div ref={bottomRef} />
            </div>

            {/* Input */}
            <div className="border-t border-slate-800 p-3 flex gap-2">
              <input
                type="text"
                value={input}
                onChange={e => setInput(e.target.value)}
                onKeyDown={e => e.key === 'Enter' && sendChat()}
                placeholder={!chatName ? 'Escribe tu nombre...' : !chatEmail ? 'Tu email...' : 'Describe tu problema...'}
                className="flex-1 bg-slate-800 border border-slate-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 placeholder-slate-500"
              />
              <button
                onClick={sendChat}
                disabled={typing || !input.trim()}
                className="bg-emerald-600 hover:bg-emerald-500 disabled:opacity-40 text-white px-4 py-2 rounded-xl transition-colors text-sm font-semibold"
              >
                →
              </button>
            </div>
          </div>
        ) : sent ? (
          <div className="bg-slate-900 border border-emerald-500/30 rounded-2xl p-8 text-center">
            <div className="w-14 h-14 bg-emerald-500/20 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-7 h-7 text-emerald-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
              </svg>
            </div>
            <h2 className="text-xl font-bold text-white mb-2">Incidencia registrada</h2>
            <p className="text-slate-400 text-sm">Recibirás respuesta en <strong className="text-white">{form.email}</strong> en breve.</p>
          </div>
        ) : (
          <form onSubmit={handleFormSubmit} className="bg-slate-900 border border-slate-800 rounded-2xl p-6 space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Nombre</label>
                <input required value={form.name} onChange={e => setForm(p => ({ ...p, name: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500" placeholder="Tu nombre" />
              </div>
              <div>
                <label className="text-xs text-slate-400 mb-1 block">Email</label>
                <input required type="email" value={form.email} onChange={e => setForm(p => ({ ...p, email: e.target.value }))}
                  className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500" placeholder="tu@email.com" />
              </div>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Servicio afectado</label>
              <input value={form.service} onChange={e => setForm(p => ({ ...p, service: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500" placeholder="Web, Chatbot, Panel..." />
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Urgencia</label>
              <select value={form.priority} onChange={e => setForm(p => ({ ...p, priority: e.target.value }))}
                className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500">
                <option value="normal">Normal — funciona con problemas</option>
                <option value="high">Alta — afecta al negocio</option>
                <option value="urgent">Urgente — servicio caído</option>
              </select>
            </div>
            <div>
              <label className="text-xs text-slate-400 mb-1 block">Descripción</label>
              <textarea required value={form.description} onChange={e => setForm(p => ({ ...p, description: e.target.value }))}
                rows={4} className="w-full bg-slate-800 border border-slate-700 rounded-lg px-3 py-2 text-white text-sm focus:outline-none focus:border-emerald-500 resize-none"
                placeholder="Describe qué está pasando..." />
            </div>
            {error && <p className="text-red-400 text-sm">{error}</p>}
            <button type="submit" disabled={sending}
              className="w-full bg-emerald-600 hover:bg-emerald-500 disabled:opacity-50 text-white font-semibold py-3 rounded-lg transition-colors text-sm">
              {sending ? 'Enviando...' : 'Enviar incidencia'}
            </button>
          </form>
        )}
      </div>
    </div>
  )
}
