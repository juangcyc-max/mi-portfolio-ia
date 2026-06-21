// Genera un PDF del contrato (texto ya con los datos rellenados).
// Sigue el estilo de marca de lib/budgetPdf.ts: logo + línea verde, texto paginado.

async function loadLogo(): Promise<string | null> {
  try {
    const res = await fetch("/logo.png");
    const blob = await res.blob();
    return await new Promise<string>((resolve) => {
      const reader = new FileReader();
      reader.onloadend = () => resolve(reader.result as string);
      reader.readAsDataURL(blob);
    });
  } catch {
    return null;
  }
}

// Heurística: líneas cortas en mayúsculas (encabezados de cláusula) van en negrita.
function isHeading(line: string): boolean {
  const t = line.trim();
  if (!t || t.length > 70) return false;
  const letters = t.replace(/[^A-Za-zÁÉÍÓÚÜÑáéíóúüñ]/g, "");
  return letters.length > 0 && letters === letters.toUpperCase();
}

export async function downloadContractPDF(text: string, fileSuffix = "cliente"): Promise<void> {
  try {
    const { default: jsPDF } = await import("jspdf");
    const doc = new jsPDF({ unit: "mm", format: "a4" });
    const pageW = doc.internal.pageSize.getWidth();
    const pageH = doc.internal.pageSize.getHeight();
    const margin = 18;
    const maxW = pageW - margin * 2;
    const bottom = pageH - margin;

    // Cabecera con logo + línea verde (solo primera página)
    const logo = await loadLogo();
    if (logo) doc.addImage(logo, "PNG", (pageW - 34) / 2, 12, 34, 34);
    doc.setDrawColor(16, 185, 129);
    doc.setLineWidth(0.5);
    doc.line(margin, 50, pageW - margin, 50);

    let y = 60;
    let titleDone = false;

    const addPageIfNeeded = (lineH: number) => {
      if (y + lineH > bottom) {
        doc.addPage();
        y = margin;
      }
    };

    for (const rawLine of text.split("\n")) {
      // Primer renglón no vacío = título centrado
      if (!titleDone && rawLine.trim() !== "") {
        titleDone = true;
        doc.setFont("helvetica", "bold");
        doc.setFontSize(15);
        doc.setTextColor(15, 23, 42);
        const titleLines = doc.splitTextToSize(rawLine.trim(), maxW);
        for (const tl of titleLines) {
          addPageIfNeeded(8);
          doc.text(tl, pageW / 2, y, { align: "center" });
          y += 8;
        }
        y += 4;
        continue;
      }

      const heading = isHeading(rawLine);
      doc.setFont("helvetica", heading ? "bold" : "normal");
      doc.setFontSize(heading ? 11 : 10);
      doc.setTextColor(heading ? 15 : 51, heading ? 23 : 65, heading ? 42 : 85);

      const lineH = heading ? 6 : 5.2;
      const wrapped = doc.splitTextToSize(rawLine === "" ? " " : rawLine, maxW);
      for (const wl of wrapped) {
        addPageIfNeeded(lineH);
        doc.text(wl, margin, y);
        y += lineH;
      }
      if (heading) y += 1.5;
    }

    // Pie con numeración de páginas
    const total = doc.getNumberOfPages();
    for (let p = 1; p <= total; p++) {
      doc.setPage(p);
      doc.setFont("helvetica", "normal");
      doc.setFontSize(8);
      doc.setTextColor(148, 163, 184);
      doc.text("Mindbridge IA · mindbride.net", margin, pageH - 8);
      doc.text(`Página ${p} de ${total}`, pageW - margin, pageH - 8, { align: "right" });
    }

    const slug = fileSuffix.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "") || "cliente";
    doc.save(`contrato-mindbridge-${slug}.pdf`);
  } catch {
    alert("Error al generar el PDF del contrato.");
  }
}
