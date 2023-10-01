import axiosInstance from "./axiosInstance";

export default async function getTestText(testId: string | undefined) {
    const res = await axiosInstance.get(`public/typing-test/${testId}/text`);
    return res.data;
}