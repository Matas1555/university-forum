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
import Campus from "../assets/campus.svg";
import KTU from "../assets/KTU.jpg";
import VDU from "../assets/VDU.jpg";
import VU from "../assets/VU.jpg";
import StarRating from "../components/starRating/starRating";
import drawnArrow from "../assets/drawn_Arrow.png";
import PeopleTalking from "../assets/peopleTalking-removebg-preview.png";
import PersonRating from "../assets/ratingPerson.png";


const discussions = [
  { title: 'Kokia jūsų patirtis programų sistemų modulyje? Įdomios paskaitos?', date: '2025-12-01', comment_count: 2 },
  { title: 'Ar VDU geriau negu KTU?', date: '2025-12-02', comment_count: 4 },
  { title: 'Kokia jūsų patirtis programų sistemų modulyje? Įdomios paskaitos?', date: '2025-12-01', comment_count: 2 },
  { title: 'Ar VDU geriau negu KTU?', date: '2025-12-02', comment_count: 4 },
  { title: 'Kokia jūsų patirtis programų sistemų modulyje? Įdomios paskaitos?', date: '2025-12-01', comment_count: 2 },
  { title: 'Ar VDU geriau negu KTU?', date: '2025-12-02', comment_count: 4 },
];

const Home = () => {
  const navigate = useNavigate();
  const [activeSection, setActiveSection] = useState('');
  const [loading, setLoading] = useState(false);
  const [contentVisible, setContentVisible] = useState(true);
  
  const showUniversitetai = () => {
    setLoading(true);
    setContentVisible(false);
    setTimeout(() => {
      setActiveSection('universitetai');
      setLoading(false);
      setContentVisible(true);
    }, 1000);
  };
  
  const showKategorijos = () => {
    setLoading(true);
    setContentVisible(false);
    setTimeout(() => {
      setActiveSection('kategorijos');
      setLoading(false);
      setContentVisible(true);
    }, 1000);
  };
  
  const handleOpenForum = (universityId, universityName) => {
    navigate(`/forumai/universitetai/${universityId}/irasai`, { 
      state: { 
        forumType: 'university',
        forumId: universityId, 
        forumName: universityName,
        breadcrumb: [
          { label: 'Forumai', path: '/forumai' },
          { label: 'Universitetai', path: '/pagrindinis' },
          { label: universityName, path: `/forumai/universitetai/${universityId}/irasai` }
        ]
      } 
    });
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

  const handleClick = () => {
    setOpenFilters(!filtersClicked);
  };

  return (
    <>
      <div className="w-full gap-10 mb-5 flex flex-col items-center md:flex-row-reverse md:p-8 md:items-start">
      <div className="w-3/4 md:w-3/12 md:gap-20">
        <DiscussionList
        listName="Jūsų įrašai"
        IconComponent={ArchiveIcon}
        discussions={discussions}
        />
        <DiscussionList
        listName="Naujausi įrašai"
        IconComponent={NewsIcon}
        discussions={discussions}
        />
      </div>



      <div className="w-3/4 md:w-8/12">

        <div className="w-full mb-16 bg-grey rounded-md hidden md:block lg:pb-0">
          <div className="flex flex-row justify-between p-10">
            <div>
              <h1 className="text-white font-bold text-4xl mb-10">Prisijunk prie bendruomenės ir padėk bendraminčiams!</h1>
              <p className="text-light-grey mb-10">UniForum tai internetinis forumas skirtas busimiems ir esamiems studentams, dėstytojams ir universiteto darbuotojamas laisva forma diskutuoti apie įvairias temas susijas su universiteto gyvenimu.</p>
              <div className="flex flex-row gap-5 items-end">
                <p className="text-white font-extrabold text-lg lg:mt-10 lg:mb-1">Suraskite universitetą kuris jus domina</p>
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-10 text-lght-blue">
                  <path fillRule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-.53 14.03a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V8.25a.75.75 0 0 0-1.5 0v5.69l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3Z" clipRule="evenodd" />
                </svg>
              </div>
              
            </div>
            <img src={Campus} alt="Campus" className="size-72 scale-x-[-1]  -translate-y-10 hidden xl:block"/>
          </div>
        </div>

        <div className="flex flex-row text-white font-thin text-2xl text-center justify-center items-center italic mt-20 m-auto w-1/2">
          <img src={drawnArrow} className="size-10 invert rotate-[3.142rad] -translate-x-10 translate-y-14"/>
          <h1 className="-rotate-12">Paspausk!</h1>
          <img src={drawnArrow} className="size-10 invert rotate-90 translate-x-10 translate-y-14"/>
        </div>

        <div className="flex flex-row justify-between items-center mx-20 mt-20">
          <div className="flex flex-col gap-5 justify-center items-center w-[40%] text-center cursor-pointer group" onClick={showUniversitetai}>
            <h1 className="text-white font-bold text-4xl group-hover:text-lght-blue group-focus:text-lght-blue transition-colors duration-300 z-10">{activeSection === 'universitetai' ? <span className="text-lght-blue">Prisijunkite prie diskusijos</span> : "Prisijunkite prie diskusijos"}</h1>
            <img src={PeopleTalking} className={`w-full invert transform -translate-x-28 -translate-y-14 group-hover:scale-110 group-focus:scale-110 transition-transform duration-300 ${activeSection === 'universitetai' ? 'scale-110' : ''}`}/>
          </div>
          <div className="w-[20%] text-center">
            <h1 className="text-lght-blue font-bold text-4xl mb-10">arba</h1>
          </div>
          <div className="flex flex-col gap-5 justify-center items-center w-[40%] text-center cursor-pointer group" onClick={showKategorijos}>
            <h1 className="text-white font-bold text-4xl group-hover:text-lght-blue group-focus:text-lght-blue transition-colors duration-300 z-10">{activeSection === 'kategorijos' ? <span className="text-lght-blue">Sužinokite daugiau apie universitetus ir palikite atsiliepimus</span> : "Sužinokite daugiau apie universitetus ir palikite atsiliepimus"}</h1>
            <img src={PersonRating} className={`w-4/5 invert translate-x-28 -translate-y-14 contrast-200 group-hover:scale-110 group-focus:scale-110 transition-transform duration-300 ${activeSection === 'kategorijos' ? 'scale-110' : ''}`}/>
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
                onClick={() => handleOpenForum(1, 'Kauno technologijos universitetas')}
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
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 animate-fade-in-up border-t-2 pt-4 border-light-grey rounded-md px-1 mb-10">
            <div 
              className="bg-grey rounded-md flex flex-row align-middle justify-between border-l-2 border-light-grey items-center hover:bg-dark cursor-pointer transition-colors transition: duration-150 ease-linear" 
              onClick={() => handleOpenForum(1, 'Kauno technologijos universitetas')}
            >
              <div className="flex flex-row items-center">
                <img src={KTUlogo} className="size-12 m-3 rounded-sm"/>
                <p className="text-white text-sm font-medium">Kauno technologijos universitetas</p>
              </div>
              <div className="m-3">
                <p className="text-white font-medium text-sm">256</p>
                <p className="text-light-grey font-medium">Įrašų</p>
              </div>
            </div>
            <div className="bg-grey rounded-md flex flex-row align-middle justify-between border-l-2 border-light-grey items-center hover:bg-dark cursor-pointer transition-colors transition: duration-150 ease-linear">
              <div className="flex flex-row items-center">
                <img src={VUlogo} className="size-10 m-3 rounded-sm invert"/>
                <p className="text-white text-sm font-medium">Vilniaus universitetas</p>
              </div>
              <div className="m-3">
                <p className="text-white font-medium text-sm">256</p>
                <p className="text-light-grey font-medium">Įrašų</p>
              </div>
            </div>
            <div className="bg-grey rounded-md flex flex-row align-middle justify-between border-l-2 border-light-grey items-center hover:bg-dark cursor-pointer transition-colors transition: duration-150 ease-linear">
              <div className="flex flex-row items-center">
                <img src={VDUlogo} className="size-10 m-3 rounded-sm invert"/>
                <p className="text-white text-sm font-medium">Vytauto didžiojo universitetas</p>
              </div>
              <div className="m-3">
                <p className="text-white font-medium text-sm">256</p>
                <p className="text-light-grey font-medium">Įrašų</p>
              </div>
            </div>
            <div className="bg-grey rounded-md flex flex-row align-middle justify-between border-l-2 border-light-grey items-center hover:bg-dark cursor-pointer transition-colors transition: duration-150 ease-linear">
              <div className="flex flex-row items-center">
                <img src={MRUlogo} className="size-6 w-20 m-3 rounded-sm"/>
                <p className="text-white text-sm font-medium">Vytauto didžiojo universitetas</p>
              </div>
              <div className="m-3">
                <p className="text-white font-medium text-sm">256</p>
                <p className="text-light-grey font-medium">Įrašų</p>
              </div>
            </div>
            <div className="bg-grey rounded-md flex flex-row align-middle justify-between border-l-2 border-light-grey items-center hover:bg-dark cursor-pointer transition-colors transition: duration-150 ease-linear">
              <div className="flex flex-row items-center">
                <img src={KTUlogo} className="size-12 m-3 rounded-sm"/>
                <p className="text-white text-sm font-medium">Kauno technologijos universitetas</p>
              </div>
              <div className="m-3">
                <p className="text-white font-medium text-sm">256</p>
                <p className="text-light-grey font-medium">Įrašų</p>
              </div>
            </div>
            <div className="bg-grey rounded-md flex flex-row align-middle justify-between border-l-2 border-light-grey items-center hover:bg-dark cursor-pointer transition-colors transition: duration-150 ease-linear">
              <div className="flex flex-row items-center">
                <img src={VUlogo} className="size-10 m-3 rounded-sm invert"/>
                <p className="text-white text-sm font-medium">Vilniaus universitetas</p>
              </div>
              <div className="m-3">
                <p className="text-white font-medium text-sm">256</p>
                <p className="text-light-grey font-medium">Įrašų</p>
              </div>
            </div>
            <div className="bg-grey rounded-md flex flex-row align-middle justify-between border-l-2 border-light-grey items-center hover:bg-dark cursor-pointer transition-colors transition: duration-150 ease-linear">
              <div className="flex flex-row items-center">
                <img src={VDUlogo} className="size-10 m-3 rounded-sm invert"/>
                <p className="text-white text-sm font-medium">Vytauto didžiojo universitetas</p>
              </div>
              <div className="m-3">
                <p className="text-white font-medium text-sm">256</p>
                <p className="text-light-grey font-medium">Įrašų</p>
              </div>
            </div>
            <div className="bg-grey rounded-md flex flex-row align-middle justify-between border-l-2 border-light-grey items-center hover:bg-dark cursor-pointer transition-colors transition: duration-150 ease-linear">
              <div className="flex flex-row items-center">
                <img src={MRUlogo} className="size-6 w-20 m-3 rounded-sm"/>
                <p className="text-white text-sm font-medium">Vytauto didžiojo universitetas</p>
              </div>
              <div className="m-3">
                <p className="text-white font-medium text-sm">256</p>
                <p className="text-light-grey font-medium">Įrašų</p>
              </div>
            </div>
          </div>

          <div className="text-white font-medium text-md ml-3">
            <h1>Kategorijų forumai</h1>
          </div>
          <div className="grid grid-cols-1 gap-4 md:grid-cols-2 animate-fade-in-up border-t-2 pt-4 border-light-grey rounded-md px-1 mb-10">
            <div 
              className="bg-grey rounded-md flex flex-row align-middle justify-between border-l-2 border-light-grey items-center hover:bg-dark cursor-pointer transition-colors transition: duration-150 ease-linear" 
              onClick={() => handleOpenForum(1, 'Kauno technologijos universitetas')}
            >
              <div className="flex flex-row items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-14 bg-dark rounded-md p-2 m-2 text-light-grey">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <p className="text-white text-sm font-medium">Kursų apžvalgos</p>
              </div>
              <div className="m-3">
                <p className="text-white font-medium text-sm">256</p>
                <p className="text-light-grey font-medium">Įrašų</p>
              </div>
            </div>
            <div className="bg-grey rounded-md flex flex-row align-middle justify-between border-l-2 border-light-grey items-center hover:bg-dark cursor-pointer transition-colors transition: duration-150 ease-linear">
              <div className="flex flex-row items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-14 bg-dark rounded-md p-2 m-2 text-light-grey">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <p className="text-white text-sm font-medium">Studijų medžiaga</p>
              </div>
              <div className="m-3">
                <p className="text-white font-medium text-sm">256</p>
                <p className="text-light-grey font-medium">Įrašų</p>
              </div>
            </div>
            <div className="bg-grey rounded-md flex flex-row align-middle justify-between border-l-2 border-light-grey items-center hover:bg-dark cursor-pointer transition-colors transition: duration-150 ease-linear">
              <div className="flex flex-row items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-14 bg-dark rounded-md p-2 m-2 text-light-grey">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <p className="text-white text-sm font-medium">Socialinis gyvenimas ir renginiai</p>
              </div>
              <div className="m-3">
                <p className="text-white font-medium text-sm">256</p>
                <p className="text-light-grey font-medium">Įrašų</p>
              </div>
            </div>
            <div className="bg-grey rounded-md flex flex-row align-middle justify-between border-l-2 border-light-grey items-center hover:bg-dark cursor-pointer transition-colors transition: duration-150 ease-linear">
              <div className="flex flex-row items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-14 bg-dark rounded-md p-2 m-2 text-light-grey">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <p className="text-white text-sm font-medium">Būstas ir apgyvendinimas</p>
              </div>
              <div className="m-3">
                <p className="text-white font-medium text-sm">256</p>
                <p className="text-light-grey font-medium">Įrašų</p>
              </div>
            </div>
            <div className="bg-grey rounded-md flex flex-row align-middle justify-between border-l-2 border-light-grey items-center hover:bg-dark cursor-pointer transition-colors transition: duration-150 ease-linear">
              <div className="flex flex-row items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-14 bg-dark rounded-md p-2 m-2 text-light-grey">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <p className="text-white text-sm font-medium">Praktikos ir karjeros galimybės</p>
              </div>
              <div className="m-3">
                <p className="text-white font-medium text-sm">256</p>
                <p className="text-light-grey font-medium">Įrašų</p>
              </div>
            </div>
            <div className="bg-grey rounded-md flex flex-row align-middle justify-between border-l-2 border-light-grey items-center hover:bg-dark cursor-pointer transition-colors transition: duration-150 ease-linear">
              <div className="flex flex-row items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-14 bg-dark rounded-md p-2 m-2 text-light-grey">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <p className="text-white text-sm font-medium">Universiteto politika ir administracija</p>
              </div>
              <div className="m-3">
                <p className="text-white font-medium text-sm">256</p>
                <p className="text-light-grey font-medium">Įrašų</p>
              </div>
            </div>
            <div className="bg-grey rounded-md flex flex-row align-middle justify-between border-l-2 border-light-grey items-center hover:bg-dark cursor-pointer transition-colors transition: duration-150 ease-linear">
              <div className="flex flex-row items-center">
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-14 bg-dark rounded-md p-2 m-2 text-light-grey">
                  <path stroke-linecap="round" stroke-linejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                </svg>
                <p className="text-white text-sm font-medium">Vytauto didžiojo universitetas</p>
              </div>
              <div className="m-3">
                <p className="text-white font-medium text-sm">256</p>
                <p className="text-light-grey font-medium">Įrašų</p>
              </div>
            </div>
          </div>
          </>
          )}

          {!loading && activeSection === 'kategorijos' && contentVisible && (
          <div className="grid grid-cols-1 gap-6 mt-5 sm:grid-cols-2 md:grid-cols-3 md:gap-8 animate-fade-in-up">
            <div 
              className="bg-grey rounded-md text-white overflow-hidden hover:bg-dark transition-colors duration-300 cursor-pointer group"
              onClick={() => handleOpenUniversity(1, 'Kauno Technologijos universitetas')}
            >
              <div className="relative">
                <img src={KTU} className="w-full h-48 object-cover"/>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark to-transparent h-1/2"></div>
              </div>
              <div className="p-4">
                <h1 className="text-lg font-bold group-hover:text-lght-blue transition-colors duration-300">Kauno Technologijos universitetas</h1>
                <div className="flex items-center mt-2 mb-3">
                  <StarRating rating={4.5} width={4}/>
                  <span className="ml-2 text-light-grey text-sm">(154 atsiliepimai)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <div>
                    <p className="text-light-grey">Fakultetai</p>
                    <p className="font-medium">12</p>
                  </div>
                  <div>
                    <p className="text-light-grey">Studijų programos</p>
                    <p className="font-medium">96</p>
                  </div>
                  <div>
                    <p className="text-light-grey">Diskusijos</p>
                    <p className="font-medium">542</p>
                  </div>
                </div>
              </div>
            </div>

            <div 
              className="bg-grey rounded-md text-white overflow-hidden hover:bg-dark transition-colors duration-300 cursor-pointer group"
              onClick={() => handleOpenUniversity(2, 'Vilniaus universitetas')}
            >
              <div className="relative">
                <img src={VU} className="w-full h-48 object-cover"/>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark to-transparent h-1/2"></div>
              </div>
              <div className="p-4">
                <h1 className="text-lg font-bold group-hover:text-lght-blue transition-colors duration-300">Vilniaus universitetas</h1>
                <div className="flex items-center mt-2 mb-3">
                  <StarRating rating={4.7} width={4}/>
                  <span className="ml-2 text-light-grey text-sm">(210 atsiliepimai)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <div>
                    <p className="text-light-grey">Fakultetai</p>
                    <p className="font-medium">14</p>
                  </div>
                  <div>
                    <p className="text-light-grey">Studijų programos</p>
                    <p className="font-medium">103</p>
                  </div>
                  <div>
                    <p className="text-light-grey">Diskusijos</p>
                    <p className="font-medium">685</p>
                  </div>
                </div>
              </div>
            </div>

            <div 
              className="bg-grey rounded-md text-white overflow-hidden hover:bg-dark transition-colors duration-300 cursor-pointer group"
              onClick={() => handleOpenUniversity(3, 'Vytauto Didžiojo universitetas')}
            >
              <div className="relative">
                <img src={VDU} className="w-full h-48 object-cover"/>
                <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark to-transparent h-1/2"></div>
              </div>
              <div className="p-4">
                <h1 className="text-lg font-bold group-hover:text-lght-blue transition-colors duration-300">Vytauto Didžiojo universitetas</h1>
                <div className="flex items-center mt-2 mb-3">
                  <StarRating rating={4.2} width={4}/>
                  <span className="ml-2 text-light-grey text-sm">(89 atsiliepimai)</span>
                </div>
                <div className="flex justify-between text-sm">
                  <div>
                    <p className="text-light-grey">Fakultetai</p>
                    <p className="font-medium">10</p>
                  </div>
                  <div>
                    <p className="text-light-grey">Studijų programos</p>
                    <p className="font-medium">74</p>
                  </div>
                  <div>
                    <p className="text-light-grey">Diskusijos</p>
                    <p className="font-medium">423</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
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
