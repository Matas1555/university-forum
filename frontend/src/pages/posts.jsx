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
import { ForumAPI } from '../utils/API';

const discussions = [
    { title: 'Kokia jūsų patirtis programų sistemų modulyje? Įdomios paskaitos?', date: '2025-12-01', comment_count: 2 },
    { title: 'Ar VDU geriau negu KTU?', date: '2025-12-02', comment_count: 4 },
    { title: 'Kokia jūsų patirtis programų sistemų modulyje? Įdomios paskaitos?', date: '2025-12-01', comment_count: 2 },
    { title: 'Ar VDU geriau negu KTU?', date: '2025-12-02', comment_count: 4 },
    { title: 'Kokia jūsų patirtis programų sistemų modulyje? Įdomios paskaitos?', date: '2025-12-01', comment_count: 2 },
    { title: 'Ar VDU geriau negu KTU?', date: '2025-12-02', comment_count: 4 },
];

export const Posts = () => {
    const {user} = useStateContext();
    const location = useLocation();
    const navigate = useNavigate();
    const { pathname } = location;
    
    const locationState = location.state || {};
    const { forumType: stateForumType, forumId: stateForumId, forumName: stateForumName } = locationState;
    
    const [filtersClicked, setOpenFilters] = useState(false);
    const [sortClicked, setOpenSort] = useState(false);
    const [sortText, setSortText] = useState("Rikiuoti pagal");
    const [typeClicked, setOpenType] = useState(false);
    const [typeText, setTypeText] = useState("Rekomenduojami");
    const [activeSection, setActiveSection] = useState('recommended');
    const [currentView, setCurrentView] = useState('faculties');
    const [facultyForums, setFacultyForums] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [faculties, setFaculties] = useState([]);
    const [programs, setPrograms] = useState([]);
    const [posts, setPosts] = useState([]);
    const [discussions, setDiscussions] = useState([]);
    const [filterTag, setFilterTag] = useState('');
    const [filterType, setFilterType] = useState('');
    const [currentSort, setCurrentSort] = useState('Naujausios');
    const [facultiesView, setFacultiesView] = useState(true);
    const [programsView, setProgramsView] = useState(false);
    const [postsView, setPostsView] = useState(false);
    const [universityId, setUniversityId] = useState(null);
    const [facultyId, setFacultyId] = useState(null);
    const [programId, setProgramId] = useState(null);
    const [currentBreadcrumb, setCurrentBreadcrumb] = useState(null);
    const [currentForum, setCurrentForum] = useState(null);
    const [forumName, setForumName] = useState('');

    useEffect(() => {
        const path = location.pathname;
        const stateForumId = location.state?.forumId ;
        const stateForumName = location.state?.forumName;
        const stateFacultyId = location.state?.facultyId;
        
        let currentForumType = '';
        let currentForumId = '';
        let currentForumName = '';
        
        setFacultiesView(false);
        setProgramsView(false);
        setPostsView(false);
        
        if (stateFacultyId) {
            setFacultyId(stateFacultyId);
        }
        
        if (location.state?.programId) {
            setProgramId(location.state.programId);
        }
        
        if (location.state && location.state.breadcrumb) {
            setCurrentBreadcrumb(location.state.breadcrumb);
        } else {
            setCurrentBreadcrumb(null);
        }
        
        if (path.includes('/forumai/universitetai')) {
            const pathSegments = path.split('/');
            
            if (pathSegments.includes('universitetai') && pathSegments.length >= 4) {
                const uniId = pathSegments[pathSegments.indexOf('universitetai') + 1];
                setUniversityId(uniId);
                setFacultiesView(true);
                setCurrentView('faculties');
                currentForumType = 'university';
                currentForumId = uniId;
                currentForumName = stateForumName || 'Universitetas';
                
                fetchFacultyForums(uniId);
                
                fetchForumPosts('university', uniId);
            }
            
            if (pathSegments.includes('fakultetai') && pathSegments.length >= 6) {
                const uniId = pathSegments[pathSegments.indexOf('universitetai') + 1];
                const facId = pathSegments[pathSegments.indexOf('fakultetai') + 1];
                setUniversityId(uniId);
                setFacultyId(facId);
                setProgramsView(true);
                setCurrentView('programs');
                currentForumType = 'faculty';
                currentForumId = facId;
                currentForumName = stateForumName || 'Fakultetas';
                
                fetchProgramForums(facId);
                
                fetchForumPosts('faculty', facId);
            }
            
            if (pathSegments.includes('programos') && pathSegments.length >= 8) {
                const uniId = pathSegments[pathSegments.indexOf('universitetai') + 1];
                const facId = pathSegments[pathSegments.indexOf('fakultetai') + 1];
                const progId = pathSegments[pathSegments.indexOf('programos') + 1];
                setUniversityId(uniId);
                setFacultyId(facId);
                setProgramId(progId);
                setPostsView(true);
                setCurrentView('posts');
                currentForumType = 'program';
                currentForumId = progId;
                currentForumName = stateForumName || 'Programa';
                
                fetchForumPosts('program', progId);
            }
        } else if (pathname.includes('/forumai/')) {
            const match = pathname.match(/\/forumai\/([^\/]+)/);
            if (match) {
                setCurrentView('posts');
                currentForumType = 'forum';
                currentForumId = stateForumId || match[1];
                currentForumName = stateForumName || 'Forumas';
                setPostsView(true);
                
                fetchForumPosts('forum', currentForumId);
            }
        } else if (pathname.includes('/kategorijos/')) {
            const match = pathname.match(/\/kategorijos\/([^\/]+)/);
            if (match) {
                setCurrentView('posts');
                currentForumType = 'category';
                currentForumId = match[1];
                currentForumName = stateForumName || 'Kategorija';
                setPostsView(true);
                
                fetchForumPosts('category', currentForumId);
            }
        } else {
            setCurrentView('faculties');
            currentForumType = 'university';
            currentForumId = '1';
            currentForumName = 'Universitetas';
            setFacultiesView(true);
            
            fetchFacultyForums(1); 
            
            fetchForumPosts('university', 1);
        }
        

        setCurrentForum({
            type: currentForumType,
            id: currentForumId, 
            name: currentForumName
        });
    }, [location, pathname]);

    const fetchFacultyForums = async (universityId) => {
        try {
            setLoading(true);
            const response = await ForumAPI.getFacultyForums(universityId);
            
            if (response.data) {
                const facultiesData = response.data.map(forum => ({
                    id: forum.id,
                    name: forum.title || forum.entity_name || 'Unknown Faculty',
                    postCount: forum.post_count || 0,
                    entity_id: forum.entity_id
                }));
                
                setFaculties(facultiesData);
            } else {
                setFaculties([]);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching faculty forums:", error);
            setError('Failed to load faculty forums');
            setLoading(false);
        }
    };

    const fetchProgramForums = async (facultyId) => {
        try {
            setLoading(true);
            const response = await ForumAPI.getProgramForums(facultyId);
            
            if (response.data) {
                const programsData = response.data.map(forum => ({
                    id: forum.id,
                    name: forum.title || forum.entity_name || 'Unknown Program',
                    postCount: forum.post_count || 0,
                    entity_id: forum.entity_id
                }));
                
                setPrograms(programsData);
            } else {
                setPrograms([]);
            }
            setLoading(false);
        } catch (error) {
            console.error("Error fetching program forums:", error);
            setError('Failed to load program forums');
            setLoading(false);
        }
    };

    const fetchForumPosts = async (entityType, entityId) => {
        try {
            setLoading(true);
            
            let response;
            
            if (entityType === 'university') {
                response = await ForumAPI.getUniversityPosts(entityId);
            } else if (entityType === 'faculty') {
                response = await ForumAPI.getFacultyPosts(entityId);
            } else if (entityType === 'program') {
                response = await ForumAPI.getProgramPosts(entityId);
            } else if (entityType === 'forum') {
                response = await ForumAPI.getForumPosts(entityId);
            } else {
                setError('Invalid entity type');
                setLoading(false);
                return;
            }
            
            if (response.data) {
                if (entityType === 'forum') {
                    setPosts(response.data.posts || []);
                    if (response.data.forum_name) {
                        setForumName(response.data.forum_name);
                    }
                    setDiscussions(response.data.posts.slice(0, 5) || []);
                } else {
                    setPosts(response.data || []);
                    setDiscussions(response.data.slice(0, 5) || []);
                }
            } else {
                setPosts([]);
                setDiscussions([]);
            }
            setError(null);
            setLoading(false);
        } catch (error) {
            console.error("Error fetching forum posts:", error);
            setError('Failed to load forum posts');
            setLoading(false);
            setPosts([]);
            setDiscussions([]);
        }
    };

    const renderFacultyIcon = (faculty) => {
        if (!faculty || !faculty.name) {
            return (
                <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
            );
        }

        const facultyIcons = {
            'informatikos': (
                <path strokeLinecap="round" strokeLinejoin="round" d="M9 17.25v1.007a3 3 0 0 1-.879 2.122L7.5 21h9l-.621-.621A3 3 0 0 1 15 18.257V17.25m6-12V15a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 15V5.25m18 0A2.25 2.25 0 0 0 18.75 3H5.25A2.25 2.25 0 0 0 3 5.25m18 0V12a2.25 2.25 0 0 1-2.25 2.25H5.25A2.25 2.25 0 0 1 3 12V5.25" />
            ),
            'ekonomikos': (
                <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 18.75a60.07 60.07 0 0 1 15.797 2.101c.727.198 1.453-.342 1.453-1.096V18.75M3.75 4.5v.75A.75.75 0 0 1 3 6h-.75m0 0v-.375c0-.621.504-1.125 1.125-1.125H20.25M2.25 6v9m18-10.5v.75c0 .414.336.75.75.75h.75m-1.5-1.5h.375c.621 0 1.125.504 1.125 1.125v9.75c0 .621-.504 1.125-1.125 1.125h-.375m1.5-1.5H21a.75.75 0 0 0-.75.75v.75m0 0H3.75m0 0h-.375a1.125 1.125 0 0 1-1.125-1.125V15m1.5 1.5v-.75A.75.75 0 0 0 3 15h-.75M15 10.5a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm3 0h.008v.008H18V10.5Zm-12 0h.008v.008H6V10.5Z" />
            ),
            'mechanikos': (
                <path strokeLinecap="round" strokeLinejoin="round" d="M21.75 6.75a4.5 4.5 0 0 1-4.884 4.484c-1.076-.091-2.264.071-2.95.904l-7.152 8.684a2.548 2.548 0 1 1-3.586-3.586l8.684-7.152c.833-.686.995-1.874.904-2.95a4.5 4.5 0 0 1 6.336-4.486l-3.276 3.276a3.004 3.004 0 0 0 2.25 2.25l3.276-3.276c.256.565.398 1.192.398 1.852Z" />
            ),
            'socialinių': (
                <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
            )
        };

        const facultyName = faculty.name.toLowerCase();
        for (const [key, icon] of Object.entries(facultyIcons)) {
            if (facultyName.includes(key)) {
                return icon;
            }
        }

        return (
            <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.436 60.436 0 00-.491 6.347A48.627 48.627 0 0112 20.904a48.627 48.627 0 018.232-4.41 60.46 60.46 0 00-.491-6.347m-15.482 0a50.57 50.57 0 00-2.658-.813A59.905 59.905 0 0112 3.493a59.902 59.902 0 0110.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.697 50.697 0 0112 13.489a50.702 50.702 0 017.74-3.342M6.75 15a.75.75 0 100-1.5.75.75 0 000 1.5zm0 0v-3.675A55.378 55.378 0 0112 8.443m-7.007 11.55A5.981 5.981 0 006.75 15.75v-1.5" />
        );
    };

    const renderProgramIcon = (program) => {
        if (!program || !program.name) {
            return (
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
            );
        }

        const programIcons = {
            'programų sistemos': (
                <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
            ),
            'dirbtinis intelektas': (
                <path strokeLinecap="round" strokeLinejoin="round" d="M9.75 3.104v5.714a2.25 2.25 0 0 1-.659 1.591L5 14.5M9.75 3.104c-.251.023-.501.05-.75.082m.75-.082a24.301 24.301 0 0 1 4.5 0m0 0v5.714c0 .597.237 1.17.659 1.591L19.8 15.3M14.25 3.104c.251.023.501.05.75.082M19.8 15.3l-1.57.393A9.065 9.065 0 0 1 12 15a9.065 9.065 0 0 1-6.23-.693L5 14.5m14.8.8 1.402 1.402c1.232 1.232.65 3.318-1.067 3.611A48.309 48.309 0 0 1 12 21c-2.773 0-5.491-.235-8.135-.687-1.718-.293-2.3-2.379-1.067-3.61L5 14.5" />
            ),
            'informatika': (
                <path strokeLinecap="round" strokeLinejoin="round" d="M6.429 9.75 2.25 12l4.179 2.25m0-4.5 5.571 3 5.571-3m-11.142 0L2.25 7.5 12 2.25l9.75 5.25-4.179 2.25m0 0L21.75 12l-4.179 2.25m0 0 4.179 2.25L12 21.75 2.25 16.5l4.179-2.25m11.142 0-5.571 3-5.571-3" />
            ),
            'ekonomika': (
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 6v12m-3-2.818.879.659c1.171.879 3.07.879 4.242 0 1.172-.879 1.172-2.303 0-3.182C13.536 12.219 12.768 12 12 12c-.725 0-1.45-.22-2.003-.659-1.106-.879-1.106-2.303 0-3.182s2.9-.879 4.006 0l.415.33M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" />
            ),
            'verslo': (
                <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 21h16.5M4.5 3h15M5.25 3v18m13.5-18v18M9 6.75h1.5m-1.5 3h1.5m-1.5 3h1.5m3-6H15m-1.5 3H15m-1.5 3H15M9 21v-3.375c0-.621.504-1.125 1.125-1.125h3.75c.621 0 1.125.504 1.125 1.125V21" />
            ),
            'mechanikos': (
                <path strokeLinecap="round" strokeLinejoin="round" d="M10.343 3.94c.09-.542.56-.94 1.11-.94h1.093c.55 0 1.02.398 1.11.94l.149.894c.07.424.384.764.78.93.398.164.855.142 1.205-.108l.737-.527a1.125 1.125 0 0 1 1.45.12l.773.774c.39.389.44 1.002.12 1.45l-.527.737c-.25.35-.272.806-.107 1.204.165.397.505.71.93.78l.893.15c.543.09.94.56.94 1.109v1.094c0 .55-.397 1.02-.94 1.11l-.893.149c-.425.07-.765.383-.93.78-.165.398-.143.854.107 1.204l.527.738c.32.447.269 1.06-.12 1.45l-.774.773a1.125 1.125 0 0 1-1.449.12l-.738-.527c-.35-.25-.806-.272-1.203-.107-.397.165-.71.505-.781.929l-.149.894c-.09.542-.56.94-1.11.94h-1.094c-.55 0-1.019-.398-1.11-.94l-.148-.894c-.071-.424-.384-.764-.781-.93-.398-.164-.854-.142-1.204.108l-.738.527c-.447.32-1.06.269-1.45-.12l-.773-.774a1.125 1.125 0 0 1-.12-1.45l.527-.737c.25-.35.273-.806.108-1.204-.165-.397-.505-.71-.93-.78l-.894-.15c-.542-.09-.94-.56-.94-1.109v-1.094c0-.55.398-1.02.94-1.11l.894-.149c.424-.07.765-.383.93-.78.165-.398.143-.854-.108-1.204l-.526-.738a1.125 1.125 0 0 1 .12-1.45l.773-.773a1.125 1.125 0 0 1 1.45-.12l.737.527c.35.25.807.272 1.204.107.397-.165.71-.505.78-.929l.15-.894Z" />
            )
        };

        const programName = program.name.toLowerCase();
        for (const [key, icon] of Object.entries(programIcons)) {
            if (programName.includes(key)) {
                return icon;
            }
        }

        return (
            <path strokeLinecap="round" strokeLinejoin="round" d="M14.25 9.75 16.5 12l-2.25 2.25m-4.5 0L7.5 12l2.25-2.25M6 20.25h12A2.25 2.25 0 0 0 20.25 18V6A2.25 2.25 0 0 0 18 3.75H6A2.25 2.25 0 0 0 3.75 6v12A2.25 2.25 0 0 0 6 20.25Z" />
        );
    };

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
        if (!facultyId) return [];
        return programs.filter(program => program.facultyId === parseInt(facultyId));
    };

    return (
        <div className="flex flex-col justify-center items-center mt-5">
        
            <div className="flex flex-row gap-5 justify-center mr-0 w-full">
                
                <div className="flex flex-col items-end w-11/12 lg:w-7/12">
                    {currentView === 'faculties' && (
                        <div className="w-full mb-6">
                            <h1 className="text-white font-bold text-xl mb-3 ml-2">Fakultetų forumai</h1>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 border-t-2 border-b-2 pt-4 pb-4 border-light-grey rounded-md px-1 mb-6 min-h-[200px]">
                                {loading ? (
                                    <div className="text-white text-center py-8 col-span-2 flex justify-center items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Loading...</span>
                                    </div>
                                ) : error ? (
                                    <div className="text-red-500 text-center py-8 col-span-2 flex justify-center items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                        </svg>
                                        {error}
                                    </div>
                                ) : (facultyForums.length > 0 || faculties.length > 0) ? (
                                    (facultyForums.length > 0 ? facultyForums : faculties).map((faculty) => (
                                        <div 
                                            key={faculty.id}
                                            className="bg-grey rounded-md animate-fade-in-up flex flex-row align-middle justify-between border-l-2 border-light-grey items-center hover:bg-dark cursor-pointer transition-colors transition: duration-150 ease-linear"
                                            onClick={() => {
                                                setFacultyId(faculty.id);
                                                
                                                let newBreadcrumb = [];
                                                
                                                const defaultPath = [
                                                    {
                                                        label: "Forumai",
                                                        path: "/forumai"
                                                    }
                                                ];
                                                
                                                if (currentBreadcrumb && currentBreadcrumb.length > 0) {
                                                    const universityItems = currentBreadcrumb.filter(item => 
                                                        item.path && item.path.includes('/universitetai/') && !item.path.includes('/fakultetai/'));
                                                    
                                                    if (universityItems.length > 0) {
                                                        const universityIndex = currentBreadcrumb.findIndex(item => item === universityItems[0]);
                                                        if (universityIndex !== -1) {
                                                            newBreadcrumb = [...currentBreadcrumb.slice(0, universityIndex + 1)];
                                                        } else {
                                                            newBreadcrumb = [...defaultPath, ...universityItems];
                                                        }
                                                    } else {
                                                        const forumaiItem = currentBreadcrumb.find(item => item.label === "Forumai");
                                                        if (forumaiItem) {
                                                            newBreadcrumb = [forumaiItem];
                                                        } else {
                                                            newBreadcrumb = defaultPath;
                                                        }
                                                    }
                                                } else {
                                                    newBreadcrumb = defaultPath;
                                                }
                                                
                                                const hasUniversity = newBreadcrumb.some(item => 
                                                    item.path && item.path.includes(`/universitetai/${location.state?.forumId}/`));
                                                
                                                if (!hasUniversity && location.state?.forumId) {
                                                    newBreadcrumb.push({
                                                        label: location.state?.forumName || "Universitetas", 
                                                        path: `/forumai/universitetai/${location.state?.forumId}/irasai`,
                                                        universityId: location.state?.forumId
                                                    });
                                                }
                                                
                                                newBreadcrumb.push({
                                                    label: faculty.name, 
                                                    path: `/forumai/universitetai/${location.state?.forumId}/fakultetai/${faculty.id}/irasai`,
                                                    universityId: location.state?.forumId,
                                                    facultyId: faculty.id 
                                                });
                                                
                                                
                                                navigate(`/forumai/universitetai/${location.state?.forumId}/fakultetai/${faculty.id}/irasai`, {
                                                    state: {
                                                        ...location.state,
                                                        forumName: faculty.name,
                                                        facultyId: faculty.id,
                                                        universityName: currentBreadcrumb?.find(item => 
                                                            item.path && item.path.includes('/universitetai/') && !item.path.includes('/fakultetai/'))?.label 
                                                            || location.state?.forumName,
                                                        breadcrumb: newBreadcrumb
                                                    }
                                                });
                                            }}
                                        >
                                            <div className="flex flex-row items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10 m-3 text-light-grey bg-dark p-2 rounded-md">
                                                    {renderFacultyIcon(faculty)}
                                                </svg>
                                                <p className="text-white text-sm font-medium">{faculty.name}</p>
                                            </div>
                                            <div className="m-3 text-end">
                                                <p className="text-white font-medium text-sm">{faculty.postCount}</p>
                                                <p className="text-light-grey font-medium">
                                                    {faculty.postCount === 1 
                                                    ? 'įrašas' 
                                                    : (faculty.postCount >= 2 && faculty.postCount <= 9) 
                                                        ? 'įrašai' 
                                                        : 'įrašų'}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-light-grey text-center py-12 col-span-2 flex flex-col justify-center items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                                        </svg>
                                        <p>Nerasta fakultetų duomenų</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}

                    {currentView === 'programs' && (
                        <div className="w-full mb-6">
                            <h1 className="text-white font-bold text-xl mb-3 ml-2">Studijų programų forumai</h1>
                            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 animate-fade-in-up border-t-2 border-b-2 pt-4 pb-4 border-light-grey rounded-md px-1 mb-6 min-h-[200px]">
                                {loading ? (
                                    <div className="text-white text-center py-8 col-span-2 flex justify-center items-center">
                                        <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                        </svg>
                                        <span>Loading...</span>
                                    </div>
                                ) : programs.length > 0 ? (
                                    programs.map((program) => (
                                        <div 
                                            key={program.id}
                                            className="bg-grey rounded-md flex flex-row align-middle justify-between border-l-2 border-light-grey items-center hover:bg-dark cursor-pointer transition-colors transition: duration-150 ease-linear"
                                            onClick={() => {
                                                setProgramId(program.id);
                                                let newBreadcrumb = [];
                                                const defaultPath = [
                                                    {
                                                        label: "Forumai",
                                                        path: "/forumai"
                                                    }
                                                ];
                                                
                                                if (currentBreadcrumb && currentBreadcrumb.length > 0) {
                                                    const universityItem = currentBreadcrumb.find(item => 
                                                        item.path && item.path.includes('/universitetai/') && !item.path.includes('/fakultetai/'));
                                                        
                                                    const facultyItem = currentBreadcrumb.find(item => 
                                                        item.path && item.path.includes('/fakultetai/') && !item.path.includes('/programos/'));
                                                    
                                                    if (universityItem && facultyItem) {
                                                        const facultyIndex = currentBreadcrumb.findIndex(item => item === facultyItem);
                                                        if (facultyIndex !== -1) {
                                                            newBreadcrumb = [...currentBreadcrumb.slice(0, facultyIndex + 1)];
                                                        } else {
                                                            newBreadcrumb = [...defaultPath, universityItem, facultyItem];
                                                        }
                                                    } else if (universityItem) {
                                                        const universityIndex = currentBreadcrumb.findIndex(item => item === universityItem);
                                                        if (universityIndex !== -1) {
                                                            newBreadcrumb = [...currentBreadcrumb.slice(0, universityIndex + 1)];
                                                        } else {
                                                            newBreadcrumb = [...defaultPath, universityItem];
                                                        }
                                                    } else {
                                                        const forumaiItem = currentBreadcrumb.find(item => item.label === "Forumai");
                                                        if (forumaiItem) {
                                                            newBreadcrumb = [forumaiItem];
                                                        } else {
                                                            newBreadcrumb = defaultPath;
                                                        }
                                                    }
                                                } else {
                                                    newBreadcrumb = defaultPath;
                                                }
                                                
                                                const hasUniversity = newBreadcrumb.some(item => 
                                                    item.path && item.path.includes(`/universitetai/${location.state?.forumId}/`));
                                                
                                                if (!hasUniversity && location.state?.forumId) {
                                                    newBreadcrumb.push({
                                                        label: location.state?.universityName || "Universitetas", 
                                                        path: `/forumai/universitetai/${location.state?.forumId}/irasai`,
                                                        universityId: location.state?.forumId
                                                    });
                                                }
                                                
                                                const hasFaculty = newBreadcrumb.some(item => 
                                                    item.path && item.path.includes(`/fakultetai/${facultyId}/`));
                                                
                                                if (!hasFaculty && facultyId) {
                                                    newBreadcrumb.push({
                                                        label: location.state?.facultyName || "Fakultetas", 
                                                        path: `/forumai/universitetai/${location.state?.forumId}/fakultetai/${facultyId}/irasai`,
                                                        universityId: location.state?.forumId,
                                                        facultyId: facultyId
                                                    });
                                                }
                                                
                                                newBreadcrumb.push({
                                                    label: program.name, 
                                                    path: `/forumai/universitetai/${location.state?.forumId}/fakultetai/${facultyId}/programos/${program.id}/irasai`,
                                                    universityId: location.state?.forumId,
                                                    facultyId: facultyId,
                                                    programId: program.id
                                                });
                                                
                                                navigate(`/forumai/universitetai/${location.state?.forumId}/fakultetai/${facultyId}/programos/${program.id}/irasai`, {
                                                    state: {
                                                        ...location.state,
                                                        forumName: program.name,
                                                        programId: program.id,
                                                        facultyName: currentBreadcrumb?.find(item => 
                                                            item.path && item.path.includes('/fakultetai/') && !item.path.includes('/programos/'))?.label
                                                            || location.state?.facultyName,
                                                        breadcrumb: newBreadcrumb
                                                    }
                                                });
                                            }}
                                        >
                                            <div className="flex flex-row items-center">
                                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-10 m-3 text-light-grey bg-dark p-2 rounded-md">
                                                    {renderProgramIcon(program)}
                                                </svg>
                                                <p className="text-white text-sm font-medium">{program.name}</p>
                                            </div>
                                            <div className="m-3 text-end">
                                                <p className="text-white font-medium text-sm">{program.postCount}</p>
                                                <p className="text-light-grey font-medium">
                                                    {program.postCount === 1 
                                                    ? 'įrašas' 
                                                    : (program.postCount >= 2 && program.postCount <= 9) 
                                                        ? 'įrašai' 
                                                        : 'įrašų'}
                                                </p>
                                            </div>
                                        </div>
                                    ))
                                ) : (
                                    <div className="text-light-grey text-center py-12 col-span-2 flex flex-col justify-center items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 mb-3" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                                        </svg>
                                        <p>Nerasta studijų programų</p>
                                    </div>
                                )}
                            </div>
                        </div>
                    )}
                    

                    <div className="w-full mt-4 mb-16 bg-grey rounded-md p-4 min-h-[100px]">
                        <h1 className="text-white font-bold text-xl mb-3 mt-3 ml-2">
                            {currentBreadcrumb && currentBreadcrumb.length > 0 
                                ? currentBreadcrumb[currentBreadcrumb.length - 1].label 
                                : currentForum?.name || forumName || "Forumai"}
                        </h1>
                        <div className="border-light-grey"></div>
                    </div>

                    {/* Render the breadcrumb if available */}
                    {currentBreadcrumb && (
                        <div className="w-full">
                            <Breadcrumb items={currentBreadcrumb} />
                        </div>
                    )}

                    <div className="flex flex-row justify-between p-2 text-sm font-medium w-full">
                        <FilterComponent />
                        </div>
                    
                    <div className="w-full min-h-[300px]">
                        {loading ? (
                            <div className="text-white text-center py-16 flex justify-center items-center">
                                <svg className="animate-spin -ml-1 mr-3 h-8 w-8 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                                    </svg>
                                <span>Loading...</span>
                            </div>
                        ) : posts.length > 0 ? (
                            <PostList posts={posts} />
                        ) : (
                            <div className="text-light-grey text-center py-16 flex flex-col justify-center items-center bg-grey rounded-md">
                                <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z" />
                                    </svg>
                                <p className="text-xl mb-2">Nerasta įrašų</p>
                                <p>Šiame forume dar nėra įrašų</p>
                            </div>
                        )}
                    </div>
                </div>
                <div className="w-2/12 hidden sticky top-0 lg:block md:w-3/12 min-h-[600px]">
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