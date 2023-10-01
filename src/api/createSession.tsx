import axiosInstance from "./axiosInstance";

export default async function createSession(testId: string | undefined, startTime: number) {
    const res = await axiosInstance.post(`private/typing-test/${testId}/session`, { startTime });
    return res.data;
}