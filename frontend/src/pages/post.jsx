import {React, useState} from "react";
import { useStateContext } from "../context/contextProvider";
import { useLocation } from "react-router-dom";
import API from "../utils/API";
import profilePicture from "../assets/profile-default-icon.png";
import Comment from "../components/lists/commentList";
import RichTextEditor from "../components/richTextEditor/RichTextEditor";

const categoryColors = {
    'Bendros diskusijos': { text: 'text-lght-blue', ring: 'ring-lght-blue' },
    'Kursų apžvalgos': { text: 'text-red', ring: 'ring-red' },
    'Socialinis gyvenimas ir renginiai': { text: 'text-orange', ring: 'ring-orange' },
  };

const Post = () => {
    const {user} = useStateContext();
    const location = useLocation();
    const post = location.state?.post; // Get post data from state
    const [isExpanded, setIsExpanded] = useState(false);
    const [comment, setComment] = useState("");

    if (!post) {
        return <p className="text-white text-center mt-10">No post found.</p>;
    }
    
    return (
        <>
        
            <div className="mb-10 w-4/5 m-auto">
                <div className="flex flex-row gap-2 mb-2 justify-center cursor-pointer text-xxxs sm:text-sm sm:justify-end"> {/**Categories */}
                    {post.categories.map((category, catIndex) => {
                        const { text, ring } = categoryColors[category] || {
                        text: 'text-light-grey',
                        ring: 'ring-light-grey',
                        };
                        return (
                        <div
                            key={catIndex}
                            className={`ring-1 ${ring} rounded-md p-1 px-2 ${text} mt-2`}
                        >
                            {category}
                        </div>
                        );
                    })}
                </div>
                <div className="w-full bg-grey text-white rounded-md p-4 h-1/2 m-auto"> {/**Post */}
                    <div className="flex flex-col gap-10" >
                        <div className="flex flex-col gap-4">
                            <div className="flex flex-row items-center justify-between gap-4">
                                <div className="flex flex-row gap-2 items-center">
                                    <img src={profilePicture} className="size-8 md:size-10"/>
                                    <div className="flex flex-col items-start justify-start gap-1">
                                        <span className="text-white text-xs font-medium md:text-base">{post.user}</span>
                                        <span className="text-xxs font-medium text-light-grey md:text-xs"> • {post.date}</span>
                                    </div>
                                </div>
                                <button className='p-0 text-light-grey hover:text-lght-blue'>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M6.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM12.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0ZM18.75 12a.75.75 0 1 1-1.5 0 .75.75 0 0 1 1.5 0Z" />
                                    </svg>
                                </button>
                            </div>
                            <div className="font-medium text-lg md:text-3xl">
                                {post.title}
                            </div>
                            <div className="text-sm mt-3 md:text-base font-light text-white">
                                {post.content}
                            </div>
                        </div>
                        
                        <div>
                            <div className="flex flex-row gap-2 mb-4 text-xs">
                                <div className="flex flex-row gap-1 items-center bg-grey rounded-md ring-1 ring-light-grey px-2 py-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-4">
                                        <path fillRule="evenodd" d="M11.47 2.47a.75.75 0 0 1 1.06 0l7.5 7.5a.75.75 0 1 1-1.06 1.06l-6.22-6.22V21a.75.75 0 0 1-1.5 0V4.81l-6.22 6.22a.75.75 0 1 1-1.06-1.06l7.5-7.5Z" clipRule="evenodd" />
                                    </svg>
                                    <p className="m-0 p-0 leading-none">{post.like_count}</p>
                                </div>
                                <div className="flex flex-row gap-1 items-center bg-grey rounded-md ring-1 ring-light-grey px-2 py-1">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-4 block">
                                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                    </svg>
                                    <p className="m-0 p-0 leading-none">{post.comment_count}</p>
                                </div>
                            </div>
                            <div className="flex flex-row items-center gap-2 w-full">
                            {isExpanded ? (
                              <div className="relative w-full">
                                <div className="ring-1 rounded-md ring-light-grey">
                                    <RichTextEditor 
                                    value={comment}
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
                                <input
                                className="bg-grey ring-1 ring-light-grey rounded-md p-3 w-full text-sm font:ring-lght-blue"
                                placeholder="Palikite komentarą"
                                value={comment}
                                onChange={(e) => setComment(e.target.value)}
                                onFocus={() => setIsExpanded(true)}
                                />
                            )}
                            </div>
                        </div>
                    </div>
                </div>
                <div className="mt-4">
                {post.comments && post.comments.length > 0 ? (
                    post.comments.map((comment, index) => <Comment key={index} comment={comment} level={1} />)
                    ) : (
                    <p className="text-light-grey text-sm">Nėra komentarų.</p>
                )}
                </div>

            </div>
        </>
    );
  };
  
  export default Post;