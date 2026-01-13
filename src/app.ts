import express from "express";
import cookieParser from "cookie-parser";
import authRoutes from "./modules/auth/auth.routes";
import leaderboardRoutes from "./modules/leaderboard/leaderboard.routes"
import adminRoutes from "./modules/admin/admin.routes";
import payoutRoutes from "./modules/payouts/payout.routes";



import { errorHandler } from "./middlewares/error.middleware";

const app = express();



// Global Middlewares 
app.use(express.json());
app.use(cookieParser());

// Routes 
app.use("/api/auth", authRoutes);
app.use("/api/leaderboard", leaderboardRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/payouts", payoutRoutes);




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

