import React from 'react';
import { Link } from 'react-router-dom';

const PostCard = ({ post, onClick }) => {
  const truncate = (text, maxLength) => {
    if (!text) return '';
    return text.length > maxLength ? text.substring(0, maxLength) + '...' : text;
  };

  const formatDate = (dateString) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return date.toLocaleDateString('lt-LT', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const getForumPath = () => {
    if (!post.forum_info) return '#';
    
    const { forum_info } = post;
    
    if (forum_info.navigation_path) {
      return forum_info.navigation_path;
    }
    
    if (forum_info.entity_type === 'university') {
      return `/forumai/universitetai/${forum_info.entity_id}/irasai`;
    } else if (forum_info.entity_type === 'faculty') {
      return `/forumai/universitetai/${forum_info.university_id}/fakultetai/${forum_info.entity_id}/irasai`;
    } else if (forum_info.entity_type === 'program') {
      return `/forumai/universitetai/${forum_info.university_id}/fakultetai/${forum_info.faculty_id}/programos/${forum_info.entity_id}/irasai`;
    }
    
    return `/forumai/${post.forum_id}/irasai`;
  };

  const getForumPathText = () => {
    if (!post.forum_info) return post.forum;
    
    const { forum_info } = post;
    let pathText = '';
    
    if (forum_info.university_name) {
      pathText += forum_info.university_name;
    }
    
    if (forum_info.faculty_name) {
      pathText += ` › ${forum_info.faculty_name}`;
    }
    
    if (forum_info.program_name) {
      pathText += ` › ${forum_info.program_name}`;
    }
    
    return pathText || post.forum;
  };

  const getPostPath = () => {
    if (!post.forum_info) return `/irasai/${post.id}`;
    
    const { forum_info } = post;
    
    if (forum_info.entity_type === 'university') {
      return `/forumai/universitetai/${forum_info.entity_id}/irasai/${post.id}`;
    } else if (forum_info.entity_type === 'faculty') {
      return `/forumai/universitetai/${forum_info.university_id}/fakultetai/${forum_info.entity_id}/irasai/${post.id}`;
    } else if (forum_info.entity_type === 'program') {
      return `/forumai/universitetai/${forum_info.university_id}/fakultetai/${forum_info.faculty_id}/programos/${forum_info.entity_id}/irasai/${post.id}`;
    } else if (forum_info.entity_type === 'general') {
      return `/forumai/bendros-diskusijos/irasai/${post.id}`;
    } else if (forum_info.entity_type === 'category') {
      return `/forumai/kategorijos/${forum_info.entity_id}/irasai/${post.id}`;
    }
    
    return `/irasai/${post.id}`;
  };

  return (
    <div 
      className="bg-dark/90 border border-light-grey/20 hover:border-lght-blue/50 rounded-lg p-4 shadow-md transition-all duration-200 cursor-pointer"
      onClick={onClick || (() => window.location.href = getPostPath())}
    >
      <div className="flex flex-col md:flex-row md:items-start gap-4">
        {/* User avatar */}
        <div className="md:flex-shrink-0">
          <div className="w-12 h-12 bg-grey/80 rounded-full overflow-hidden flex items-center justify-center">
            {post.user_avatar ? (
              <img 
                src={post.user_avatar} 
                alt={post.user} 
                className="w-full h-full object-cover"
              />
            ) : (
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-light-grey">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
              </svg>
            )}
          </div>
        </div>
        
        {/* Post content */}
        <div className="flex-1">
          {/* Forum path and date */}
          <div className="flex justify-between items-center mb-2 flex-wrap gap-2">
            <Link 
              to={getForumPath()}
              onClick={(e) => e.stopPropagation()}
              className="text-xs text-lght-blue hover:underline"
            >
              {getForumPathText()}
            </Link>
            <span className="text-xs text-light-grey">{formatDate(post.created_at)}</span>
          </div>
          
          {/* Post title */}
          <h3 className="text-lg font-semibold text-white mb-2">{post.title}</h3>
          
          {/* Post description */}
          <p className="text-sm text-light-grey mb-4">{truncate(post.description, 200)}</p>
          
          {/* Post metadata - categories, likes, comments */}
          <div className="flex flex-wrap items-center gap-2">
            {/* Categories */}
            <div className="flex flex-wrap gap-1 mr-4">
              {post.categories && post.categories.map(category => (
                <span 
                  key={category.id} 
                  className={`inline-block px-2 py-1 text-xs rounded-md bg-${category.color || 'lght-blue'}/20 text-${category.color || 'lght-blue'}`}
                >
                  {category.name}
                </span>
              ))}
            </div>
            
            {/* Post stats */}
            <div className="flex items-center text-xs text-light-grey space-x-3 ml-auto">
              {/* Author */}
              <Link 
                to={`/profilis/${post.user_id}`}
                onClick={(e) => e.stopPropagation()}
                className="flex items-center gap-1 hover:text-lght-blue"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 11-7.5 0 3.75 3.75 0 017.5 0zM4.501 20.118a7.5 7.5 0 0114.998 0A17.933 17.933 0 0112 21.75c-2.676 0-5.216-.584-7.499-1.632z" />
                </svg>
                {post.user}
              </Link>
              
              {/* Likes */}
              <div className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M6.633 10.5c.806 0 1.533-.446 2.031-1.08a9.041 9.041 0 012.861-2.4c.723-.384 1.35-.956 1.653-1.715a4.498 4.498 0 00.322-1.672V3a.75.75 0 01.75-.75A2.25 2.25 0 0116.5 4.5c0 1.152-.26 2.243-.723 3.218-.266.558.107 1.282.725 1.282h3.126c1.026 0 1.945.694 2.054 1.715.045.422.068.85.068 1.285a11.95 11.95 0 01-2.649 7.521c-.388.482-.987.729-1.605.729H13.48c-.483 0-.964-.078-1.423-.23l-3.114-1.04a4.501 4.501 0 00-1.423-.23H5.904M14.25 9h2.25M5.904 18.75c.083.205.173.405.27.602.197.4-.078.898-.523.898h-.908c-.889 0-1.713-.518-1.972-1.368a12 12 0 01-.521-3.507c0-1.553.295-3.036.831-4.398C3.387 10.203 4.167 9.75 5 9.75h1.053c.472 0 .745.556.5.96a8.958 8.958 0 00-1.302 4.665c0 1.194.232 2.333.654 3.375z" />
                </svg>
                {post.likes}
              </div>
              
              {/* Comments */}
              <div className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 01.865-.501 48.172 48.172 0 003.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0012 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018z" />
                </svg>
                {post.comments_count}
              </div>
              
              {/* Views */}
              <div className="flex items-center gap-1">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M2.036 12.322a1.012 1.012 0 010-.639C3.423 7.51 7.36 4.5 12 4.5c4.638 0 8.573 3.007 9.963 7.178.07.207.07.431 0 .639C20.577 16.49 16.64 19.5 12 19.5c-4.638 0-8.573-3.007-9.963-7.178z" />
                  <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                {post.views}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PostCard; 