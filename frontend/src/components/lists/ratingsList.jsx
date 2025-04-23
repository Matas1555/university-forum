import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import StarRating from '../starRating/starRating';
import { ChevronDownIcon } from '@heroicons/react/24/outline';

export default function RatingsList({ listName, IconComponent, discussions = [] }) {
  const [visibleCount, setVisibleCount] = useState(4);
  const navigate = useNavigate();

  const showMore = () => {
    setVisibleCount(prevCount => prevCount + 2);
  };

  const handleItemClick = (id) => {
    navigate(`/destytojai/${id}`);
  };

  // Ensure discussions is always an array
  const safeDiscussions = Array.isArray(discussions) ? discussions : [];

  return (
    <div className="w-full mb-10 md:mb-28">
      <div className="flex flex-row mb-2 gap-2">
        <IconComponent />
        <p className="text-white font-light text-base">{listName}</p>
      </div>
      <div className="rounded-md p-2 flex items-center justify-center flex-col">
        {safeDiscussions.length === 0 ? (
          <div className="text-center text-gray-500">
            No items to display
          </div>
        ) : (
          <>
            {safeDiscussions.slice(0, visibleCount).map((discussion, index) => (
              <div
                key={index}
                className={`flex w-full justify-between gap-2 pt-2 p-2 pb-2 mb-3 pr-2 cursor-pointer hover:bg-grey hover:rounded-md transition-all duration-500 ease-in-out ${index >= visibleCount ? 'max-h-0 opacity-0' : 'max-h-full opacity-100'}`}
                style={{ overflow: 'hidden' }}
                onClick={() => discussion.id && handleItemClick(discussion.id)}
              >
                <div className='flex flex-row gap-4'>
                  <p className='text-white font-bold '>{index+1}.</p>
                  <div>
                    <p className="text-white font-normal">{discussion.first}</p>
                    <p className="text-light-grey font-normal">{discussion.second}</p>
                  </div>
                </div>
                <div className="flex flex-col gap-1 items-end">
                  <p className="flex gap-1 text-white"><StarRating rating={discussion.rating} width={5} /></p>
                  <p className="text-light-grey font-normal">
                    {discussion.reviewCount}{' '}
                    {discussion.reviewCount === 1 
                      ? 'atsiliepimas' 
                      : (discussion.reviewCount >= 2 && discussion.reviewCount <= 9) 
                        ? 'atsiliepimai' 
                        : 'atsiliepimų'}
                  </p>
                </div>
              </div>
            ))}
            {visibleCount < safeDiscussions.length && (
              <div
                className="flex w-full justify-center border-t-2 border-t-grey p-1 pt-2 cursor-pointer"
                onClick={showMore}
              >
                <p className="text-white font-medium text-sm">Rodyti daugiau</p>
                <ChevronDownIcon className="w-4 h-4 ml-1" />
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
}