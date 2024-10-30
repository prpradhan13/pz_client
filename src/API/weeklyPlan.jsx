import axios from  'axios';

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true,
});

export const getWeeklyPlan = async () => {
    try {
        const res = await api.get(`/api/v1/training/weeklyTraining`);
        return res.status === 200 ? res.data : [];
    } catch (error) {
        console.log(error);
        return [];
    }
};
      