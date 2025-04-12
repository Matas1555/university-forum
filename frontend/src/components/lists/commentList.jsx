import { useState, useEffect } from "react";
import RichTextEditor from "../richTextEditor/RichTextEditor";

const Comment = ({ comment, level = 1, replyingTo = null }) => {
  const maxLevel = 3;
  const [isMdScreen, setIsMdScreen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [newComment, setComment] = useState("");

  useEffect(() => {
    const handleResize = () => {
      setIsMdScreen(window.innerWidth >= 768); 
    };
    
    handleResize(); 
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Set indentation based on nesting level
  const marginLeft = isMdScreen
    ? Math.min(level * 20, 60) 
    : Math.min(level * 4, 12); 
  
  return (
    <div 
      className={`mt-3 mb-4 pt-3 pb-2 ${level > 1 ? 'border-l-2 border-light-grey/20' : ''}`}
      style={{ marginLeft: `${marginLeft}px` }}
    >
      {/* Reply indicator - only show for replies */}
      {level > 1 && replyingTo && (
        <div className="inline-flex flex-row items-center text-light-grey ml-3 mb-2 rounded-md px-2 py-0.5 bg-grey/30">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 mr-1">
            <path strokeLinecap="round" strokeLinejoin="round" d="m16.49 12 3.75 3.75m0 0-3.75 3.75m3.75-3.75H3.74V4.499" />
          </svg>
          <p className="text-xs">Atsakant į <span className="text-lght-blue font-medium">{replyingTo}</span></p>
        </div>
      )}

      {/* Comment header with user info */}
      <div className="flex flex-row items-center gap-2 ml-3">
        <img src="/assets/profile-default-icon.png" className="size-7 rounded-full ring-1 ring-inset ring-lght-blue" alt="Profile" />
        <div>
          <div className="text-sm md:text-base"><span className="text-lght-blue font-medium">{comment.user}</span></div>
          <div className="text-xs text-light-grey">{comment.date}</div>
        </div>
      </div>

      {/* Comment content */}
      <div className="text-sm text-white mt-2 mb-3 ml-3 md:text-base">
        {comment.content}
      </div>
  
      {/* Like & Reply Buttons */}
      <div className="flex gap-5 ml-3 text-xs text-light-grey border-t border-light-grey/20 pt-2">
        <div className="flex items-center gap-1 cursor-pointer hover:text-lght-blue md:text-sm transition-colors duration-150">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 md:size-5">
            <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06l-6.22-6.22V21a.75.75 0 0 1-1.5 0V4.81l-6.22 6.22a.75.75 0 1 1-1.06-1.06l7.5-7.5Z" clipRule="evenodd" />
          </svg>
          <span>{comment.like_count}</span>
        </div>
        <button 
          className="cursor-pointer hover:text-lght-blue md:text-sm transition-colors duration-150 flex items-center gap-1" 
          onClick={() => setIsExpanded(!isExpanded)}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-4 md:size-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 20.25c4.97 0 9-3.694 9-8.25s-4.03-8.25-9-8.25S3 7.444 3 12c0 2.104.859 4.023 2.273 5.48.432.447.74 1.04.586 1.641a4.483 4.483 0 0 1-.923 1.785A5.969 5.969 0 0 0 6 21c1.282 0 2.47-.402 3.445-1.087.81.22 1.668.337 2.555.337Z" />
          </svg>
          <span>Atsakyti</span>
        </button>
      </div>

      {/* Reply form */}
      {isExpanded && (
        <div className="mt-3 ml-3 mb-2 w-[95%]">
          <div className="ring-1 rounded-md ring-light-grey/50 overflow-hidden">
            <RichTextEditor 
              value={newComment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Parašykite komentarą..."
            />
          </div>
          
          <div className="flex justify-end mt-2 gap-2">
            <button
              className="ring-1 ring-light-grey text-light-grey px-3 py-1 rounded-md text-sm hover:text-white hover:ring-white transition-colors duration-150"
              onClick={() => setIsExpanded(false)}
            >
              Atšaukti
            </button>
            <button
              className="bg-lght-blue text-white px-3 py-1 rounded-md text-sm hover:bg-blue-600 transition-colors duration-150"
            >
              Komentuoti
            </button>
          </div>
        </div>
      )}
  
      {/* Nested comments */}
      {level < maxLevel && comment.comments && comment.comments.length > 0 && (
        <div className="mt-1">
          {comment.comments.map((childComment, index) => (
            <Comment 
              key={index} 
              comment={childComment} 
              level={level + 1} 
              replyingTo={comment.user} 
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default Comment;
  