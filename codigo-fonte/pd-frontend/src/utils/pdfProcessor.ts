import { PDFDocument } from "pdf-lib";
import * as pdfjsLib from "pdfjs-dist";
import { GlobalWorkerOptions } from "pdfjs-dist/build/pdf";

// ✅ Essa é a forma correta com Vite (sem precisar de export default)
GlobalWorkerOptions.workerSrc = new URL(
  "pdfjs-dist/build/pdf.worker.min.js",
  import.meta.url
).toString();

export interface ProcessedPayslip {
  name: string;
  pdfBytes: Uint8Array;
}

export async function processBulkPayslips(
  file: File
): Promise<ProcessedPayslip[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const processedPayslips: ProcessedPayslip[] = [];

  const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
  const totalPages = pdf.numPages;

  for (let currentPage = 1; currentPage <= totalPages; currentPage++) {
    const page = await pdf.getPage(currentPage);
    const textContent = await page.getTextContent();
    const text = textContent.items.map((item: any) => item.str).join(" ");

    const nameMatch = text.match(
      /([A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]{2,}(?:\s+[A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]{2,}){1,})/
    );
    if (nameMatch) {
      const name = nameMatch[0].trim();

      const newPdf = await PDFDocument.create();
      const [copiedPage] = await newPdf.copyPages(pdfDoc, [currentPage - 1]);
      newPdf.addPage(copiedPage);
      const pdfBytes = await newPdf.save();

      processedPayslips.push({ name, pdfBytes });
    }
  }

  return processedPayslips;
}
