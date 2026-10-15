import { Score } from "../common/types";
import axiosInstance from "./axiosInstance";

export default async function getRecentScores(limit = 30) {
  const res = await axiosInstance.get<Score[]>("private/scores/recent", { params: { limit } });
  return res.data;
}
