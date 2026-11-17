import { jsPDF } from "jspdf";

/**
 * Builds the normalized summary structure grouped by service -> process -> selected tasks
 * for both database persistence and PDF generation.
 */
export function buildSelectedServicesSummary(services, selectedTasksByService) {
  return services
    .map((service) => {
      const selectedIds = new Set(selectedTasksByService[service.id] || []);
      const totalTasks = service.processes.reduce((sum, proc) => sum + proc.tasks.length, 0);

      const processes = service.processes
        .map((proc) => {
          const selectedTasks = proc.tasks.filter((task) => selectedIds.has(task.id));
          if (selectedTasks.length === 0) return null;

          return {
            id: proc.id,
            group: proc.group || null,
            number: proc.number,
            title: proc.title,
            totalInProcess: proc.tasks.length,
            tasks: selectedTasks.map((task) => ({
              id: task.id,
              title: task.title,
              description: task.description,
            })),
          };
        })
        .filter(Boolean);

      const selectedCount = processes.reduce((sum, proc) => sum + proc.tasks.length, 0);

      return {
        id: service.id,
        order: service.order,
        name: service.name,
        totalTasks,
        selectedCount,
        processes,
      };
    })
    .filter((srv) => srv.selectedCount > 0);
}

/**
 * Generates and downloads a structured PDF summary grouped by service and process.
 * Accepts either live selection (`services` + `selectedTasksByService`) or saved `resumenServicios`.
 */
