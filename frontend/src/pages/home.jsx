import React, {useState, useEffect} from "react";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/react";
import { useNavigate } from 'react-router-dom';
import UniversityList from "../components/lists/universityList";
import PostList from "../components/lists/postList";
import DiscussionList from "../components/lists/discussionList";
import { ArchiveIcon, NewsIcon } from "../components/icons";
import KTUlogo from "../assets/KTU-logo.png";
import VDUlogo from "../assets/VDU-logo.png";
import VUlogo from "../assets/VU-logo.png";
import MRUlogo from "../assets/MRU-logo.png";
//import Campus from "../assets/campus.svg";
import Campus from "../assets/campus2.png";
import KTU from "../assets/KTU.jpg";
import VDU from "../assets/VDU.jpg";
import VU from "../assets/VU.jpg";
import StarRating from "../components/starRating/starRating";
import drawnArrow from "../assets/drawn_Arrow.png";
import PeopleTalking from "../assets/peopleTalking-removebg-preview.png";
import PersonRating from "../assets/ratingPerson.png";
import API from "../utils/API";
import { useStateContext } from "../context/contextProvider";

const Home = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('universitetai');
  const [loading, setLoading] = useState(false);
  const [contentVisible, setContentVisible] = useState(true);
  const [forums, setForums] = useState([]);
  const [forumsLoading, setForumsLoading] = useState(true);
  const { user, token } = useStateContext();
  
  const [userPosts, setUserPosts] = useState([]);
  const [latestPosts, setLatestPosts] = useState([]);
  const [userPostsLoading, setUserPostsLoading] = useState(false);
  const [latestPostsLoading, setLatestPostsLoading] = useState(false);
  
  const [initialLoading, setInitialLoading] = useState(false);
  const [fadeOut, setFadeOut] = useState(false);
  
  useEffect(() => {
    const hasVisitedBefore = localStorage.getItem('hasVisitedBefore');
    
    if (!hasVisitedBefore) {
      setInitialLoading(true);
      
      const fadeTimer = setTimeout(() => {
        setFadeOut(true);
      }, 1700);
      
      const hideTimer = setTimeout(() => {
        setInitialLoading(false);
        localStorage.setItem('hasVisitedBefore', 'true');
      }, 2000);
      
      return () => {
        clearTimeout(fadeTimer);
        clearTimeout(hideTimer);
      };
    }
  }, []);
  
  useEffect(() => {
    const fetchForums = async () => {
      try {
        setForumsLoading(true);
        const response = await API.get('/forums', {
          params: {
            entity_type: 'university'
          }
        });
        setForums(response.data);
      } catch (error) {
        console.error('Error fetching forums:', error);
      } finally {
        setForumsLoading(false);
      }
    };

    fetchForums();
    fetchLatestPosts();
    
    if (user && token) {
      fetchUserPosts();
    }
  }, [user, token]);
  
  // Fetch user's posts if user is logged in
  const fetchUserPosts = async () => {
    if (!user || !token) return;
    
    try {
      setUserPostsLoading(true);
      const response = await API.get('/posts', { 
        params: { user_id: user.id } 
      });
      
      // Format posts for discussion list
      const formattedPosts = response.data.map(post => ({
        id: post.id,
        title: post.title,
        created_at: formatDate(post.created_at),
        comments_count: post.comments_count || 0
      }));
      
      setUserPosts(formattedPosts);
    } catch (error) {
      console.error('Error fetching user posts:', error);
    } finally {
      setUserPostsLoading(false);
    }
  };
  
  // Fetch latest posts for everyone
  const fetchLatestPosts = async () => {
    try {
      setLatestPostsLoading(true);
      const response = await API.get('/posts', {
        params: {
          sort_by: 'created_at',
          sort_order: 'desc',
          limit: 15
        }
      });
      
      // Format posts for discussion list
      const formattedPosts = response.data.map(post => ({
        id: post.id,
        title: post.title,
        created_at: formatDate(post.created_at),
        comments_count: post.comments_count || 0
      }));
      
      setLatestPosts(formattedPosts);
    } catch (error) {
      console.error('Error fetching latest posts:', error);
    } finally {
      setLatestPostsLoading(false);
    }
  };
  
  // Format date for displaying
  const formatDate = (dateString) => {
    if (!dateString) return "";
    const date = new Date(dateString);
    return date.toLocaleDateString('lt-LT');
  };
  
  // Handle navigation to post page
  const handlePostClick = (postId) => {
    navigate(`/irasai/${postId}`, { 
      state: { 
        breadcrumb: [
          { label: 'Įrašai', path: '/irasai' },
          { label: 'Įrašas', path: `/irasai/${postId}` }
        ]
      } 
    });
    window.scrollTo(0, 0);
  };

  // For DiscussionList, add onClick to handle navigation
  const enhanceDiscussionsWithClick = (discussions) => {
    return discussions.map(discussion => ({
      ...discussion,
      onClick: () => handlePostClick(discussion.id)
    }));
  };

  const getUniversityLogo = (universityName) => {
    if (!universityName) {
      return { src: KTUlogo, className: "size-12 m-3 rounded-sm" };
    }
    
    if (universityName.includes('KTU') || universityName.includes('Kaun')) {
      return { src: KTUlogo, className: "size-12 m-3 rounded-sm" };
    } else if (universityName.includes('VDU') || universityName.includes('Vytaut')) {
      return { src: VDUlogo, className: "size-10 m-3 rounded-sm invert" };
    } else if (universityName.includes('VU') || universityName.includes('Vilnia')) {
      return { src: VUlogo, className: "size-10 m-3 rounded-sm invert" };
    } else if (universityName.includes('MRU') || universityName.includes('Mykol')) {
      return { src: MRUlogo, className: "size-6 w-20 m-3 rounded-sm" };
    } else {
      // Default logo
      return { src: KTUlogo, className: "size-12 m-3 rounded-sm" };
    }
  };
  
  const showUniversitetai = () => {
    if (activeSection !== 'universitetai') {
      setLoading(true);
      setContentVisible(false);
      setTimeout(() => {
        setActiveSection('universitetai');
        setLoading(false);
        setContentVisible(true);
      }, 1000);
    }
  };
  
  const showKategorijos = () => {
    if (activeSection !== 'kategorijos') {
      setLoading(true);
      setContentVisible(false);
      setTimeout(() => {
        setActiveSection('kategorijos');
        setLoading(false);
        setContentVisible(true);
      }, 1000);
    }
  };
  
  const handleOpenForum = (forumId, forumName, universityName, entityId) => {
    navigate(`/forumai/universitetai/${forumId}/irasai`, { 
      state: { 
        forumType: 'university',
        forumId: forumId, 
        forumName: forumName,
        entityType: 'university',
        entityId: entityId || forumId,
        breadcrumb: [
          { label: 'Forumai', path: '/forumai' },
          { label: 'Universitetai', path: '/pagrindinis' },
          { label: universityName || forumName, path: `/forumai/universitetai/${forumId}/irasai` }
        ]
      } 
    });
    window.scrollTo(0, 0);
  }

  const handleOpenUniversity = (universityId, universityName) => {
    navigate(`/forumai/universitetai/${universityId}`, { 
      state: { 
        forumType: 'university',
        forumId: universityId, 
        forumName: universityName,
        breadcrumb: [
          { label: 'Universitetai', path: '/pagrindinis' },
          { label: universityName, path: `/universitetai/${universityId}` }
        ]
      } 
    });
    window.scrollTo(0, 0);
  }


  return (
    <>
      {/* Initial loading overlay with fade-out animation */}
      {initialLoading && (
        <div className={`fixed inset-0 z-50 flex items-center justify-center bg-dark transition-opacity duration-300 ${fadeOut ? 'opacity-0' : 'opacity-100'}`}>
          <div className="flex flex-col items-center">
            <div className="relative">
              <div className="animate-spin rounded-full h-24 w-24 border-4 border-light-grey opacity-30"></div>
              <div className="animate-spin rounded-full h-24 w-24 border-t-4 border-lght-blue absolute top-0 left-0"></div>
            </div>
            <h2 className="text-white text-2xl font-semibold mt-8">UniForum</h2>
            <div className="flex space-x-2 mt-4">
              <div className="w-2 h-2 bg-lght-blue rounded-full animate-bounce" style={{ animationDelay: '0ms' }}></div>
              <div className="w-2 h-2 bg-lght-blue rounded-full animate-bounce" style={{ animationDelay: '150ms' }}></div>
              <div className="w-2 h-2 bg-lght-blue rounded-full animate-bounce" style={{ animationDelay: '300ms' }}></div>
            </div>
          </div>
        </div>
      )}
      
      <div className="w-full gap-10 mb-5 flex flex-col items-center md:flex-row-reverse md:p-8 md:items-start">
      <div className="w-3/4 md:w-3/12 md:gap-20">
        {user && token && (
          <>
            {userPostsLoading ? (
              <div className="mb-10 md:mb-28">
                <div className="flex flex-row mb-2 gap-2">
                  <ArchiveIcon />
                  <p className="text-white font-light text-base">Jūsų įrašai</p>
                </div>
                <div className="flex justify-center py-6">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-lght-blue"></div>
                </div>
              </div>
            ) : userPosts.length > 0 ? (
        <DiscussionList
        listName="Jūsų įrašai"
        IconComponent={ArchiveIcon}
                discussions={enhanceDiscussionsWithClick(userPosts)}
              />
            ) : (
              <div className="mb-10 md:mb-28">
                <div className="flex flex-row mb-2 gap-2">
                  <ArchiveIcon />
                  <p className="text-white font-light text-base">Jūsų įrašai</p>
                </div>
                <div className="rounded-md p-4 border border-light-grey/30 text-center">
                  <p className="text-light-grey">Jūs dar nesukūrėte įrašų.</p>
                  <button 
                    onClick={() => navigate('/kurti-irasa')} 
                    className="mt-4 bg-lght-blue hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors"
                  >
                    Sukurti naują įrašą
                  </button>
                </div>
              </div>
            )}
          </>
        )}
        
        {latestPostsLoading ? (
          <div className="mb-10 md:mb-28">
            <div className="flex flex-row mb-2 gap-2">
              <NewsIcon />
              <p className="text-white font-light text-base">Naujausi įrašai</p>
            </div>
            <div className="flex justify-center py-6">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-lght-blue"></div>
            </div>
          </div>
        ) : latestPosts.length > 0 ? (
        <DiscussionList
        listName="Naujausi įrašai"
        IconComponent={NewsIcon}
            discussions={enhanceDiscussionsWithClick(latestPosts)}
          />
        ) : (
          <div className="mb-10 md:mb-28">
            <div className="flex flex-row mb-2 gap-2">
              <NewsIcon />
              <p className="text-white font-light text-base">Naujausi įrašai</p>
            </div>
            <div className="rounded-md p-4 border border-light-grey/30 text-center">
              <p className="text-light-grey">Šiuo metu nėra naujų įrašų.</p>
            </div>
          </div>
        )}
      </div>

      <div className="w-3/4 md:w-8/12">

        <div className="w-full mb-16 bg-gradient-to-br from-dark/50 to-grey rounded-md border-l-2 border-lght-blue hidden md:block lg:pb-0 overflow-hidden">
          <div className="flex flex-row justify-between p-10 relative">
            <div className="z-10">
              <div className="flex items-center gap-3 mb-4">
                <div className="bg-lght-blue/20 p-2 rounded-md">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-6 text-lght-blue">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 0 0 3.741-.479 3 3 0 0 0-4.682-2.72m.94 3.198.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0 1 12 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 0 1 6 18.719m12 0a5.971 5.971 0 0 0-.941-3.197m0 0A5.995 5.995 0 0 0 12 12.75a5.995 5.995 0 0 0-5.058 2.772m0 0a3 3 0 0 0-4.681 2.72 8.986 8.986 0 0 0 3.74.477m.94-3.197a5.971 5.971 0 0 0-.94 3.197M15 6.75a3 3 0 1 1-6 0 3 3 0 0 1 6 0Zm6 3a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Zm-13.5 0a2.25 2.25 0 1 1-4.5 0 2.25 2.25 0 0 1 4.5 0Z" />
                  </svg>
                </div>
                <h1 className="text-white font-bold text-4xl">Sveiki atvykę į <span className="text-lght-blue">UniForum</span>!</h1>
              </div>
              
              <p className="text-lighter-grey mb-6 max-w-2xl leading-relaxed">
                Esate būsimas studentas, dėstytojas ar universiteto darbuotojas? UniForum – tai vieta, kur bendruomenė dalinasi žiniomis, patirtimi ir patarimais apie:
              </p>
              
              <div className="grid grid-cols-2 gap-4 mb-8">
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5 text-lght-blue">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                  </svg>
                  <span className="text-white font-medium">Studijų programas</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5 text-lght-blue">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                  </svg>
                  <span className="text-white font-medium">Dėstytojus</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5 text-lght-blue">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                  </svg>
                  <span className="text-white font-medium">Modulius</span>
                </div>
                <div className="flex items-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5 text-lght-blue">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M2.25 12l8.954-8.955c.44-.439 1.152-.439 1.591 0L21.75 12M4.5 9.75v10.125c0 .621.504 1.125 1.125 1.125H9.75v-4.875c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125V21h4.125c.621 0 1.125-.504 1.125-1.125V9.75M8.25 21h8.25" />
                </svg>
                  <span className="text-white font-medium">Studentų gyvenimą</span>
                </div>
              </div>
              
              <div className="flex flex-col md:flex-row gap-4 mb-2">
                <button onClick={() => navigate('/registracija')} className="bg-lght-blue hover:bg-blue-600 text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M19 7.5v3m0 0v3m0-3h3m-3 0h-3m-2.25-4.125a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0ZM4 19.235v-.11a6.375 6.375 0 0 1 12.75 0v.109A12.318 12.318 0 0 1 10.374 21c-2.331 0-4.512-.645-6.374-1.766Z" />
                  </svg>
                  Prisijunk prie bendruomenės
                </button>
                <button onClick={showUniversitetai} className="bg-dark hover:bg-grey border border-lght-blue text-white font-medium py-2 px-4 rounded-md transition-colors flex items-center justify-center gap-2">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="size-5">
                    <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                  </svg>
                  Suraskite universitetą
                </button>
              </div>
            </div>
            
            <div className="absolute right-20 top-16 h-full hidden xl:block">
              <img src={Campus} alt="Campus" loading="eager" className="size-72 scale-x-[1.2] -translate-y-7 relative z-10"/>
            </div>
          </div>
        </div>
        
        {/* Recommendation System Card */}
        <div className="w-full mb-16 bg-dark rounded-lg border-2 border-lght-blue shadow-lg shadow-lght-blue/20 overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between p-6">
            <div className="md:w-3/5">
              <div className="flex items-center gap-2 mb-4">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 text-lght-blue">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
                </svg>
                <h2 className="text-white font-bold text-2xl md:text-3xl">Universiteto rekomendacijų sistema</h2>
              </div>
              
              <p className="text-light-grey mb-6">
                Nežinote, kurį universitetą ar studijų programą pasirinkti? Mūsų rekomendacijų sistema 
                panaudos dirbtinį intelektą, kad analizuotų forumo diskusijas, atsiliepimus ir programų 
                aprašymus, ir pasiūlys jums geriausiai tinkančias studijų galimybes.
              </p>
              
              <div className="flex flex-wrap gap-3 mb-6">
                <span className="bg-lght-blue/20 text-white px-3 py-1 rounded-full text-sm">Akademiniai interesai</span>
                <span className="bg-lght-blue/20 text-white px-3 py-1 rounded-full text-sm">Studijų stilius</span>
                <span className="bg-lght-blue/20 text-white px-3 py-1 rounded-full text-sm">Karjeros tikslai</span>
                <span className="bg-lght-blue/20 text-white px-3 py-1 rounded-full text-sm">Asmeniniai prioritetai</span>
                <span className="bg-lght-blue/20 text-white px-3 py-1 rounded-full text-sm">Vieta</span>
              </div>
              
              <button 
                onClick={() => navigate('/rekomendacijos')}
                className="bg-lght-blue hover:bg-blue-600 text-white font-bold py-3 px-6 rounded-lg transition-colors flex items-center gap-2"
              >
                Gauti rekomendacijas
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                </svg>
              </button>
            </div>
            
            <div className="hidden md:flex md:w-2/5 justify-end items-center">
              <div className="relative">
                {/* Abstract representation of AI recommendation */}
                <div className="absolute -top-10 -left-10 w-32 h-32 bg-lght-blue/30 rounded-full blur-xl"></div>
                <div className="absolute -bottom-5 -right-5 w-28 h-28 bg-purple-500/20 rounded-full blur-xl"></div>
                
                <div className="relative bg-gradient-to-br from-dark to-grey p-6 rounded-xl border border-light-grey z-10 shadow-lg">
                  <div className="mb-4 space-y-3">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-lght-blue/30 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">KTU - Informatika</p>
                        <div className="flex items-center">
                          <StarRating rating={4.8} width={3} color="white" />
                          <span className="text-light-grey text-xs ml-1">98% atitikimas</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-purple-500/30 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">VU - Programų sistemos</p>
                        <div className="flex items-center">
                          <StarRating rating={4.6} width={3} color="white" />
                          <span className="text-light-grey text-xs ml-1">95% atitikimas</span>
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-md bg-green-500/30 flex items-center justify-center">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
                          <path strokeLinecap="round" strokeLinejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                        </svg>
                      </div>
                      <div className="flex-1">
                        <p className="text-white font-medium">VDU - Multimedijos inžinerija</p>
                        <div className="flex items-center">
                          <StarRating rating={4.5} width={3} color="white" />
                          <span className="text-light-grey text-xs ml-1">92% atitikimas</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-row text-white  justify-center items-center italic mt-20 m-auto w-1/2">
          <img src={drawnArrow} className="size-10 invert rotate-[3.142rad] -translate-x-10 translate-y-14"/>
          <h1 className="-rotate-12 font-thin text-2xl text-center">Paspausk!</h1>
          <img src={drawnArrow} className="size-10 invert rotate-90 translate-x-10 translate-y-14"/>
        </div>

        <div className="flex flex-row justify-between items-center mx-20 mt-20">
          <div className="flex flex-col gap-5 justify-center items-center w-[40%] text-center cursor-pointer group" onClick={showUniversitetai}>
            <h1 className="text-white font-bold text-4xl group-hover:text-lght-blue group-focus:text-lght-blue transition-colors duration-300 z-10">{activeSection === 'universitetai' ? <span className="text-lght-blue">Prisijunkite prie diskusijos</span> : "Prisijunkite prie diskusijos"}</h1>
            <img src={PeopleTalking} loading="eager" className={`w-full invert transform -translate-x-28 -translate-y-14 group-hover:scale-110 group-focus:scale-110 transition-transform duration-300 ${activeSection === 'universitetai' ? 'scale-110' : ''}`}/>
          </div>
          <div className="w-[20%] text-center">
            <h1 className="text-lght-blue font-bold text-4xl mb-10">arba</h1>
          </div>
          <div className="flex flex-col gap-5 justify-center items-center w-[40%] text-center cursor-pointer group" onClick={showKategorijos}>
            <h1 className="text-white font-bold text-4xl group-hover:text-lght-blue group-focus:text-lght-blue transition-colors duration-300 z-10">{activeSection === 'kategorijos' ? <span className="text-lght-blue">Sužinokite daugiau apie universitetus ir palikite atsiliepimus</span> : "Sužinokite daugiau apie universitetus ir palikite atsiliepimus"}</h1>
            <img src={PersonRating} loading="eager" className={`w-4/5 invert translate-x-28 -translate-y-14 contrast-200 group-hover:scale-110 group-focus:scale-110 transition-transform duration-300 ${activeSection === 'kategorijos' ? 'scale-110' : ''}`}/>
          </div>
        </div>

        {loading && (
          <div className="flex justify-center mt-10">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-lght-blue"></div>
          </div>
        )}

        <div className="min-h-[400px] mt-10 transition-all duration-500 ease-in-out">
          {!loading && activeSection === 'universitetai' && contentVisible && (
            <>
          <div className="my-10">              
            <div 
                className="bg-grey rounded-md flex flex-row align-middle justify-between border-l-2 border-light-grey items-center hover:bg-dark cursor-pointer transition-colors transition: duration-150 ease-linear" 
                onClick={() => handleOpenForum(1, 'Bendros diskusijos', 'General', null)}
          >
            <div className="flex flex-row items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-20 bg-dark m-2 p-4 rounded-md text-light-grey">
                  <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                </svg>
                <div>
                  <p className="text-white ml-5 text-2xl font-medium">Bendros diskusijos</p> 
                  <p className="text-light-grey ml-5 text-md font-medium">Tai yra forumus bendroms diskusijoms apie viską, kas susiję su universiteto gyvenimu.</p>
            </div>
            </div>
                <div className="m-3 mr-5">
                  <p className="text-white font-medium text-xl">256</p>
                  <p className="text-light-grey font-medium text-xl">Įrašų</p>
          </div>
            </div>
          </div>

          <div className="text-white font-medium text-md ml-3">
            <h1>Universitetų forumai</h1>
          </div>


          
          {forumsLoading ? (
            <div className="flex justify-center mt-10">
              <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-lght-blue"></div>
            </div>
          ) : (
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2 animate-fade-in-up border-t-2 pt-4 border-light-grey rounded-md px-1 mb-10">
              {forums.map((forum) => {
                const logo = getUniversityLogo(forum.university_name);
                return (
                  <div 
                    key={forum.id}
                    className="bg-grey rounded-md flex flex-row align-middle justify-between border-l-2 border-light-grey items-center hover:bg-dark cursor-pointer transition-colors transition: duration-150 ease-linear" 
                    onClick={() => handleOpenForum(forum.id, forum.title, forum.university_name, forum.entity_id)}
                  >
                    <div className="flex flex-row items-center">
                      <img src={logo.src} className={logo.className} alt={forum.university_name || "University"} />
                      <div>
                        <p className="text-white text-sm font-medium">{forum.title}</p>
                      </div>
            </div>
            <div className="m-3 text-end">
                      <p className="text-white font-medium text-sm">{forum.post_count || 0}</p>
              <p className="text-light-grey font-medium">
                {forum.post_count === 1 
                ? 'įrašas' 
                : (forum.post_count >= 2 && forum.post_count <= 9) 
                    ? 'įrašai' 
                    : 'įrašų'}
              </p>
            </div>
          </div>
                );
              })}
            </div>
          )}
            </>
          )}

          {!loading && activeSection === 'kategorijos' && contentVisible && (
            <>
              <div className="mt-8">
                <UniversityList />
              </div>
            </>
          )}
        </div>
      </div>
    </div>
    </>
  );
};

const style = document.createElement('style');
style.textContent = `
  @keyframes fadeInUp {
    from {
      opacity: 0;
      transform: translateY(20px);
    }
    to {
      opacity: 1;
      transform: translateY(0);
    }
  }
  
  .animate-fade-in-up {
    animation: fadeInUp 0.5s ease-out forwards;
  }
`;
document.head.appendChild(style);

export default Home;
