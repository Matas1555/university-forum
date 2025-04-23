import { useState, useEffect } from "react";
import RichTextEditor from "../richTextEditor/RichTextEditor";
import profilePicture from "../../assets/profile-default-icon.png";
import { ForumAPI } from "../../utils/API";
import API from "../../utils/API";
import { useStateContext } from "../../context/contextProvider";
import { sanitizeHtml, isHtmlEmpty, cleanRichTextContent } from "../../utils/helpers";

const Comment = ({ comment, level = 1, replyingTo = null, onCommentAdded, post_user_id, updatePostCommentCount }) => {
  const maxLevel = 3;
  const [isMdScreen, setIsMdScreen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [newComment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [localComment, setLocalComment] = useState(comment);
  const [userInteraction, setUserInteraction] = useState(null); // 'like', 'dislike', or null
  const { user } = useStateContext();

  useEffect(() => {
    setLocalComment(comment);
  }, [comment]);

  useEffect(() => {
    if (user) {
      fetchUserInteraction();
    }
  }, [user, localComment.id]);

  useEffect(() => {
    const handleResize = () => {
      setIsMdScreen(window.innerWidth >= 768); 
    };
    
    handleResize(); 
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
  const fetchUserInteraction = async () => {
    try {
      const response = await ForumAPI.getUserCommentInteractions();
      const interaction = response.data.find(i => i.comment_id === localComment.id);
      if (interaction) {
        setUserInteraction(interaction.type);
      } else {
        setUserInteraction(null);
      }
    } catch (error) {
      console.error('Failed to fetch user interactions:', error);
    }
  };
  
  const handleSubmitReply = async () => {
    if (!user) {
      setError("Prisijunkite, kad galėtumėte komentuoti");
      return;
    }
    
    if (isHtmlEmpty(newComment)) {
      setError("Komentaras negali būti tuščias");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      const sanitizedHtml = sanitizeHtml(cleanRichTextContent(newComment));
      
      const replyLevel = Math.min(level + 1, 3);
      
      const commentData = {
        text: sanitizedHtml,
        post_id: comment.post_id || parseInt(window.location.pathname.split('/').pop()),
        parent_id: comment.id,
        level: replyLevel
      };
      
      const response = await ForumAPI.createComment(commentData);
      
      setComment('');
      setIsExpanded(false);
      
      // Immediately update the post comment count in the parent component
      if (updatePostCommentCount) {
        updatePostCommentCount();
      }
      
      if (onCommentAdded) {
        onCommentAdded();
      }
    } catch (error) {
      console.error('Failed to submit reply:', error);
      setError(error.response?.data?.error || "Klaida siunčiant komentarą");
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleLike = async () => {
    if (!user) {
      setError("Prisijunkite, kad galėtumėte įvertinti komentarą");
      return;
    }

    try {
      // Optimistically update UI
      const updatedComment = { ...localComment };
      let newInteraction = null;
      
      if (userInteraction === 'like') {
        // Remove like
        updatedComment.like_count = Math.max((updatedComment.like_count || 0) - 1, 0);
        newInteraction = null;
      } else if (userInteraction === 'dislike') {
        // Change dislike to like
        updatedComment.like_count = (updatedComment.like_count || 0) + 1;
        updatedComment.dislike_count = Math.max((updatedComment.dislike_count || 0) - 1, 0);
        newInteraction = 'like';
      } else {
        // Add new like
        updatedComment.like_count = (updatedComment.like_count || 0) + 1;
        newInteraction = 'like';
      }
      
      setLocalComment(updatedComment);
      setUserInteraction(newInteraction);
      
      // Send API request
      const response = await ForumAPI.likeComment(localComment.id);
      
      // Update with actual server response if needed
      if (response.data.like_count !== undefined || response.data.dislike_count !== undefined) {
        setLocalComment(prev => ({
          ...prev,
          like_count: response.data.like_count !== undefined ? response.data.like_count : prev.like_count,
          dislike_count: response.data.dislike_count !== undefined ? response.data.dislike_count : prev.dislike_count
        }));
      }
      
      // Refresh user's interactions
      await fetchUserInteraction();
    } catch (error) {
      console.error('Failed to like comment:', error);
      setError("Nepavyko įvertinti komentaro");
      // Reset to original comment data
      setLocalComment(comment);
      await fetchUserInteraction();
    }
  };

  const handleDislike = async () => {
    if (!user) {
      setError("Prisijunkite, kad galėtumėte įvertinti komentarą");
      return;
    }

    try {
      // Optimistically update UI
      const updatedComment = { ...localComment };
      let newInteraction = null;
      
      if (userInteraction === 'dislike') {
        // Remove dislike
        updatedComment.dislike_count = Math.max((updatedComment.dislike_count || 0) - 1, 0);
        newInteraction = null;
      } else if (userInteraction === 'like') {
        // Change like to dislike
        updatedComment.dislike_count = (updatedComment.dislike_count || 0) + 1;
        updatedComment.like_count = Math.max((updatedComment.like_count || 0) - 1, 0);
        newInteraction = 'dislike';
      } else {
        // Add new dislike
        updatedComment.dislike_count = (updatedComment.dislike_count || 0) + 1;
        newInteraction = 'dislike';
      }
      
      setLocalComment(updatedComment);
      setUserInteraction(newInteraction);
      
      // Send API request
      const response = await ForumAPI.dislikeComment(localComment.id);
      
      // Update with actual server response if needed
      if (response.data.like_count !== undefined || response.data.dislike_count !== undefined) {
        setLocalComment(prev => ({
          ...prev,
          like_count: response.data.like_count !== undefined ? response.data.like_count : prev.like_count,
          dislike_count: response.data.dislike_count !== undefined ? response.data.dislike_count : prev.dislike_count
        }));
      }
      
      // Refresh user's interactions
      await fetchUserInteraction();
    } catch (error) {
      console.error('Failed to dislike comment:', error);
      setError("Nepavyko įvertinti komentaro");
      // Reset to original comment data
      setLocalComment(comment);
      await fetchUserInteraction();
    }
  };

  const visualLevel = Math.min(level, 3);
  const marginLeft = isMdScreen
    ? Math.min(visualLevel * 20, 60) 
    : Math.min(visualLevel * 4, 12); 
  
  return (
    <div 
      className={`mt-3 mb-4 pt-3 pb-2 ${visualLevel > 1 ? 'border-l-2 border-light-grey/20' : ''}`}
      style={{ marginLeft: `${marginLeft}px` }}
    >
      {/* Reply indicator - only show for replies */}
      {visualLevel > 1 && replyingTo && (
        <div className="inline-flex flex-row items-center text-light-grey ml-3 mb-2 rounded-md px-2 py-0.5 bg-grey/30">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 mr-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.49 12 3.75 3.75m0 0-3.75 3.75m3.75-3.75H3.74V4.499" />
          </svg>
          <p className="text-xs">Atsakant į <span className="text-lght-blue font-medium">{replyingTo}</span></p>
        </div>
      )}

      {/* Comment header with user info */}
      <div className="flex flex-row items-center gap-2 ml-3">
        <img 
          src={localComment.user_avatar ? `http://127.0.0.1:5000/storage/${localComment.user_avatar}` : profilePicture} 
          className="size-7 rounded-full ring-1 ring-inset ring-lght-blue object-cover" 
          alt="Profile" 
        />
        <div>
          <div className="text-sm md:text-base"><span className="text-lght-blue font-medium">{localComment.user}</span>
          {localComment.user_id === post_user_id && (
            <span className="text-green font-light text-xs"> • Įrašo autorius</span>
          )}
          </div>
          <div className="text-xs text-light-grey">{localComment.date}</div>
        </div>
      </div>

      {/* Comment content */}
      <div 
        className="text-sm text-white mt-2 mb-3 ml-3 md:text-base"
        dangerouslySetInnerHTML={{ __html: localComment.content || localComment.text }}
      />
  
      {/* Like & Reply Buttons */}
      <div className="flex gap-2 ml-3 text-xs text-light-grey border-t border-light-grey/20 pt-2">
        <div 
          className={`flex items-center gap-1 cursor-pointer md:text-sm transition-colors duration-150 ${userInteraction === 'like' ? 'text-lght-blue' : 'hover:text-lght-blue text-light-grey'}`}
          onClick={handleLike}
        >
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 md:size-5">
            <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06l-6.22-6.22V21a.75.75 0 0 1-1.5 0V4.81l-6.22 6.22a.75.75 0 1 1-1.06-1.06l7.5-7.5Z" clipRule="evenodd" />
          </svg>
          <span>{localComment.like_count || 0}</span>
        </div>
        <div 
          className={`flex items-center gap-1 cursor-pointer md:text-sm transition-colors duration-150 ${userInteraction === 'dislike' ? 'text-red' : 'hover:text-red text-light-grey'}`}
          onClick={handleDislike}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="size-4 md:size-5 rotate-180">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.47 2.47a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06l-6.22-6.22V21a.75.75 0 0 1-1.5 0V4.81l-6.22 6.22a.75.75 0 1 1-1.06-1.06l7.5-7.5Z" />
          </svg>
          <span>{localComment.dislike_count || 0}</span>
        </div>
        {/* Show reply button for all levels */}
        <button 
          className="cursor-pointer hover:text-lght-blue ml-4 md:text-sm transition-colors duration-150 flex items-center gap-1" 
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 md:size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
          </svg>
          <span>Atsakyti</span>
        </button>
      </div>

      {/* Error message */}
      {error && (
        <div className="mt-2 ml-3 text-red text-sm">
          {error}
          <button className="ml-2 text-xs" onClick={() => setError(null)}>×</button>
        </div>
      )}

      {/* Reply form */}
      {isExpanded && (
        <div className="mt-3 ml-3 mb-2 w-[95%]">
          <div className="ring-1 rounded-md ring-light-grey/50 overflow-hidden">
            <RichTextEditor 
              value={newComment}
              onChange={(content) => setComment(content)}
              placeholder="Parašykite komentarą..."
            />
          </div>
          
          <div className="flex justify-end mt-2 gap-2">
            <button
              className="ring-1 ring-light-grey text-light-grey px-3 py-1 rounded-md text-sm hover:text-white hover:ring-white transition-colors duration-150"
              onClick={() => {
                setIsExpanded(false);
                setComment('');
                setError(null);
              }}
              disabled={isSubmitting}
            >
              Atšaukti
            </button>
            <button
              className="bg-lght-blue text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition-colors duration-150"
              onClick={handleSubmitReply}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Siunčiama...' : 'Komentuoti'}
            </button>
          </div>
        </div>
      )}
  
      {/* Nested comments */}
      {localComment.replies && localComment.replies.length > 0 && (
        <div className="mt-1">
          {localComment.replies.map((childComment, index) => {
            // Ensure childComment has the post_id from parent comment
            const childWithPostId = {
              ...childComment,
              post_id: childComment.post_id || localComment.post_id
            };
            
            return (
              <Comment 
                key={index} 
                comment={childWithPostId} 
                level={level + 1} 
                replyingTo={localComment.user}
                onCommentAdded={onCommentAdded}
                post_user_id={post_user_id}
                updatePostCommentCount={updatePostCommentCount}
              />
            );
          })}
        </div>
      )}
    </div>
  );
};

export default Comment;
  