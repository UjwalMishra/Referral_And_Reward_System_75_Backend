import { Request, Response } from "express";
import { getSimpleReferralReportService } from "./admin.service";
import { exportToCSV } from "../../utils/csvExporter";
import { generateReferralReportPDF } from "../../utils/pdfExporter";

export const getReferralReport = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const search = req.query.search as string;
  const minEarnings = Number(req.query.minEarnings) || 0;
  const userType = req.query.userType as string;

  const result = await getSimpleReferralReportService({
    page,
    limit,
    search,
    minEarnings,
    userType,
  });

  res.json({
    success: true,
    page,
    limit,
    ...result,
  });
};


export const exportReferralReportCSV = async (
  req: Request,
  res: Response
) => {
  const search = req.query.search as string;
  const minEarnings = Number(req.query.minEarnings) || 0;
  const userType = req.query.userType as string;

  const result = await getSimpleReferralReportService({
    page: 1,
    limit: 10_000, // large limit = no pagination
    search,
    minEarnings,
    userType,
  });

  const csv = exportToCSV(result.data, [
    "name",
    "email",
    "userType",
    "totalReferrals",
    "totalEarnings",
  ]);

  res.setHeader("Content-Type", "text/csv");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=referral-report.csv"
  );

  res.send(csv);
};

export const exportReferralReportPDF = async (
  req: Request,
  res: Response
) => {
  const search = req.query.search as string;
  const minEarnings = Number(req.query.minEarnings) || 0;
  const userType = req.query.userType as string;

  const result = await getSimpleReferralReportService({
    page: 1,
    limit: 10_000,
    search,
    minEarnings,
    userType,
  });

  const doc = generateReferralReportPDF(result.data);

  res.setHeader("Content-Type", "application/pdf");
  res.setHeader(
    "Content-Disposition",
    "attachment; filename=referral-report.pdf"
  );

  doc.pipe(res);
  doc.end();
};