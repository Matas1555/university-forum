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
    }, [params.postId, user, token]);

    const fetchPost = async () => {
        if (params.postId) {
            try {
                setLoading(true);
                const response = await ForumAPI.getPost(params.postId);
                setPostData(response.data);
                
                const viewedKey = `viewed_post_${params.postId}`;
                if (!sessionStorage.getItem(viewedKey)) {
                    try {
                        await ForumAPI.incrementPostViews(params.postId);
                        sessionStorage.setItem(viewedKey, 'true');
                        setPostData(prevData => ({
                            ...prevData,
                            views: (prevData.views || 0) + 1
                        }));
                    } catch (viewError) {
                        console.error('Error tracking view:', viewError);
                    }
                }
                
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
            
            const commentsMap = {};
            
            response.data.forEach(comment => {
                commentsMap[comment.id] = comment;
            });
            
            const flattenComments = (comments, result = []) => {
                comments.forEach(comment => {
                    const replyingToUser = comment.parent_id && commentsMap[comment.parent_id] 
                        ? commentsMap[comment.parent_id].user 
                        : null;
                        
                    result.push({
                        ...comment,
                        replyingToUser
                    });
                    
                    if (comment.replies && comment.replies.length > 0) {
                        flattenComments(comment.replies, result);
                    }
                });
                return result;
            };
            
            const flatComments = flattenComments(response.data);
            
            const sortedComments = flatComments.sort((a, b) => {

                if (a.date && b.date) {
                    return new Date(a.date) - new Date(b.date);
                }
                return 0;
            });
            
            setComments(sortedComments);
            setCommentsLoading(false);
        } catch (error) {
            console.error('Error fetching comments:', error);
            setCommentsLoading(false);
        }
    };

    const handleLike = async (e) => {
        e.preventDefault();
        
        if (!user) {
            setErrorMessage('Prisijunkite, kad galėtumėte įvertinti įrašą');
            return;
        }
        
        const currentInteraction = postData.user_interaction;
        
        const updatedPost = { ...postData };
        
        if (currentInteraction === 'like') {
            updatedPost.likes = Math.max(0, updatedPost.likes - 1);
            updatedPost.user_interaction = null;
        } else if (currentInteraction === 'dislike') {
            updatedPost.likes = updatedPost.likes + 1;
            updatedPost.dislikes = Math.max(0, updatedPost.dislikes - 1);
            updatedPost.user_interaction = 'like';
        } else {
            updatedPost.likes = updatedPost.likes + 1;
            updatedPost.user_interaction = 'like';
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
            
            fetchPost();
            
            if (error.response?.status === 401) {
                setErrorMessage('Prisijunkite, kad galėtumėte įvertinti įrašą');
            } else {
                setErrorMessage('Nepavyko įvertinti įrašo. Bandykite dar kartą.');
            }
        }
    };
    
    const handleDislike = async (e) => {
        e.preventDefault();
        
        if (!user) {
            setErrorMessage('Prisijunkite, kad galėtumėte įvertinti įrašą');
            return;
        }
        
        const currentInteraction = postData.user_interaction;
        
        const updatedPost = { ...postData };
        
        if (currentInteraction === 'dislike') {
            updatedPost.dislikes = Math.max(0, updatedPost.dislikes - 1);
            updatedPost.user_interaction = null;
        } else if (currentInteraction === 'like') {
            updatedPost.dislikes = updatedPost.dislikes + 1;
            updatedPost.likes = Math.max(0, updatedPost.likes - 1);
            updatedPost.user_interaction = 'dislike';
        } else {
            updatedPost.dislikes = updatedPost.dislikes + 1;
            updatedPost.user_interaction = 'dislike';
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
        }
    };

    const handleShare = (e) => {
        e.preventDefault();
        const url = window.location.href;
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
        
        if (postData.forum_info) {
            const forumInfo = postData.forum_info;
            
            if (forumInfo.entity_type === 'university') {
                items.push(
                    { label: 'Universitetai', path: '/forumai/universitetai' },
                    { 
                        label: truncateText(forumInfo.university_name || 'Universitetas'), 
                        path: forumInfo.navigation_path || `/forumai/universitetai/${forumInfo.entity_id}/irasai`,
                    }
                );
            } 
            else if (forumInfo.entity_type === 'faculty') {
                items.push(
                    { label: 'Universitetai', path: '/forumai/universitetai' },
                    { 
                        label: truncateText(forumInfo.university_name || 'Universitetas'), 
                        path: `/forumai/universitetai/${forumInfo.university_id}/irasai`,
                    },
                    { 
                        label: 'Fakultetai', 
                        path: `/forumai/universitetai/${forumInfo.university_id}/fakultetai` 
                    },
                    { 
                        label: truncateText(forumInfo.faculty_name || 'Fakultetas'),
                        path: forumInfo.navigation_path || `/forumai/universitetai/${forumInfo.university_id}/fakultetai/${forumInfo.entity_id}/irasai`,
                    }
                );
            } 
            else if (forumInfo.entity_type === 'program') {
                items.push(
                    { label: 'Universitetai', path: '/forumai/universitetai' },
                    { 
                        label: truncateText(forumInfo.university_name || 'Universitetas'), 
                        path: `/forumai/universitetai/${forumInfo.university_id}/irasai`,
                    },
                    { 
                        label: 'Fakultetai', 
                        path: `/forumai/universitetai/${forumInfo.university_id}/fakultetai` 
                    },
                    { 
                        label: truncateText(forumInfo.faculty_name || 'Fakultetas'),
                        path: `/forumai/universitetai/${forumInfo.university_id}/fakultetai/${forumInfo.faculty_id}/irasai`,
                    },
                    { 
                        label: 'Programos', 
                        path: `/forumai/universitetai/${forumInfo.university_id}/fakultetai/${forumInfo.faculty_id}/programos`
                    },
                    { 
                        label: truncateText(forumInfo.program_name || 'Programa'),
                        path: forumInfo.navigation_path || `/forumai/universitetai/${forumInfo.university_id}/fakultetai/${forumInfo.faculty_id}/programos/${forumInfo.entity_id}/irasai`,
                    }
                );
            }
        }
        // Fallback to old method if forum_info is not available
        else if (params.universityId) {
            items.push(
                { label: 'Universitetai', path: '/forumai/universitetai' },
                { 
                    label: truncateText(forumInfo.forumName || 'Universitetas'), 
                    path: `/forumai/universitetai/${params.universityId}/irasai`,
                    universityId: params.universityId
                }
            );
        
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
            
            setPostData(prevPostData => ({
                ...prevPostData,
                comments_count: (prevPostData.comments_count || 0) + 1
            }));
            
            await fetchComments();
            
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
        <div className="container mx-auto px-4 mb-10">
            {/* Breadcrumb */}
            <nav className="bg-dark p-4 mb-6 rounded-md border border-light-grey/20">
                <ol className="flex flex-wrap items-center text-sm">
                    <li className="flex items-center">
                        <a href="/forumai" className="text-lght-blue hover:underline">Forumas</a>
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mx-2 text-lighter-grey">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                        </svg>
                    </li>
                    {generateBreadcrumbItems().map((item, index) => (
                        <li key={index} className="flex items-center">
                            {index < generateBreadcrumbItems().length - 1 ? (
                                <>
                                    <a href={item.path} className="text-lght-blue hover:underline">{item.label}</a>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mx-2 text-lighter-grey">
                                        <path strokeLinecap="round" strokeLinejoin="round" d="M8.25 4.5l7.5 7.5-7.5 7.5" />
                                    </svg>
                                </>
                            ) : (
                                <span className="text-white font-medium">{item.label}</span>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>

            {/* Thread Header */}
            <div className="bg-grey rounded-lg mb-6 border-l-4 border-lght-blue">
                <div className="p-4">
                    <div className="flex items-center justify-between">
                        <div>
                            <h1 className="text-white text-2xl font-bold">{postData.title}</h1>
                            <div className="flex flex-wrap items-center gap-2 mt-2 text-sm text-lighter-grey">
                                <span className="text-lght-blue">
                                    {postData.forum_info ? (
                                        <span>
                                            {postData.forum_info.entity_type === 'university' && postData.forum_info.university_name ? 
                                                `${postData.forum_info.university_name} - Universiteto forumas` : 
                                                postData.forum_info.entity_type === 'faculty' && postData.forum_info.faculty_name ? 
                                                `${postData.forum_info.faculty_name} - Fakulteto forumas` :
                                                postData.forum_info.entity_type === 'program' && postData.forum_info.program_name ?
                                                `${postData.forum_info.program_name} - Programos forumas` :
                                                postData.forum || "Forumas"}
                                        </span>
                                    ) : (
                                        postData.forum || "Forumas"
                                    )}
                                </span>
                                <span>•</span>
                                <span>{postData.created_at || postData.date}</span>
                                <span>•</span>
                                <span>{comments.length} atsakymai</span>
                                <span>•</span>
                                <span>{postData.views || 0} peržiūros</span>
                                <span>•</span>
                                <span>{postData.likes + postData.dislikes} įvertinimai</span>
                            </div>
                        </div>
                        {user && (
                            <button 
                                onClick={() => window.location.href = '/kurti-irasa'} 
                                className="bg-lght-blue text-white px-4 py-2 rounded-md hover:bg-blue-600 transition-colors hidden md:block"
                            >
                                Sukurti naują įrašą
                            </button>
                        )}
                    </div>
                </div>
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

            {/* Categories */}
            {postData.categories && Array.isArray(postData.categories) && postData.categories.length > 0 && (
                <div className="flex flex-wrap gap-2 mb-4">
                    {postData.categories.map((category, catIndex) => {
                        const categoryName = typeof category === 'object' ? category.name : category;
                        const color = category.color || 'lght-blue';
                        return (
                            <div
                                key={catIndex}
                                className={`ring-1 ring-${color} rounded-full py-1 px-3 text-xs font-medium text-${color}`}
                            >
                                {categoryName}
                            </div>
                        );
                    })}
                </div>
            )}

            {/* Original Post Panel */}
            <div className="bg-grey rounded-lg mb-6 overflow-hidden border border-light-grey/20">
                {/* Post Header */}
                <div className="bg-dark p-4 border-b border-light-grey/20 flex items-center justify-between">
                    <div className="flex items-center">
                        <div className="mr-3">
                                <img 
                                    src={postData.user_avatar ? `http://127.0.0.1:5000/storage/${postData.user_avatar}` : profilePicture} 
                                className="w-10 h-10 rounded-full object-cover border border-light-grey" 
                                    alt="Profile" 
                                />
                                </div>
                        <div>
                            <div className="text-white font-medium">{postData.user || postData.username || 'Unknown'}</div>
                            <div className="text-lighter-grey text-xs flex items-center gap-2">
                                <span>{postData.user_status?.name || 'Studentas'}</span>
                                
                            </div>
                        </div>
                    </div>
                    <div>
                    <span className="text-lighter-grey text-md font-medium">{postData.date || postData.created_at || ''}</span>
                        </div>
                        </div>
                
                {/* Post Content */}
                <div className="p-6">
                    <div className="text-white prose prose-invert max-w-none mb-8">
                        <div dangerouslySetInnerHTML={{ __html: postData.content || postData.description }} />
                    </div>
                    
                    {/* Post Actions */}
                    <div className="flex items-center gap-4 pt-4 border-t border-light-grey/20">
                            <div 
                            className={`flex items-center gap-1 cursor-pointer md:text-sm transition-colors duration-150 hover:bg-dark/30 p-1.5 rounded-md ${postData.user_interaction === 'like' ? 'text-lght-blue bg-dark/20' : 'hover:text-lght-blue text-lighter-grey'}`}
                                onClick={handleLike}
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06l-6.22-6.22V21a.75.75 0 0 1-1.5 0V4.81l-6.22 6.22a.75.75 0 1 1-1.06-1.06l7.5-7.5Z" clipRule="evenodd" />
                                </svg>
                            <span>{postData.likes || postData.like_count || 0}</span>
                            </div>
                            <div 
                            className={`flex items-center gap-1 cursor-pointer md:text-sm transition-colors duration-150 hover:bg-dark/30 p-1.5 rounded-md ${postData.user_interaction === 'dislike' ? 'text-red bg-dark/20' : 'hover:text-red text-lighter-grey'}`}
                                onClick={handleDislike}
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 rotate-180">
                                    <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06l-6.22-6.22V21a.75.75 0 0 1-1.5 0V4.81l-6.22 6.22a.75.75 0 1 1-1.06-1.06l7.5-7.5Z" clipRule="evenodd" />
                                </svg>
                            <span>{postData.dislikes || 0}</span>
                            </div>
                        <div className="flex items-center gap-1 md:text-sm text-lighter-grey p-1.5">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 0 1 0-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178Z" />
                                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
                                </svg>
                            <span>{postData.views || 0}</span>
                            </div>
                            <div 
                            className="flex items-center gap-1 cursor-pointer hover:text-lght-blue md:text-sm transition-colors duration-150 hover:bg-dark/30 p-1.5 rounded-md text-lighter-grey"
                                onClick={handleShare}
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5">
                                    <path fillRule="evenodd" d="M15.75 4.5a3 3 0 1 1 .825 2.066l-8.421 4.679a3.002 3.002 0 0 1 0 1.51l8.421 4.679a3 3 0 1 1-.729 1.31l-8.421-4.678a3 3 0 1 1 0-4.132l8.421-4.679a3 3 0 0 1-.096-.755Z" clipRule="evenodd" />
                                </svg>
                            <span>Dalintis</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Reply Box */}
                        {user && (
                <div className="bg-grey rounded-lg p-4 border border-lght-blue mb-6">
                    <h3 className="text-white font-medium mb-3">Pridėti atsakymą</h3>
                            {isExpanded ? (
                        <div className="relative rounded-md p-4">
                            <div className="mb-8 ring-1 rounded-md ring-light-grey">
                                        <RichTextEditor 
                                            value={comment}
                                            onChange={(content) => setComment(content)}
                                    placeholder="Parašykite komentarą..."
                                        />
                                    </div>

                            <div className="flex justify-end gap-2">
                                <button
                                    className="ring-1 ring-light-grey text-white px-3 py-1 rounded-md text-sm hover:bg-dark-blue transition"
                                    onClick={() => setIsExpanded(false)}
                                    disabled={commentSubmitting}
                                >
                                    Atšaukti
                                </button>
                                    <button
                                    className="bg-lght-blue text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition" 
                                        onClick={handleComment}
                                        disabled={commentSubmitting}
                                    >
                                        {commentSubmitting ? 'Siunčiama...' : 'Komentuoti'}
                                    </button>
                            </div>
                                </div>
                            ) : (
                        <div onClick={() => setIsExpanded(true)} className="border border-light-grey/40 rounded-md cursor-text p-3 text-lighter-grey hover:border-lght-blue focus:border-lght-blue transition-colors">
                            Spustelėkite čia, kad pradėtumėte rašyti atsakymą...
                        </div>
                                )}
                            </div>
                        )}

            {/* Replies Header */}
            <div className="bg-dark p-4 rounded-t-lg border border-light-grey/20 flex justify-between items-center mb-0">
                <h2 className="text-white text-lg font-medium">
                    Atsakymai ({postData.comment_count || postData.comments_count || (postData.comments && postData.comments.length) || 0})
                </h2>
                <div className="text-xs text-lighter-grey">
                    Rikiuoti pagal:
                    <select className="ml-2 bg-dark text-white border border-light-grey/30 rounded px-2 py-1 text-xs">
                        <option value="oldest">Seniausias</option>
                        <option value="newest">Naujausias</option>
                        <option value="likes">Daugiausiai patiktukų</option>
                    </select>
                </div>
            </div>

            {/* Comments Section */}
            <div className="bg-grey rounded-b-lg overflow-hidden border-x border-b border-light-grey/20 mb-6">
                {commentsLoading ? (
                    <div className="text-lighter-grey text-center py-6 flex justify-center items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-lighter-grey" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        <span>Kraunami komentarai...</span>
                    </div>
                ) : (
                    <div>
                        {comments && Array.isArray(comments) && comments.length > 0 ? (
                            <div>
                                {comments.map((comment, index) => (
                                    <div key={index} className="border-b border-light-grey/20 last:border-b-0">
                        <Comment 
                            key={index} 
                            comment={comment} 
                                            replyingTo={comment.replyingToUser}
                            onCommentAdded={fetchComments} 
                            post_user_id={postData.user_id}
                            updatePostCommentCount={() => {
                                setPostData(prevPostData => ({
                                    ...prevPostData,
                                    comments_count: (prevPostData.comments_count || 0) + 1
                                }));
                            }}
                        />
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <div className="p-8 text-center text-lighter-grey">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mx-auto mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                </svg>
                                <p className="text-lg">Nėra komentarų</p>
                                <p className="mt-2">Būkite pirmas, kuris pakomentuos šį įrašą!</p>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Forum Navigation */}
            <div className="flex flex-wrap gap-3 justify-between">
                <a href={postData.forum_info?.navigation_path || location.state?.referrer || '/forumai'} className="text-lght-blue hover:underline flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 19.5 3 12m0 0 7.5-7.5M3 12h18" />
                    </svg>
                    Grįžti į {postData.forum_info ? postData.forum_info.title : 'įrašų sąrašą'}
                </a>
                {user && (
                    <a href="/kurti-irasa" className="text-lght-blue hover:underline flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 mr-1">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        Sukurti naują įrašą
                    </a>
                )}
            </div>
        </div>
    );
};

export default Post;