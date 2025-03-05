import React, {useState} from "react";
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
  const [activeSection, setActiveSection] = useState('universitetai');
  const showUniversitetai = () => setActiveSection('universitetai');
  const showKategorijos = () => setActiveSection('kategorijos');
  const [filtersClicked, setOpenFilters] = useState(false);

  const handleOpenForum = () => {
    navigate('/posts');
  }

  const handleClick = () => {
    setOpenFilters(!filtersClicked);
  };

  return (
    <>
      <div className="flex flex-col w-10/12 items-center m-auto">
        <div className="mt-5 mb-10 w-full flex flex-row m-auto"> {/* Search bar */}
          <button  className={`rounded-lg p-2 pl-4 pr-4 mr-2 hover:bg-lght-blue transition-colors transition: duration-150ease-linear ${
                      filtersClicked ? "bg-lght-blue " : "bg-grey"
                    }`}
          onClick={handleClick}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-white">
              <path d="M6 12a.75.75 0 0 1-.75-.75v-7.5a.75.75 0 1 1 1.5 0v7.5A.75.75 0 0 1 6 12ZM18 12a.75.75 0 0 1-.75-.75v-7.5a.75.75 0 0 1 1.5 0v7.5A.75.75 0 0 1 18 12ZM6.75 20.25v-1.5a.75.75 0 0 0-1.5 0v1.5a.75.75 0 0 0 1.5 0ZM18.75 18.75v1.5a.75.75 0 0 1-1.5 0v-1.5a.75.75 0 0 1 1.5 0ZM12.75 5.25v-1.5a.75.75 0 0 0-1.5 0v1.5a.75.75 0 0 0 1.5 0ZM12 21a.75.75 0 0 1-.75-.75v-7.5a.75.75 0 0 1 1.5 0v7.5A.75.75 0 0 1 12 21ZM3.75 15a2.25 2.25 0 1 0 4.5 0 2.25 2.25 0 0 0-4.5 0ZM12 11.25a2.25 2.25 0 1 1 0-4.5 2.25 2.25 0 0 1 0 4.5ZM15.75 15a2.25 2.25 0 1 0 4.5 0 2.25 2.25 0 0 0-4.5 0Z" />
            </svg>
          </button>
          <input className="bg-grey text-white rounded-md p-4 pl-4 pr-4 text-xs w-full focus: border-blue focus:border-lght-blue" placeholder="Ieškokite per visus forumus..."/>
          <button className="bg-grey border-lght-blue border-2 rounded-lg p-2 pl-4 pr-4 ml-2 hover:bg-dark transition-colors transition: duration-150ease-linear">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-lght-blue">
            <path fill-rule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clip-rule="evenodd" />
          </svg>
          </button>
        </div>

        <div className={`grid grid-cols-2 grid-rows-1 gap-5 w-10/12 mb-10 ${
          filtersClicked ? " " : "hidden"
        }`}> {/* Filter screen*/}
          <select className="bg-grey text-white p-3 rounded-md border-r-8 border-r-grey">
            <option value="none">Pasirinkite universiteta...</option>
            <option value="KTU" className="">Kauno Technologijos universitetas</option>
            <option value="KTU">Kauno Technologijos universitetas</option>
            <option value="KTU">Kauno Technologijos universitetas</option>
            <option value="KTU">Kauno Technologijos universitetas</option>
            <option value="KTU">Kauno Technologijos universitetas</option>
          </select>
          <select className="bg-grey text-white p-3 rounded-md border-r-8 border-r-grey">
            <option value="none">Pasirinkite universiteta...</option>
            <option value="KTU" className="">Kauno Technologijos universitetas</option>
            <option value="KTU">Kauno Technologijos universitetas</option>
            <option value="KTU">Kauno Technologijos universitetas</option>
            <option value="KTU">Kauno Technologijos universitetas</option>
            <option value="KTU">Kauno Technologijos universitetas</option>
          </select>
          <select className="bg-grey text-white p-3 rounded-md border-r-8 border-r-grey">
            <option value="none">Pasirinkite universiteta...</option>
            <option value="KTU" className="">Kauno Technologijos universitetas</option>
            <option value="KTU">Kauno Technologijos universitetas</option>
            <option value="KTU">Kauno Technologijos universitetas</option>
            <option value="KTU">Kauno Technologijos universitetas</option>
            <option value="KTU">Kauno Technologijos universitetas</option>
          </select>
          <select className="bg-grey text-white p-3 rounded-md border-r-8 border-r-grey">
            <option value="none">Pasirinkite universiteta...</option>
            <option value="KTU" className="">Kauno Technologijos universitetas</option>
            <option value="KTU">Kauno Technologijos universitetas</option>
            <option value="KTU">Kauno Technologijos universitetas</option>
            <option value="KTU">Kauno Technologijos universitetas</option>
            <option value="KTU">Kauno Technologijos universitetas</option>
          </select>
        </div>
      </div>

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
                  <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-.53 14.03a.75.75 0 0 0 1.06 0l3-3a.75.75 0 1 0-1.06-1.06l-1.72 1.72V8.25a.75.75 0 0 0-1.5 0v5.69l-1.72-1.72a.75.75 0 0 0-1.06 1.06l3 3Z" clip-rule="evenodd" />
                </svg>
              </div>
              
            </div>
            <img src={Campus} alt="Campus" className="size-72 scale-x-[-1]  -translate-y-10 hidden xl:block"/>
          </div>
        </div>

        <div className="flex fle-row justify-start w-3/4 gap-2 mb-6">
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-lght-blue">
          <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 21v-4.03a48.527 48.527 0 0 1-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979Z" />
          <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 0 0 1.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0 0 15.75 7.5Z" />
        </svg>

          <p className="text-white">Forumai</p>
        </div>

        <div className="flex flex-row gap-2 mb-2">
          <button className={`border-2 border-grey rounded-md p-3 text-sm text-white focus:bg-lght-blue focus:border-lght-blue hover:bg-lght-blue hover:border-lght-blue transition-colors transition: duration-150ease-linear
          ${
            activeSection === 'universitetai' ? "bg-lght-blue border-lght-blue" : "bg-dark"
          }`} 
            onClick={showUniversitetai}
          >
            Universitetai
          </button>
          <button className={`border-2 border-grey rounded-md p-3 text-sm text-white focus:bg-lght-blue focus:border-lght-blue hover:bg-lght-blue hover:border-lght-blue transition-colors transition: duration-150ease-linear
          ${
            activeSection === 'kategorijos' ? "bg-lght-blue border-lght-blue" : "bg-dark"
          }`}
            onClick={showKategorijos}
          >
            Kategorijos
          </button>
        </div>

        {activeSection === 'universitetai' && (
        <div className="flex flex-col gap-2 mb-2 m-auto justify-center justify-items-center align-center"> {/* Universitetu forumu sarasas */}
          <div className="bg-grey rounded-md flex flex-row align-middle justify-between items-center hover:bg-dark cursor-pointer transition-colors transition: duration-150ease-linear" onClick={handleOpenForum}>
            <div className="flex flex-row items-center">
              <img src={KTUlogo} className="size-12 m-3 rounded-sm"/>
              <p className="text-white text-sm font-medium">Kauno technologijos universitetas</p>
            </div>
            <div className="m-3">
              <p className="text-white font-medium text-sm">256</p>
              <p className="text-light-grey font-medium">Įrašų</p>
            </div>
          </div>
          <div className="bg-grey rounded-md flex flex-row align-middle justify-between items-center hover:bg-dark cursor-pointer transition-colors transition: duration-150ease-linear">
            <div className="flex flex-row items-center">
              <img src={VUlogo} className="size-10 m-3 rounded-sm invert"/>
              <p className="text-white text-sm font-medium">Vilniaus universitetas</p>
            </div>
            <div className="m-3">
              <p className="text-white font-medium text-sm">256</p>
              <p className="text-light-grey font-medium">Įrašų</p>
            </div>
          </div>
          <div className="bg-grey rounded-md flex flex-row align-middle justify-between items-center hover:bg-dark cursor-pointer transition-colors transition: duration-150ease-linear">
            <div className="flex flex-row items-center">
              <img src={VDUlogo} className="size-10 m-3 rounded-sm invert"/>
              <p className="text-white text-sm font-medium">Vytauto didžiojo universitetas</p>
            </div>
            <div className="m-3">
              <p className="text-white font-medium text-sm">256</p>
              <p className="text-light-grey font-medium">Įrašų</p>
            </div>
          </div>
          <div className="bg-grey rounded-md flex flex-row align-middle justify-between items-center hover:bg-dark cursor-pointer transition-colors transition: duration-150ease-linear">
            <div className="flex flex-row items-center">
              <img src={MRUlogo} className="size-6 w-20 m-3 rounded-sm"/>
              <p className="text-white text-sm font-medium">Vytauto didžiojo universitetas</p>
            </div>
            <div className="m-3">
              <p className="text-white font-medium text-sm">256</p>
              <p className="text-light-grey font-medium">Įrašų</p>
            </div>
          </div>
          <div className="bg-grey rounded-md flex flex-row align-middle justify-between items-center hover:bg-dark cursor-pointer transition-colors transition: duration-150ease-linear">
            <div className="flex flex-row items-center">
              <img src={KTUlogo} className="size-12 m-3 rounded-sm"/>
              <p className="text-white text-sm font-medium">Kauno technologijos universitetas</p>
            </div>
            <div className="m-3">
              <p className="text-white font-medium text-sm">256</p>
              <p className="text-light-grey font-medium">Įrašų</p>
            </div>
          </div>
          <div className="bg-grey rounded-md flex flex-row align-middle justify-between items-center hover:bg-dark cursor-pointer transition-colors transition: duration-150ease-linear">
            <div className="flex flex-row items-center">
              <img src={VUlogo} className="size-10 m-3 rounded-sm invert"/>
              <p className="text-white text-sm font-medium">Vilniaus universitetas</p>
            </div>
            <div className="m-3">
              <p className="text-white font-medium text-sm">256</p>
              <p className="text-light-grey font-medium">Įrašų</p>
            </div>
          </div>
          <div className="bg-grey rounded-md flex flex-row align-middle justify-between items-center hover:bg-dark cursor-pointer transition-colors transition: duration-150ease-linear">
            <div className="flex flex-row items-center">
              <img src={VDUlogo} className="size-10 m-3 rounded-sm invert"/>
              <p className="text-white text-sm font-medium">Vytauto didžiojo universitetas</p>
            </div>
            <div className="m-3">
              <p className="text-white font-medium text-sm">256</p>
              <p className="text-light-grey font-medium">Įrašų</p>
            </div>
          </div>
          <div className="bg-grey rounded-md flex flex-row align-middle justify-between items-center hover:bg-dark cursor-pointer transition-colors transition: duration-150ease-linear">
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
        )}

        {activeSection === 'kategorijos' && (
        <div className="grid grid-cols-2 gap-4 mt-5 md:grid-cols-3 md:gap-8"> {/* Kategoriju sarasas */}
          <div className="border-2 border-lght-blue bg-grey p-3 rounded-lg h-40 cursor-pointer hover:bg-dark transition-colors transition: duration-150ease-linear">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-16 text-lght-blue m-auto">
              <path fill-rule="evenodd" d="M12 2.25c-2.429 0-4.817.178-7.152.521C2.87 3.061 1.5 4.795 1.5 6.741v6.018c0 1.946 1.37 3.68 3.348 3.97.877.129 1.761.234 2.652.316V21a.75.75 0 0 0 1.28.53l4.184-4.183a.39.39 0 0 1 .266-.112c2.006-.05 3.982-.22 5.922-.506 1.978-.29 3.348-2.023 3.348-3.97V6.741c0-1.947-1.37-3.68-3.348-3.97A49.145 49.145 0 0 0 12 2.25ZM8.25 8.625a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Zm2.625 1.125a1.125 1.125 0 1 1 2.25 0 1.125 1.125 0 0 1-2.25 0Zm4.875-1.125a1.125 1.125 0 1 0 0 2.25 1.125 1.125 0 0 0 0-2.25Z" clip-rule="evenodd" />
            </svg>
            <p className="text-white m-auto align-middle text-center font-medium mt-4 md:text-xl">Bendros diskusijos</p>
          </div>
          <div className="border-2 border-red bg-grey p-3 rounded-lg justify-items-center h-40 hover:bg-dark transition-colors transition: duration-150ease-linear">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-16 text-red m-auto">
              <path d="M8.25 10.875a2.625 2.625 0 1 1 5.25 0 2.625 2.625 0 0 1-5.25 0Z" />
              <path fill-rule="evenodd" d="M12 2.25c-5.385 0-9.75 4.365-9.75 9.75s4.365 9.75 9.75 9.75 9.75-4.365 9.75-9.75S17.385 2.25 12 2.25Zm-1.125 4.5a4.125 4.125 0 1 0 2.338 7.524l2.007 2.006a.75.75 0 1 0 1.06-1.06l-2.006-2.007a4.125 4.125 0 0 0-3.399-6.463Z" clip-rule="evenodd" />
            </svg>
            <p className="text-white m-auto align-middle text-center font-medium mt-4 md:text-xl">Kursų apžvalgos</p>
          </div>
          <div className="border-2 border-green bg-grey p-3 rounded-lg justify-items-center h-40 hover:bg-dark transition-colors transition: duration-150ease-linear">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-16 text-green m-auto">
              <path d="M11.25 4.533A9.707 9.707 0 0 0 6 3a9.735 9.735 0 0 0-3.25.555.75.75 0 0 0-.5.707v14.25a.75.75 0 0 0 1 .707A8.237 8.237 0 0 1 6 18.75c1.995 0 3.823.707 5.25 1.886V4.533ZM12.75 20.636A8.214 8.214 0 0 1 18 18.75c.966 0 1.89.166 2.75.47a.75.75 0 0 0 1-.708V4.262a.75.75 0 0 0-.5-.707A9.735 9.735 0 0 0 18 3a9.707 9.707 0 0 0-5.25 1.533v16.103Z" />
            </svg>
            <p className="text-white m-auto align-middle text-center font-medium mt-4 md:text-xl">Studijų medžiaga</p>
          </div>
          <div className="border-2 border-orange bg-grey p-3 rounded-lg justify-items-center h-40 hover:bg-dark transition-colors transition: duration-150ease-linear">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-16 text-orange m-auto">
              <path fill-rule="evenodd" d="M9 4.5a.75.75 0 0 1 .721.544l.813 2.846a3.75 3.75 0 0 0 2.576 2.576l2.846.813a.75.75 0 0 1 0 1.442l-2.846.813a3.75 3.75 0 0 0-2.576 2.576l-.813 2.846a.75.75 0 0 1-1.442 0l-.813-2.846a3.75 3.75 0 0 0-2.576-2.576l-2.846-.813a.75.75 0 0 1 0-1.442l2.846-.813A3.75 3.75 0 0 0 7.466 7.89l.813-2.846A.75.75 0 0 1 9 4.5ZM18 1.5a.75.75 0 0 1 .728.568l.258 1.036c.236.94.97 1.674 1.91 1.91l1.036.258a.75.75 0 0 1 0 1.456l-1.036.258c-.94.236-1.674.97-1.91 1.91l-.258 1.036a.75.75 0 0 1-1.456 0l-.258-1.036a2.625 2.625 0 0 0-1.91-1.91l-1.036-.258a.75.75 0 0 1 0-1.456l1.036-.258a2.625 2.625 0 0 0 1.91-1.91l.258-1.036A.75.75 0 0 1 18 1.5ZM16.5 15a.75.75 0 0 1 .712.513l.394 1.183c.15.447.5.799.948.948l1.183.395a.75.75 0 0 1 0 1.422l-1.183.395c-.447.15-.799.5-.948.948l-.395 1.183a.75.75 0 0 1-1.422 0l-.395-1.183a1.5 1.5 0 0 0-.948-.948l-1.183-.395a.75.75 0 0 1 0-1.422l1.183-.395c.447-.15.799-.5.948-.948l.395-1.183A.75.75 0 0 1 16.5 15Z" clip-rule="evenodd" />
            </svg>
            <p className="text-white text-sm m-auto align-middle text-center font-medium mt-4 md:text-xl">Socialinis gyvenimas ir renginiai</p>
          </div>
          <div className="border-2 border-purple bg-grey p-3 rounded-lg justify-items-center h-40 hover:bg-dark transition-colors transition: duration-150ease-linear">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-16 text-purple">
              <path d="M11.47 3.841a.75.75 0 0 1 1.06 0l8.69 8.69a.75.75 0 1 0 1.06-1.061l-8.689-8.69a2.25 2.25 0 0 0-3.182 0l-8.69 8.69a.75.75 0 1 0 1.061 1.06l8.69-8.689Z" />
              <path d="m12 5.432 8.159 8.159c.03.03.06.058.091.086v6.198c0 1.035-.84 1.875-1.875 1.875H15a.75.75 0 0 1-.75-.75v-4.5a.75.75 0 0 0-.75-.75h-3a.75.75 0 0 0-.75.75V21a.75.75 0 0 1-.75.75H5.625a1.875 1.875 0 0 1-1.875-1.875v-6.198a2.29 2.29 0 0 0 .091-.086L12 5.432Z" />
            </svg>
            <p className="text-white text-sm m-auto align-middle text-center font-medium mt-4 md:text-xl">Būstas ir apgyvendinimas</p>
          </div>
          <div className="border-2 border-lght-blue bg-grey p-3 rounded-lg justify-items-center h-40 hover:bg-dark transition-colors transition: duration-150ease-linear">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-16 text-lght-blue">
              <path fill-rule="evenodd" d="M7.5 5.25a3 3 0 0 1 3-3h3a3 3 0 0 1 3 3v.205c.933.085 1.857.197 2.774.334 1.454.218 2.476 1.483 2.476 2.917v3.033c0 1.211-.734 2.352-1.936 2.752A24.726 24.726 0 0 1 12 15.75c-2.73 0-5.357-.442-7.814-1.259-1.202-.4-1.936-1.541-1.936-2.752V8.706c0-1.434 1.022-2.7 2.476-2.917A48.814 48.814 0 0 1 7.5 5.455V5.25Zm7.5 0v.09a49.488 49.488 0 0 0-6 0v-.09a1.5 1.5 0 0 1 1.5-1.5h3a1.5 1.5 0 0 1 1.5 1.5Zm-3 8.25a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Z" clip-rule="evenodd" />
              <path d="M3 18.4v-2.796a4.3 4.3 0 0 0 .713.31A26.226 26.226 0 0 0 12 17.25c2.892 0 5.68-.468 8.287-1.335.252-.084.49-.189.713-.311V18.4c0 1.452-1.047 2.728-2.523 2.923-2.12.282-4.282.427-6.477.427a49.19 49.19 0 0 1-6.477-.427C4.047 21.128 3 19.852 3 18.4Z" />
            </svg>
            <p className="text-white text-sm m-auto align-middle text-center font-medium mt-4 md:text-xl">Praktikos ir karjeros galimybės</p>
          </div>
          <div className="border-2 border-red bg-grey p-3 rounded-lg justify-items-center h-40 hover:bg-dark transition-colors transition: duration-150ease-linear">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-16 text-red">
              <path fill-rule="evenodd" d="M2.25 5.25a3 3 0 0 1 3-3h13.5a3 3 0 0 1 3 3V15a3 3 0 0 1-3 3h-3v.257c0 .597.237 1.17.659 1.591l.621.622a.75.75 0 0 1-.53 1.28h-9a.75.75 0 0 1-.53-1.28l.621-.622a2.25 2.25 0 0 0 .659-1.59V18h-3a3 3 0 0 1-3-3V5.25Zm1.5 0v7.5a1.5 1.5 0 0 0 1.5 1.5h13.5a1.5 1.5 0 0 0 1.5-1.5v-7.5a1.5 1.5 0 0 0-1.5-1.5H5.25a1.5 1.5 0 0 0-1.5 1.5Z" clip-rule="evenodd" />
            </svg>
            <p className="text-white text-sm m-auto align-middle text-center font-medium mt-4 md:text-xl">Universiteto politika ir administracija</p>
          </div>
        </div>
      )}
      </div>

    </div>

    </>
  );
};

export default Home;
