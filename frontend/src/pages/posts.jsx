import React, {useState, useEffect} from "react";
import { useStateContext } from "../context/contextProvider";
import API from "../utils/API";
import profilePic from "../assets/profile-default-icon.png";
import DiscussionList from "../components/lists/discussionList";
import { NewsIcon } from "../components/icons";
import PostList from "../components/lists/postList";
import { useLocation, useNavigate } from "react-router-dom";
import Breadcrumb from "../components/navigation/breadcrumb";
import FilterComponent from "../components/filter/FilterComponent";

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

const faculties = [
    {
        id: 1,
        name: "Informatikos fakultetas",
        postCount: 176,
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
        )
    },
    {
        id: 2,
        name: "Ekonomikos fakultetas",
        postCount: 125,
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
        )
    },
    {
        id: 3,
        name: "Mechanikos fakultetas",
        postCount: 89,
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z" />
        )
    },
    {
        id: 4,
        name: "Socialinių mokslų fakultetas",
        postCount: 142,
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
        )
    }
];

const programs = [
    {
        id: 1,
        facultyId: 1,
        name: "Programų sistemos",
        postCount: 87,
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
        )
    },
    {
        id: 2,
        facultyId: 1,
        name: "Dirbtinis intelektas",
        postCount: 42,
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
        )
    },
    {
        id: 3,
        facultyId: 1,
        name: "Informatika",
        postCount: 64,
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3" />
        )
    },
    {
        id: 4,
        facultyId: 2,
        name: "Ekonomika",
        postCount: 53,
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
        )
    },
    {
        id: 5,
        facultyId: 2,
        name: "Verslo vadyba",
        postCount: 41,
        icon: (
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
        )
    },
    {
        id: 6,
        facultyId: 3,
        name: "Mechanikos inžinerija",
        postCount: 37,
        icon: (
            <>
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
                <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0Z" />
            </>
        )
    }
];

