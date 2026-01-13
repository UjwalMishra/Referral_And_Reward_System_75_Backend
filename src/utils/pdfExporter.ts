import PDFDocument from "pdfkit";

interface PDFRow {
  name: string;
  email: string;
  userType: string;
  totalReferrals: number;
  totalEarnings: number;
}

export const generateReferralReportPDF = (rows: PDFRow[]) => {
  const doc = new PDFDocument({ margin: 40 });

  // Title
  doc
    .fontSize(18)
    .text("Referral Commission Report", { align: "center" })
    .moveDown(1);

  // Header
  doc
    .fontSize(12)
    .text("Name | Email | User Type | Referrals | Earnings", {
      underline: true,
    })
    .moveDown(0.5);

  // Rows
  rows.forEach((row) => {
    doc.text(
      `${row.name} | ${row.email} | ${row.userType} | ${row.totalReferrals} | ₹${row.totalEarnings}`
    );
  });

  doc
    .moveDown(1)
    .fontSize(10)
    .text(`Generated on: ${new Date().toLocaleString()}`, {
      align: "right",
    });

  return doc;
};
