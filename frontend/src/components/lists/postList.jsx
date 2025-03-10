import React from 'react';
import { Navigate, useNavigate } from 'react-router-dom';

const categoryColors = {
  'Bendros diskusijos': { text: 'text-lght-blue', ring: 'ring-lght-blue' },
  'Kursų apžvalgos': { text: 'text-red', ring: 'ring-red' },
  'Socialinis gyvenimas ir renginiai': { text: 'text-orange', ring: 'ring-orange' },
};

const PostList = ({ posts }) => {
  const navigate = useNavigate();

  const handleOpenPost = (post) =>{
    navigate('/post', {state: { post } });
  }

  return (
    <div className="w-full" >
      {posts.map((post, index) => (
        <div key={index} className='cursor-pointer' onClick={() => handleOpenPost(post)}>
          <div className="group flex flex-col justify-between items-start gap-5 bg-grey rounded-md p-5 m-2 border-2 border-dark hover:bg-dark hover:border-light-grey transition-colors duration-150 ease-linear">
            <div className="flex flex-row gap-10 items-center w-full">
              <div className="flex flex-col gap-2 w-full">
                <div className="flex flex-row justify-between">
                  <button className='p-0 text-light-grey hover:text-lght-blue'>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                    </svg>
                  </button>
                  <div className="hidden flex-row gap-2 justify-end lg:flex text-xxs">
                    {post.categories.map((category, catIndex) => {
                        const { text, ring } = categoryColors[category] || {
                          text: 'text-light-grey',
                          ring: 'ring-light-grey',
                        };
                        return (
                          <div
                            key={catIndex}
                            className={`ring-1 ${ring} rounded-md p-1 px-2 ${text}`}
                          >
                            • {category}
                          </div>
                        );
                    })}
                  </div>
                </div>
                <h1 className="text-white font-medium">{post.title}</h1> 
                <p className="text-light-grey font-medium">
                  {post.content.length > 250
                    ? post.content.slice(0,250) + "..."
                    : post.content}
                </p>
                <p className="text-light-grey font-light italic text-xs">{post.date}</p>
              </div>
            </div>
            <div className="flex flex-row w-full gap-3 border-t-2 pt-4 group-hover:border-t-light-grey border-t-dark justify-between transition-colors duration-150 ease-linear">
              <div className="flex flex-row gap-8">
                <div className="flex flex-row gap-2 p-2 rounded-md text-white hover:bg-grey hover:text-lght-blue transition-colors duration-150 ease-linear">
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06l-6.22-6.22V21a.75.75 0 0 1-1.5 0V4.81l-6.22 6.22a.75.75 0 1 1-1.06-1.06l7.5-7.5Z" clipRule="evenodd" />
                  </svg>
                  <p className="flex gap-1">{post.like_count}</p>
                </div>
                <div className="flex flex-row gap-2 p-2 rounded-md text-white hover:bg-grey hover:text-lght-blue transition-colors duration-150 ease-linear">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                  </svg>
                  <p className="flex gap-1 ">{post.comment_count}</p>
                </div>
              </div>
              <div className="flex flex-row gap-2 p-2 rounded-md text-white hover:bg-grey hover:text-lght-blue transition-colors duration-150 ease-linear">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 ">
                  <path fillRule="evenodd" d="M15.75 4.5a3 3 0 1 1 .825 2.066l-8.421 4.679a3.002 3.002 0 0 1 0 1.51l8.421 4.679a3 3 0 1 1-.729 1.31l-8.421-4.678a3 3 0 1 1 0-4.132l8.421-4.679a3 3 0 0 1-.096-.755Z" clipRule="evenodd" />
                </svg>
                <p className="flex gap-1 ">Dalintis</p>
              </div>
            </div>
          </div>
          <div className="mt-8 mb-8 border-2 rounded-sm border-grey"></div>
        </div>
      ))}
    </div>
  );
};

export default PostList;
