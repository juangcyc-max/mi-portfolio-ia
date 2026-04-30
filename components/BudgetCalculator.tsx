"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import { useTranslation } from "@/lib/i18n/LanguageContext";

// Iconos SVG para darle el toque profesional
const Icons = {
  landing: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13 10V3L4 14h7v7l9-11h-7z" />
    </svg>
  ),
  corporate: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />
    </svg>
  ),
  ecommerce: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
    </svg>
  ),
  ia: (props: any) => (
    <svg fill="none" viewBox="0 0 24 24" stroke="currentColor" {...props}>
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
    </svg>
  ),
};

type ProjectType = "landing" | "corporate" | "ecommerce" | "ia";

type Features = {
  seo: boolean;
  chatbot: boolean;
  analytics: boolean;
  cms: boolean;
  multilingual: boolean;
  aiIntegration: boolean;
};

interface BudgetRange {
  min: number;
  max: number;
}

// Precios de implementación alineados con sección Planes:
// Lanzamiento (landing) → 990€ | Negocio (corporate) → 2.490€ | Empresa (ia) → 4.990€+
const PROJECT_PRICES: Record<ProjectType, BudgetRange> = {
  landing: { min: 990, max: 1990 },
  corporate: { min: 2490, max: 4490 },
  ecommerce: { min: 3500, max: 7990 },
  ia: { min: 4990, max: 12000 },
};

const FEATURE_PRICES: Record<keyof Features, number> = {
  seo: 400,
  chatbot: 600,
  analytics: 300,
  cms: 500,
  multilingual: 450,
  aiIntegration: 1000,
};


// Cuota mensual de mantenimiento por tipo de proyecto (alineada con Planes)
const MONTHLY_FEE: Record<ProjectType, number> = {
  landing: 79,
  corporate: 149,
  ecommerce: 149,
  ia: 299,
};

const IVA_RATE = 0.21;

