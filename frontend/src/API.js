import axios from "axios";
const API = axios.create({
    baseURL: 'http://127.0.0.1:5000/api',
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('ACCESS_TOKEN')
    config.headers.Authorization = `Bearer ${token}`;
    return config;
});

API.interceptors.response.use(
    (response) => {
        return response;
    },
    (error) => {
        try{
            const {response} = error;
            if(response.status === 401) {
                localStorage.removeItem('ACCESS_TOKEN');
            }
        } catch {
            console.error(err);
        }
        throw error;
});

export default API;