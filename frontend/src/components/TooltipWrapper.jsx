import React, { useState } from 'react';

/**
 * Tooltip wrapper component that adds an animated tooltip to any element on hover
 * @param {ReactNode} children - The element to wrap with tooltip functionality
 * @param {string} content - Text content to display in the tooltip
 * @param {string} position - Position of the tooltip: 'top', 'bottom', 'left', 'right'
 * @param {string} bgColor - Background color of the tooltip (default: 'grey')
 * @param {string} textColor - Text color of the tooltip (default: 'white')
 * @param {number} width - Width of the tooltip in pixels (default: 250)
 */
const TooltipWrapper = ({ 
  children,
  content,
  position = 'top',
  bgColor = 'grey',
  textColor = 'white',
  width = 250
}) => {
  const [isVisible, setIsVisible] = useState(false);

  // Helper function to determine arrow positioning classes
  const getArrowClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-grey';
      case 'bottom':
        return 'top-0 left-1/2 transform -translate-x-1/2 -translate-y-full border-l-8 border-r-8 border-b-8 border-l-transparent border-r-transparent border-b-grey';
      case 'left':
        return 'right-0 top-1/2 transform translate-x-full -translate-y-1/2 border-t-8 border-b-8 border-l-8 border-t-transparent border-b-transparent border-l-grey';
      case 'right':
        return 'left-0 top-1/2 transform -translate-x-full -translate-y-1/2 border-t-8 border-b-8 border-r-8 border-t-transparent border-b-transparent border-r-grey';
      default:
        return 'bottom-0 left-1/2 transform -translate-x-1/2 translate-y-full border-l-8 border-r-8 border-t-8 border-l-transparent border-r-transparent border-t-grey';
    }
  };

  // Helper function to determine positioning classes for the tooltip
  const getPositionClasses = () => {
    switch (position) {
      case 'top':
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
      case 'bottom':
        return 'top-full left-1/2 transform -translate-x-1/2 mt-2';
      case 'left':
        return 'right-full top-1/2 transform -translate-y-1/2 mr-2';
      case 'right':
        return 'left-full top-1/2 transform -translate-y-1/2 ml-2';
      default:
        return 'bottom-full left-1/2 transform -translate-x-1/2 mb-2';
    }
  };

  // Determine the origin point for the animation based on position
  const getOriginClass = () => {
    switch (position) {
      case 'top': return 'origin-bottom';
      case 'bottom': return 'origin-top';
      case 'left': return 'origin-right';
      case 'right': return 'origin-left';
      default: return 'origin-bottom';
    }
  };

  return (
    <div className="relative inline-flex items-center justify-center">
      {/* Element that triggers the tooltip */}
      <div 
        className="cursor-pointer"
        onMouseEnter={() => setIsVisible(true)}
        onMouseLeave={() => setIsVisible(false)}
        onFocus={() => setIsVisible(true)}
        onBlur={() => setIsVisible(false)}
      >
        {children}
      </div>

      {/* Tooltip */}
      <div 
        className={`absolute z-10 ${getPositionClasses()} bg-${bgColor} text-${textColor} text-sm p-2 rounded-md shadow-lg transition-all duration-300 ease-in-out transform ${getOriginClass()} ${isVisible ? 'opacity-100 scale-100' : 'opacity-0 scale-95 pointer-events-none'}`}
        style={{ width: `${width}px` }}
        role="tooltip"
      >
        <div className="relative">
          <p className="text-sm break-words">{content}</p>
          {/* Arrow pointing to the wrapped element */}
          <div className={`absolute w-0 h-0 ${getArrowClasses()}`}></div>
        </div>
      </div>
    </div>
  );
};

export default TooltipWrapper; 