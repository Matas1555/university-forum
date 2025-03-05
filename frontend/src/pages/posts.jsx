import React, {useState} from "react";
import { useStateContext } from "../context/contextProvider";
import API from "../utils/API";
import profilePic from "../assets/profile-default-icon.png";
import DiscussionList from "../components/lists/discussionList";
import { PopularIcon } from "../components/icons";
import PostList from "../components/lists/postList";

const posts = [
    {
      title: 'GGGGGGGGGGGGGGGGGGG',
      content: 'Lorem ipsum Lorwrgwsdvwsdvwvwevwevem ipsum Lorem ipssdvwsdvwvwevwevem ipsum Lorem ipssdvwsdvwvwevwevem ipsum Lorem ipssdvwsdvwvwevwevem ipsum Lorem ips sdvwsdvwvwevwevem ipsum Lorem ipsum Lorem ipsum',
      date: 'Įkelta prieš 5 valandas',
      like_count: 2,
      comment_count: 2,
    },
    {
        title: 'GGGGGGGGGGGGGGGGGGG',
        content: 'Lorem ipsum Lorwrgwsdvwsdvwvwevwevem ipsum Lorem ipssdvwsdvwvwevwevem ipsum Lorem ipssdvwsdvwvwevwevem ipsum Lorem ipssdvwsdvwvwevwevem ipsum Lorem ips sdvwsdvwvwevwevem ipsum Lorem ipsum Lorem ipsum',
        date: 'Įkelta prieš 5 valandas',
        like_count: 2,
        comment_count: 2,
    },
    {
        title: 'GGGGGGGGGGGGGGGGGGG',
        content: 'Lorem ipsum Lorwrgwsdvwsdvwvwevwevem ipsum Lorem ipssdvwsdvwvwevwevem ipsum Lorem ipssdvwsdvwvwevwevem ipsum Lorem ipssdvwsdvwvwevwevem ipsum Lorem ips sdvwsdvwvwevwevem ipsum Lorem ipsum Lorem ipsum',
        date: 'Įkelta prieš 5 valandas',
        like_count: 2,
        comment_count: 2,
    },
    {
        title: 'GGGGGGGGGGGGGGGGGGG',
        content: 'Lorem ipsum Lorwrgwsdvwsdvwvwevwevem ipsum Lorem ipssdvwsdvwvwevwevem ipsum Lorem ipssdvwsdvwvwevwevem ipsum Lorem ipssdvwsdvwvwevwevem ipsum Lorem ips sdvwsdvwvwevwevem ipsum Lorem ipsum Lorem ipsum',
        date: 'Įkelta prieš 5 valandas',
        like_count: 2,
        comment_count: 2,
    },
  ];

const discussions = [
    { title: 'Kokia jūsų patirtis programų sistemų modulyje? Įdomios paskaitos?', date: '2025-12-01', comment_count: 2 },
    { title: 'Ar VDU geriau negu KTU?', date: '2025-12-02', comment_count: 4 },
    { title: 'Kokia jūsų patirtis programų sistemų modulyje? Įdomios paskaitos?', date: '2025-12-01', comment_count: 2 },
    { title: 'Ar VDU geriau negu KTU?', date: '2025-12-02', comment_count: 4 },
    { title: 'Kokia jūsų patirtis programų sistemų modulyje? Įdomios paskaitos?', date: '2025-12-01', comment_count: 2 },
    { title: 'Ar VDU geriau negu KTU?', date: '2025-12-02', comment_count: 4 },
  ];

