"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { fadeInUp } from "@/lib/animations";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

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

const PROJECT_PRICES: Record<ProjectType, BudgetRange> = {
  landing: { min: 800, max: 2000 },
  corporate: { min: 2000, max: 5000 },
  ecommerce: { min: 3500, max: 10000 },
  ia: { min: 2500, max: 12000 },
};

const FEATURE_PRICES: Record<keyof Features, number> = {
  seo: 400,
  chatbot: 600,
  analytics: 300,
  cms: 500,
  multilingual: 450,
  aiIntegration: 1000,
};

const PROJECT_LABELS: Record<ProjectType, string> = {
  landing: "Landing Page",
  corporate: "Sitio Corporativo",
  ecommerce: "Tienda Online",
  ia: "Integración IA",
};

const FEATURE_LABELS: Record<keyof Features, string> = {
  seo: "SEO Optimizado",
  chatbot: "Chatbot IA",
  analytics: "Analytics Avanzado",
  cms: "CMS (Gestor de Contenidos)",
  multilingual: "Multi-idioma",
  aiIntegration: "Integración IA Avanzada",
};

const IVA_RATE = 0.21; // 21% IVA

export default function BudgetCalculator() {
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

  const toggleFeature = (feature: keyof Features) => {
    setFeatures((prev) => ({ ...prev, [feature]: !prev[feature] }));
    setShowBudget(true);
  };

  const calculateBudget = (): BudgetRange | null => {
    if (!projectType) return null;

    const basePrice = PROJECT_PRICES[projectType as ProjectType];
    let featureTotal = 0;

    Object.entries(features).forEach(([feature, enabled]) => {
      if (enabled) {
        featureTotal += FEATURE_PRICES[feature as keyof Features];
      }
    });

    return {
      min: basePrice.min + featureTotal,
      max: basePrice.max + featureTotal,
    };
  };

  const budget = calculateBudget();

  const formatPrice = (price: number) => {
    return new Intl.NumberFormat("es-ES").format(price);
  };

  const handleGetQuote = () => {
    if (!projectType) return;
    const contactSection = document.getElementById("contacto");
    if (contactSection) {
      contactSection.scrollIntoView({ behavior: "smooth" });
    }
  };

  // ✅ GENERAR PDF PROFESIONAL CON DESGLOSE COMPLETO
  const downloadPDF = async () => {
    if (!budget || !projectType) return;

    const doc = new jsPDF();
    const pageWidth = doc.internal.pageSize.getWidth();

    try {
      // Cargar el logo PNG
      const logoResponse = await fetch('/logo.png');
      const logoBlob = await logoResponse.blob();
      const logoReader = new FileReader();
      
      const logoBase64 = await new Promise<string>((resolve) => {
        logoReader.onloadend = () => resolve(logoReader.result as string);
        logoReader.readAsDataURL(logoBlob);
      });

      // ========== HEADER CON LOGO ==========
      doc.setFillColor(255, 255, 255);
      doc.rect(0, 0, pageWidth, 75, "F");
      
      // ✅ Logo con proporción correcta (606x580 ≈ 1:1)
      const logoSize = 45; // Cuadrado: 45mm × 45mm
      const logoX = (pageWidth - logoSize) / 2;
      
      doc.addImage(logoBase64, 'PNG', logoX, 15, logoSize, logoSize);
      
      // Línea decorativa verde
      doc.setDrawColor(16, 185, 129);
      doc.setLineWidth(0.5);
      doc.line(0, 73, pageWidth, 73);

      // ========== TÍTULO ==========
      doc.setTextColor(15, 23, 42);
      doc.setFontSize(24);
      doc.setFont("helvetica", "bold");
      doc.text("PRESUPUESTO ESTIMADO", pageWidth / 2, 90, { align: "center" });

      // Fecha y referencia
      doc.setFontSize(9);
      doc.setTextColor(100, 116, 139);
      const fecha = new Date().toLocaleDateString("es-ES", { 
        year: "numeric", 
        month: "long", 
        day: "numeric" 
      });
      doc.text(`Fecha: ${fecha}`, 14, 98);
      doc.text(`Ref: PRES-${projectType.toUpperCase()}-${new Date().getFullYear()}`, pageWidth - 14, 98, { align: "right" });

      // ========== DESGLOSE DE PRECIOS ==========
      let yPos = 115;
      
      // Título de la tabla
      doc.setFontSize(13);
      doc.setFont("helvetica", "bold");
      doc.setTextColor(15, 23, 42);
      doc.text("DESCRIPCIÓN DEL PROYECTO", 14, yPos);
      
      // Fondo gris claro para la tabla
      doc.setFillColor(248, 250, 252);
      doc.roundedRect(14, yPos + 2, pageWidth - 28, 80, 3, 3, "F");
      
      // Precio del proyecto base
      yPos += 10;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(15, 23, 42);
      doc.text(`${PROJECT_LABELS[projectType as ProjectType]}`, 20, yPos);
      
      doc.setFont("helvetica", "normal");
      doc.setTextColor(51, 65, 85);
      doc.text(`${formatPrice(budget.min)}€ - ${formatPrice(budget.max)}€`, pageWidth - 20, yPos, { align: "right" });
      
      // Línea separadora
      doc.setDrawColor(226, 232, 240);
      doc.setLineWidth(0.3);
      doc.line(20, yPos + 2, pageWidth - 20, yPos + 2);
      
      // Funcionalidades seleccionadas
      const selectedFeatures = Object.entries(features)
        .filter(([_, enabled]) => enabled);
      
      if (selectedFeatures.length > 0) {
        yPos += 8;
        doc.setFont("helvetica", "italic");
        doc.setFontSize(10);
        doc.setTextColor(71, 85, 105);
        doc.text("Funcionalidades adicionales:", 20, yPos);
        
        selectedFeatures.forEach(([feature, _], index) => {
          yPos += 6;
          doc.setFont("helvetica", "normal");
          doc.text(`• ${FEATURE_LABELS[feature as keyof Features]}`, 24, yPos);
          doc.text(`+${formatPrice(FEATURE_PRICES[feature as keyof Features])}€`, pageWidth - 20, yPos, { align: "right" });
        });
      }
      
      // Subtotal (Base Imponible)
      yPos += 12;
      doc.setDrawColor(226, 232, 240);
      doc.line(20, yPos, pageWidth - 20, yPos);
      yPos += 8;
      
      doc.setFont("helvetica", "bold");
      doc.setFontSize(11);
      doc.setTextColor(71, 85, 105);
      doc.text("SUBTOTAL (Base Imponible)", 20, yPos);
      doc.text(`${formatPrice(budget.min)}€ - ${formatPrice(budget.max)}€`, pageWidth - 20, yPos, { align: "right" });
      
      // IVA 21%
      const ivaMin = budget.min * IVA_RATE;
      const ivaMax = budget.max * IVA_RATE;
      
      yPos += 7;
      doc.setFont("helvetica", "normal");
      doc.text(`IVA (21%)`, 20, yPos);
      doc.text(`${formatPrice(ivaMin)}€ - ${formatPrice(ivaMax)}€`, pageWidth - 20, yPos, { align: "right" });
      
      // Línea separadora gruesa
      yPos += 8;
      doc.setDrawColor(16, 185, 129);
      doc.setLineWidth(0.5);
      doc.line(20, yPos, pageWidth - 20, yPos);
      
      // TOTAL
      const totalMin = budget.min + ivaMin;
      const totalMax = budget.max + ivaMax;
      
      yPos += 10;
      doc.setFont("helvetica", "bold");
      doc.setFontSize(13);
      doc.setTextColor(16, 185, 129);
      doc.text("TOTAL (con IVA)", 20, yPos);
      doc.text(`${formatPrice(totalMin)}€ - ${formatPrice(totalMax)}€`, pageWidth - 20, yPos, { align: "right" });

      // ========== NOTAS Y CONDICIONES ==========
      yPos += 20;
      
      doc.setFontSize(9);
      doc.setFont("helvetica", "italic");
      doc.setTextColor(148, 163, 184);
      doc.text("* Presupuesto orientativo sujeto a revisión según requisitos específicos.", 14, yPos);
      yPos += 5;
      doc.text("* Validez del presupuesto: 30 días desde la fecha de emisión.", 14, yPos);
      yPos += 5;
      doc.text("* Forma de pago: 50% al inicio del proyecto, 50% a la entrega.", 14, yPos);
      yPos += 5;
      doc.text("* Tiempo estimado de entrega: Según complejidad del proyecto.", 14, yPos);

      // ========== FOOTER ==========
      doc.setFillColor(16, 185, 129);
      doc.rect(0, 250, pageWidth, 30, "F");
      
      doc.setTextColor(255, 255, 255);
      doc.setFontSize(11);
      doc.setFont("helvetica", "bold");
      doc.text("¿Listo para empezar tu proyecto?", pageWidth / 2, 260, { align: "center" });
      
      doc.setFont("helvetica", "normal");
      doc.setFontSize(9);
      doc.text("juan@mindbridge-ia.com | www.mindbridge-ia.com", pageWidth / 2, 268, { align: "center" });
      doc.text(`© ${new Date().getFullYear()} Mindbridge IA - Todos los derechos reservados.`, pageWidth / 2, 274, { align: "center" });

      // Guardar
      doc.save(`presupuesto-mindbridge-${projectType}-${new Date().getFullYear()}.pdf`);
      
    } catch (error) {
      console.error("Error generando PDF:", error);
      alert("Hubo un error al generar el PDF. Intenta de nuevo.");
    }
  };

  return (
    <section 
      className="py-12 sm:py-16 md:py-20 px-4 bg-transparent" 
      id="presupuesto"
      suppressHydrationWarning
    >
      <div className="max-w-4xl mx-auto">
        
        {/* Header */}
        <motion.div
          className="text-center mb-10 sm:mb-12"
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true }}
          variants={fadeInUp}
        >
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-slate-900 dark:text-white mb-3">
            Calcula tu{" "}
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-emerald-500 to-cyan-400">
              Presupuesto
            </span>
          </h2>
          <p className="text-sm sm:text-base text-slate-600 dark:text-slate-300 max-w-2xl mx-auto">
            Selecciona el tipo de proyecto y las funcionalidades que necesitas. 
            Obtendrás un estimado inmediato.
          </p>
        </motion.div>

        {/* Calculator Card */}
        <motion.div
          className="bg-white/20 dark:bg-slate-900/60 backdrop-blur-md rounded-2xl p-5 sm:p-6 md:p-8 border border-white/40 dark:border-slate-600/60 shadow-xl"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          
          {/* Step 1: Project Type */}
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-emerald-500 text-white flex items-center justify-center text-sm font-bold">1</span>
              Tipo de Proyecto
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {(Object.keys(PROJECT_PRICES) as ProjectType[]).map((type) => (
                <button
                  key={type}
                  onClick={() => {
                    setProjectType(type);
                    setShowBudget(true);
                  }}
                  className={`p-4 rounded-xl border-2 text-left transition-all ${
                    projectType === type
                      ? "border-emerald-500 bg-emerald-500/20 dark:bg-emerald-500/30 shadow-lg shadow-emerald-500/20"
                      : "border-slate-300 dark:border-slate-600 hover:border-emerald-500/50 dark:hover:border-emerald-400 bg-white/50 dark:bg-slate-800/50"
                  }`}
                >
                  <div className="font-bold text-slate-900 dark:text-white mb-1">
                    {PROJECT_LABELS[type]}
                  </div>
                  <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                    {formatPrice(PROJECT_PRICES[type].min)}€ - {formatPrice(PROJECT_PRICES[type].max)}€
                  </div>
                </button>
              ))}
            </div>
          </motion.div>

          {/* Step 2: Features */}
          <motion.div variants={fadeInUp} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <span className="w-7 h-7 rounded-full bg-cyan-500 text-white flex items-center justify-center text-sm font-bold">2</span>
              Funcionalidades Adicionales
            </h3>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-8">
              {(Object.keys(FEATURE_PRICES) as Array<keyof Features>).map((feature) => (
                <label
                  key={feature}
                  className={`flex items-center gap-3 p-3 rounded-xl border-2 cursor-pointer transition-all ${
                    features[feature]
                      ? "border-cyan-500 bg-cyan-500/20 dark:bg-cyan-500/30"
                      : "border-slate-300 dark:border-slate-600 hover:border-cyan-500/50 dark:hover:border-cyan-400 bg-white/50 dark:bg-slate-800/50"
                  }`}
                >
                  <input
                    type="checkbox"
                    checked={features[feature]}
                    onChange={() => toggleFeature(feature)}
                    className="w-5 h-5 rounded border-slate-400 dark:border-slate-500 text-cyan-500 focus:ring-cyan-500 bg-white dark:bg-slate-700"
                  />
                  <div className="flex-1">
                    <div className="font-semibold text-sm text-slate-900 dark:text-white">
                      {FEATURE_LABELS[feature]}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-300 font-medium">
                      +{formatPrice(FEATURE_PRICES[feature])}€
                    </div>
                  </div>
                </label>
              ))}
            </div>
          </motion.div>

          {/* Budget Display */}
          {budget && showBudget && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="bg-gradient-to-r from-emerald-500 to-cyan-500 rounded-xl p-6 text-center text-white shadow-lg"
            >
              <div className="text-sm font-medium mb-2">
                Presupuesto Estimado
              </div>
              <div className="text-3xl sm:text-4xl font-black mb-2">
                {formatPrice(budget.min)}€ - {formatPrice(budget.max)}€
              </div>
              <div className="text-xs sm:text-sm mb-6 opacity-90">
                (sin IVA · IVA 21%: {(budget.min * 0.21).toLocaleString("es-ES")}€ - {(budget.max * 0.21).toLocaleString("es-ES")}€)
              </div>
              
              <div className="flex flex-col sm:flex-row gap-3 justify-center">
                <button
                  onClick={handleGetQuote}
                  className="inline-flex items-center justify-center gap-2 bg-white text-emerald-600 px-6 py-3 rounded-xl font-bold hover:scale-105 transition-transform shadow-lg"
                >
                  Solicitar Presupuesto Detallado
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                  </svg>
                </button>
                
                <button
                  onClick={downloadPDF}
                  className="inline-flex items-center justify-center gap-2 bg-emerald-600 hover:bg-emerald-700 text-white px-6 py-3 rounded-xl font-bold transition-colors shadow-lg"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                  </svg>
                  Descargar PDF
                </button>
              </div>
            </motion.div>
          )}

          {!budget && (
            <div className="text-center text-slate-600 dark:text-slate-300 font-medium py-4">
              Selecciona un tipo de proyecto para ver el presupuesto
            </div>
          )}
        </motion.div>
      </div>
    </section>
  );
}