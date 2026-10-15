import { Score } from "../common/types";
import axiosInstance from "./axiosInstance";

type endSessionParams = {
  testId: string | undefined;
  endTime: number;
  missedCharacters: string[];
};

export default async function endSession({ testId, endTime, missedCharacters }: endSessionParams) {
  const res = await axiosInstance.put<Score>(`private/typing-test/${testId}/session`, {
    endTime,
    missedCharacters,
  });
  return res.data;
}
