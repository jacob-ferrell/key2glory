import axiosInstance from "./axiosInstance";

export default async function endSession(testId: string | undefined, endTime: number) {
    const res = await axiosInstance.put(`private/typing-test/${testId}/session`, { endTime, errors: 8 });
    console.log(res.data)
    return res.data;
}