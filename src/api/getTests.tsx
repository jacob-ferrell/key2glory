import { Page, TypingTest } from "../common/types";
import axiosInstance from "./axiosInstance";

export default async function getTests(params: string) {
  const res = await axiosInstance.get<Page<TypingTest>>("public/typing-test" + params);
  return res.data;
}
