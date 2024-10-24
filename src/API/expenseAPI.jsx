import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

export const createExpense = async (formData) => {
    try {
        const res = await api.post(`/api/v1/expense`, formData)
        return res.status === 200 ? res.data : [];
    } catch (error) {
        console.log(error);
        return [];
    }
};

export const getExpenseData = async () => {
    try {
        const res = await api.get(`/api/v1/expense`);
        return res.status === 200 ? res.data : []
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const updateExpenseData = async (expenseId, formData) => {
    try {
        const res = await api.put(`/api/v1/expense/${expenseId}`, formData);
        return res.status === 200 ? res.data : []
    } catch (error) {
        console.log(error);
        return [];
    }
}

export const deleteExpenseData = async (expenseId) => {
    try {
        const res = await api.delete(`/api/v1/expense/${expenseId}`);
        return res.status === 200 ? res.data : []
    } catch (error) {
        console.log(error);
        return [];
    }
}