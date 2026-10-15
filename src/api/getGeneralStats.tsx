import { GeneralStats } from "../common/types";
import axiosInstance from "./axiosInstance";

export default async function getGeneralStats() {
  const res = await axiosInstance.get<GeneralStats>("private/general-stats");
  return res.data;
}
