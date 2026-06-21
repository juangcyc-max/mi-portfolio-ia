import { IVA_RATE } from "@/lib/budgetData";
import type { Features } from "@/lib/budgetData";

interface PdfParams {
  projectType: string;
  projectLabel: string;
  budget: { min: number; max: number };
  features: Features;
  featureLabels: Record<keyof Features, string>;
  formatPrice: (n: number) => string;
}

export async function downloadBudgetPDF({
  projectType, projectLabel, budget, features, featureLabels, formatPrice,
}: PdfParams): Promise<void> {
  const { default: jsPDF } = await import("jspdf");
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  try {
    const logoResponse = await fetch("/logo.png");
    const logoBlob = await logoResponse.blob();
    const logoBase64 = await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(logoBlob);
    });

    doc.setFillColor(255, 255, 255);
    doc.rect(0, 0, pageWidth, 75, "F");
    const logoSize = 45;
    doc.addImage(logoBase64, "PNG", (pageWidth - logoSize) / 2, 15, logoSize, logoSize);
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
    doc.text(projectLabel, 20, yPos);
    doc.setFont("helvetica", "normal");
    doc.text(`${formatPrice(budget.min)}€ - ${formatPrice(budget.max)}€`, pageWidth - 20, yPos, { align: "right" });

    const FEATURE_PRICES_MAP: Record<keyof Features, number> = {
      seo: 400, chatbot: 600, analytics: 300, cms: 500, multilingual: 450, aiIntegration: 1000,
    };

    const selectedFeatures = (Object.entries(features) as [keyof Features, boolean][]).filter(([, on]) => on);
    if (selectedFeatures.length > 0) {
      yPos += 8;
      doc.setFont("helvetica", "italic");
      doc.setFontSize(10);
      doc.text("Funcionalidades adicionales:", 20, yPos);
      selectedFeatures.forEach(([feature]) => {
        yPos += 6;
        doc.setFont("helvetica", "normal");
        doc.text(`• ${featureLabels[feature]}`, 24, yPos);
        doc.text(`+${formatPrice(FEATURE_PRICES_MAP[feature])}€`, pageWidth - 20, yPos, { align: "right" });
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
    doc.text("IVA (21%)", 20, yPos);
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
  } catch {
    alert("Error al generar PDF.");
  }
}
