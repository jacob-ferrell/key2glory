import axiosInstance from "./axiosInstance";

export default async function addToFavorites(testId: number) {
  await axiosInstance.post("private/favorites/" + testId);
}
