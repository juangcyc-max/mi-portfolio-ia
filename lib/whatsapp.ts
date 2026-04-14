/**
 * Green API — WhatsApp messaging utility
 * Docs: https://green-api.com/en/docs/
 */

export async function sendWhatsAppMessage(chatId: string, message: string): Promise<void> {
  const idInstance = process.env.GREEN_API_ID_INSTANCE
  const apiToken = process.env.GREEN_API_TOKEN
  const apiUrl = process.env.GREEN_API_URL

  if (!idInstance || !apiToken || !apiUrl) {
    console.warn('[whatsapp] Green API credentials missing — skipping send')
    return
  }

  try {
    const res = await fetch(
      `${apiUrl}/waInstance${idInstance}/sendMessage/${apiToken}`,
      {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ chatId, message }),
      }
    )
    if (!res.ok) {
      const err = await res.text()
      console.error('[whatsapp] send error:', err)
    }
  } catch (err) {
    console.error('[whatsapp] fetch error:', err)
  }
}

/** Notifica a Juan directamente por WhatsApp */
export async function notifyJuan(message: string): Promise<void> {
  const chatId = process.env.JUAN_WHATSAPP_CHAT_ID || '34613096449@c.us'
  await sendWhatsAppMessage(chatId, message)
}
