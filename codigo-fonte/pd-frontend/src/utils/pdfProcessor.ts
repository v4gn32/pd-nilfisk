import { PDFDocument } from 'pdf-lib';
import * as PDFJS from 'pdfjs-dist';

export interface ProcessedPayslip {
  name: string;
  pdfBytes: Uint8Array;
}

export async function processBulkPayslips(file: File): Promise<ProcessedPayslip[]> {
  const arrayBuffer = await file.arrayBuffer();
  const pdfDoc = await PDFDocument.load(arrayBuffer);
  const processedPayslips: ProcessedPayslip[] = [];

  // Load PDF.js
  const pdf = await PDFJS.getDocument({ data: arrayBuffer }).promise;
  
  let currentPage = 1;
  const totalPages = pdf.numPages;
  
  while (currentPage <= totalPages) {
    // Extract name from the current page
    const page = await pdf.getPage(currentPage);
    const textContent = await page.getTextContent();
    const text = textContent.items.map((item: any) => item.str).join(' ');
    
    // Find name using regex pattern for uppercase names
    // This pattern looks for 2+ consecutive uppercase words that might be a name
    const nameMatch = text.match(/([A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ][A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ\s]+(?:\s[A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ][A-ZÁÀÂÃÉÈÊÍÏÓÔÕÖÚÇÑ]+){1,})/);
    
    if (nameMatch) {
      const name = nameMatch[0].trim();
      
      // Create a new PDF document for this payslip
      const newPdfDoc = await PDFDocument.create();
      const [copiedPage] = await newPdfDoc.copyPages(pdfDoc, [currentPage - 1]);
      newPdfDoc.addPage(copiedPage);
      
      const pdfBytes = await newPdfDoc.save();
      
      processedPayslips.push({
        name,
        pdfBytes
      });
    }
    
    currentPage++;
  }

  return processedPayslips;
}