import React from 'react';
import { Link, useLocation } from 'react-router-dom';

const SubNavigation = ({ items }) => {
  const location = useLocation();
  
  return (
    <div className="flex flex-wrap gap-2 pb-4 mb-6 border-b border-light-grey">
      {items.map((item, index) => {
        const isActive = location.pathname === item.path;
        return (
          <Link
            key={index}
            to={item.path}
            className={`px-4 py-2 text-sm font-medium rounded-md transition-colors duration-150 ease-in-out
              ${isActive 
                ? 'bg-lght-blue text-white' 
                : 'bg-grey text-white hover:bg-dark'}`}
          >
            {item.icon && (
              <span className="mr-2">{item.icon}</span>
            )}
            {item.label}
          </Link>
        );
      })}
    </div>
  );
};

export default SubNavigation;