import {React, useState, useEffect} from "react";
import { useStateContext } from "../context/contextProvider";
import { useLocation, useParams } from "react-router-dom";
import API, { ForumAPI } from "../utils/API";
import { sanitizeHtml, isHtmlEmpty, cleanRichTextContent } from "../utils/helpers";
import profilePicture from "../assets/profile-default-icon.png";
import Comment from "../components/lists/commentList";
import RichTextEditor from "../components/richTextEditor/RichTextEditor";
import Breadcrumb from "../components/navigation/breadcrumb";

const categoryColors = {
    'Bendros diskusijos': { text: 'text-lght-blue', ring: 'ring-lght-blue' },
    'Kursų apžvalgos': { text: 'text-red', ring: 'ring-red' },
    'Socialinis gyvenimas ir renginiai': { text: 'text-orange', ring: 'ring-orange' },
};

const Post = () => {
    const {user, token} = useStateContext();
    const location = useLocation();
    const params = useParams();
    const [postData, setPostData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [isExpanded, setIsExpanded] = useState(false);
    const [comment, setComment] = useState("");
    const [userInteractions, setUserInteractions] = useState({});
    const [errorMessage, setErrorMessage] = useState('');
    const [commentSubmitting, setCommentSubmitting] = useState(false);
    const [comments, setComments] = useState([]);
    const [commentsLoading, setCommentsLoading] = useState(true);
    const [forumInfo, setForumInfo] = useState({
        forumName: null,
        facultyName: null,
        programName: null,
        categoryName: null
    });

    useEffect(() => {
        fetchPost();
        if (params.postId) {
            fetchComments();
        }
        if (user && token) {
            fetchUserInteractions();
        }
    }, [params.postId, user, token]);

    const fetchPost = async () => {
        if (params.postId) {
            try {
                setLoading(true);
                const response = await ForumAPI.getPost(params.postId);
                setPostData(response.data);
                
                if (response.data.forum_id) {
                    try {
                        const forumResponse = await ForumAPI.getAllForums();
                        const forum = forumResponse.data.find(f => f.id === response.data.forum_id);
                        if (forum) {
                            setForumInfo(prev => ({
                                ...prev,
                                forumName: forum.title,
                                facultyName: forum.faculty_name,
                                programName: forum.program_name
                            }));
                        }
                    } catch (forumError) {
                        console.error('Error fetching forum info:', forumError);
                    }
                }
                
                setLoading(false);
            } catch (error) {
                console.error('Error fetching post:', error);
                setError('Failed to load post.');
                setLoading(false);
            }
        }
    };

    const fetchComments = async () => {
        try {
            setCommentsLoading(true);
            const response = await ForumAPI.getPostComments(params.postId);
            setComments(response.data);
            setCommentsLoading(false);
        } catch (error) {
            console.error('Error fetching comments:', error);
            setCommentsLoading(false);
        }
    };
    
    const fetchUserInteractions = async () => {
        try {
            const response = await API.get('/user/post-interactions');
            
            const interactionsMap = {};
            response.data.forEach(interaction => {
                interactionsMap[interaction.post_id] = interaction.type;
            });
            
            setUserInteractions(interactionsMap);
        } catch (error) {
            console.error('Failed to fetch user interactions', error);
        }
    };

    const handleLike = async (e) => {
        e.preventDefault();
        
        if (!user) {
            setErrorMessage('Prisijunkite, kad galėtumėte įvertinti įrašą');
            return;
        }
        
        const currentInteraction = userInteractions[postData.id];
        
        const updatedPost = { ...postData };
        
        if (currentInteraction === 'like') {
            updatedPost.likes = Math.max(0, updatedPost.likes - 1);
            
            setUserInteractions(prev => {
                const newInteractions = { ...prev };
                delete newInteractions[postData.id];
                return newInteractions;
            });
        } else if (currentInteraction === 'dislike') {
            updatedPost.likes = updatedPost.likes + 1;
            updatedPost.dislikes = Math.max(0, updatedPost.dislikes - 1);
            
            setUserInteractions(prev => ({
                ...prev,
                [postData.id]: 'like'
            }));
        } else {
            updatedPost.likes = updatedPost.likes + 1;
            
            setUserInteractions(prev => ({
                ...prev,
                [postData.id]: 'like'
            }));
        }
        
        setPostData(updatedPost);
        
        try {
            const response = await API.post(`/posts/${postData.id}/like`);
            
            if (response.data.likes !== updatedPost.likes || 
                (response.data.dislikes !== undefined && response.data.dislikes !== updatedPost.dislikes)) {
                
                const syncedPost = { ...postData };
                
                syncedPost.likes = response.data.likes;
                if (response.data.dislikes !== undefined) {
                    syncedPost.dislikes = response.data.dislikes;
                }
                
                setPostData(syncedPost);
            }
        } catch (error) {
            console.error('Failed to like post', error);
            
            // Reset to original data
            fetchPost();
            
            if (error.response?.status === 401) {
                setErrorMessage('Prisijunkite, kad galėtumėte įvertinti įrašą');
            } else {
                setErrorMessage('Nepavyko įvertinti įrašo. Bandykite dar kartą.');
            }
            
            fetchUserInteractions();
        }
    };
    
    const handleDislike = async (e) => {
        e.preventDefault();
        
        if (!user) {
            setErrorMessage('Prisijunkite, kad galėtumėte įvertinti įrašą');
            return;
        }
        
        const currentInteraction = userInteractions[postData.id];
        
        const updatedPost = { ...postData };
        
        if (currentInteraction === 'dislike') {
            updatedPost.dislikes = Math.max(0, updatedPost.dislikes - 1);
            
            setUserInteractions(prev => {
                const newInteractions = { ...prev };
                delete newInteractions[postData.id];
                return newInteractions;
            });
        } else if (currentInteraction === 'like') {
            updatedPost.dislikes = updatedPost.dislikes + 1;
            updatedPost.likes = Math.max(0, updatedPost.likes - 1);
            
            setUserInteractions(prev => ({
                ...prev,
                [postData.id]: 'dislike'
            }));
        } else {
            updatedPost.dislikes = updatedPost.dislikes + 1;
            
            setUserInteractions(prev => ({
                ...prev,
                [postData.id]: 'dislike'
            }));
        }
        
        setPostData(updatedPost);
        
        try {
            const response = await API.post(`/posts/${postData.id}/dislike`);
            
            if ((response.data.dislikes !== undefined && response.data.dislikes !== updatedPost.dislikes) || 
                (response.data.likes !== undefined && response.data.likes !== updatedPost.likes)) {
                
                const syncedPost = { ...postData };
                
                if (response.data.dislikes !== undefined) {
                    syncedPost.dislikes = response.data.dislikes;
                }
                if (response.data.likes !== undefined) {
                    syncedPost.likes = response.data.likes;
                }
                
                setPostData(syncedPost);
            }
        } catch (error) {
            console.error('Failed to dislike post', error);
            
            // Reset to original data
            fetchPost();
            
            if (error.response?.status === 401) {
                setErrorMessage('Prisijunkite, kad galėtumėte įvertinti įrašą');
            } else {
                setErrorMessage('Nepavyko įvertinti įrašo. Bandykite dar kartą.');
            }
            
            fetchUserInteractions();
        }
    };

    const handleShare = (e) => {
        e.preventDefault();
        const url = window.location.origin + `/forumai/irasai/${postData.id}`;
        navigator.clipboard.writeText(url)
          .then(() => {
            alert('Nuoroda nukopijuota!');
          })
          .catch(() => {
            const input = document.createElement('input');
            input.value = url;
            document.body.appendChild(input);
            input.select();
            document.execCommand('copy');
            document.body.removeChild(input);
            alert('Nuoroda nukopijuota!');
          });
    };

    const truncateText = (text, maxLength = 35) => {
        if (!text) return '';
        if (text.length <= maxLength) return text;
        return text.slice(0, maxLength) + '...';
    };

    const generateBreadcrumbItems = () => {
        const items = [
            { label: 'Pagrindinis', path: '/pagrindinis' },
            { label: 'Forumai', path: '/forumai' }
        ];
        
        // Add paths based on URL parameters
        if (params.universityId) {
            items.push(
                { label: 'Universitetai', path: '/forumai/universitetai' },
                { 
                    label: truncateText(forumInfo.forumName || 'Universitetas'), 
                    path: `/forumai/universitetai/${params.universityId}/irasai`,
                    universityId: params.universityId
                }
            );
        }
        
        if (params.facultyId && forumInfo.facultyName) {
            items.push(
                { 
                    label: 'Fakultetai', 
                    path: `/forumai/universitetai/${params.universityId}/fakultetai` 
                },
                { 
                    label: truncateText(forumInfo.facultyName || 'Fakultetas'),
                    path: `/forumai/universitetai/${params.universityId}/fakultetai/${params.facultyId}/irasai`,
                    universityId: params.universityId,
                    facultyId: params.facultyId
                }
            );
        }
        
        if (params.programId && forumInfo.programName) {
            items.push(
                { 
                    label: 'Programos', 
                    path: `/forumai/universitetai/${params.universityId}/fakultetai/${params.facultyId}/programos`
                },
                { 
                    label: truncateText(forumInfo.programName || 'Programa'),
                    path: `/forumai/universitetai/${params.universityId}/fakultetai/${params.facultyId}/programos/${params.programId}/irasai`,
                    universityId: params.universityId,
                    facultyId: params.facultyId,
                    programId: params.programId
                }
            );
        }
        
        if (params.categoryId && forumInfo.categoryName) {
            items.push(
                { label: 'Kategorijos', path: '/forumai/kategorijos' },
                { 
                    label: truncateText(forumInfo.categoryName || 'Kategorija'), 
                    path: `/forumai/kategorijos/${params.categoryId}`,
                    categoryId: params.categoryId
                }
            );
        }
        
        if (postData) {
            items.push({ 
                label: truncateText(postData.title), 
                path: location.pathname,
                postId: params.postId
            });
        }
        
        return items;
    };
    
    const handleComment = async (e) => {
        e.preventDefault();
        
        if (isHtmlEmpty(comment)) {
            setErrorMessage('Komentaras negali būti tuščias');
            return;
        }
        
        if (!user) {
            setErrorMessage('Prisijunkite, kad galėtumėte komentuoti įrašą');
            return;
        }
        
        setCommentSubmitting(true);
        
        try {
            const sanitizedHtml = sanitizeHtml(cleanRichTextContent(comment));
            
            const commentData = {
                text: sanitizedHtml,
                post_id: postData.id
            };
            
            const response = await ForumAPI.createComment(commentData);
            
            setComment('');
            setIsExpanded(false);
            
            // Immediately update comment count in the UI
            setPostData(prevPostData => ({
                ...prevPostData,
                comments_count: (prevPostData.comments_count || 0) + 1
            }));
            
            // Fetch the updated comments
            await fetchComments();
            
            // Refresh post data to ensure all data is in sync with server
            await fetchPost();
            
        } catch (error) {
            console.error('Failed to submit comment', error);
            
            if (error.response?.status === 401) {
                setErrorMessage('Prisijunkite, kad galėtumėte komentuoti įrašą');
            } else if (error.response?.data?.errors) {
                setErrorMessage(Object.values(error.response.data.errors).flat().join(', '));
            } else {
                setErrorMessage('Nepavyko išsaugoti komentaro. Bandykite dar kartą.');
            }
        } finally {
            setCommentSubmitting(false);
        }
    };

    if (loading) {
        return (
            <div className="text-white text-center py-8 flex justify-center items-center">
                <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <span>Kraunamas įrašas...</span>
            </div>
        );
    }

    if (error) {
        return <p className="text-red-500 text-center mt-10">{error}</p>;
    }

    if (!postData) {
        return <p className="text-white text-center mt-10">Įrašas nerastas.</p>;
    }
    
    return (
        <div className="mb-10 w-4/5 m-auto">
            {/* Breadcrumb */}
            <div className="mb-4">
                <Breadcrumb items={generateBreadcrumbItems()} />
            </div>

            {errorMessage && (
                <div className="bg-red/10 border border-red text-red p-3 rounded-md mb-4">
                    {errorMessage}
                    <button 
                        onClick={() => setErrorMessage('')} 
                        className="ml-2 font-bold"
                    >
                        ×
                    </button>
                </div>
            )}

            <div className="flex flex-row gap-2 mb-2 justify-center cursor-pointer text-xxxs sm:text-sm sm:justify-end">
                {postData.categories && Array.isArray(postData.categories) && postData.categories.length > 0 ? (
                    postData.categories.map((category, catIndex) => {
                        const categoryName = typeof category === 'object' ? category.name : category;
                        const color = category.color;
                        return (
                            <div
                                key={catIndex}
                                className={`ring-1 ring-${color} rounded-md p-1 px-2 font-medium text-${color} mt-2`}
                            >
                                {categoryName}
                            </div>
                        );
                    })
                ) : (
                    null
                )}
            </div>

            <div className="w-full bg-grey text-white rounded-md p-4 h-1/2 m-auto">
                <div className="flex flex-col gap-10">
                    <div className="flex flex-col gap-4">
                        <div className="flex flex-row items-center justify-between gap-4">
                            <div className="flex flex-row gap-2 items-center">
                                <img 
                                    src={postData.user_avatar ? `http://127.0.0.1:5000/storage/${postData.user_avatar}` : profilePicture} 
                                    className="size-8 md:size-10 rounded-full object-cover border border-light-grey" 
                                    alt="Profile" 
                                />
                                <div className="flex flex-col items-start justify-start gap-1">
                                    <span className="text-white text-xs font-medium md:text-base">{postData.user || postData.username || 'Unknown'}</span>
                                    <span className="text-xxs font-medium text-light-grey md:text-xs">{postData.user_status?.name || 'Studentas'} • {postData.date || postData.created_at || ''}</span>
                                </div>
                            </div>
                            <button className='text-white hover:bg-lght-blue rounded-full -translate-y-2 p-1 transition-colors duration-150 ease-linear'>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                </svg>
                            </button>
                        </div>
                        <div className="font-medium text-lg md:text-3xl">
                            {postData.title}
                        </div>
                        <div className="text-sm mt-3 md:text-base font-light text-white">
                            {postData.content || postData.description}
                        </div>
                    </div>
                    
                    <div>
                        <div className="flex flex-row gap-4 mb-4">
                            <div 
                                className={`flex flex-row gap-2 p-2 rounded-md hover:bg-dark cursor-pointer
                                    ${userInteractions[postData.id] === 'like' 
                                        ? 'bg-dark text-lght-blue' 
                                        : 'hover:text-lght-blue text-white transition-colors duration-150 ease-linear'}`}
                                onClick={handleLike}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                    <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06l-6.22-6.22V21a.75.75 0 0 1-1.5 0V4.81l-6.22 6.22a.75.75 0 1 1-1.06-1.06l7.5-7.5Z" clipRule="evenodd" />
                                </svg>
                                <p className="flex gap-1">{postData.likes || postData.like_count || 0}</p>
                            </div>
                            <div 
                                className={`flex flex-row gap-2 p-2 mr-6 rounded-md hover:bg-dark cursor-pointer
                                    ${userInteractions[postData.id] === 'dislike' 
                                        ? 'bg-dark text-red' 
                                        : 'hover:text-red text-white transition-colors duration-150 ease-linear'}`}
                                onClick={handleDislike}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 rotate-180">
                                    <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06l-6.22-6.22V21a.75.75 0 0 1-1.5 0V4.81l-6.22 6.22a.75.75 0 1 1-1.06-1.06l7.5-7.5Z" clipRule="evenodd" />
                                </svg>
                                <p className="flex gap-1">{postData.dislikes || 0}</p>
                            </div>
                            <div 
                                className="flex flex-row gap-2 p-2 rounded-md text-white hover:bg-dark hover:text-lght-blue transition-colors duration-150 ease-linear cursor-pointer"
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                </svg>
                                <p className="flex gap-1">{postData.comment_count || postData.comments_count || (postData.comments && postData.comments.length) || 0}</p>
                            </div>
                            <div 
                                className="flex flex-row gap-2 p-2 rounded-md text-white hover:bg-dark hover:text-lght-blue transition-colors duration-150 ease-linear cursor-pointer"
                                onClick={handleShare}
                            >
                                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                                    <path fillRule="evenodd" d="M15.75 4.5a3 3 0 1 1 .825 2.066l-8.421 4.679a3.002 3.002 0 0 1 0 1.51l8.421 4.679a3 3 0 1 1-.729 1.31l-8.421-4.678a3 3 0 1 1 0-4.132l8.421-4.679a3 3 0 0 1-.096-.755Z" clipRule="evenodd" />
                                </svg>
                                <p className="flex gap-1">Dalintis</p>
                            </div>
                        </div>
                        {user && (
                            <div className="flex flex-row items-center gap-2 w-full">
                            {isExpanded ? (
                                <div className="relative w-full">
                                    <div className="ring-1 rounded-md ring-light-grey">
                                        <RichTextEditor 
                                            value={comment}
                                            onChange={(content) => setComment(content)}
                                            placeholder="Tekstas"
                                        />
                                    </div>

                                    <button
                                        className="absolute bottom-2 right-2 bg-lght-blue text-white px-3 py-1 rounded-md text-sm hover:bg-dark-blue transition" 
                                        onClick={handleComment}
                                        disabled={commentSubmitting}
                                    >
                                        {commentSubmitting ? 'Siunčiama...' : 'Komentuoti'}
                                    </button>
                                    <button
                                        className="absolute bottom-2 right-28 ring-1 ring-light-grey text-white px-3 py-1 rounded-md text-sm hover:bg-dark-blue transition"
                                        onClick={() => setIsExpanded(false)}
                                        disabled={commentSubmitting}
                                    >
                                        Atšaukti
                                    </button>
                                </div>
                            ) : (
                                <input
                                    className="bg-grey ring-1 ring-light-grey rounded-md p-3 w-full text-sm font:ring-lght-blue"
                                    placeholder="Palikite komentarą"
                                    value={comment}
                                    onChange={(e) => setComment(e.target.value)}
                                    onFocus={() => setIsExpanded(true)}
                                />
                                )}
                            </div>
                        )}
                    </div>
                </div>
            </div>
            <div className="mt-4">
                {commentsLoading ? (
                    <div className="text-light-grey text-center py-4 flex justify-center items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-light-grey" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Kraunami komentarai...</span>
                    </div>
                ) : comments && Array.isArray(comments) && comments.length > 0 ? (
                    comments.map((comment, index) => (
                        <Comment 
                            key={index} 
                            comment={comment} 
                            level={1} 
                            onCommentAdded={fetchComments} 
                            post_user_id={postData.user_id}
                            updatePostCommentCount={() => {
                                setPostData(prevPostData => ({
                                    ...prevPostData,
                                    comments_count: (prevPostData.comments_count || 0) + 1
                                }));
                            }}
                        />
                    ))
                ) : (
                    <p className="text-light-grey text-sm">Nėra komentarų.</p>
                )}
            </div>
        </div>
    );
};

export default Post;