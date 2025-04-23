import React from 'react';

const StarRating = ({ rating = 0, width = 4,  color='light-grey'}) => {
  // Convert rating to a number and default to 0 if it's null, undefined, or not a valid number
  const validRating = isNaN(Number(rating)) ? 0 : Number(rating);
  
  const roundedRating = Math.round(validRating);
  let textSize = "md";

  if (width > 5) {
    textSize = "4xl";
  }
  
  return (
    <div className="flex items-center">
      {[...Array(5)].map((_, index) => (
        <svg 
          key={index} 
          xmlns="http://www.w3.org/2000/svg" 
          viewBox="0 0 24 24" 
          fill={index < roundedRating ? "currentColor" : "#687682"}
          stroke="currentColor"
          strokeWidth={1.5}
          className={`w-${width} h-${width} ${index < roundedRating ? 'text-yellow' : `text-light-grey`}`}
        >
          <path 
            fillRule="evenodd" 
            d="M10.788 3.21c.448-1.077 1.976-1.077 2.424 0l2.082 5.006 5.404.434c1.164.093 1.636 1.545.749 2.305l-4.117 3.527 1.257 5.273c.271 1.136-.964 2.033-1.96 1.425L12 18.354 7.373 21.18c-.996.608-2.231-.29-1.96-1.425l1.257-5.273-4.117-3.527c-.887-.76-.415-2.212.749-2.305l5.404-.434 2.082-5.005Z" 
            clipRule="evenodd" 
          />
        </svg>
      ))}
      {validRating > 0 && (
        <span className={`ml-2 text-${color} text-${textSize}`}>
          {validRating.toFixed(1)}
        </span>
      )}
    </div>
  );
};

export default StarRating;