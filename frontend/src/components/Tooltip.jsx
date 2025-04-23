import React, { useState } from 'react';

/**
 * Tooltip component that displays information on hover with smooth animation
 * @param {string} content - Text content to display in the tooltip
 * @param {string} position - Position of the tooltip relative to the icon: 'top', 'bottom', 'left', 'right'
 * @param {string} iconColor - Color of the information icon (default: 'white')
 * @param {string} bgColor - Background color of the tooltip (default: 'grey')
 * @param {string} textColor - Text color of the tooltip (default: 'white')
 * @param {number} width - Width of the tooltip in pixels (default: 250)
 */
const Tooltip = ({ 
  content,
  position = 'top',
  iconColor = 'white',
  bgColor = 'white',
  textColor = 'dark',
  width = 250
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Helper function to determine arrow positioning classes
  const getArrowClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white';
      case 'bottom':
        return 'top-0 left-1/2 transform -translate-x-1/2 -translate-y-[200%] border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-white';
      case 'left':
        return 'right-0 top-1/2 transform translate-x-full -translate-y-1/2 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-white';
      case 'right':
        return 'left-0 top-1/2 transform -translate-x-full -translate-y-1/2 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-white';
      default:
        return 'bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-white';
    }
  };

  // Helper function to determine positioning classes for the tooltip
  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-4';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-4';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-4';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-4';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-4';
    }
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Information Icon */}
      <div 
        className="cursor-pointer"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
      >
        <svg 
          xmlns="http://www.w3.org/2000/svg"
          viewBox="0 0 24 24"
          fill="currentColor"
          className={`size-5 text-${iconColor}`}
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm8.706-1.442c1.146-.573 2.437.463 2.126 1.706l-.709 2.836.042-.02a.75.75 0 01.67 1.34l-.04.022c-1.147.573-2.438-.463-2.127-1.706l.71-2.836-.042.02a.75.75 0 11-.671-1.34l.041-.022zM12 9a.75.75 0 100-1.5.75.75 0 000 1.5z"
            clipRule="evenodd"
          />
        </svg>
      </div>

      {/* Tooltip */}
      <div 
        className={`absolute z-[100] ${getPositionClasses()} bg-${bgColor} text-${textColor} backdrop-blur-sm text-sm p-2 rounded-md shadow-lg transition-all duration-300 ease-in-out transform origin-${position === 'bottom' ? 'top' : position === 'top' ? 'bottom' : position === 'left' ? 'right' : 'left'} ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
        style={{ width: `${width}px` }}
        role="tooltip"
      >
        <div className="relative">
          <p className="text-sm break-words">{content}</p>
          {/* Arrow pointing to the icon */}
          <div className={`absolute w-0 h-0 ${getArrowClasses()}`}></div>
        </div>
      </div>
    </div>
  );
};

export default Tooltip; 