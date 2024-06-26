import axios from "axios";
import { getCookie } from "react-use-cookie";

const BASE_URL = window.location.host.includes("localhost")
  ? "http://localhost:5432"
  : "http://api.speedtest.skills";

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

export const getTasksWithSubmissions = async () => {
  try {
    const response = await instance.get(`/tasksWithSubmissions`, {});
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Something went wrong");
  }
};

export const submitSolution = async (taskId, submittedSolution) => {
  try {
    const response = await instance.post(`/submitSubmission`, {
      taskId,
      submittedSolution: JSON.stringify(submittedSolution),
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Something went wrong");
  }
};

export const getStats = async () => {
  try {
    const response = await instance.get(`/stats`, {});
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data || "Something went wrong");
  }
};
