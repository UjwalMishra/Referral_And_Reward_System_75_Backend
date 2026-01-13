import { Router } from "express";
import { exportReferralReportCSV, exportReferralReportPDF, getReferralReport } from "./admin.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { adminMiddleware } from "../../middlewares/admin.middleware";

const router = Router();

router.get(
  "/referral-report",
  authMiddleware,
  adminMiddleware,
  getReferralReport
);

router.get(
  "/referral-report/export/csv",
  authMiddleware,
  adminMiddleware,
  exportReferralReportCSV
);

router.get(
  "/referral-report/export/pdf",
  authMiddleware,
  adminMiddleware,
  exportReferralReportPDF
);

export default router;
