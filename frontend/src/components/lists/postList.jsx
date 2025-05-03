import React, { useState, useEffect } from 'react';
import { Navigate, useNavigate, useLocation } from 'react-router-dom';
import API from '../../utils/API';
import profilePicture from "../../assets/profile-default-icon.png";
import { useStateContext } from '../../context/contextProvider';

const PostList = ({ posts: initialPosts }) => {
  const [posts, setPosts] = useState(initialPosts || []);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  
  const navigate = useNavigate();
  const location = useLocation();
  const { forumType, forumId, forumName, programId, universityId } = location.state || {};
  const { user, token } = useStateContext();
  
  useEffect(() => {
    setPosts(initialPosts || []);
  }, [initialPosts]);
  
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
    
    const currentInteraction = post.user_interaction;
    
    const updatedPosts = [...posts];
    const postIndex = updatedPosts.findIndex(p => p.id === post.id);
    
    if (postIndex === -1) return;
    
    const updatedPost = { ...updatedPosts[postIndex] };
    
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
    }
  };
  
  const handleDislike = async (e, post) => {
    e.stopPropagation(); 
    
    if (!user) {
      setErrorMessage('Prisijunkite, kad galėtumėte įvertinti įrašą');
      return;
    }
    
    const currentInteraction = post.user_interaction;
    
    const updatedPosts = [...posts];
    const postIndex = updatedPosts.findIndex(p => p.id === post.id);
    
    if (postIndex === -1) return;
    
    const updatedPost = { ...updatedPosts[postIndex] };
    
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
      <div className="w-full flex flex-col justify-center items-center min-h-[200px] bg-grey rounded-lg p-8 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 text-lighter-grey" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
        </svg>
        <p className="text-lighter-grey text-lg">Šiuo metu įrašų nėra.</p>
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
        <div key={post.id || index} 
            className="cursor-pointer hover:bg-dark/50 transition-colors duration-200 rounded-md border border-transparent hover:border-light-grey/30" 
            onClick={() => handleOpenPost(post)}>
          <div className="p-5 border-b border-light-grey/20 flex flex-col md:flex-row">
            {/* Thread info - left side */}
            <div className="flex-grow pr-4">
              {/* Thread title and category tags */}
              <div className="mb-3">               
                {post.categories && post.categories.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-2">
                    {post.categories.map((category, catIndex) => {
                      const categoryName = typeof category === 'object' ? category.name : category;
                      const color = category.color || 'lght-blue';
                      return (
                        <div
                          key={catIndex}
                          className={`text-${color} ring-${color} ring-1 text-xs px-2 py-0.5 bg-dark/60 rounded-full`}
                        >
                          {categoryName}
                        </div>
                      );
                    })}
                  </div>
                )}
                <h3 className="text-white font-semibold text-xl hover:text-lght-blue transition-colors duration-150 leading-tight">{post.title}</h3>
              </div>
              
              {/* Thread author and stats */}
              <div className="flex flex-wrap items-center text-xs text-lighter-grey gap-x-4 gap-y-1">
                <div className="flex items-center">
                  <img 
                    src={post.user_avatar ? `http://127.0.0.1:5000/storage/${post.user_avatar}` : profilePicture} 
                    alt="User profile" 
                    className="w-6 h-6 rounded-full object-cover border border-light-grey mr-1"
                  />
                  <span className="text-lght-blue font-medium text-lg">{post.user || post.username || 'Nežinomas'}</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v6h4.5m4.5 0a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
                  </svg>
                  <span>{formatDate(post.created_at) || post.date || ''}</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                  </svg>
                  <span>{post.comments_count || post.comment_count || 0} atsakymai</span>
                </div>
                <div className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-3 h-3 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.25c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 0 1 2.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 0 0 .322-1.672V2.75a.75.75 0 0 1 .75-.75 2.25 2.25 0 0 1 2.25 2.25c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282m0 0h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 0 1-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 0 0-1.423-.23H5.904m10.598-9.75H14.25M5.904 18.5c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 0 1-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 9.953 4.167 9.5 5 9.5h1.053c.472 0 .745.556.5.96a8.958 8.958 0 0 0-1.302 4.665c0 1.194.232 2.333.654 3.375Z" />
                  </svg>
                  <span>{post.likes || post.like_count || 0} patinka</span>
                </div>
              </div>
            </div>
            
            {/* Thread stats - right side */}
            <div className="flex mt-3 gap-5 md:mt-0 md:justify-end md:flex-col md:items-end md:w-56 md:pl-4 text-xs md:text-sm text-lighter-grey">
              <div className=" flex gap-4 items-baseline text-start md:mb-2">
                <div className="font-medium text-white">{post.comments_count || post.comment_count || 0}</div>
                <div className="text-xs hidden md:block">Atsakymai</div>
              </div>
              
              <div className="flex gap-5 items-baseline text-start md:mb-2">
                <div className="font-medium text-white">{post.views || 0}</div>
                <div className="text-xs hidden md:block">Peržiūros</div>
              </div>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default PostList;
