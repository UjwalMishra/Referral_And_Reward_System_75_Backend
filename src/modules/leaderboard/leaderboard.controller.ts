import { Request, Response } from "express";
import { getLeaderboardService } from "./leaderboard.service";

export const getLeaderboard = async (req: Request, res: Response) => {
  const page = Number(req.query.page) || 1;
  const limit = Number(req.query.limit) || 10;

  const data = await getLeaderboardService({ page, limit });

  res.json({
    success: true,
    page,
    limit,
    data,
  });
};
