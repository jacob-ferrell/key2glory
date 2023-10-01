import { Stats } from "../common/types";
import axiosInstance from "./axiosInstance";

export default async function postScore(score: Stats, testId: number) {
    const res = await axiosInstance.post(`private/typing-test/${testId}/scores`, score);
    return res.data;
}