import React from 'react';
import { Link } from 'react-router-dom';

const Breadcrumb = ({ items }) => {
  return (
    <nav className="flex py-4" aria-label="Breadcrumb">
      <ol className="flex flex-wrap items-center space-x-1 md:space-x-2">
        <li className="inline-flex items-center">
          <Link 
            to="/pagrindinis" 
            className="inline-flex items-center text-sm font-medium text-lght-blue hover:text-white"
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 mr-2">
              <path d="M11.47 3.84a.75.75 0 011.06 0l8.69 8.69a.75.75 0 101.06-1.06l-8.689-8.69a2.25 2.25 0 00-3.182 0l-8.69 8.69a.75.75 0 001.061 1.06l8.69-8.69z" />
              <path d="M12 5.432l8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 01-.75-.75v-4.5a.75.75 0 00-.75-.75h-3a.75.75 0 00-.75.75V21a.75.75 0 01-.75.75H5.625a1.875 1.875 0 01-1.875-1.875v-6.198c.031-.028.062-.056.091-.086L12 5.43z" />
            </svg>
            Pagrindinis
          </Link>
        </li>
        
        {items.map((item, index) => (
          <li key={index}>
            <div className="flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-light-grey">
                <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 010 1.06l-7.5 7.5a.75.75 0 01-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 011.06-1.06l7.5 7.5z" clipRule="evenodd" />
              </svg>
              {index === items.length - 1 ? (
                <span className="ml-1 text-sm font-medium text-white md:ml-2">{item.label}</span>
              ) : (
                <Link 
                  to={item.path} 
                  className="ml-1 text-sm font-medium text-lght-blue hover:text-white md:ml-2"
                >
                  {item.label}
                </Link>
              )}
            </div>
          </li>
        ))}
      </ol>
    </nav>
  );
};

export default Breadcrumb;