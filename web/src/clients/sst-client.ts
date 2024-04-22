import axios from "axios";
import { getCookie } from "react-use-cookie";

const BASE_URL = "http://localhost:5432";

const instance = axios.create({
  baseURL: BASE_URL,
  //   withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
    "Sst-Secret": getCookie("secret"),
  },
});

export const login = async (secret) => {
  try {
    const response = await instance.post(`/login`, { secret });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Something went wrong");
  }
};

export const getCompetitor = async () => {
  try {
    const response = await instance.get(`/competitor`, {});
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Something went wrong");
  }
};
