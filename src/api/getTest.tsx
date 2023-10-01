import axiosInstance from "./axiosInstance";

export default async function getTest(testId: string | undefined) {
    const res = await axiosInstance.get("public/typing-test/" + testId);
    return res.data;
}