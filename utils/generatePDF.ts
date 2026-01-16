"use client";

import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { OWNER_SIGNATURE, LOGO_BRITISH_SAFETY, LOGO_IFSM, LOGO_MAECS_PAT } from '@/constants/assets';
import { FIRE_DOOR_QUESTIONS } from '@/constants/questions';
import { Door, SiteDetails } from '@/store/useAssessmentStore';

interface jsPDFWithPlugin extends jsPDF {
  lastAutoTable: {
    finalY: number;
  };
}


// export const generatePDF = (siteDetails: any, doors: Door[]) => {
export const generatePDF = (siteDetails: SiteDetails, doors: Door[]) => {
  const doc = new jsPDF() as jsPDFWithPlugin;
  const timestamp = new Date().toLocaleDateString('en-GB');
  const remedialRequired = doors.some(door => Object.values(door.responses).includes('Fail'));

  const addFooter = (pdf: jsPDFWithPlugin) => {
  
    // const pageCount = (pdf as any).internal.getNumberOfPages();
    const pageCount = pdf.getNumberOfPages();
    for (let i = 1; i <= pageCount; i++) {
      pdf.setPage(i);
      pdf.setFontSize(9);
      pdf.setTextColor(150);
      pdf.setFont("helvetica", "bold");
      pdf.text("Powered by BSD & Consults", 105, 285, { align: "center" });
      pdf.setFontSize(8);
      pdf.setFont("helvetica", "normal");
      pdf.text("Compliance with the Building Regulations 2010 / Compliance with the Regulatory Reform Fire Safety Order 2005", 105, 290, { align: "center" });
    }
  };

  // --- 1. FRONT SUMMARY PAGE ---
  doc.addImage(LOGO_BRITISH_SAFETY, 'PNG', 14, 10, 25, 15);
  doc.addImage(LOGO_IFSM, 'PNG', 45, 10, 22, 15);
  doc.addImage(LOGO_MAECS_PAT, 'PNG', 75, 8, 35, 18);

  doc.setFontSize(9);
  doc.setTextColor(60, 60, 60);
  doc.setFont("helvetica", "bold");
  doc.text("Mae Compliance Service", 195, 12, { align: 'right' });
  doc.setFont("helvetica", "normal");
  doc.text("+44 7404 229188", 195, 17, { align: 'right' });
  doc.text("admin@maecs.co.uk", 195, 22, { align: 'right' });
  doc.setTextColor(0, 50, 200);
  doc.text("https://maecs.co.uk/", 195, 27, { align: 'right' });

  doc.setDrawColor(190, 0, 0);
  doc.setLineWidth(1.5);
  doc.line(14, 32, 195, 32);

  doc.setFillColor(248, 248, 248);
  doc.rect(14, 38, 181, 15, 'F');
  doc.setFontSize(22);
  doc.setTextColor(40, 40, 40);
  doc.setFont("helvetica", "bold");
  doc.text('FIRE DOOR INSPECTION REPORT', 18, 48);

  const drawField = (label: string, value: string | number, col: number, row: number, isRed = false) => {
    const x = 14 + (col * 100);
    const y = 65 + (row * 22);
    doc.setFillColor(190, 0, 0);
    doc.circle(x - 2, y - 1, 0.5, 'F');
    doc.setFontSize(11);
    doc.setTextColor(120, 120, 120);
    doc.setFont("helvetica", "bold");
    doc.text(label.toUpperCase(), x, y);
    doc.setFontSize(12);
    doc.setFont("helvetica", "normal");
    if (isRed && value === "Yes") { doc.setTextColor(190, 0, 0); doc.setFont("helvetica", "bold"); }
    else { doc.setTextColor(0); }
    doc.text(`${value || 'N/A'}`, x, y + 8);
    doc.setDrawColor(230);
    doc.line(x, y + 12, x + 85, y + 12);
  };

  drawField("Business Name", siteDetails.businessName, 0, 0);
  drawField("Customer Name", siteDetails.customerName, 0, 1);
  drawField("Site Address", siteDetails.siteAddress, 0, 2);
  drawField("Customer Phone", siteDetails.customerPhone, 0, 3);
  drawField("Customer Email", siteDetails.customerEmail, 0, 4);
  drawField("Certificate Number", siteDetails.certNumber, 1, 0);
  drawField("Date of Test", timestamp, 1, 1);
  drawField("Number of Doors Tested", doors.length, 1, 2);
  drawField("Are Remedial Works Required", remedialRequired ? "Yes" : "No", 1, 3, true);
  drawField("Lead Inspector", siteDetails.engineerInitials, 1, 4);

  // --- 2. DOOR DETAIL PAGES ---
  doors.forEach((door) => {
    doc.addPage();
    doc.setFillColor(40, 40, 40);
    doc.rect(0, 0, 210, 25, 'F');
    
    doc.setFontSize(14); doc.setTextColor(255); doc.setFont("helvetica", "bold");
    doc.text(`DOOR ID: ${door.labelId || 'N/A'}`, 14, 16);
    doc.setFontSize(10); doc.setFont("helvetica", "normal");
    doc.text(`Floor Level: ${door.floorLevel || 'N/A'}`, 195, 11, { align: 'right' });
    doc.text(`Door Location: ${door.location || 'N/A'}`, 195, 18, { align: 'right' });

    autoTable(doc, {
      startY: 32,
      head: [['Assessment Criteria (BS Standards)', 'Compliance']],
      body: FIRE_DOOR_QUESTIONS.map((q, i) => [`${i + 1}. ${q.text}`, door.responses[q.id] || 'N/A']),
      theme: 'grid',
      styles: { 
        fontSize: 13, 
        cellPadding: 4,
        overflow: 'linebreak'
      },
      headStyles: { fillColor: [190, 0, 0], fontSize: 14 },
      columnStyles: { 
        0: { cellWidth: 145 }, 
        1: { cellWidth: 38, halign: 'center', fontStyle: 'bold' } 
      },
      margin: { bottom: 35 }, 
      didParseCell: (data) => {
        if (data.section === 'body' && data.column.index === 1) {
          if (data.cell.raw === 'Fail') data.cell.styles.textColor = [200, 0, 0];
          if (data.cell.raw === 'Pass') data.cell.styles.textColor = [0, 128, 0];
        }
      }
    });

  
    let currentY = doc.lastAutoTable.finalY;

    if (currentY > 240) {
      doc.addPage();
      currentY = 30;
    }
    
    doc.setFontSize(14); doc.setFont("helvetica", "bold"); doc.setTextColor(0);
    doc.text('REMEDIAL ACTIONS & NOTES', 14, currentY + 15);
    doc.setDrawColor(190, 0, 0); doc.line(14, currentY + 17, 40, currentY + 17);

    doc.setFontSize(13);
    doc.text('Action Required: ', 14, currentY + 28);
    doc.setFont("helvetica", "normal");
    doc.text(`${door.actionRequired || 'None'}`, 55, currentY + 28, { maxWidth: 135 });

    doc.setFont("helvetica", "bold");
    doc.text('General Notes: ', 14, currentY + 42);
    doc.setFont("helvetica", "normal");
    doc.text(`${door.notes || 'None'}`, 55, currentY + 42, { maxWidth: 135 });

    if (door.images && door.images.length > 0) {
      door.images.forEach((imgData, idx) => {
        if (imgData && imgData.startsWith('data:image')) {
          doc.addPage();
          doc.setFillColor(245, 245, 245); doc.rect(0, 0, 210, 30, 'F');
          doc.setFontSize(14); doc.setFont("helvetica", "bold"); doc.setTextColor(40);
          doc.text(`PHOTO EVIDENCE: DOOR ${door.labelId || ''} - Image ${idx + 1}`, 14, 20);
          const imgWidth = 170; const imgHeight = 220; const xPos = (210 - imgWidth) / 2;
          try { doc.addImage(imgData, 'JPEG', xPos, 40, imgWidth, imgHeight, undefined, 'FAST'); } 
          catch (e) { console.error(e); }
        }
      });
    }
  });

  // --- 3. SIGN-OFF PAGE ---
  doc.addPage();
  doc.setFontSize(20); doc.text('Authorized Sign-off', 14, 30);
  if (OWNER_SIGNATURE) doc.addImage(OWNER_SIGNATURE, 'PNG', 14, 38, 50, 20);
  doc.setFontSize(13);
  doc.text(`Lead Inspector: ${siteDetails.engineerInitials}`, 14, 70);

  addFooter(doc);
  doc.save(`Mae_Fire_Report_${siteDetails.certNumber || 'Export'}.pdf`);
};