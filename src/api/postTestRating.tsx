import axiosInstance from "./axiosInstance";

type TestRatingResponse = {
  typingTest: number;
  rating: number;
  username: string;
};

export default async function postTestRating(testId: number, rating: number) {
  const res = await axiosInstance.post<TestRatingResponse>(`private/typing-test/${testId}/rating`, { rating });
  return res.data;
}
