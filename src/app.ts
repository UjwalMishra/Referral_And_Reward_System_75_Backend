import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes";
import userRoutes from "./modules/users/user.routes";
import leaderboardRoutes from "./modules/leaderboard/leaderboard.routes"
import adminRoutes from "./modules/admin/admin.routes";
import payoutRoutes from "./modules/payouts/payout.routes";
import { env } from "./config/env.config";
import cors from "cors";


import { errorHandler } from "./middlewares/error.middleware";

const app = express();



// Global Middlewares 
app.use(express.json());
app.use(cookieParser());
app.use(
  cors({
    origin: env.FRONTEND_URL,
    credentials: true,
  })
);


// Routes 
app.use("/api/auth", authRoutes);
app.use("/api/users", userRoutes);
app.use("/api/admin/leaderboard", leaderboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/admin/payouts", payoutRoutes);

// invalid routes
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "Route not found",
  });
});

// error handler
app.use(errorHandler);

export default app;