export function exportPlannerSummaryPdf({
  services = [],
  selectedTasksByService = {},
  resumenServicios = null,
  notes = "",
  clientName = "",
  clientPhone = "",
  createdAt = null,
}) {
  const doc = new jsPDF({ orientation: "portrait", unit: "mm", format: "letter" });
  const pageWidth = doc.internal.pageSize.getWidth();
  const pageHeight = doc.internal.pageSize.getHeight();
  const marginX = 16;
  const contentWidth = pageWidth - marginX * 2;
  const bottomLimit = pageHeight - 18;

  const targetDate = createdAt ? new Date(createdAt) : new Date();
  const formattedDate = new Intl.DateTimeFormat("es-MX", {
    dateStyle: "long",
    timeStyle: "short",
  }).format(Number.isNaN(targetDate.getTime()) ? new Date() : targetDate);

  const selectedServices = Array.isArray(resumenServicios)
    ? resumenServicios
    : buildSelectedServicesSummary(services, selectedTasksByService);

  const totalSelected = selectedServices.reduce(
    (sum, srv) => sum + (Number(srv.selectedCount) || 0),
    0,
  );

  // Encabezado corporativo superior
  doc.setFillColor(8, 23, 70);
  doc.rect(0, 0, pageWidth, 34, "F");
  doc.setFillColor(59, 130, 246);
  doc.rect(0, 34, pageWidth, 1.5, "F");

  doc.setTextColor(255, 255, 255);
  doc.setFont("helvetica", "bold");
  doc.setFontSize(17);
  doc.text("ETRONIC — Planificador de Proyecto", marginX, 15);

  doc.setFont("helvetica", "normal");
  doc.setFontSize(9.5);
  doc.setTextColor(191, 219, 254);
  doc.text(`Resumen de funcionalidades seleccionadas · ${formattedDate}`, marginX, 23);

  doc.setFont("helvetica", "bold");
  doc.setFontSize(10);
  doc.setTextColor(255, 255, 255);
  doc.text(
    `Total: ${totalSelected} ${totalSelected === 1 ? "funcionalidad" : "funcionalidades"}`,
    pageWidth - marginX,
    23,
    { align: "right" },
  );

  let cursorY = 43;

  const ensureSpace = (neededMm) => {
    if (cursorY + neededMm <= bottomLimit) return;
    doc.addPage();
    cursorY = 18;
  };

  if (clientName.trim() || clientPhone.trim()) {
    doc.setFillColor(241, 245, 249);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(marginX, cursorY, contentWidth, 12, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    const clientLabel = [
      clientName.trim() ? `Cliente: ${clientName.trim()}` : null,
      clientPhone.trim() ? `Teléfono-Whatsapp / Correo: ${clientPhone.trim()}` : null,
    ]
      .filter(Boolean)
      .join("   |   ");
    doc.text(clientLabel, marginX + 4, cursorY + 7.5);
    cursorY += 17;
  }

  selectedServices.forEach((service, serviceIdx) => {
    if (serviceIdx > 0) {
      cursorY += 4;
    }

    ensureSpace(16);

    // Franja de Servicio
    doc.setFillColor(239, 246, 255);
    doc.setDrawColor(147, 197, 253);
    doc.roundedRect(marginX, cursorY, contentWidth, 11, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(11);
    doc.setTextColor(15, 23, 42);
    doc.text(`${service.order}. ${service.name}`, marginX + 4, cursorY + 7);

    doc.setFontSize(9);
    doc.setTextColor(29, 78, 216);
    doc.text(
      `${service.selectedCount} / ${service.totalTasks || service.selectedCount}`,
      pageWidth - marginX - 4,
      cursorY + 7,
      { align: "right" },
    );

    cursorY += 15;

    service.processes.forEach((proc, procIdx) => {
      const prevGroup = procIdx > 0 ? service.processes[procIdx - 1].group : null;
      if (proc.group && proc.group !== prevGroup) {
        ensureSpace(9);
        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(29, 78, 216);
        doc.text(proc.group.toUpperCase(), marginX + 1, cursorY);
        cursorY += 5.5;
      }

      ensureSpace(12);

      const processCountSuffix = proc.totalInProcess
        ? `(${proc.tasks.length}/${proc.totalInProcess})`
        : `(${proc.tasks.length})`;

      // Subtítulo del bloque de proceso
      doc.setFont("helvetica", "bold");
      doc.setFontSize(10);
      doc.setTextColor(88, 72, 244);
      doc.text(`${proc.number}. ${proc.title} ${processCountSuffix}`, marginX + 1, cursorY);
      cursorY += 5.5;

      proc.tasks.forEach((task) => {
        const descLines = task.description
          ? doc.splitTextToSize(task.description, contentWidth - 10)
          : [];
        const itemHeight = 5 + descLines.length * 4 + 2.5;
        ensureSpace(itemHeight);

        // Viñeta circular azul-violeta
        doc.setFillColor(59, 130, 246);
        doc.circle(marginX + 3, cursorY - 1.2, 1.2, "F");

        doc.setFont("helvetica", "bold");
        doc.setFontSize(9.5);
        doc.setTextColor(15, 23, 42);
        doc.text(task.title, marginX + 7, cursorY);
        cursorY += 4.2;

        if (descLines.length > 0) {
          doc.setFont("helvetica", "normal");
          doc.setFontSize(8.5);
          doc.setTextColor(71, 85, 105);
          doc.text(descLines, marginX + 7, cursorY);
          cursorY += descLines.length * 4 + 2.5;
        } else {
          cursorY += 1.5;
        }
      });

      cursorY += 2;
    });
  });

  if (notes.trim()) {
    const noteLines = doc.splitTextToSize(notes.trim(), contentWidth - 8);
    const boxHeight = 10 + noteLines.length * 4.5 + 4;
    ensureSpace(boxHeight + 4);

    doc.setFillColor(248, 250, 252);
    doc.setDrawColor(203, 213, 225);
    doc.roundedRect(marginX, cursorY, contentWidth, boxHeight, 2, 2, "FD");

    doc.setFont("helvetica", "bold");
    doc.setFontSize(9.5);
    doc.setTextColor(15, 23, 42);
    doc.text("Comentarios adicionales", marginX + 4, cursorY + 6.5);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(9);
    doc.setTextColor(51, 65, 85);
    doc.text(noteLines, marginX + 4, cursorY + 12);
  }

  // Pie de página con numeración total
  const pageCount = doc.getNumberOfPages();
  for (let i = 1; i <= pageCount; i += 1) {
    doc.setPage(i);
    doc.setDrawColor(226, 232, 240);
    doc.line(marginX, pageHeight - 13, pageWidth - marginX, pageHeight - 13);

    doc.setFont("helvetica", "normal");
    doc.setFontSize(8);
    doc.setTextColor(100, 116, 139);
    doc.text("ETRONIC · Soluciones Tecnológicas e IA (etronic.com.mx)", marginX, pageHeight - 8);
    doc.text(`Página ${i} de ${pageCount}`, pageWidth - marginX, pageHeight - 8, {
      align: "right",
    });
  }

  const fileDate = new Date().toISOString().slice(0, 10);
  doc.save(`Etronic-Planificador-Proyecto-${fileDate}.pdf`);
}
