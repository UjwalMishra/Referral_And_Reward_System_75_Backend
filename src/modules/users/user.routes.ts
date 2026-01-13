import { Router } from "express";
import { getUserDashboard } from "./user.controller";
import { authMiddleware } from "../../middlewares/auth.middleware";

const router = Router();

router.get(
  "/dashboard",
  authMiddleware,
  getUserDashboard
);

export default router;
