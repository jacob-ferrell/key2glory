import axiosInstance from "./axiosInstance";

export default async function removeFromFavorites(testId: number) {
  await axiosInstance.delete("private/favorites/" + testId);
}