export default function BudgetCalculator() {
  const { t } = useTranslation();

  const PROJECT_LABELS: Record<ProjectType, string> = {
    landing: t('proj_landing'),
    corporate: t('proj_corporate'),
    ecommerce: t('proj_ecommerce'),
    ia: t('proj_ia'),
  };

  const FEATURE_LABELS: Record<keyof Features, string> = {
    seo: t('feat_seo'),
    chatbot: t('feat_chatbot'),
    analytics: t('feat_analytics'),
    cms: t('feat_cms'),
    multilingual: t('feat_multilingual'),
    aiIntegration: t('feat_ai_advanced'),
  };

  const [projectType, setProjectType] = useState<ProjectType | "">("");
  const [features, setFeatures] = useState<Features>({
    seo: false,
    chatbot: false,
    analytics: false,
    cms: false,
    multilingual: false,
    aiIntegration: false,
  });
  const [showBudget, setShowBudget] = useState(false);
  const [clientName, setClientName] = useState("");
  const [clientEmail, setClientEmail] = useState("");
  const [comment, setComment] = useState("");
  const [sending, setSending] = useState(false);
  const [sent, setSent] = useState(false);

  const toggleFeature = (feature: keyof Features) => {
    setFeatures((prev) => ({ ...prev, [feature]: !prev[feature] }));
    setShowBudget(true);
  };

  const calculateBudget = (): BudgetRange | null => {
    if (!projectType) return null;
    const basePrice = PROJECT_PRICES[projectType as ProjectType];
    let featureTotal = 0;
    Object.entries(features).forEach(([feature, enabled]) => {
      if (enabled) featureTotal += FEATURE_PRICES[feature as keyof Features];
    });
    return {
      min: basePrice.min + featureTotal,
      max: basePrice.max + featureTotal,
    };
  };

  const budget = calculateBudget();
  const formatPrice = (price: number) => new Intl.NumberFormat("es-ES").format(price);

  const handleGetQuote = async () => {
    if (!projectType || !budget) return;
    if (!clientName.trim() || !clientEmail.trim()) {
      alert("Por favor introduce tu nombre y email en el paso 3.");
      return;
    }
    setSending(true);
    const featuresText = Object.entries(features)
      .filter(([, enabled]) => enabled)
      .map(([f]) => FEATURE_LABELS[f as keyof Features])
      .join(", ");
    const additional_info = [
      comment.trim(),
      featuresText ? `Funcionalidades seleccionadas: ${featuresText}` : "",
    ].filter(Boolean).join("\n\n");
    await fetch("/api/budget-request", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        name: clientName,
        email: clientEmail,
        project_type: PROJECT_LABELS[projectType as ProjectType],
        budget_range: `${formatPrice(budget.min)}€ - ${formatPrice(budget.max)}€`,
        additional_info,
      }),
    });
    setSending(false);
    setSent(true);
    document.getElementById("contacto")?.scrollIntoView({ behavior: "smooth" });
  };

  // Lógica de descarga de PDF mantenida intacta
  const downloadPDF = async () => {
    if (!budget || !projectType) return;
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();
    try {
      const logoResponse = await fetch('/logo.png');
      const logoBlob = await logoResponse.blob();
      const logoReader = new FileReader();
      const logoBase64 = await new Promise<string>((resolve) => {
        logoReader.onloadend = () => resolve(logoReader.result as string);
        logoReader.readAsDataURL(logoBlob);
      });

      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, pageWidth, 75, "F");
      const logoSize = 45;
      const logoX = (pageWidth - logoSize) / 2;
      doc.addImage(logoBase64, 'PNG', logoX, 15, logoSize, logoSize);
      doc.setDrawColor(16, 185, 129);
      doc.setLineWidth(0.5);
      doc.line(0, 73, pageWidth, 73);
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("PRESUPUESTO ESTIMADO", pageWidth / 2, 90, { align: "center" });
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      const fecha = new Date().toLocaleDateString("es-ES", { year: "numeric", month: "long", day: "numeric" });
      doc.text(`Fecha: ${fecha}`, 14, 98);
      doc.text(`Ref: PRES-${projectType.toUpperCase()}-${new Date().getFullYear()}`, pageWidth - 14, 98, { align: "right" });
      let yPos = 115;
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("DESCRIPCIÓN DEL PROYECTO", 14, yPos);
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(14, yPos + 2, pageWidth - 28, 80, 3, 3, "F");
      yPos += 10;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.text(`${PROJECT_LABELS[projectType as ProjectType]}`, 20, yPos);
      doc.setFont("helvetica", "normal");
      doc.text(`${formatPrice(budget.min)}€ - ${formatPrice(budget.max)}€`, pageWidth - 20, yPos, { align: "right" });
      const selectedFeatures = Object.entries(features).filter(([_, enabled]) => enabled);
      if (selectedFeatures.length > 0) {
        yPos += 8;
        doc.setFont("helvetica", "italic");
        doc.setFontSize(10);
        doc.text("Funcionalidades adicionales:", 20, yPos);
        selectedFeatures.forEach(([feature, _]) => {
          yPos += 6;
          doc.setFont("helvetica", "normal");
          doc.text(`• ${FEATURE_LABELS[feature as keyof Features]}`, 24, yPos);
          doc.text(`+${formatPrice(FEATURE_PRICES[feature as keyof Features])}€`, pageWidth - 20, yPos, { align: "right" });
        });
      }
      yPos += 12;
      doc.line(20, yPos, pageWidth - 20, yPos);
      yPos += 8;
      doc.setFont("helvetica", "bold");
      doc.text("SUBTOTAL (Base Imponible)", 20, yPos);
      doc.text(`${formatPrice(budget.min)}€ - ${formatPrice(budget.max)}€`, pageWidth - 20, yPos, { align: "right" });
      const ivaMin = budget.min * IVA_RATE;
      const ivaMax = budget.max * IVA_RATE;
      yPos += 7;
      doc.setFont("helvetica", "normal");
      doc.text(`IVA (21%)`, 20, yPos);
      doc.text(`${formatPrice(ivaMin)}€ - ${formatPrice(ivaMax)}€`, pageWidth - 20, yPos, { align: "right" });
      yPos += 8;
      doc.setDrawColor(16, 185, 129);
      doc.line(20, yPos, pageWidth - 20, yPos);
      const totalMin = budget.min + ivaMin;
      const totalMax = budget.max + ivaMax;
      yPos += 10;
      doc.setFontSize(13);
      doc.setTextColor(16, 185, 129);
      doc.text("TOTAL (con IVA)", 20, yPos);
      doc.text(`${formatPrice(totalMin)}€ - ${formatPrice(totalMax)}€`, pageWidth - 20, yPos, { align: "right" });
      yPos += 20;
      doc.setFontSize(9);
      doc.setTextColor(148, 163, 184);
      doc.text("* Presupuesto orientativo sujeto a revisión según requisitos específicos.", 14, yPos);
      doc.setFillColor(16, 185, 129);
      doc.rect(0, 250, pageWidth, 30, "F");
      doc.setTextColor(255, 255, 255);
      doc.text("¿Listo para empezar tu proyecto?", pageWidth / 2, 260, { align: "center" });
      doc.save(`presupuesto-mindbridge-${projectType}-${new Date().getFullYear()}.pdf`);
    } catch (error) {
      alert("Error al generar PDF.");
    }
  };

  return (
    <section className="py-24 px-4 relative overflow-hidden" id="presupuesto">
      {/* Elementos decorativos de fondo para el "extremo" visual */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full -z-10 pointer-events-none opacity-20">
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-emerald-500/30 rounded-full blur-[120px]" />
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-cyan-500/30 rounded-full blur-[120px]" />
      </div>

      <div className="max-w-5xl mx-auto">
        <motion.div
          className="text-center mb-16"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <span className="inline-block px-4 py-1.5 mb-4 text-xs font-bold tracking-widest text-emerald-500 uppercase bg-emerald-500/10 rounded-full">
            {t('calc_badge')}
          </span>
          <h2 className="text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-6 tracking-tight">
            {t('calc_title')}{" "}
            {/* ✅ GRADIENTE VERDE SOLO (sin cyan) */}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 to-emerald-500">
              {t('calc_title_hl')}
            </span>
          </h2>
          <p className="text-lg text-slate-600 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed">
            {t('calc_subtitle')}
          </p>
        </motion.div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Columna Izquierda: Selección */}
          <div className="lg:col-span-7 space-y-8">
            <motion.div 
               className="bg-white dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-200 dark:border-white/10 shadow-2xl shadow-slate-200/50 dark:shadow-none"
               variants={fadeInUp} initial="hidden" whileInView="visible"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-2xl bg-emerald-500 flex items-center justify-center text-white shadow-lg shadow-emerald-500/30 font-bold">1</div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">{t('calc_step1')}</h3>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {(Object.keys(PROJECT_PRICES) as ProjectType[]).map((type) => {
                  const Icon = Icons[type];
                  return (
                    <button
                      key={type}
                      onClick={() => { setProjectType(type); setShowBudget(true); }}
                      className={`group relative p-6 rounded-2xl border-2 transition-all duration-300 text-left ${
                        projectType === type
                          ? "border-emerald-500 bg-emerald-500/[0.03] dark:bg-emerald-500/10 shadow-inner"
                          : "border-slate-100 dark:border-white/5 bg-slate-50/50 dark:bg-white/5 hover:border-emerald-500/30"
                      }`}
                    >
                      <Icon className={`w-8 h-8 mb-4 transition-colors ${projectType === type ? "text-emerald-500" : "text-slate-400 group-hover:text-emerald-400"}`} />
                      <div className="font-bold text-slate-900 dark:text-white text-lg">{PROJECT_LABELS[type]}</div>
                      <div className="text-sm text-slate-500 mt-1">{t('calc_from')} {formatPrice(PROJECT_PRICES[type].min)}€</div>
                      {projectType === type && (
                        <motion.div layoutId="activeType" className="absolute top-4 right-4 w-2 h-2 rounded-full bg-emerald-500" />
                      )}
                    </button>
                  );
                })}
              </div>
            </motion.div>

            <motion.div 
              className="bg-white dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-200 dark:border-white/10 shadow-2xl shadow-slate-200/50 dark:shadow-none"
              variants={fadeInUp} initial="hidden" whileInView="visible"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500 flex items-center justify-center text-white shadow-lg shadow-cyan-500/30 font-bold">2</div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">{t('calc_step2')}</h3>
              </div>

              <div className="grid grid-cols-1 gap-3">
                {(Object.keys(FEATURE_PRICES) as Array<keyof Features>).map((feature) => (
                  <label
                    key={feature}
                    className={`flex items-center justify-between p-4 rounded-2xl border-2 cursor-pointer transition-all duration-200 ${
                      features[feature]
                        ? "border-cyan-500 bg-cyan-500/[0.03] dark:bg-cyan-500/10"
                        : "border-slate-100 dark:border-white/5 hover:border-cyan-500/20"
                    }`}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center transition-colors ${features[feature] ? "bg-cyan-500 border-cyan-500" : "border-slate-300 dark:border-slate-600"}`}>
                        {features[feature] && <svg className="w-4 h-4 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={3} d="M5 13l4 4L19 7" /></svg>}
                      </div>
                      <span className="font-semibold text-slate-700 dark:text-slate-200">{FEATURE_LABELS[feature]}</span>
                    </div>
                    <span className="text-sm font-mono text-cyan-600 dark:text-cyan-400">+{formatPrice(FEATURE_PRICES[feature])}€</span>
                    <input type="checkbox" checked={features[feature]} onChange={() => toggleFeature(feature)} className="hidden" />
                  </label>
                ))}
              </div>
            </motion.div>

            {/* Paso 3 — Datos de contacto y comentario */}
            <motion.div
              className="bg-white dark:bg-slate-900/40 backdrop-blur-xl rounded-3xl p-8 border border-slate-200 dark:border-white/10 shadow-2xl shadow-slate-200/50 dark:shadow-none"
              variants={fadeInUp} initial="hidden" whileInView="visible"
            >
              <div className="flex items-center gap-4 mb-8">
                <div className="w-10 h-10 rounded-2xl bg-emerald-700 flex items-center justify-center text-white shadow-lg shadow-emerald-700/30 font-bold">3</div>
                <h3 className="text-xl font-bold text-slate-800 dark:text-white">Cuéntanos qué necesitas</h3>
              </div>
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block font-medium">Tu nombre</label>
                    <input
                      value={clientName}
                      onChange={e => setClientName(e.target.value)}
                      className="w-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
                      placeholder="Juan García"
                    />
                  </div>
                  <div>
                    <label className="text-xs text-slate-400 mb-1 block font-medium">Tu email</label>
                    <input
                      value={clientEmail}
                      onChange={e => setClientEmail(e.target.value)}
                      type="email"
                      className="w-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors"
                      placeholder="tu@email.com"
                    />
                  </div>
                </div>
                <div>
                  <label className="text-xs text-slate-400 mb-1 block font-medium">Descripción del proyecto <span className="text-slate-300">(opcional)</span></label>
                  <textarea
                    value={comment}
                    onChange={e => setComment(e.target.value)}
                    rows={4}
                    className="w-full border border-slate-200 dark:border-white/10 bg-slate-50 dark:bg-white/5 rounded-xl px-4 py-3 text-sm text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-emerald-500 transition-colors resize-none"
                    placeholder="Cuéntanos sobre tu negocio, qué quieres conseguir, si tienes web actual, plazos, integraciones que necesitas..."
                  />
                </div>
              </div>
            </motion.div>
          </div>

          {/* Columna Derecha: Resumen (Sticky) */}
          <div className="lg:col-span-5 sticky top-24">
            <AnimatePresence mode="wait">
              {budget && showBudget ? (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="bg-slate-900 dark:bg-black rounded-[2.5rem] p-10 text-white shadow-[0_20px_50px_rgba(0,0,0,0.3)] border border-white/10 relative overflow-hidden"
                >
                  {/* Decoración interna del card */}
                  <div className="absolute -top-24 -right-24 w-48 h-48 bg-emerald-500/20 rounded-full blur-3xl" />
                  
                  <div className="relative z-10 text-center">
                    <p className="text-emerald-400 font-bold tracking-widest text-xs uppercase mb-4">{t('calc_estimated')}</p>
                    <div className="text-5xl md:text-6xl font-black mb-2 tracking-tighter">
                      {formatPrice(budget.min)}€
                    </div>
                    <div className="text-slate-400 text-sm mb-4">
                      {t('calc_max')} {formatPrice(budget.max)}€ <br/>
                      <span className="text-[10px] uppercase opacity-50 mt-2 block tracking-widest">{t('calc_iva')}</span>
                    </div>

                    {/* Cuota mensual */}
                    {projectType && (
                      <div className="flex items-center justify-center gap-2 mb-6 px-4 py-3 rounded-2xl bg-white/5 border border-emerald-500/20">
                        <svg className="w-4 h-4 text-emerald-400 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                        </svg>
                        <span className="text-sm text-slate-300">
                          {t('calc_monthly_label')} <span className="font-black text-emerald-400">{formatPrice(MONTHLY_FEE[projectType as ProjectType])} €/mes</span>
                        </span>
                      </div>
                    )}

                    <div className="space-y-4">
                      {sent ? (
                        <div className="w-full py-4 px-8 bg-emerald-500/20 border border-emerald-500/40 rounded-2xl text-center">
                          <p className="text-emerald-400 font-black text-sm">✓ ¡Solicitud enviada!</p>
                          <p className="text-emerald-300/70 text-xs mt-1">Te contactamos en menos de 24h con el presupuesto ajustado.</p>
                        </div>
                      ) : (
                        <button
                          onClick={handleGetQuote}
                          disabled={sending}
                          className="w-full py-4 px-8 bg-emerald-500 hover:bg-emerald-400 disabled:opacity-60 text-slate-900 font-black rounded-2xl transition-all duration-300 shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-95"
                        >
                          {sending ? "Enviando..." : t('calc_booking')}
                        </button>
                      )}
                      <button
                        onClick={downloadPDF}
                        className="w-full py-4 px-8 bg-white/5 hover:bg-white/10 text-white font-bold rounded-2xl border border-white/10 transition-all flex items-center justify-center gap-3"
                      >
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" /></svg>
                        {t('calc_pdf')}
                      </button>
                    </div>
                    
                    <p className="mt-8 text-[11px] text-slate-500 leading-relaxed italic">
                      {t('calc_note')}
                    </p>
                  </div>
                </motion.div>
              ) : (
                <motion.div
                  key="placeholder"
                  className="h-96 flex flex-col items-center justify-center border-4 border-dashed border-slate-200 dark:border-white/5 rounded-[2.5rem] p-10 text-center"
                >
                  <div className="w-16 h-16 bg-slate-100 dark:bg-white/5 rounded-full flex items-center justify-center mb-6 animate-pulse">
                    <svg className="w-8 h-8 text-slate-400" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 7h6m0 10v-3m-3 3h.01M9 17h.01M9 14h.01M12 14h.01M15 11h.01M12 11h.01M9 11h.01M7 21h10a2 2 0 002-2V5a2 2 0 00-2-2H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                  </div>
                  <h4 className="text-xl font-bold text-slate-400 mb-2">{t('calc_placeholder')}</h4>
                  <p className="text-slate-500 text-sm">{t('calc_placeholder2')}</p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}