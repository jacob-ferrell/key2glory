import axiosInstance from "./axiosInstance";

export default async function getGeneralStats() {
    const res = await axiosInstance.get('private/general-stats');
    return res.data;
}