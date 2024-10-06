import axiosInstance from "./axiosInstance";

export default async function postTest(type: string, text: string) {
    const res = await axiosInstance.post('private/typing-test', {type, text});
    return res.data;
}