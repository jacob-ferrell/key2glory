import axiosInstance from "./axiosInstance";

export default async function getMissedCharacters() {
    const res = await axiosInstance.get("/private/missed-characters");
    const missedCharacters = new Map<string, number>();
    Object.keys(res.data.characterCounts).forEach((char: string) => {
        missedCharacters.set(char, res.data.characterCounts[char]);
    });
    return missedCharacters;
}