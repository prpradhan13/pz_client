import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    withCredentials: true
});

export const createTodo = async (formData) => {
    try {
        const res = await api.post(`/api/v1/todo`, formData, { withCredentials: true });
        return res.status === 200 ? res.data : []
    } catch (error) {
        console.log(error);
        return [];
    }
};

export const getTodoData = async () => {
    try {
        const res = await api.get(`/api/v1/todo`, { withCredentials: true });
        return res.status === 200 ? res.data : []
    } catch (error) {
        console.log(error);
        return [];
    }
};

export const updateTodoData = async (todoId, tasks) => {
    console.log(todoId, tasks);
    
    try {
        const res = await api.put(`/api/v1/todo/${todoId}`, { tasks: tasks }, { withCredentials: true });
        return res.status === 200 ? res.data : []
    } catch (error) {
        console.log(error);
        return [];
    }
};

export const updateTaskChange = async (todoId, taskId, taskTitle, isCompleted) => {
    const payload = { taskId, taskTitle, completed: isCompleted };

    try {
        const res = await api.patch(`/api/v1/todo/${todoId}`, payload, {withCredentials: true});
        return res.status === 200 ? res.data : []
    } catch (error) {
      console.error("Error updating task completion", error.response || error);
    }
};