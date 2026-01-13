import { Router } from "express";
import { createPayout } from "./payout.controller";
import { getPendingPayouts } from "./payout.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { adminMiddleware } from "../../middlewares/admin.middleware";

const router = Router();


router.get(
  "/pending",
  authMiddleware,
  adminMiddleware,
  getPendingPayouts
);


router.post(
  "/process",
  authMiddleware,
  adminMiddleware,
  createPayout
);

export default router;
