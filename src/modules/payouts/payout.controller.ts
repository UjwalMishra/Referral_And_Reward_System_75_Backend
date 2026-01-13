import { Request, Response } from "express";
import { createPayoutService } from "./payout.service";

export const createPayout = async (req: Request, res: Response) => {
  const { userId } = req.body;

  if (!userId) {
    return res.status(400).json({
      success: false,
      message: "userId is required",
    });
  }

  const payout = await createPayoutService(userId);

  res.json({
    success: true,
    message: "Payout completed successfully",
    payout,
  });
};
