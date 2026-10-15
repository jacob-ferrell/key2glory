import { LeaderboardEntry } from "../common/types";
import axiosInstance from "./axiosInstance";

export default async function getLeaderboard(limit = 50) {
  const res = await axiosInstance.get<LeaderboardEntry[]>("public/leaderboard", { params: { limit } });
  return res.data;
}
