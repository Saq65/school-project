import axios from 'axios';

const API_URL = 'https://school-project-u33a.onrender.com/api';

const api = axios.create({
    baseURL: API_URL,
    headers: {
        'Content-Type': 'application/json',
    },
});

export const schoolAPI = {
    addSchool: async (formData) => {
        const response = await api.post('/schools', formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });
        return response.data;
    },

    getAllSchools: async () => {
        const response = await api.get('/schools');
        return response.data;
    },

    getSchoolById: async (id) => {
        const response = await api.get(`/schools/${id}`);
        return response.data;
    },

    deleteSchool: async (id) => {  
        const response = await api.delete(`/schools/${id}`);
        return response.data;
    },
};

export default api;