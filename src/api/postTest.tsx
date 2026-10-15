import { TestType, TypingTest } from "../common/types";
import axiosInstance from "./axiosInstance";

export default async function postTest(type: TestType, text: string) {
  const res = await axiosInstance.post<TypingTest>("private/typing-test", { type, text });
  return res.data;
}
