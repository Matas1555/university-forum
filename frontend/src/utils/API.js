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

                localStorage.setItem('ACCESS_TOKEN', newToken);
                API.defaults.headers.common["Authorization"] = `Bearer ${newToken}`;
                return API(originalRequest);
            } catch (refreshError) {
                localStorage.removeItem('ACCESS_TOKEN');
                localStorage.removeItem('REFRESH_TOKEN');
                return Promise.reject(refreshError);
            }
        }

        return Promise.reject(error);
    }
);

export const ForumAPI = {
    getAllForums: () => {
        return API.get('/forums');
    },
    
    getUniversityForums: () => {
        return API.get('/forums', {
            params: { entity_type: 'university' }
        });
    },
    
    getFacultyForums: (universityId) => {
        return API.get('/forums', {
            params: { 
                entity_type: 'faculty',
                university_id: universityId 
            }
        });
    },
    
    getProgramForums: (facultyId) => {
        return API.get('/forums', {
            params: { 
                entity_type: 'program',
                faculty_id: facultyId 
            }
        });
    },
    
    getForumPosts: (forumId) => {
        return API.get(`/forums/${forumId}/posts`);
    },
    
    getUniversityPosts: (universityId, sortBy = 'date', sortOrder = 'desc') => {
        return API.get('/posts', {
            params: {
                forum_id: universityId,
                sort_by: sortBy,
                sort_order: sortOrder
            }
        });
    },
    
    getFacultyPosts: (facultyId, sortBy = 'date', sortOrder = 'desc') => {
        return API.get('/posts', {
            params: {
                forum_id: facultyId,
                sort_by: sortBy,
                sort_order: sortOrder
            }
        });
    },
    
    getProgramPosts: (programId, sortBy = 'date', sortOrder = 'desc') => {
        return API.get('/posts', {
            params: {
                forum_id: programId,
                sort_by: sortBy,
                sort_order: sortOrder
            }
        });
    },
    
    getUniversities: () => {
        return API.get('/universities');
    },
    
    getUniversityById: (universityId) => {
        return API.get(`/universities/${universityId}`);
    },
    
    getFacultiesByUniversity: (universityId) => {
        return API.get(`/universities/${universityId}/faculties`);
    },
    
    getProgramsByFaculty: (facultyId) => {
        return API.get(`/faculties/${facultyId}/programs`);
    },
    
    getUniversityPrograms: (universityId) => {
        return API.get(`/universities/${universityId}/programs`);
    },

    getFacultiesWithPrograms: (universityId) => {
        return API.get(`/universities/${universityId}/faculties-with-programs`);
    },
    
    createPost: (postData) => {
        return API.post('/posts', postData);
    },
    
    getPost: (postId) => {
        return API.get(`/posts/${postId}`);
    },
    
    getPostComments: (postId) => {
        return API.get(`/posts/${postId}/comments`);
    },
    
    createComment: (commentData) => {
        return API.post('/comments', commentData);
    },

    like: (postId) => {
        return API.post(`/posts/${postId}/like`);
    },

    dislike: (postId) => {
        return API.post(`/posts/${postId}/dislike`);
    },
    
    likeComment: (commentId) => {
        return API.post(`/comments/${commentId}/like`);
    },
    
    dislikeComment: (commentId) => {
        return API.post(`/comments/${commentId}/dislike`);
    },
    
    getUserCommentInteractions: () => {
        return API.get('/user/comment-interactions');
    }
};

export const LecturerAPI = {
    getLecturers: async (params = {}) => {
        return await API.get('/lecturers', { params });
    },
    
    getTopRatedLecturers: async () => {
        return await API.get('/lecturers/top-rated');
    },
    
    getLecturer: async (id) => {
        return await API.get(`/lecturers/${id}`);
    },
    
    getLecturersByFaculty: async (facultyId) => {
        return await API.get(`/faculties/${facultyId}/lecturers`);
    },
    
    createReview: async (lecturerId, reviewData) => {
        return await API.post(`/lecturers/${lecturerId}/reviews`, reviewData);
    }
};

export const UniversityAPI = {
    getUniversities: async () => {
        return await API.get('/universities');
    },
    
    getFaculties: async (universityId) => {
        return await API.get(`/universities/${universityId}/faculties`);
    },
    
    getFacultiesWithPrograms: async (universityId) => {
        return await API.get(`/universities/${universityId}/faculties-with-programs`);
    }
}; 

export default API;