// Base UI strings — Spanish (es) is the source of truth.
// English (en) is pre-translated here.
// All other languages are fetched from /api/translate and cached in localStorage.

export type UIStrings = typeof ES_STRINGS;

export const ES_STRINGS = {
  // Navbar
  nav_services:   "Servicios",
  nav_plans:      "Planes",
  nav_chat:       "Chat IA",
  nav_portfolio:  "Portfolio",
  nav_contact:    "Contactar",

  // Hero
  hero_badge:     "Soluciones digitales para negocios",
  hero_title1:    "Web · Cloud · IA",
  hero_title2:    "que hacen crecer tu negocio",
  hero_subtitle:  "Diseñamos, construimos y mantenemos soluciones digitales completas para pequeñas y medianas empresas. Web, automatización cloud e IA integrada en un solo servicio.",
  hero_cta1:      "Ver planes",
  hero_cta2:      "Hablar con el asistente",

  // Services section
  services_badge:   "Soluciones para negocios reales",
  services_title1:  "Web · Cloud · IA",
  services_title2:  "todo en un solo servicio",
  services_subtitle:"No vendemos herramientas sueltas. Entregamos soluciones digitales completas para pequeñas y medianas empresas: web conectada, infraestructura cloud e IA incluida donde realmente aporta valor.",
  services_included:"Todo incluido en una sola cuota",
  services_cta1:    "Ver planes y precios",
  services_cta2:    "Hablar con un experto",

  // Plans section
  plans_badge:      "Planes y Precios",
  plans_title1:     "Inversión clara,",
  plans_title2:     "resultados medibles",
  plans_subtitle:   "Cada plan incluye implementación inicial, cuota mensual de mantenimiento, uso de IA dentro del límite y soporte técnico. Sin sorpresas, sin costes ocultos.",
  plans_toggle_monthly: "Cuota mensual",
  plans_toggle_impl:    "Implementación",
  plans_impl_note:      "pago único de implementación",
  plans_monthly_then:   "luego",
  plans_popular:        "Más popular",
  plans_includes:       "Incluye",
  plans_ai_overage:     "Exceso:",
  plans_faq:            "Todos los precios son orientativos y se ajustan al alcance del proyecto. IVA no incluido.",
  plans_faq_link:       "Contacta para un presupuesto exacto",

  // Budget calculator
  calc_title:       "Diseña tu inversión en",
  calc_title_hl:    "Tecnología",
  calc_subtitle:    "Personaliza tu solución digital. Nuestra IA calcula una estimación precisa basada en estándares actuales de mercado.",
  calc_step1:       "Selecciona la base",
  calc_step2:       "Potencia tu proyecto",
  calc_result_cta:  "RESERVAR CONSULTORÍA",
  calc_pdf:         "Exportar PDF Técnico",
  calc_placeholder: "Esperando tu selección",
  calc_placeholder2:"Elige un tipo de proyecto a la izquierda para generar el desglose en tiempo real.",
  calc_monthly_label:"Mantenimiento mensual:",

  // Contact
  contact_badge:    "Hablemos",
  contact_title:    "¿Listo para empezar?",
  contact_name:     "Nombre",
  contact_email:    "Email",
  contact_message:  "Mensaje",
  contact_send:     "Enviar mensaje",
  contact_sending:  "Enviando...",

  // Chat
  chat_title:       "Asistente Mindbridge",
  chat_subtitle:    "Responde en tu idioma",
  chat_placeholder: "Escribe tu mensaje...",
  chat_clear:       "Limpiar chat",
  chat_online:      "En línea",

  // Footer
  footer_tagline:   "Soluciones digitales para negocios que quieren crecer.",
  footer_rights:    "Todos los derechos reservados.",
};

export const EN_STRINGS: UIStrings = {
  nav_services:   "Services",
  nav_plans:      "Plans",
  nav_chat:       "AI Chat",
  nav_portfolio:  "Portfolio",
  nav_contact:    "Contact",

  hero_badge:     "Digital solutions for businesses",
  hero_title1:    "Web · Cloud · AI",
  hero_title2:    "that grow your business",
  hero_subtitle:  "We design, build and maintain complete digital solutions for small and medium businesses. Web, cloud automation and integrated AI in a single service.",
  hero_cta1:      "See plans",
  hero_cta2:      "Talk to the assistant",

  services_badge:   "Solutions for real businesses",
  services_title1:  "Web · Cloud · AI",
  services_title2:  "all in one service",
  services_subtitle:"We don't sell standalone tools. We deliver complete digital solutions for SMBs: connected web, cloud infrastructure and AI included where it truly adds value.",
  services_included:"All included in one monthly fee",
  services_cta1:    "See plans & pricing",
  services_cta2:    "Talk to an expert",

  plans_badge:      "Plans & Pricing",
  plans_title1:     "Clear investment,",
  plans_title2:     "measurable results",
  plans_subtitle:   "Each plan includes initial implementation, monthly maintenance fee, AI usage within limits and technical support. No surprises, no hidden costs.",
  plans_toggle_monthly: "Monthly fee",
  plans_toggle_impl:    "Implementation",
  plans_impl_note:      "one-time setup fee",
  plans_monthly_then:   "then",
  plans_popular:        "Most popular",
  plans_includes:       "Includes",
  plans_ai_overage:     "Overage:",
  plans_faq:            "All prices are indicative and adjusted to project scope. VAT not included.",
  plans_faq_link:       "Contact us for an exact quote",

  calc_title:       "Design your investment in",
  calc_title_hl:    "Technology",
  calc_subtitle:    "Customize your digital solution. Our AI calculates a precise estimate based on current market standards.",
  calc_step1:       "Select the base",
  calc_step2:       "Power your project",
  calc_result_cta:  "BOOK CONSULTATION",
  calc_pdf:         "Export Technical PDF",
  calc_placeholder: "Waiting for your selection",
  calc_placeholder2:"Choose a project type on the left to generate a real-time breakdown.",
  calc_monthly_label:"Monthly maintenance:",

  contact_badge:    "Let's talk",
  contact_title:    "Ready to get started?",
  contact_name:     "Name",
  contact_email:    "Email",
  contact_message:  "Message",
  contact_send:     "Send message",
  contact_sending:  "Sending...",

  chat_title:       "Mindbridge Assistant",
  chat_subtitle:    "Responds in your language",
  chat_placeholder: "Type your message...",
  chat_clear:       "Clear chat",
  chat_online:      "Online",

  footer_tagline:   "Digital solutions for businesses that want to grow.",
  footer_rights:    "All rights reserved.",
};

export const STATIC_TRANSLATIONS: Partial<Record<string, UIStrings>> = {
  es: ES_STRINGS,
  en: EN_STRINGS,
};
