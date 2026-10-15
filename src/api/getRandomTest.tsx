import { TestType, TypingTest } from "../common/types";
import axiosInstance from "./axiosInstance";

export default async function getRandomTest(type: TestType, exclude?: number) {
  const res = await axiosInstance.get<TypingTest>("public/typing-test/random", {
    params: { type, exclude },
  });
  return res.data;
}
