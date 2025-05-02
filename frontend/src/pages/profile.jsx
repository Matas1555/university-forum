import { useState, useEffect } from "react";
import { useStateContext } from "../context/contextProvider";
import API, { ForumAPI } from "../utils/API";
import defaultAvatar from "../assets/profile-default-icon.png";

const Profile = () => {
    const { user } = useStateContext();
    const [activeTab, setActiveTab] = useState("info");
    const [posts, setPosts] = useState([]);
    const [likedPosts, setLikedPosts] = useState([]);
    const [commentedPosts, setCommentedPosts] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);
    
    const userFields = [
        { key: 'username', label: 'Username' },
        { key: 'email', label: 'Email' },
        { key: 'bio', label: 'Biography' },
        { key: 'university_id', label: 'University ID' },
        { key: 'yearOfGraduation', label: 'Graduation Year' },
        { key: 'faculty_id', label: 'Faculty ID' },
        { key: 'reputation', label: 'Reputation' },
        { key: 'created_at', label: 'Member Since' }
    ];

    useEffect(() => {
        if (user && activeTab === "posts") {
            fetchUserPosts();
        }
        if (user && activeTab === "liked") {
            fetchLikedPosts();
        }
        if (user && activeTab === "commented") {
            fetchCommentedPosts();
        }
        if (user && activeTab === "saved") {
            fetchSavedPosts();
        }
        if (user && activeTab === "reviews") {
            fetchReviews();
        }
    }, [user, activeTab]);

    const fetchUserPosts = async () => {
        try {
            setIsLoading(true);
            setError(null);
            const response = await API.get('/posts', { params: { user_id: user.id } });
            setPosts(response.data);
        } catch (error) {
            setError("Failed to fetch your posts");
            console.error('Error fetching user posts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchLikedPosts = async () => {
        try {
            setIsLoading(true);
            setError(null);
            
            const interactionsResponse = await API.get('/user/post-interactions');
            
            const likedPostIds = interactionsResponse.data
                .filter(interaction => interaction.type === 'like')
                .map(interaction => interaction.post_id);
            
            const likedPostsDetails = [];
            for (const postId of likedPostIds) {
                try {
                    const postResponse = await ForumAPI.getPost(postId);
                    likedPostsDetails.push(postResponse.data);
                } catch (error) {
                    console.error(`Error fetching details for post ${postId}:`, error);
                }
            }
            
            setLikedPosts(likedPostsDetails);
        } catch (error) {
            setError("Failed to fetch liked posts");
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
            setError("Failed to fetch commented posts");
            console.error('Error fetching commented posts:', error);
        } finally {
            setIsLoading(false);
        }
    };

    const formatDate = (dateString) => {
        if (!dateString) return "N/A";
        return new Date(dateString).toLocaleDateString();
    };

    const renderPostList = (postList) => {
        if (isLoading) {
            return <div className="text-center py-8">Loading...</div>;
        }
        
        if (error) {
            return <div className="text-center py-8 text-red">{error}</div>;
        }
        
        if (!postList || postList.length === 0) {
            return <div className="text-center py-8 text-light-grey">No posts found</div>;
        }
        
        return (
            <div className="grid grid-cols-1 gap-4">
                {postList.map((post) => (
                    <div 
                        key={post.id} 
                        className="bg-grey rounded-lg p-4 transition-all hover:bg-grey/80 cursor-pointer"
                        onClick={() => window.location.href = `/post/${post.id}`}
                    >
                        <h3 className="text-white text-xl font-semibold mb-2">{post.title}</h3>
                        <p className="text-light-grey mb-3">
                            {post.description && post.description.length > 150 
                                ? `${post.description.substring(0, 150)}...` 
                                : post.description}
                        </p>
                        <div className="flex justify-between items-center">
                            <span className="text-light-grey text-sm">
                                {formatDate(post.created_at)}
                            </span>
                            <div className="flex items-center gap-4">
                                <span className="flex items-center gap-1 text-light-grey">
                                    <i className="fas fa-thumbs-up"></i> {post.likes || 0}
                                </span>
                                <span className="flex items-center gap-1 text-light-grey">
                                    <i className="fas fa-comment"></i> {post.comments_count || 0}
                                </span>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        );
    };

    return (
        <div className="max-w-6xl mx-auto px-4 py-8">
            {/* Profile Header */}
            <div className="bg-grey rounded-lg p-6 mb-8">
                <div className="flex flex-col md:flex-row items-center gap-6">
                    <div className="w-32 h-32 rounded-full overflow-hidden bg-dark flex items-center justify-center">
                        <img 
                            src={user?.avatar || defaultAvatar} 
                            alt={user?.username || "User"} 
                            className="w-full h-full object-cover"
                            onError={(e) => {e.target.src = defaultAvatar}}
                        />
                    </div>
                    <div className="text-center md:text-left">
                        <h1 className="text-white text-3xl font-bold">{user?.username || "User"}</h1>
                        <p className="text-light-grey mt-2">{user?.bio || "No biography provided"}</p>
                        <div className="flex flex-wrap gap-2 mt-4">
                            <span className="bg-dark px-3 py-1 rounded-full text-white text-sm">
                                Reputacija: {user?.reputation || 0}
                            </span>
                            <span className="bg-dark px-3 py-1 rounded-full text-white text-sm">
                                Narys nuo: {formatDate(user?.created_at)}
                            </span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Tabs Navigation */}
            <div className="mb-6 border-b border-grey">
                <div className="flex flex-wrap gap-4">
                    <button
                        className={`px-4 py-2 text-white font-medium border-b-2 transition-colors ${
                            activeTab === "info" ? "border-lght-blue" : "border-transparent"
                        }`}
                        onClick={() => setActiveTab("info")}
                    >
                        Informacija
                    </button>
                    <button
                        className={`px-4 py-2 text-white font-medium border-b-2 transition-colors ${
                            activeTab === "posts" ? "border-lght-blue" : "border-transparent"
                        }`}
                        onClick={() => setActiveTab("posts")}
                    >
                        Mano įrašai
                    </button>
                    <button
                        className={`px-4 py-2 text-white font-medium border-b-2 transition-colors ${
                            activeTab === "liked" ? "border-lght-blue" : "border-transparent"
                        }`}
                        onClick={() => setActiveTab("liked")}
                    >
                        Patikę įrašai
                    </button>
                    <button
                        className={`px-4 py-2 text-white font-medium border-b-2 transition-colors ${
                            activeTab === "saved" ? "border-lght-blue" : "border-transparent"
                        }`}
                        onClick={() => setActiveTab("saved")}
                    >
                        Išsaugoti įrašai
                    </button>
                    <button
                        className={`px-4 py-2 text-white font-medium border-b-2 transition-colors ${
                            activeTab === "commented" ? "border-lght-blue" : "border-transparent"
                        }`}
                        onClick={() => setActiveTab("commented")}
                    >
                        Komentuoti įrašai
                    </button>
                    <button
                        className={`px-4 py-2 text-white font-medium border-b-2 transition-colors ${
                            activeTab === "reviews" ? "border-lght-blue" : "border-transparent"
                        }`}
                        onClick={() => setActiveTab("reviews")}
                    >
                        Atsiliepimai
                    </button>
                </div>
            </div>

            {/* Tab Content */}
            <div className="bg-dark rounded-lg p-6">
                {/* User Information Tab */}
                {activeTab === "info" && (
                    <div>
                        <h2 className="text-white text-2xl font-bold mb-6">Naudotojo informacija</h2>
                        {user ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                {userFields.map(field => (
                                    user[field.key] && (
                                        <div key={field.key} className="bg-grey rounded-lg p-4">
                                            <h3 className="text-light-grey text-sm mb-1">{field.label}</h3>
                                            <p className="text-white">
                                                {field.key === 'created_at' 
                                                    ? formatDate(user[field.key])
                                                    : user[field.key] || "N/A"}
                                            </p>
                                        </div>
                                    )
                                ))}
                            </div>
                        ) : (
                            <p className="text-light-grey">Papildomos informacijos nėra</p>
                        )}
                    </div>
                )}

                {/* My Posts Tab */}
                {activeTab === "posts" && (
                    <div>
                        <h2 className="text-white text-2xl font-bold mb-6">Mano įrašai</h2>
                        {renderPostList(posts)}
                    </div>
                )}

                {/* Liked Posts Tab */}
                {activeTab === "liked" && (
                    <div>
                        <h2 className="text-white text-2xl font-bold mb-6">Patikę įrašai</h2>
                        {renderPostList(likedPosts)}
                    </div>
                )}

                {/* Commented Posts Tab */}
                {activeTab === "commented" && (
                    <div>
                        <h2 className="text-white text-2xl font-bold mb-6">Komentuoti įrašai</h2>
                        {renderPostList(commentedPosts)}
                    </div>
                )}

                {/* Saved Posts Tab */}
                {activeTab === "saved" && (
                    <div>
                        <h2 className="text-white text-2xl font-bold mb-6">Išsaugoti įrašai</h2>
                    </div>
                )}

                {/* Reviews Tab */}
                {activeTab === "reviews" && (
                    <div>
                        <h2 className="text-white text-2xl font-bold mb-6">Atsiliepimai</h2>
                    </div>
                )}
            </div>
        </div>
    );
};

export default Profile;