const Posts = () => {
    const {user} = useStateContext();
    const [filtersClicked, setOpenFilters] = useState(false);
    const [sortClicked, setOpenSort] = useState(false);
    const [sortText, setSortText] = useState("Rikiuoti pagal");

    const handleClick = () => {
        setOpenFilters(!filtersClicked);
    };

    const handleSortClick = () => {
        setOpenSort(!sortClicked);
    };

    const handleSortOptionClick = (text) => {
        setSortText(text);
        setOpenSort(!sortClicked);
    };

    return (
        <>
            <div className="mt-5 mb-10 w-7/12 flex flex-row m-auto"> {/* Search bar */}
                <button  className={`rounded-lg p-2 pl-4 pr-4 mr-2 hover:bg-lght-blue transition-colors transition: duration-150 ease-linear ${
                            filtersClicked ? "bg-lght-blue " : "bg-grey"
                        }`}
                onClick={handleClick}>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 text-white">
                    <path d="M6 12a.75.75 0 0 1-.75-.75v-7.5a.75.75 0 1 1 1.5 0v7.5A.75.75 0 0 1 6 12ZM18 12a.75.75 0 0 1-.75-.75v-7.5a.75.75 0 0 1 1.5 0v7.5A.75.75 0 0 1 18 12ZM6.75 20.25v-1.5a.75.75 0 0 0-1.5 0v1.5a.75.75 0 0 0 1.5 0ZM18.75 18.75v1.5a.75.75 0 0 1-1.5 0v-1.5a.75.75 0 0 1 1.5 0ZM12.75 5.25v-1.5a.75.75 0 0 0-1.5 0v1.5a.75.75 0 0 0 1.5 0ZM12 21a.75.75 0 0 1-.75-.75v-7.5a.75.75 0 0 1 1.5 0v7.5A.75.75 0 0 1 12 21ZM3.75 15a2.25 2.25 0 1 0 4.5 0 2.25 2.25 0 0 0-4.5 0ZM12 11.25a2.25 2.25 0 1 1 0-4.5 2.25 2.25 0 0 1 0 4.5ZM15.75 15a2.25 2.25 0 1 0 4.5 0 2.25 2.25 0 0 0-4.5 0Z" />
                </svg>
                </button>
                <input className="bg-grey text-white rounded-md p-4 pl-4 pr-4 text-xs w-full focus: border-blue focus:border-lght-blue" placeholder="Ieškokite per visus forumus..."/>
                <button className="bg-grey border-lght-blue border-2 rounded-lg p-2 pl-4 pr-4 ml-2 hover:bg-dark transition-colors transition: duration-150ease-linear">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="size-6 text-lght-blue">
                <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clip-rule="evenodd" />
                </svg>
                </button>
            </div>

            <div className="flex flex-row gap-5 justify-center m-8 mr-0">
                <div className="flex flex-col items-end w-7/12"> {/**Dropdown menu sort by */}
                    <div class="relative inline-block text-left">
                        <div className="mr-3">
                            <button type="button" class="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-grey px-3 py-2 text-sm font-medium text-white ring-1  ring-light-grey ring-inset hover:bg-gray-50 focus:ring-lght-blue focus:text-lght-blue" id="menu-button" aria-expanded="true" aria-haspopup="true" onClick={handleSortClick}>
                            {sortText}
                            <svg class="-mr-1 size-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                <path fill-rule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clip-rule="evenodd" />
                            </svg>
                            </button>
                        </div>
                        <div className={`absolute right-0 z-10 mt-2 mr-3  origin-top-right rounded-md bg-grey ring-1 shadow-lg ring-light-grey focus:outline-hidden ${
                                sortClicked ? " " : "hidden"
                                }`} 
                                role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabindex="-1">
                            <div class="" role="none">
                            <a href="#" class="block px-4 py-2 text-sm text-white m-1 rounded-md ring-1 ring-grey hover:text-lght-blue  hover:ring-lght-blue transition: duration-100 ease-linear" role="menuitem" tabindex="-1" id="menu-item-0" onClick={() => handleSortOptionClick("Likes")}>Likes</a>
                            <a href="#" class="block px-4 py-2 text-sm text-white m-1 rounded-md ring-1 ring-grey hover:text-lght-blue  hover:ring-lght-blue transition: duration-100 ease-linear" role="menuitem" tabindex="-1" id="menu-item-1" onClick={() => handleSortOptionClick("Komentarus")}>Komentarus</a>
                            <a href="#" class="block px-4 py-2 text-sm text-white m-1 rounded-md ring-1 ring-grey hover:text-lght-blue  hover:ring-lght-blue transition: duration-100 ease-linear" role="menuitem" tabindex="-1" id="menu-item-2" onClick={() => handleSortOptionClick("Data")}>Data</a>
                            </div>
                        </div>
                    </div>
                    <PostList posts={posts} />
                </div>
                <div className="w-2/12 hidden md:block">
                    <DiscussionList
                    listName="Populiariausi įrašai"
                    IconComponent={PopularIcon}
                    discussions={discussions}
                    />
                </div>
            </div>
            
        </>
    );
  };
  
  export default Posts;