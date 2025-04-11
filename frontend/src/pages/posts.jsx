import React, {useState} from "react";
import { useStateContext } from "../context/contextProvider";
import API from "../utils/API";
import profilePic from "../assets/profile-default-icon.png";
import DiscussionList from "../components/lists/discussionList";
import { PopularIcon } from "../components/icons";
import PostList from "../components/lists/postList";
import { useLocation } from "react-router-dom";
import Breadcrumb from "../components/navigation/breadcrumb";

const posts = [
    {
        title: "GGGGGGGGGGGGGGGGGGG",
        content: "Lorem ipsum dolor sit amet, consectetur adipiscing elit. Etiam non sagittis sapien. Sed a nunc magna. Proin pellentesque odio justo, vitae fringilla nunc porta sed. Fusce vitae magna ligula. Phasellus ac elit eget est accumsan pulvinar. Vestibulum scelerisque, augue at varius euismod, massa dui pretium odio, nec egestas erat erat in elit. Donec scelerisque iaculis sodales. Fusce nec lacus efficitur, egestas dui eu, pharetra urna. Praesent id ipsum augue.Aenean nec consequat justo. Praesent massa arcu, tincidunt ac fringilla nec, rutrum ac enim. Pellentesque habitant morbi tristique senectus et netus et malesuada fames ac turpis egestas. Nullam aliquet metus at malesuada eleifend. Praesent mauris ipsum, venenatis quis eros ut, volutpat venenatis turpis. Fusce pellentesque enim sit amet augue luctus, sed sagittis ante ornare. Phasell",
        date: "Įkelta prieš 5 valandas",
        user: "test_user1",
        like_count: 2,
        comment_count: 2,
        categories: ["Bendros diskusijos", "Kursų apžvalgos", "Socialinis gyvenimas ir renginiai"],
        comments: [
            {
                user: "kitas_vartotojas2245",
                content: "Tai yra atsakymas i komentara",
                like_count: 2,
                comment_count: 2,
                date: "prieš 4 valandas",
                comments: [
                    {
                        user: "zmogus_antras5468",
                        content: "Tai yra atsakymas i aukščiau esantį komentarą",
                        like_count: 2,
                        comment_count: 2,
                        date: "prieš 3 valandas",
                        comments: [
                        {
                            user: "paskutinis_vartotojas",
                            content: "Tai yra trečiasis lygis",
                            like_count: 1,
                            comment_count: 0,
                            date: "prieš 2 valandas",
                            comments: []
                        }
                        ]
                    },
                    {
                        user: "zmogus_antras5468",
                        content: "Tai yra atsakymas i aukščiau esantį komentarą",
                        like_count: 2,
                        comment_count: 2,
                        date: "prieš 3 valandas",
                        comments: [
                        {
                            user: "paskutinis_vartotojas",
                            content: "Tai yra trečiasis lygis",
                            like_count: 1,
                            comment_count: 0,
                            date: "prieš 2 valandas",
                            comments: []
                        }
                        ]
                    }
                ]
            }
        ]
    },
    {
        title: "GGGGGGGGGGGGGGGGGGG",
        content: "Lorem ipsum...",
        date: "Įkelta prieš 5 valandas",
        user: "test_user1",
        like_count: 2,
        comment_count: 2,
        categories: ["Bendros diskusijos", "Kursų apžvalgos", "Socialinis gyvenimas ir renginiai"],
        comments: [
        {
            user: "kitas_vartotojas2245",
            content: "Tai yra atsakymas i komentara",
            like_count: 2,
            comment_count: 2,
            date: "prieš 4 valandas",
            comments: [
            {
                user: "zmogus_antras5468",
                content: "Tai yra atsakymas i aukščiau esantį komentarą",
                like_count: 2,
                comment_count: 2,
                date: "prieš 3 valandas",
                comments: [
                {
                    user: "paskutinis_vartotojas",
                    content: "Tai yra trečiasis lygis",
                    like_count: 1,
                    comment_count: 0,
                    date: "prieš 2 valandas",
                    comments: []
                }
                ]
            }
            ]
        }
        ]
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
    const location = useLocation();
    
    // Extract forum context from navigation state if available
    const { forumType, forumId, forumName, breadcrumb } = location.state || {};
    
    const [filtersClicked, setOpenFilters] = useState(false);
    const [sortClicked, setOpenSort] = useState(false);
    const [sortText, setSortText] = useState("Rikiuoti pagal");
    const [typeClicked, setOpenType] = useState(false);
    const [typeText, setTypeText] = useState("Rekomenduojami");
    const [activeSection, setActiveSection] = useState('recommended');

    const showRecommended = () => setActiveSection('recommended');
    const showPopular = () => setActiveSection('popular');
    const showNew = () => setActiveSection('new');
    
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

    const handleTypeClick = () => {
        setOpenType(!typeClicked);
    };

    const handleTypeOptionClick = (text) => {
        setTypeText(text);
        setOpenType(!typeClicked);
    };

    return (
        <div className="flex flex-col justify-center items-center mt-5">
        
            <div className="flex flex-row gap-5 justify-center mr-0">
                
                <div className="flex flex-col items-end w-11/12 lg:w-7/12">
                    {/* Render the breadcrumb if available */}
                    {breadcrumb && (
                        <div className="w-full ">
                            <Breadcrumb items={breadcrumb} />
                        </div>
                    )}
                    <div className="flex flex-row justify-between p-2 text-sm font-medium w-full">
                        <div className="hidden lg:flex lg:flex-row gap-2">
                            <button 
                                className={`px-2 py-2 ring-1 ring-light-grey bg-grey text-white rounded-md hover:ring-lght-blue hover:text-lght-blue transition-colors duration-100 ease-linear
                                ${activeSection === 'recommended' ? "ring-lght-blue text-lght-blue" : "text-white ring-light-grey"}`}
                                onClick={showRecommended}
                            >
                                Rekomenduojami
                            </button>
                            <button className="px-2 py-2 ring-1 ring-light-grey bg-grey text-white rounded-md hover:ring-lght-blue hover:text-lght-blue transition-colors duration-100 ease-linear">
                                Populiariausi
                            </button>
                            <button className="px-2 py-2 ring-1 ring-light-grey bg-grey text-white rounded-md hover:ring-lght-blue hover:text-lght-blue transition-colors duration-100 ease-linear">
                                Naujausi
                            </button>  
                        </div>
                        <div className="relative inline-block text-left lg:hidden">
                            <div className="mr-3">
                                <button 
                                    type="button" 
                                    className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-grey px-3 py-2 text-sm font-medium text-white ring-1 ring-light-grey ring-inset hover:bg-gray-50 focus:ring-lght-blue focus:text-lght-blue" 
                                    id="menu-button" 
                                    aria-expanded="true" 
                                    aria-haspopup="true" 
                                    onClick={handleTypeClick}
                                >
                                    {typeText}
                                    <svg className="-mr-1 size-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                        <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                            <div 
                                className={`absolute right-0 z-10 mt-2 mr-3 origin-top-right rounded-md bg-grey ring-1 shadow-lg ring-light-grey focus:outline-hidden ${
                                    typeClicked ? "" : "hidden"
                                }`} 
                                role="menu" 
                                aria-orientation="vertical" 
                                aria-labelledby="menu-button" 
                                tabIndex="-1"
                            >
                                <div className="" role="none">
                                    <a 
                                        href="#" 
                                        className="block px-4 py-2 text-sm text-white m-1 rounded-md ring-1 ring-grey hover:text-lght-blue hover:ring-lght-blue transition: duration-100 ease-linear" 
                                        role="menuitem" 
                                        tabIndex="-1" 
                                        id="menu-item-0" 
                                        onClick={() => handleTypeOptionClick("Rekomenduojami")}
                                    >
                                        Rekomenduojami
                                    </a>
                                    <a 
                                        href="#" 
                                        className="block px-4 py-2 text-sm text-white m-1 rounded-md ring-1 ring-grey hover:text-lght-blue hover:ring-lght-blue transition: duration-100 ease-linear" 
                                        role="menuitem" 
                                        tabIndex="-1" 
                                        id="menu-item-1" 
                                        onClick={() => handleTypeOptionClick("Populiarus")}
                                    >
                                        Populiarus
                                    </a>
                                    <a 
                                        href="#" 
                                        className="block px-4 py-2 text-sm text-white m-1 rounded-md ring-1 ring-grey hover:text-lght-blue hover:ring-lght-blue transition: duration-100 ease-linear" 
                                        role="menuitem" 
                                        tabIndex="-1" 
                                        id="menu-item-2" 
                                        onClick={() => handleTypeOptionClick("Nauji")}
                                    >
                                        Nauji
                                    </a>
                                </div>
                            </div>
                        </div>
                        <div className="relative inline-block text-left">
                            <div className="mr-3 md:text-xs">
                                <button 
                                    type="button" 
                                    className="inline-flex w-full justify-center gap-x-1.5 rounded-md bg-grey px-3 py-2 text-sm font-medium text-white ring-1 ring-light-grey ring-inset hover:bg-gray-50 focus:ring-lght-blue focus:text-lght-blue" 
                                    id="menu-button" 
                                    aria-expanded="true" 
                                    aria-haspopup="true" 
                                    onClick={handleSortClick}
                                >
                                    {sortText}
                                    <svg className="-mr-1 size-5 text-gray-400" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true" data-slot="icon">
                                        <path fillRule="evenodd" d="M5.22 8.22a.75.75 0 0 1 1.06 0L10 11.94l3.72-3.72a.75.75 0 1 1 1.06 1.06l-4.25 4.25a.75.75 0 0 1-1.06 0L5.22 9.28a.75.75 0 0 1 0-1.06Z" clipRule="evenodd" />
                                    </svg>
                                </button>
                            </div>
                            <div 
                                className={`absolute right-0 z-10 mt-2 mr-3 origin-top-right rounded-md bg-grey ring-1 shadow-lg ring-light-grey focus:outline-hidden ${
                                    sortClicked ? "" : "hidden"
                                }`} 
                                role="menu" 
                                aria-orientation="vertical" 
                                aria-labelledby="menu-button" 
                                tabIndex="-1"
                            >
                                <div className="" role="none">
                                    <a 
                                        href="#" 
                                        className="block px-4 py-2 text-sm text-white m-1 rounded-md ring-1 ring-grey hover:text-lght-blue hover:ring-lght-blue transition: duration-100 ease-linear" 
                                        role="menuitem" 
                                        tabIndex="-1" 
                                        id="menu-item-0" 
                                        onClick={() => handleSortOptionClick("Likes")}
                                    >
                                        Likes
                                    </a>
                                    <a 
                                        href="#" 
                                        className="block px-4 py-2 text-sm text-white m-1 rounded-md ring-1 ring-grey hover:text-lght-blue hover:ring-lght-blue transition: duration-100 ease-linear" 
                                        role="menuitem" 
                                        tabIndex="-1" 
                                        id="menu-item-1" 
                                        onClick={() => handleSortOptionClick("Komentarus")}
                                    >
                                        Komentarus
                                    </a>
                                    <a 
                                        href="#" 
                                        className="block px-4 py-2 text-sm text-white m-1 rounded-md ring-1 ring-grey hover:text-lght-blue hover:ring-lght-blue transition: duration-100 ease-linear" 
                                        role="menuitem" 
                                        tabIndex="-1" 
                                        id="menu-item-2" 
                                        onClick={() => handleSortOptionClick("Data")}
                                    >
                                        Data
                                    </a>
                                </div>
                            </div>
                        </div>
                    </div>
                    <PostList posts={posts} />
                </div>
                <div className="w-2/12 hidden sticky top-0 lg:block md:w-3/12">
                    <DiscussionList
                        listName="Populiariausi įrašai"
                        IconComponent={PopularIcon}
                        discussions={discussions}
                    />
                </div>
            </div>
        </div>
    );
};

export default Posts;