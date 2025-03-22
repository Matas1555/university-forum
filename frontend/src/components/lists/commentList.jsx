import { useState, useEffect } from "react";
import RichTextEditor from "../richTextEditor/RichTextEditor";

const Comment = ({ comment, level = 1, replyingTo = null }) => {
  const maxLevel = 3;
  const [isMdScreen, setIsMdScreen] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false);
  const [newComment, setComment] = useState("");

  // Detect screen width and update state
  useEffect(() => {
    const handleResize = () => {
      setIsMdScreen(window.innerWidth >= 768); // md breakpoint is 768px in Tailwind
    };
    
    handleResize(); // Run on mount
    window.addEventListener("resize", handleResize);
    
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Adjust indentation based on screen size
  const marginLeft = isMdScreen
    ? Math.min(level * 20, 60) // md and above: 30px per level (max 90px)
    : Math.min(level * 4, 12); // sm screens: 16px per level (max 48px)
  
    return (
      <div className={`bg-dark border-light-grey pl-5`}
      style={{ marginLeft: `${marginLeft}px` }}>
        {level > 1 && replyingTo && (
        <div className="inline-flex flex-row items-center text-light-grey -ml-4 mb-1 rounded-md p-1 pr-2 box-border">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-4">
            <path stroke-linecap="round" stroke-linejoin="round" d="m16.49 12 3.75 3.75m0 0-3.75 3.75m3.75-3.75H3.74V4.499" />
          </svg>
          <p className="text-xs ">Atsakant į {replyingTo}</p>
        </div>
        )}
        <div className="flex flex-row items-center gap-2">
          <img src="/assets/profile-default-icon.png" className="size-6 rounded-full md:size-10" alt="Profile" />
          <div className="text-xs text-light-grey md:text-base"><span className="text-light-blue">{comment.user}</span> • {comment.date}</div>
        </div>
        <p className="text-sm text-white mt-2 md:text-lg md:font-medium">{comment.content}</p>
  
        {/* Like & Reply Buttons */}
        <div className="flex gap-3 mt-2 text-xs text-light-grey">
          <div className="flex items-center gap-1 cursor-pointer hover:text-lght-blue md:text-lg">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4 md:size-6">
              <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06l-6.22-6.22V21a.75.75 0 0 1-1.5 0V4.81l-6.22 6.22a.75.75 0 1 1-1.06-1.06l7.5-7.5Z" clipRule="evenodd" />
            </svg>
            {comment.like_count}
          </div>
          <div className="cursor-pointer hover:text-lght-blue md:text-lg" onClick={() => setIsExpanded(true)}>Atsakyti</div>
        </div>
        <div className="flex flex-row items-center gap-2 w-full">
          {isExpanded ? (
              <div className="relative w-full mt-1">

              <div className="ring-1 rounded-md ring-light-grey">
                  <RichTextEditor 
                  value={newComment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Tekstas"
                  />
              </div>
            
              <button
                className="absolute bottom-3 right-2 bg-lght-blue text-white px-3 py-1 rounded-md text-sm hover:bg-dark-blue transition"
              >
                Komentuoti
              </button>
              <button
                className="absolute bottom-3 right-28 ring-1 ring-light-grey text-white px-3 py-1 rounded-md text-sm hover:bg-dark-blue transition"
                onClick={() => setIsExpanded(false)}
              >
                Atšaukti
              </button>
            </div>
          ) : (
              <></>
          )}
          </div>
  
        {/* Render Nested Comments (up to 3 levels) */}
        {level < maxLevel && comment.comments && comment.comments.length > 0 && (
          <div className="mt-2">
            {comment.comments.map((childComment, index) => (
              <Comment key={index} comment={childComment} level={level + 1} replyingTo={comment.user} />
            ))}
          </div>
        )}
      </div>
    );
  };
  export default Comment;
  