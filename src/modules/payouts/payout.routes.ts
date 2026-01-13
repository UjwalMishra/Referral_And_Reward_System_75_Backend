import { Router } from "express";
import { createPayout } from "./payout.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";
import { adminMiddleware } from "../../middlewares/admin.middleware";

const router = Router();

router.post(
  "/",
  authMiddleware,
  adminMiddleware,
  createPayout
);

export default router;
