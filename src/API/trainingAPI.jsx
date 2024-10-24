import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

export const createTraining = async (trainingFormData) => {
    try {
        const res = await api.post('/api/v1/training', trainingFormData)
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

export const deleteTrainingData = async (trainingId) => {
    try {
        const res = await api.delete(`/api/v1/training/${trainingId}`);
        return res.status === 200 ? res.data : [];
    } catch (error) {
        console.log(error);
        return [];
    }
};