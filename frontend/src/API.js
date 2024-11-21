import axios from "axios";
const API = axios.create({
    baseURL: 'http://127.0.0.1:5000/api',
});

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
});

API.interceptors.response.use(
    (response) => {
        return response;
    },
    async (error) => {
        const { response } = error;
        const originalRequest = error.config;

        if (response && response.status === 401 && !originalRequest._retry) {
            originalRequest._retry = true;

            try {
                const refreshToken = localStorage.getItem('REFRESH_TOKEN');
                if (!refreshToken) {
                    throw new Error("Refresh token not available");
                }

                const refreshResponse = await API.post('/refresh-token', {}, {
                    headers: {
                        'Authorization': `Bearer ${refreshToken}`
                    }
                });

                const newToken = refreshResponse.data.access_token;

                // Update tokens in localStorage and retry the request
                localStorage.setItem('ACCESS_TOKEN', newToken);
                API.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
                return API(originalRequest);
            } catch (refreshError) {
                // Remove tokens and redirect to login if refresh fails
                localStorage.removeItem('ACCESS_TOKEN');
                localStorage.removeItem('REFRESH_TOKEN');
                window.location.href = "/login"; // Redirect to login
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);


export default API;