import { useState, useEffect } from "react";
import { useStateContext } from "../context/contextProvider";
import API, { ForumAPI } from "../utils/API";
import defaultAvatar from "../assets/profile-default-icon.png";
import { Link } from 'react-router-dom';

const Profile = () => {
    const { user } = useStateContext();
    const [activeTab, setActiveTab] = useState("info");
    const [posts, setPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);
    const [commentedPosts, setCommentedPosts] = useState([]);
    const [savedPosts, setSavedPosts] = useState([]);
    const [reviews, setReviews] = useState([]);
    const [stats, setStats] = useState({
        postsCount: 0,
        likesCount: 0,
        commentsCount: 0,
        savedCount: 0
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const userFields = [
        { key: 'username', label: 'Naudotojo vardas', icon: 'user' },
        { key: 'email', label: 'El. paštas', icon: 'envelope' },
        { key: 'bio', label: 'Biografija', icon: 'book-open' },
        { key: 'university_id', label: 'Universitetas', icon: 'university' },
        { key: 'yearOfGraduation', label: 'Baigimo metai', icon: 'graduation-cap' },
        { key: 'faculty_id', label: 'Fakultetas', icon: 'building' },
        { key: 'reputation', label: 'Reputacija', icon: 'star' },
        { key: 'created_at', label: 'Narys nuo', icon: 'calendar' }
    ];

    useEffect(() => {
        if (user) {
            // Fetch user stats when component mounts
            fetchUserStats();
            
            // Fetch tab-specific data
            if (activeTab === "posts") {
                fetchUserPosts();
            } else if (activeTab === "liked") {
                fetchLikedPosts();
            } else if (activeTab === "commented") {
                fetchCommentedPosts();
            } else if (activeTab === "saved") {
                fetchSavedPosts();
            } else if (activeTab === "reviews") {
                fetchReviews();
            }
        }
    }, [user, activeTab]);

    const fetchUserStats = async () => {
        try {
            // This would be better as a single API call in a real app
            const postsResponse = await API.get('/posts', { params: { user_id: user.id } });
            const commentsResponse = await API.get('/comments', { params: { user_id: user.id } });
            
            setStats({
                postsCount: postsResponse.data.length,
                commentsCount: commentsResponse.data.length,
                likesCount: postsResponse.data.reduce((acc, post) => acc + (post.likes || 0), 0),
                savedCount: 0 // Would need an API endpoint for this
            });
        } catch (error) {
            console.error('Error fetching user stats:', error);
        }
    };

    const fetchUserPosts = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await API.get('/posts', { params: { user_id: user.id } });
            setPosts(response.data);
        } catch (error) {
            setError("Nepavyko gauti jūsų įrašų");
            console.error('Error fetching user posts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchLikedPosts = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const response = await ForumAPI.getPosts();
            
            const likedPosts = response.data.filter(post => post.user_interaction === 'like');
            
            setLikedPosts(likedPosts);
        } catch (error) {
            setError("Nepavyko gauti patikusių įrašų");
            console.error('Error fetching liked posts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchCommentedPosts = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const commentsResponse = await API.get('/comments', { 
                params: { user_id: user.id } 
            });
            
            const commentedPostIds = [...new Set(
                commentsResponse.data.map(comment => comment.post_id)
            )];
            
            const commentedPostsDetails = [];
            for (const postId of commentedPostIds) {
                try {
                    const postResponse = await ForumAPI.getPost(postId);
                    commentedPostsDetails.push(postResponse.data);
                } catch (error) {
                    console.error(`Error fetching details for post ${postId}:`, error);
                }
            }
            
            setCommentedPosts(commentedPostsDetails);
        } catch (error) {
            setError("Nepavyko gauti komentuotų įrašų");
            console.error('Error fetching commented posts:', error);
        } finally {
            setIsLoading(false);
        }
    };
    
    const fetchSavedPosts = async () => {
        try {
            setIsLoading(true);
            setError(null);
            // In a real app, this would be an actual API call
            setSavedPosts([]);
            setError("Išsaugotų įrašų funkcija dar neįgyvendinta");
        } catch (error) {
            setError("Nepavyko gauti išsaugotų įrašų");
            console.error('Error fetching saved posts:', error);
        } finally {
            setIsLoading(false);
        }
    };
    
    const fetchReviews = async () => {
        try {
            setIsLoading(true);
            setError(null);
            // In a real app, this would be an actual API call
            setReviews([]);
            setError("Atsiliepimų funkcija dar neįgyvendinta");
        } catch (error) {
            setError("Nepavyko gauti atsiliepimų");
            console.error('Error fetching reviews:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        const date = new Date(dateString);
        return date.toLocaleDateString('lt-LT', { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric' 
        });
    };

    // Helper function to get university name from ID
    const getUniversityName = (universityId) => {
        const universities = {
            1: "KTU - Kauno Technologijos Universitetas",
            2: "VDU - Vytauto Didžiojo Universitetas",
            3: "VGTU - Vilniaus Gedimino Technikos Universitetas"
        };
        return universities[universityId] || `Universitetas #${universityId}`;
    };
    
    // Helper function to get faculty name from ID
    const getFacultyName = (facultyId) => {
        const faculties = {
            1: "Informatikos fakultetas",
            2: "Ekonomikos fakultetas",
            3: "Mechanikos fakultetas"
        };
        return faculties[facultyId] || `Fakultetas #${facultyId}`;
    };
    
    // Loading skeleton for posts list
    const PostSkeleton = () => (
        <div className="animate-pulse">
            <div className="bg-grey/40 rounded-lg p-4 mb-4">
                <div className="h-6 bg-grey/60 rounded w-3/4 mb-3"></div>
                <div className="h-4 bg-grey/60 rounded w-full mb-2"></div>
                <div className="h-4 bg-grey/60 rounded w-full mb-2"></div>
                <div className="h-4 bg-grey/60 rounded w-2/3 mb-4"></div>
                <div className="flex justify-between items-center">
                    <div className="h-4 bg-grey/60 rounded w-1/4"></div>
                    <div className="flex gap-3">
                        <div className="h-4 bg-grey/60 rounded w-12"></div>
                        <div className="h-4 bg-grey/60 rounded w-12"></div>
                    </div>
                </div>
            </div>
        </div>
    );

    const renderPostList = (postList) => {
        if (isLoading) {
            return (
                <div>
                    <PostSkeleton />
                    <PostSkeleton />
                    <PostSkeleton />
                </div>
            );
        }
        
        if (error) {
            return (
                <div className="text-center py-8 text-red-500 bg-grey/20 rounded-lg border border-red-500/30 p-4">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-2 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                    </svg>
                    <p>{error}</p>
                </div>
            );
        }
        
        if (!postList || postList.length === 0) {
            return (
                <div className="text-center py-12 bg-grey/20 rounded-lg">
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-light-grey" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                    </svg>
                    <p className="text-light-grey text-lg">Nerasta įrašų</p>
                </div>
            );
        }
        
        return (
            <div className="grid grid-cols-1 gap-4">
                {postList.map((post) => (
                    <div 
                        key={post.id} 
                        className="bg-grey rounded-lg overflow-hidden transition-all hover:bg-grey/80 cursor-pointer border border-light-grey/10 hover:border-lght-blue/30 hover:shadow-md hover:shadow-lght-blue/10"
                    >
                        <div className="p-5 border-b border-light-grey/10">
                            <h3 className="text-white text-xl font-semibold mb-2 line-clamp-1">{post.title}</h3>
                            <p className="text-light-grey mb-3 line-clamp-2">
                                {post.description || "No description provided"}
                            </p>
                            <div className="flex justify-between items-center">
                                <div className="flex items-center gap-2">
                                    <span className="bg-dark/60 text-white text-xs px-2 py-1 rounded">
                                        {formatDate(post.created_at)}
                                    </span>
                                </div>
                                <div className="flex items-center gap-3">
                                    <span className="flex items-center gap-1 text-light-grey">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                                        </svg>
                                        {post.likes || 0}
                                    </span>
                                    <span className="flex items-center gap-1 text-light-grey">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                                        </svg>
                                        {post.comments_count || 0}
                                    </span>
                                </div>
                            </div>
                        </div>
                        <Link to={`/post/${post.id}`} className="block">
                            <div className="bg-dark/40 py-2 px-4 text-sm text-lght-blue flex items-center justify-center hover:bg-lght-blue/20 transition-colors">
                                <span>Peržiūrėti įrašą</span>
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 ml-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 5l7 7m0 0l-7 7m7-7H3" />
                                </svg>
                            </div>
                        </Link>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="max-w-7xl mx-auto px-4 py-8 mt-4">
            {/* Profile Header */}
            <div className="relative bg-gradient-to-br from-dark to-grey rounded-xl shadow-md overflow-hidden mb-8 border border-light-grey/10">
                {/* Background pattern */}
                <div className="absolute inset-0 overflow-hidden opacity-10">
                    {Array(10).fill(0).map((_, i) => (
                        <div key={i} className="absolute text-lght-blue text-9xl font-bold opacity-5" style={{ 
                            left: `${Math.random() * 100}%`, 
                            top: `${Math.random() * 100}%`,
                            transform: `rotate(${Math.random() * 360}deg)`
                        }}>
                            {['Q', 'A', '+', '?', '#'].at(Math.floor(Math.random() * 5))}
                        </div>
                    ))}
                </div>
                
                {/* Profile content */}
                <div className="relative z-10 p-8 flex flex-col md:flex-row items-center md:items-start gap-8">
                    <div className="flex flex-col items-center">
                        {/* Profile avatar with border */}
                        <div className="w-36 h-36 rounded-full overflow-hidden bg-dark border-4 border-lght-blue shadow-lg shadow-lght-blue/20">
                            <img 
                                src={user?.avatar || defaultAvatar} 
                                alt={user?.username || "User"} 
                                className="w-full h-full object-cover"
                                onError={(e) => {e.target.src = defaultAvatar}}
                            />
                        </div>
                        
                        {/* User reputation badge */}
                        <div className="mt-4 bg-lght-blue/20 px-4 py-2 rounded-full text-white text-sm font-medium flex items-center border border-lght-blue/30">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1 text-lght-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            <span>Reputacija: {user?.reputation || 0}</span>
                        </div>
                    </div>
                    
                    <div className="flex-1 text-center md:text-left">
                        <h1 className="text-white text-3xl md:text-4xl font-bold mb-2">{user?.username || "Naudotojas"}</h1>
                        
                        <div className="mb-4 flex items-center justify-center md:justify-start text-light-grey">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                            <span>Narys nuo: {formatDate(user?.created_at)}</span>
                        </div>
                        
                        <p className="text-light-grey max-w-2xl mb-6">{user?.bio || "Biografija nepateikta"}</p>
                        
                        {/* Stats cards */}
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
                            <div className="bg-dark/50 rounded-lg p-3 border border-light-grey/10 text-center">
                                <div className="text-2xl font-bold text-white">{stats.postsCount}</div>
                                <div className="text-light-grey text-sm">Įrašai</div>
                            </div>
                            <div className="bg-dark/50 rounded-lg p-3 border border-light-grey/10 text-center">
                                <div className="text-2xl font-bold text-white">{stats.commentsCount}</div>
                                <div className="text-light-grey text-sm">Komentarai</div>
                            </div>
                            <div className="bg-dark/50 rounded-lg p-3 border border-light-grey/10 text-center">
                                <div className="text-2xl font-bold text-white">{stats.likesCount}</div>
                                <div className="text-light-grey text-sm">Patiktukai</div>
                            </div>
                            <div className="bg-dark/50 rounded-lg p-3 border border-light-grey/10 text-center">
                                <div className="text-2xl font-bold text-white">{user?.reputation || 0}</div>
                                <div className="text-light-grey text-sm">Reputacija</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="bg-dark/40 border border-light-grey/10 rounded-xl overflow-hidden mb-8 shadow-sm">
                <div className="flex flex-wrap">
                    {[
                        { id: "info", label: "Informacija", icon: "info-circle" },
                        { id: "posts", label: "Mano įrašai", icon: "file-alt" },
                        { id: "liked", label: "Patikę įrašai", icon: "thumbs-up" },
                        { id: "commented", label: "Komentuoti įrašai", icon: "comment" },
                        { id: "saved", label: "Išsaugoti įrašai", icon: "bookmark" },
                        { id: "reviews", label: "Atsiliepimai", icon: "star" }
                    ].map(tab => (
                        <button
                            key={tab.id}
                            className={`px-4 py-4 text-white font-medium transition-colors flex-1 flex flex-col sm:flex-row items-center justify-center gap-2 ${
                                activeTab === tab.id 
                                    ? "bg-lght-blue/20 border-t-2 border-lght-blue" 
                                    : "hover:bg-dark/60 border-t-2 border-transparent"
                            }`}
                            onClick={() => setActiveTab(tab.id)}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                {tab.id === "info" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />}
                                {tab.id === "posts" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-5a2 2 0 00-2 2v12a2 2 0 002 2h5z" />}
                                {tab.id === "liked" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />}
                                {tab.id === "commented" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />}
                                {tab.id === "saved" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />}
                                {tab.id === "reviews" && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />}
                            </svg>
                            <span>{tab.label}</span>
                        </button>
                    ))}
                </div>
            </div>

            {/* Tab Content */}
            <div className="bg-dark/40 rounded-xl p-6 border border-light-grey/10 shadow-lg min-h-[400px]">
                {/* User Information Tab */}
                {activeTab === "info" && (
                    <div>
                        <h2 className="text-white text-2xl font-bold mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-lght-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                            Naudotojo informacija
                        </h2>
                        
                        {user ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {userFields.map(field => {
                                    let displayValue = user[field.key];
                                    
                                    // Format specific fields
                                    if (field.key === 'created_at') {
                                        displayValue = formatDate(user[field.key]);
                                    } else if (field.key === 'university_id' && user[field.key]) {
                                        displayValue = getUniversityName(user[field.key]);
                                    } else if (field.key === 'faculty_id' && user[field.key]) {
                                        displayValue = getFacultyName(user[field.key]);
                                    }
                                    
                                    return displayValue && (
                                        <div key={field.key} className="bg-grey/20 rounded-lg p-4 flex items-start gap-3 border border-light-grey/10 hover:border-lght-blue/20 transition-colors">
                                            <div className="bg-lght-blue/20 p-2 rounded-md">
                                                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-lght-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                    {field.key === 'username' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />}
                                                    {field.key === 'email' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />}
                                                    {field.key === 'bio' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />}
                                                    {field.key === 'university_id' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8" />}
                                                    {field.key === 'yearOfGraduation' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />}
                                                    {field.key === 'faculty_id' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" />}
                                                    {field.key === 'reputation' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />}
                                                    {field.key === 'created_at' && <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />}
                                                </svg>
                                            </div>
                                            <div className="flex-1">
                                                <h3 className="text-light-grey text-sm">{field.label}</h3>
                                                <p className="text-white">{displayValue || "N/A"}</p>
                                            </div>
                                        </div>
                                    )
                                })}
                            </div>
                        ) : (
                            <div className="text-center py-12 bg-grey/20 rounded-lg">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mx-auto mb-4 text-light-grey" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                </svg>
                                <p className="text-light-grey">Papildomos informacijos nėra</p>
                            </div>
                        )}
                    </div>
                )}

                {/* My Posts Tab */}
                {activeTab === "posts" && (
                    <div>
                        <h2 className="text-white text-2xl font-bold mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-lght-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 20H5a2 2 0 01-2-2V6a2 2 0 012-2h10a2 2 0 012 2v1M19 20a2 2 0 002-2V8a2 2 0 00-2-2h-5a2 2 0 00-2 2v12a2 2 0 002 2h5z" />
                            </svg>
                            Mano įrašai
                        </h2>
                        {renderPostList(posts)}
                    </div>
                )}

                {/* Liked Posts Tab */}
                {activeTab === "liked" && (
                    <div>
                        <h2 className="text-white text-2xl font-bold mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-lght-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10h4.764a2 2 0 011.789 2.894l-3.5 7A2 2 0 0115.263 21h-4.017c-.163 0-.326-.02-.485-.06L7 20m7-10V5a2 2 0 00-2-2h-.095c-.5 0-.905.405-.905.905 0 .714-.211 1.412-.608 2.006L7 11v9m7-10h-2M7 20H5a2 2 0 01-2-2v-6a2 2 0 012-2h2.5" />
                            </svg>
                            Patikę įrašai
                        </h2>
                        {renderPostList(likedPosts)}
                    </div>
                )}

                {/* Commented Posts Tab */}
                {activeTab === "commented" && (
                    <div>
                        <h2 className="text-white text-2xl font-bold mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-lght-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
                            </svg>
                            Komentuoti įrašai
                        </h2>
                        {renderPostList(commentedPosts)}
                    </div>
                )}

                {/* Saved Posts Tab */}
                {activeTab === "saved" && (
                    <div>
                        <h2 className="text-white text-2xl font-bold mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-lght-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 5a2 2 0 012-2h10a2 2 0 012 2v16l-7-3.5L5 21V5z" />
                            </svg>
                            Išsaugoti įrašai
                        </h2>
                        {renderPostList(savedPosts)}
                    </div>
                )}

                {/* Reviews Tab */}
                {activeTab === "reviews" && (
                    <div>
                        <h2 className="text-white text-2xl font-bold mb-6 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-lght-blue" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                            </svg>
                            Atsiliepimai
                        </h2>
                        {renderPostList(reviews)}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;