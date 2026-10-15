import { Score } from "../common/types";
import axiosInstance from "./axiosInstance";

export default async function getTestLeaderboard(testId: number, limit = 10) {
  const res = await axiosInstance.get<Score[]>(`public/typing-test/${testId}/scores`, {
    params: { limit },
  });
  return res.data;
}