const Posts = () => {
    const {user} = useStateContext();
    const location = useLocation();
    const navigate = useNavigate();
    
    // Extract forum context from navigation state if available
    const { forumType, forumId, forumName, breadcrumb, facultyId, programId } = location.state || {};
    
    const [filtersClicked, setOpenFilters] = useState(false);
    const [sortClicked, setOpenSort] = useState(false);
    const [sortText, setSortText] = useState("Rikiuoti pagal");
    const [typeClicked, setOpenType] = useState(false);
    const [typeText, setTypeText] = useState("Rekomenduojami");
    const [activeSection, setActiveSection] = useState('recommended');
    const [currentView, setCurrentView] = useState('faculties'); // 'faculties', 'programs', or 'posts'

    useEffect(() => {
        // Determine the current view based on URL and state
        const pathParts = location.pathname.split('/');
        if (pathParts.includes('fakultetai') && facultyId && !programId) {
            setCurrentView('programs');
        } else if (pathParts.includes('programos') || programId) {
            setCurrentView('posts');
        } else {
            setCurrentView('faculties');
        }

        // Ensure breadcrumb data is preserved when navigating
        if (location.state && location.state.breadcrumb) {
            // Store breadcrumb in sessionStorage to preserve during back navigation
            sessionStorage.setItem('currentBreadcrumb', JSON.stringify(location.state.breadcrumb));
        }
    }, [location, facultyId, programId]);

    // Retrieve stored breadcrumb data
    const storedBreadcrumb = JSON.parse(sessionStorage.getItem('currentBreadcrumb') || 'null');
    const currentBreadcrumb = breadcrumb || storedBreadcrumb;

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

    // Filter programs based on the faculty ID
    const getFacultyPrograms = () => {
        return programs.filter(program => program.facultyId === parseInt(facultyId));
    };

    return (
        <div className="flex flex-col justify-center items-center mt-5">
        
            <div className="flex flex-row gap-5 justify-center mr-0">
                
                <div className="flex flex-col items-end w-11/12 lg:w-7/12">
                    {currentView === 'faculties' && (
                        <div className="w-full mb-6">
                            <h1 className="text-white font-bold text-xl mb-3 ml-2">Fakultetai</h1>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 animate-fade-in-up border-t-2 border-b-2 pt-4 pb-4 border-light-grey rounded-md px-1 mb-6">
                                {faculties.map((faculty) => (
                                    <div 
                                        key={faculty.id}
                                        className="bg-grey rounded-md flex flex-row align-middle justify-between border-l-2 border-light-grey items-center hover:bg-dark cursor-pointer transition-colors transition: duration-150 ease-linear"
                                        onClick={() => navigate(`/forumai/universitetai/${location.state?.forumId}/fakultetai/${faculty.id}/irasai`, {
                                            state: {
                                                ...location.state,
                                                forumName: faculty.name,
                                                facultyId: faculty.id,
                                                breadcrumb: [
                                                    ...(breadcrumb || []).slice(0, -1),
                                                    { 
                                                        label: location.state?.forumName, 
                                                        path: `/forumai/universitetai/${location.state?.forumId}/irasai`,
                                                        universityId: location.state?.forumId
                                                    },
                                                    { 
                                                        label: faculty.name, 
                                                        path: `/forumai/universitetai/${location.state?.forumId}/fakultetai/${faculty.id}/irasai`,
                                                        universityId: location.state?.forumId,
                                                        facultyId: faculty.id 
                                                    }
                                                ]
                                            }
                                        })}
                                    >
                                        <div className="flex flex-row items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10 m-3 text-light-grey bg-dark p-2 rounded-md">
                                                {faculty.icon}
                                            </svg>
                                            <p className="text-white text-sm font-medium">{faculty.name}</p>
                                        </div>
                                        <div className="m-3">
                                            <p className="text-white font-medium text-sm">{faculty.postCount}</p>
                                            <p className="text-light-grey font-medium">Įrašų</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}

                    {currentView === 'programs' && (
                        <div className="w-full mb-6">
                            <h1 className="text-white font-bold text-xl mb-3 ml-2">Studijų programos</h1>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 animate-fade-in-up border-t-2 border-b-2 pt-4 pb-4 border-light-grey rounded-md px-1 mb-6">
                                {getFacultyPrograms().map((program) => (
                                    <div 
                                        key={program.id}
                                        className="bg-grey rounded-md flex flex-row align-middle justify-between border-l-2 border-light-grey items-center hover:bg-dark cursor-pointer transition-colors transition: duration-150 ease-linear"
                                        onClick={() => navigate(`/forumai/universitetai/${location.state?.forumId}/fakultetai/${facultyId}/programos/${program.id}/irasai`, {
                                            state: {
                                                ...location.state,
                                                forumName: program.name,
                                                programId: program.id,
                                                breadcrumb: [
                                                    ...(breadcrumb || []).slice(0, -1),
                                                    { 
                                                        label: breadcrumb.slice(-2)[0].label, 
                                                        path: `/forumai/universitetai/${location.state?.forumId}/irasai`,
                                                        universityId: location.state?.forumId
                                                    },
                                                    { 
                                                        label: breadcrumb.slice(-1)[0].label, 
                                                        path: `/forumai/universitetai/${location.state?.forumId}/fakultetai/${facultyId}/irasai`,
                                                        universityId: location.state?.forumId,
                                                        facultyId: facultyId
                                                    },
                                                    { 
                                                        label: program.name, 
                                                        path: `/forumai/universitetai/${location.state?.forumId}/fakultetai/${facultyId}/programos/${program.id}/irasai`,
                                                        universityId: location.state?.forumId,
                                                        facultyId: facultyId,
                                                        programId: program.id
                                                    }
                                                ]
                                            }
                                        })}
                                    >
                                        <div className="flex flex-row items-center">
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10 m-3 text-light-grey bg-dark p-2 rounded-md">
                                                {program.icon}
                                            </svg>
                                            <p className="text-white text-sm font-medium">{program.name}</p>
                                        </div>
                                        <div className="m-3">
                                            <p className="text-white font-medium text-sm">{program.postCount}</p>
                                            <p className="text-light-grey font-medium">Įrašų</p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                    

                    <div className="w-full mt-4 mb-16 bg-grey rounded-md p-4">
                        <h1 className="text-white font-bold text-xl mb-3 mt-3 ml-2">
                            {currentBreadcrumb && currentBreadcrumb.length > 0 
                                ? currentBreadcrumb[currentBreadcrumb.length - 1].label 
                                : forumName}
                        </h1>
                        <div className=" border-light-grey"></div>
                    </div>

                    {/* Render the breadcrumb if available */}
                    {currentBreadcrumb && (
                        <div className="w-full">
                            <Breadcrumb items={currentBreadcrumb} />
                        </div>
                    )}

                    <div className="flex flex-row justify-between p-2 text-sm font-medium w-full">
                        <FilterComponent></FilterComponent>
                    </div>
                    <PostList posts={posts} />
                </div>
                <div className="w-2/12 hidden sticky top-0 lg:block md:w-3/12">
                    <DiscussionList
                        listName="Naujausi įrašai"
                        IconComponent={NewsIcon}
                        discussions={discussions}
                    />
                </div>
            </div>
        </div>
    );
};

export default Posts;