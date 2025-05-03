import { useState, useEffect } from "react";
import RichTextEditor from "../richTextEditor/RichTextEditor";
import profilePicture from "../../assets/profile-default-icon.png";
import { ForumAPI } from "../../utils/API";
import { useStateContext } from "../../context/contextProvider";
import { sanitizeHtml, isHtmlEmpty, cleanRichTextContent } from "../../utils/helpers";

const Comment = ({ comment, replyingTo = null, onCommentAdded, post_user_id, updatePostCommentCount }) => {
  const [isMdScreen, setIsMdScreen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [newComment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [localComment, setLocalComment] = useState(comment);
  const { user } = useStateContext();

  useEffect(() => {
    setLocalComment(comment);
  }, [comment]);

  useEffect(() => {
    const handleResize = () => {
      setIsMdScreen(window.innerWidth >= 768); 
    };
    
    handleResize(); 
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  
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
      
      const commentData = {
        text: sanitizedHtml,
        post_id: comment.post_id || parseInt(window.location.pathname.split('/').pop()),
        parent_id: comment.id
      };
      
      await ForumAPI.createComment(commentData);
      
      setComment('');
      setIsExpanded(false);

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
      const updatedComment = { ...localComment };
      
      if (localComment.user_interaction === 'like') {
        updatedComment.like_count = Math.max((updatedComment.like_count || 0) - 1, 0);
        updatedComment.user_interaction = null;
      } else if (localComment.user_interaction === 'dislike') {
        updatedComment.like_count = (updatedComment.like_count || 0) + 1;
        updatedComment.dislike_count = Math.max((updatedComment.dislike_count || 0) - 1, 0);
        updatedComment.user_interaction = 'like';
      } else {
        updatedComment.like_count = (updatedComment.like_count || 0) + 1;
        updatedComment.user_interaction = 'like';
      }
      
      setLocalComment(updatedComment);
      
      const response = await ForumAPI.likeComment(localComment.id);
      
      if (response.data.like_count !== undefined || response.data.dislike_count !== undefined) {
        setLocalComment(prev => ({
          ...prev,
          like_count: response.data.like_count !== undefined ? response.data.like_count : prev.like_count,
          dislike_count: response.data.dislike_count !== undefined ? response.data.dislike_count : prev.dislike_count
        }));
      }
    } catch (error) {
      console.error('Failed to like comment:', error);
      setError("Nepavyko įvertinti komentaro");
      setLocalComment(comment);
    }
  };

  const handleDislike = async () => {
    if (!user) {
      setError("Prisijunkite, kad galėtumėte įvertinti komentarą");
      return;
    }

    try {
      const updatedComment = { ...localComment };
      
      if (localComment.user_interaction === 'dislike') {
        updatedComment.dislike_count = Math.max((updatedComment.dislike_count || 0) - 1, 0);
        updatedComment.user_interaction = null;
      } else if (localComment.user_interaction === 'like') {
        updatedComment.dislike_count = (updatedComment.dislike_count || 0) + 1;
        updatedComment.like_count = Math.max((updatedComment.like_count || 0) - 1, 0);
        updatedComment.user_interaction = 'dislike';
      } else {
        updatedComment.dislike_count = (updatedComment.dislike_count || 0) + 1;
        updatedComment.user_interaction = 'dislike';
      }
      
      setLocalComment(updatedComment);
      
      const response = await ForumAPI.dislikeComment(localComment.id);
      
      if (response.data.like_count !== undefined || response.data.dislike_count !== undefined) {
        setLocalComment(prev => ({
          ...prev,
          like_count: response.data.like_count !== undefined ? response.data.like_count : prev.like_count,
          dislike_count: response.data.dislike_count !== undefined ? response.data.dislike_count : prev.dislike_count
        }));
      }
    } catch (error) {
      console.error('Failed to dislike comment:', error);
      setError("Nepavyko įvertinti komentaro");
      setLocalComment(comment);
    }
  };
  
  return (
    <div className="p-4 hover:bg-dark/40 transition-colors duration-200">
      {/* Reply indicator - only show for replies */}
      {replyingTo && (
        <div className="inline-flex flex-row items-center text-lighter-grey mb-3 rounded-md px-2 py-1 bg-dark/40">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 mr-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.49 12 3.75 3.75m0 0-3.75 3.75m3.75-3.75H3.74V4.499" />
          </svg>
          <p className="text-xs md:text-sm">Atsakant į <span className="text-lght-blue font-medium hover:underline cursor-pointer">{replyingTo}</span></p>
        </div>
      )}

      <div className="flex flex-col md:flex-row md:gap-4">
        {/* User Info Panel - Left Side */}
        <div className="md:w-48 flex md:flex-col items-start md:items-center md:border-r md:border-light-grey/20 md:pr-4 md:py-2">
          <img 
            src={localComment.user_avatar ? `http://127.0.0.1:5000/storage/${localComment.user_avatar}` : profilePicture} 
            className="size-8 md:size-16 rounded-full ring-1 ring-inset ring-lght-blue object-cover" 
            alt="Profile" 
          />
          <div className="flex flex-col ml-3 md:ml-0 md:mt-2 md:text-center">
            <span className="text-lght-blue font-medium text-md2 md:text-base">{localComment.user}</span>
            <span className="text-xxs text-lighter-grey hidden md:block">{localComment.user_status || ""}</span>
            
            <div className="flex items-center gap-2 md:mt-1">
              {localComment.user_id === post_user_id && (
                <span className="text-green font-light text-xxs md:text-xs px-2 py-0.5 bg-green/10 rounded-full">Įrašo autorius</span>
              )}
            </div>
          </div>
        </div>
        
        {/* Comment Content - Right Side */}
        <div className="flex-1 mt-3 md:mt-0">
          {/* Comment Header */}
          <div className="flex justify-between items-center mb-2 text-xxs text-lighter-grey md:bg-dark/30 md:p-2 md:rounded-t-md">
            <div className="flex items-center gap-2">
              <span className="inline-block md:hidden">{localComment.user_status || "Studentas"}</span>
              <span className="inline-block text-medium text-lighter-grey text-md2">{localComment.date || localComment.created_at}</span>
              {localComment.parent_id && !replyingTo && (
                <span className="flex items-center">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-3 mr-1">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m16.49 12 3.75 3.75m0 0-3.75 3.75m3.75-3.75H3.74V4.499" />
                  </svg>
                  Atsakymas
                </span>
              )}
            </div>
            <span className="text-xxs">#{localComment.id}</span>
          </div>
          
          {/* Comment Content */}
          <div 
            className="text-sm text-white md:text-base min-h-[60px] md:bg-dark/20 md:p-4 md:rounded-b-md"
            dangerouslySetInnerHTML={{ __html: localComment.content || localComment.text }}
          />
      
          {/* Comment Actions Footer */}
          <div className="flex gap-4 text-xs text-lighter-grey border-t border-light-grey/20 pt-3 mt-4">
            <div 
              className={`flex items-center gap-1 cursor-pointer md:text-sm transition-colors duration-150 hover:bg-dark/30 p-1.5 rounded-md ${localComment.user_interaction === 'like' ? 'text-lght-blue bg-dark/20' : 'hover:text-lght-blue text-lighter-grey'}`}
              onClick={handleLike}
            >
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 md:size-5">
                <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06l-6.22-6.22V21a.75.75 0 0 1-1.5 0V4.81l-6.22 6.22a.75.75 0 1 1-1.06-1.06l7.5-7.5Z" clipRule="evenodd" />
              </svg>
              <span>{localComment.like_count || 0}</span>
            </div>
            <div 
              className={`flex items-center gap-1 cursor-pointer md:text-sm transition-colors duration-150 hover:bg-dark/30 p-1.5 rounded-md ${localComment.user_interaction === 'dislike' ? 'text-red bg-dark/20' : 'hover:text-red text-lighter-grey'}`}
              onClick={handleDislike}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="size-4 md:size-5 rotate-180">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.47 2.47a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06l-6.22-6.22V21a.75.75 0 0 1-1.5 0V4.81l-6.22 6.22a.75.75 0 1 1-1.06-1.06l7.5-7.5Z" />
              </svg>
              <span>{localComment.dislike_count || 0}</span>
            </div>
            <button 
              className="cursor-pointer hover:text-lght-blue md:text-sm transition-colors duration-150 flex items-center gap-1 hover:bg-dark/30 p-1.5 rounded-md" 
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
            <div className="mt-2 text-red text-sm bg-red/10 p-2 rounded-md">
              {error}
              <button className="ml-2 text-xs font-bold" onClick={() => setError(null)}>×</button>
            </div>
          )}

          {/* Reply form */}
          {isExpanded && (
            <div className="mt-3 mb-2 w-full bg-dark/30 p-3 rounded-md">
              <div className="ring-1 rounded-md ring-light-grey/50 overflow-hidden">
                <RichTextEditor 
                  value={newComment}
                  onChange={(content) => setComment(content)}
                  placeholder="Parašykite atsakymą..."
                />
              </div>
              
              <div className="flex justify-end mt-2 gap-2">
                <button
                  className="ring-1 ring-light-grey text-lighter-grey px-3 py-1 rounded-md text-sm hover:text-white hover:ring-white transition-colors duration-150"
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
        </div>
      </div>
    </div>
  );
};

export default Comment;
  