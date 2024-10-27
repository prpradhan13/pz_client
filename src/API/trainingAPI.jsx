import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
  withCredentials: true,
});

export const createTraining = async (trainingFormData) => {
  try {
    const res = await api.post("/api/v1/training", trainingFormData);
    return res.status === 200 ? res.data : [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getTraining = async () => {
  try {
    const res = await api.get(`/api/v1/training`);
    return res.status === 200 ? res.data : [];
  } catch (error) {
    console.log(error);
    return [];
  }
};

export const getPublicTrainingData = async (
  page = 1,
  limit = 10,
  sortBy = "createdAt",
  order = "desc"
) => {
  try {
    const res = await api.get(`/api/v1/training/public`, {params: { page, limit, sortBy, order }});

    return res.status === 200 ? res.data : { trainingData: [], total: 0 };
  } catch (error) {
    console.error("Error fetching public training data:", error);
    return { trainingData: [], total: 0 };
  }
};

export const deleteTrainingData = async (trainingId) => {
  try {
    const res = await api.delete(`/api/v1/training/${trainingId}`);
    return res.status === 200 ? res.data : [];
  } catch (error) {
    console.log(error);
    return [];
  }
};
