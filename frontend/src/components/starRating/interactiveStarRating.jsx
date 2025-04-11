import React, { useState } from 'react';

const InteractiveStarRating = ({ initialRating, width, onRatingChange }) => {
  const [rating, setRating] = useState(initialRating || 0);
  const [hoverRating, setHoverRating] = useState(0);
  let textSize = "md";

  if(width > 5) {
    textSize = "4xl";
  }
  
  const handleStarClick = (clickedRating) => {
    setRating(clickedRating);
    if (onRatingChange) {
      onRatingChange(clickedRating);
    }
  };

  const handleStarHover = (hoveredRating) => {
    setHoverRating(hoveredRating);
  };

  const handleMouseLeave = () => {
    setHoverRating(0);
  };
  
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => {
        const starValue = index + 1;
        return (
          <svg 
            key={index} 
            xmlns="http://www.w3.org/2000/svg" 
            viewBox="0 0 24 24" 
            fill={starValue <= (hoverRating || rating) ? "currentColor" : "#687682"}
            stroke="currentColor"
            strokeWidth={1.5}
            className={`w-${width} h-${width} ${starValue <= (hoverRating || rating) ? 'text-yellow' : 'text-light-grey'} cursor-pointer`}
            onClick={() => handleStarClick(starValue)}
            onMouseEnter={() => handleStarHover(starValue)}
            onMouseLeave={handleMouseLeave}
          >
            <path 
              fillRule="evenodd" 
              d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" 
              clipRule="evenodd" 
            />
          </svg>
        );
      })}
    </div>
  );
};

export default InteractiveStarRating; 