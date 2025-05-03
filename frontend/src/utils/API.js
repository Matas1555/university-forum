import axios from "axios";

const requestControllers = new Map();

const API = axios.create({
    baseURL: 'http://127.0.0.1:5000/api',
});

export const cancelPreviousRequest = (endpoint) => {
    if (requestControllers.has(endpoint)) {
        console.log(`Canceling previous request to: ${endpoint}`);
        requestControllers.get(endpoint).abort();
        requestControllers.delete(endpoint);
    }
};

export const getRequestKey = (endpoint, params = {}) => {
    const paramsString = params ? JSON.stringify(params) : '';
    return `${endpoint}${paramsString ? '?' + paramsString : ''}`;
};

API.interceptors.request.use((config) => {
    const token = localStorage.getItem('ACCESS_TOKEN');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    
    const controller = new AbortController();
    config.signal = controller.signal;
    
    const requestKey = getRequestKey(config.url, config.params);
    
    cancelPreviousRequest(requestKey);
    
    requestControllers.set(requestKey, controller);
    
    return config;
}, (error) => {
    return Promise.reject(error);
});

API.interceptors.response.use(
    (response) => {
        const requestKey = getRequestKey(response.config.url, response.config.params);
        if (requestControllers.has(requestKey)) {
            requestControllers.delete(requestKey);
        }
        return response;
    },
    async (error) => {
        if (axios.isCancel(error)) {
            console.log('Request canceled:', error.message);
            return Promise.reject(error);
        }
        
        const { response, config } = error;
        const originalRequest = config;
        
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

        if (originalRequest) {
            const requestKey = getRequestKey(originalRequest.url, originalRequest.params);
            if (requestControllers.has(requestKey)) {
                requestControllers.delete(requestKey);
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
    
    getGeneralDiscussionPosts: (sortBy = 'date', sortOrder = 'desc') => {
        return API.get(`/forums/358/posts`, {
            params: {
                sort_by: sortBy,
                sort_order: sortOrder
            }
        });
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

    incrementPostViews: (postId) => {
        return API.post(`/posts/${postId}/view`);
    },
    
    searchPosts: (searchParams) => {
        console.log('🔍 Search API call initiated with parameters:', searchParams);
        
        // Make sure we're using 'q' instead of 'keyword' for search term
        const finalParams = {...searchParams};
        if (finalParams.keyword) {
            console.log('Converting "keyword" parameter to "q" for backend compatibility');
            finalParams.q = finalParams.keyword;
            delete finalParams.keyword;
        }
        
        console.log('Final API search parameters:', finalParams);
        const apiCall = API.get('/search', { params: finalParams });
        
        // Add promise handlers for debugging
        apiCall.then(response => {
            console.log('✅ Search API call successful:', {
                total: response.data?.pagination?.total || 'No count available',
                results: response.data?.data?.length || 0,
                firstResult: response.data?.data?.[0] ? 
                    `"${response.data.data[0].title}" by ${response.data.data[0].user}` : 
                    'No results'
            });
            return response;
        }).catch(error => {
            console.error('❌ Search API call failed:', error);
            console.error('Error details:', error.response || error.message || error);
            throw error;
        });
        
        return apiCall;
    },
    
    getCategories: () => {
        return API.get('/categories');
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
    },
    
    deleteReview: async (reviewId) => {
        return await API.delete(`/lecturer-reviews/${reviewId}`);
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
    },

    getProgramById: async (programId) => {
        return await API.get(`/programs/${programId}`);
    },
    
    getUniversityReviews: async (universityId) => {
        return await API.get(`/universities/${universityId}/reviews`);
    },
    
    createUniversityReview: async (universityId, reviewData) => {
        return await API.post(`/universities/${universityId}/reviews`, reviewData);
    },
    
    deleteUniversityReview: async (reviewId) => {
        return await API.delete(`/university-reviews/${reviewId}`);
    },

    getProgramReviews: async (programId, page = 1) => {
        return await API.get(`/programs/${programId}/reviews`, { params: { page } });
    },
    
    createProgramReview: async (programId, reviewData) => {
        return await API.post(`/programs/${programId}/reviews`, reviewData);
    },
    
    updateProgramReview: async (reviewId, reviewData) => {
        return await API.put(`/program-reviews/${reviewId}`, reviewData);
    },
    
    deleteProgramReview: async (reviewId) => {
        return await API.delete(`/program-reviews/${reviewId}`);
    },
    
    hasUserReviewedProgram: async (programId) => {
        return await API.get(`/programs/${programId}/user-reviewed`);
    },
    
    filterRecommendations: async (preferences) => {
        return await API.post('/recommendations/filter', preferences);
    },
    
    getAIRecommendations: async (preferences) => {
        return await API.post('/recommendations/ai', preferences);
    }
}; 

export default API;