import axiosInstance from "./axiosInstance";

export default async function getTests(params: string) {
    const res = await axiosInstance.get("public/typing-test" + params);
    return res.data.body;
}