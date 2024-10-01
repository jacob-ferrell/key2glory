import axiosInstance from "./axiosInstance";

export default async function addToFavorites(testId: string) {
    await axiosInstance.post("private/favorites/" + testId);
}