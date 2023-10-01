import axiosInstance from "./axiosInstance";

type testRating = {
    rating: number;
}

export default async function postTestRating(testId: number, rating: testRating) {
    const res = await axiosInstance.post(`private/typing-test/${testId}/rating`, rating);
    return res.data;
}