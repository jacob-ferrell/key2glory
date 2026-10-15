import axiosInstance from "./axiosInstance";

export default async function getMissedCharacters() {
  const res = await axiosInstance.get<{ characterCounts: Record<string, number> }>("private/missed-characters");
  return new Map(Object.entries(res.data.characterCounts));
}
