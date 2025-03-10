import React, { useState } from 'react';

export default function DiscussionList ({ listName, IconComponent, discussions }) {
  const [visibleCount, setVisibleCount] = useState(4);

  const showMore = () => {
    setVisibleCount(prevCount => prevCount + 2);
  };

  return (
    <div className="w-full mb-10 md:mb-28">
      <div className="flex flex-row mb-2 gap-2">
        <IconComponent />
        <p className="text-white font-light text-base">{listName}</p>
      </div>
      <div className="rounded-md p-2 flex items-center justify-center flex-col">
        {discussions.slice(0, visibleCount).map((discussion, index) => (
          <div
            key={index}
            className={`flex w-full justify-between gap-2 pt-2 p-2 pb-2 mb-3 pr-2 cursor-pointer hover:bg-grey hover:rounded-md transition-all duration-500 ease-in-out ${index >= visibleCount ? 'max-h-0 opacity-0' : 'max-h-full opacity-100'}`}
            style={{ overflow: 'hidden' }}
          >
            <div>
            <p className="text-white font-light text-base">{discussion.title}</p>
            <p className="text-light-grey font-medium text-sm">Įkelta {discussion.date}</p>
            </div>
            <div className="flex flex-row gap-1">
              <p className="flex gap-1 text-white">{discussion.comment_count}</p>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth="1.5"
                stroke="currentColor"
                className="size-6 text-white"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z"
                />
              </svg>
            </div>
          </div>
        ))}
        {visibleCount < discussions.length && (
          <div
            className="flex w-full justify-center border-t-2 border-t-grey p-1 pt-2 cursor-pointer"
            onClick={showMore}
          >
            <p className="text-white font-medium text-sm">Rodyti daugiau</p>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth="1.5"
              stroke="currentColor"
              className="size-6 text-white"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
};