import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import API from '../../utils/API';
import profilePicture from "../../assets/profile-default-icon.png";
import { useStateContext } from '../../context/contextProvider';

const PostList = ({ posts: initialPosts }) => {
  const [posts, setPosts] = useState(initialPosts || []);
  const [userInteractions, setUserInteractions] = useState({});
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { forumType, forumId, forumName, programId, universityId } = location.state || {};
  const { user, token } = useStateContext();
  
  useEffect(() => {
    setPosts(initialPosts || []);
  }, [initialPosts]);
  
  useEffect(() => {
    if (user && token) {
      fetchUserInteractions();
    }
  }, [user, token]);
  
  const fetchUserInteractions = async () => {
    try {
      setIsLoading(true);
      const response = await API.get('/user/post-interactions');
      
      const interactionsMap = {};
      response.data.forEach(interaction => {
        interactionsMap[interaction.post_id] = interaction.type;
      });
      
      setUserInteractions(interactionsMap);
    } catch (error) {
      console.error('Failed to fetch user interactions', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleOpenPost = (post) => {
    const forumType = post.forumType;
    console.log(forumType);
    let postUrl = '/forumai';
    
    if (forumType === 'university' && forumId) {
      postUrl = `/forumai/universitetai/${forumId}/irasai/${post.id}`;
    } else if (forumType === 'program' && forumId) {
      postUrl = `/forumai/universitetai/${forumId}/programos/${programId}/irasai/${post.id}`;
    } else if (forumType === 'faculty' && forumId) {
      postUrl = `/forumai/universitetai/${universityId}/fakultetai/${forumId}/irasai/${post.id}`;
    } else if (forumType === 'category' && forumId) {
      postUrl = `/forumai/kategorijos/${forumId}/irasai/${post.id}`;
    } else {
      postUrl = `/forumai/irasai/${post.id}`;
    }

    navigate(postUrl, { 
      state: { 
        forumType,
        forumId,
        forumName
      } 
    });
  };
  
  const handleLike = async (e, post) => {
    e.stopPropagation();
    
    if (!user) {
      setErrorMessage('Prisijunkite, kad galėtumėte įvertinti įrašą');
      return;
    }
    
    const currentInteraction = userInteractions[post.id];
    
    const updatedPosts = [...posts];
    const postIndex = updatedPosts.findIndex(p => p.id === post.id);
    
    if (postIndex === -1) return;
    
    const updatedPost = { ...updatedPosts[postIndex] };
    
    if (currentInteraction === 'like') {
      updatedPost.likes = Math.max(0, updatedPost.likes - 1);
      
      setUserInteractions(prev => {
        const newInteractions = { ...prev };
        delete newInteractions[post.id];
        return newInteractions;
      });
    } else if (currentInteraction === 'dislike') {
      updatedPost.likes = updatedPost.likes + 1;
      updatedPost.dislikes = Math.max(0, updatedPost.dislikes - 1);
      
      setUserInteractions(prev => ({
        ...prev,
        [post.id]: 'like'
      }));
    } else {
      updatedPost.likes = updatedPost.likes + 1;
      
      setUserInteractions(prev => ({
        ...prev,
        [post.id]: 'like'
      }));
    }
    
    updatedPosts[postIndex] = updatedPost;
    setPosts(updatedPosts);
    
    try {
      const response = await API.post(`/posts/${post.id}/like`);
      
      if (response.data.likes !== updatedPost.likes || 
          (response.data.dislikes !== undefined && response.data.dislikes !== updatedPost.dislikes)) {
        
        const serverSyncedPosts = [...posts];
        const syncedPost = { ...serverSyncedPosts[postIndex] };
        
        syncedPost.likes = response.data.likes;
        if (response.data.dislikes !== undefined) {
          syncedPost.dislikes = response.data.dislikes;
        }
        
        serverSyncedPosts[postIndex] = syncedPost;
        setPosts(serverSyncedPosts);
      }
    } catch (error) {
      console.error('Failed to like post', error);
      
      setPosts([...initialPosts]);
      
      if (error.response?.status === 401) {
        setErrorMessage('Prisijunkite, kad galėtumėte įvertinti įrašą');
      } else {
        setErrorMessage('Nepavyko įvertinti įrašo. Bandykite dar kartą.');
      }
      
      fetchUserInteractions();
    }
  };
  
  const handleDislike = async (e, post) => {
    e.stopPropagation(); 
    
    if (!user) {
      setErrorMessage('Prisijunkite, kad galėtumėte įvertinti įrašą');
      return;
    }
    
    const currentInteraction = userInteractions[post.id];
    
    const updatedPosts = [...posts];
    const postIndex = updatedPosts.findIndex(p => p.id === post.id);
    
    if (postIndex === -1) return;
    
    const updatedPost = { ...updatedPosts[postIndex] };
    
    if (currentInteraction === 'dislike') {
      updatedPost.dislikes = Math.max(0, updatedPost.dislikes - 1);
      
      setUserInteractions(prev => {
        const newInteractions = { ...prev };
        delete newInteractions[post.id];
        return newInteractions;
      });
    } else if (currentInteraction === 'like') {
      updatedPost.dislikes = updatedPost.dislikes + 1;
      updatedPost.likes = Math.max(0, updatedPost.likes - 1);
      
      setUserInteractions(prev => ({
        ...prev,
        [post.id]: 'dislike'
      }));
    } else {
      updatedPost.dislikes = updatedPost.dislikes + 1;
      
      setUserInteractions(prev => ({
        ...prev,
        [post.id]: 'dislike'
      }));
    }
    
    updatedPosts[postIndex] = updatedPost;
    setPosts(updatedPosts);
    
    try {
      const response = await API.post(`/posts/${post.id}/dislike`);
      
      if ((response.data.dislikes !== undefined && response.data.dislikes !== updatedPost.dislikes) || 
          (response.data.likes !== undefined && response.data.likes !== updatedPost.likes)) {
        
        const serverSyncedPosts = [...posts];
        const syncedPost = { ...serverSyncedPosts[postIndex] };
        
        if (response.data.dislikes !== undefined) {
          syncedPost.dislikes = response.data.dislikes;
        }
        if (response.data.likes !== undefined) {
          syncedPost.likes = response.data.likes;
        }
        
        serverSyncedPosts[postIndex] = syncedPost;
        setPosts(serverSyncedPosts);
      }
    } catch (error) {
      console.error('Failed to dislike post', error);
      
      setPosts([...initialPosts]);
      
      if (error.response?.status === 401) {
        setErrorMessage('Prisijunkite, kad galėtumėte įvertinti įrašą');
      } else {
        setErrorMessage('Nepavyko įvertinti įrašo. Bandykite dar kartą.');
      }

      fetchUserInteractions();
    }
  };
  
  const handleComment = (e, post) => {
    e.stopPropagation();
    handleOpenPost(post);
  };
  
  const handleShare = (e, post) => {
    e.stopPropagation();
    
    let postUrl = '/forumai';
    
    if (forumType === 'university' && forumId) {
      postUrl = `/forumai/universitetai/${forumId}/irasai/${post.id}`;
    } else if (forumType === 'program' && forumId) {
      postUrl = `/forumai/universitetai/${forumId}/programos/${programId}/irasai/${post.id}`;
    } else if (forumType === 'faculty' && forumId) {
      postUrl = `/forumai/universitetai/${universityId}/fakultetai/${forumId}/irasai/${post.id}`;
    } else if (forumType === 'category' && forumId) {
      postUrl = `/forumai/kategorijos/${forumId}/irasai/${post.id}`;
    } else {
      postUrl = `/forumai/irasai/${post.id}`;
    }
    
    const url = window.location.origin + postUrl;
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

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('lt-LT', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };


  if (!posts || posts.length === 0) {
    return (
      <div className="w-full flex justify-center items-center min-h-[200px]">
        <p className="text-light-grey">Šiuo metu įrašų nėra.</p>
      </div>
    );
  }

  return (
    <div className="w-full">
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
      
      {posts.map((post, index) => (
        <div key={post.id || index} className='cursor-pointer' onClick={() => handleOpenPost(post)}>
          <div className="group flex flex-col justify-between items-start gap-5 bg-grey rounded-md p-5 m-2 border-2 border-dark hover:bg-dark hover:border-light-grey transition-colors duration-150 ease-linear">
            <div className="flex flex-row gap-10 items-center w-full">
              <div className="flex flex-col gap-2 w-full">
                <div className="flex flex-row justify-between">
                  {post.user && (
                    <div className="flex items-center gap-3">
                      <div className="relative">
                        <img 
                          src={post.user_avatar ? `http://127.0.0.1:5000/storage/${post.user_avatar}` : profilePicture} 
                          alt="User profile" 
                          className="w-10 h-10 rounded-full object-cover border border-light-grey"
                        />
                      </div>
                      <div className="flex flex-col">
                        <p className="text-white text-sm">{post.user || post.username || 'Nežinomas'}</p>
                        <p className="text-light-grey text-xs">{post.user_status?.name || 'Studentas'}</p>
                      </div>
                    </div>
                  )}
                  <div className='flex flex-row gap-10 justify-end items-center'>
                    <div className="hidden flex-row gap-4 justify-end items-end lg:flex text-xs">
                      {post.categories && post.categories.map((category, catIndex) => {
                          const categoryName = typeof category === 'object' ? category.name : category;
                          const color = category.color;
                          return (
                              <div
                                  key={catIndex}
                                  className={`ring-1 ring-${color} rounded-md p-1 px-2 font-medium text-${color}`}
                              >
                                  • {categoryName}
                              </div>
                          );
                      })}
                    </div>
                    <button className='p-1 rounded-full text-white hover:bg-lght-blue transition-colors duration-150 ease-linear' onClick={(e) => e.stopPropagation()}>
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                      </svg>
                    </button>
                  </div>
                </div>
                <h1 className="text-white font-medium text-2xl">{post.title}</h1> 
                <p className="text-lighter-grey font-light text-xl">
                  {(post.content || post.description || '').length > 250
                    ? (post.content || post.description || '').slice(0,250) + "..."
                    : (post.content || post.description || '')}
                </p>
                <div className="flex justify-end w-full">
                  <p className="text-light-grey font-light italic text-md">
                    {formatDate(post.created_at) || post.date || ''}
                  </p>
                </div>
              </div>
            </div>
            <div className="flex flex-row w-full gap-3 border-t-2 pt-4 group-hover:border-t-light-grey border-t-dark justify-between transition-colors duration-150 ease-linear">
              <div className="flex flex-row gap-8">
                <div className='flex flex-row gap-2'>
                  <div 
                    className={`flex flex-row gap-2 p-2 rounded-md hover:bg-grey cursor-pointer
                      ${userInteractions[post.id] === 'like' 
                        ? 'bg-grey text-lght-blue' 
                        : 'hover:text-lght-blue text-white transition-colors duration-150 ease-linear'}`}
                    onClick={(e) => handleLike(e, post)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                      <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06l-6.22-6.22V21a.75.75 0 0 1-1.5 0V4.81l-6.22 6.22a.75.75 0 1 1-1.06-1.06l7.5-7.5Z" clipRule="evenodd" />
                    </svg>
                    <p className="flex gap-1">{post.likes || post.like_count || 0}</p>
                  </div>
                  <div 
                    className={`flex flex-row gap-2 p-2 rounded-md  hover:bg-grey cursor-pointer
                      ${userInteractions[post.id] === 'dislike' 
                        ? 'bg-grey text-red' 
                        : 'hover:text-red text-white transition-colors duration-150 ease-linear'}`}
                    onClick={(e) => handleDislike(e, post)}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 rotate-180">
                      <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06l-6.22-6.22V21a.75.75 0 0 1-1.5 0V4.81l-6.22 6.22a.75.75 0 1 1-1.06-1.06l7.5-7.5Z" clipRule="evenodd" />
                    </svg>
                    <p className="flex gap-1">{post.dislikes || 0}</p>
                  </div>
                </div>
                <div 
                  className="flex flex-row gap-2 p-2 rounded-md text-white hover:bg-grey hover:text-lght-blue transition-colors duration-150 ease-linear cursor-pointer"
                  onClick={(e) => handleComment(e, post)}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                  </svg>
                  <p className="flex gap-1">{post.comments_count || post.comment_count || 0}</p>
                </div>
              </div>
              <div 
                className="flex flex-row gap-2 p-2 rounded-md text-white hover:bg-grey hover:text-lght-blue transition-colors duration-150 ease-linear cursor-pointer"
                onClick={(e) => handleShare(e, post)}
              >
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                  <path fillRule="evenodd" d="M15.75 4.5a3 3 0 1 1 .825 2.066l-8.421 4.679a3.002 3.002 0 0 1 0 1.51l8.421 4.679a3 3 0 1 1-.729 1.31l-8.421-4.678a3 3 0 1 1 0-4.132l8.421-4.679a3 3 0 0 1-.096-.755Z" clipRule="evenodd" />
                </svg>
                <p className="flex gap-1">Dalintis</p>
              </div>
            </div>
          </div>
          <div className="mt-8 mb-8 border-2 rounded-sm border-grey"></div>
        </div>
      ))}
    </div>
  );
};

export default PostList;
