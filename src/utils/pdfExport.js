import { jsPDF } from 'jspdf';
import html2canvas from 'html2canvas';

export async function generatePDF(elementId, patientName, timestamp) {
  const element = document.getElementById(elementId);
  if (!element) return false;

  try {
    // Save original styles
    const originalStyle = element.getAttribute('style');
    // Ensure element is visible and styled for print
    element.style.background = 'white';
    element.style.color = 'black';
    element.style.width = '210mm'; // A4 width
    element.style.padding = '20mm';
    element.style.boxSizing = 'border-box';
    
    document.body.classList.add('pdf-exporting');

    const canvas = await html2canvas(element, {
      scale: 2, // Higher density for better text quality
      useCORS: true,
      logging: false,
      backgroundColor: '#ffffff',
    });

    document.body.classList.remove('pdf-exporting');

    // Restore original styles
    if (originalStyle) element.setAttribute('style', originalStyle);
    else element.removeAttribute('style');

    const imgData = canvas.toDataURL('image/png');
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (canvas.height * pdfWidth) / canvas.width;

    // Handle multipage if content exceeds A4 height
    let heightLeft = pdfHeight;
    let position = 0;
    const pageHeight = pdf.internal.pageSize.getHeight();

    pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
    heightLeft -= pageHeight;

    while (heightLeft > 0) {
      position = heightLeft - pdfHeight;
      pdf.addPage();
      pdf.addImage(imgData, 'PNG', 0, position, pdfWidth, pdfHeight);
      heightLeft -= pageHeight;
    }

    const safeName = (patientName || 'Patient').replace(/[^a-z0-9]/gi, '_').toLowerCase();
    const dateStr = new Date(timestamp || Date.now()).toISOString().split('T')[0];
    pdf.save(`History_${safeName}_${dateStr}.pdf`);
    return true;
  } catch (error) {
    console.error('PDF generation failed:', error);
    return false;
  }
}
