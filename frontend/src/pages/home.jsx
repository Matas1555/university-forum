import React from "react";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/react";
import UniversityList from "../components/lists/universityList";
import PostList from "../components/lists/postList";

const Home = () => {
  return (
    <>
    <div className="h-screen w-full items-center gap-10 flex flex-col md:flex-row">

      <div className="mt-5 w-5/6"> {/* Search bar */}
        <input className="bg-grey rounded-md p-4 pl-4 pr-4 text-xs w-full focus: border-blue" placeholder="Ieškokite per visus forumus..."/>
      </div>

      <div className="w-3/4"> {/* Prisijungusio vartotojo irasai */}
        <div className="flex flex-row mb-2 gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-white">
            <path stroke-linecap="round" stroke-linejoin="round" d="m20.25 7.5-.625 10.632a2.25 2.25 0 0 1-2.247 2.118H6.622a2.25 2.25 0 0 1-2.247-2.118L3.75 7.5M10 11.25h4M3.375 7.5h17.25c.621 0 1.125-.504 1.125-1.125v-1.5c0-.621-.504-1.125-1.125-1.125H3.375c-.621 0-1.125.504-1.125 1.125v1.5c0 .621.504 1.125 1.125 1.125Z" />
          </svg>
          <p className="text-white font- text-base">Jūsų įrašai</p>
        </div>
        
        <div className=" bg-grey rounded-md p-2 flex items-center justify-center flex-col">
          <div className="flex w-full justify-between pt-3 p-2 pb-5 pr-2"> 
            <p className="text-white font-normal text-base">Kokia jūsų patirtis šiame mo...</p>
            <div className="flex flex-row gap-1">
              <p className="flex gap-1 text-white">2</p>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
              </svg>
            </div>
          </div>
          <div className="flex w-full justify-between pt-3 p-2 pb-5 pr-2"> 
            <p className="text-white font-normal text-base">Ar VDU geriau negu KTU?</p>
            <div className="flex flex-row gap-1">
              <p className="flex gap-1 text-white">4</p>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
              </svg>
            </div>
          </div>
          <div className="flex w-full justify-center border-t-2 border-t-dark p-1 pt-2">
            <p className="text-white">Rodyti daugiau</p>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 text-white">
              <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
        </div>
        </div>
      </div>

      <div className="w-3/4 mt-5"> {/* Naujausiu irasu meniu */}
        <div className="flex flex-row mb-2 gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-white">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 0 1-2.25 2.25M16.5 7.5V18a2.25 2.25 0 0 0 2.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 0 0 2.25 2.25h13.5M6 7.5h3v3H6v-3Z" />
          </svg>
          <p className="text-white font- text-base">Naujausi įrašai</p>
        </div>
        
        <div className=" bg-grey rounded-md p-2 flex items-center justify-center flex-col">
          <div className="flex w-full justify-between pt-3 p-2 pb-5 pr-2"> 
            <p className="text-white font-normal text-base">Kokia jūsų patirtis šiame mo...</p>
            <div className="flex flex-row gap-1">
              <p className="flex gap-1 text-white">2</p>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
              </svg>
            </div>
          </div>
          <div className="flex w-full justify-between pt-3 p-2 pb-5 pr-2"> 
            <p className="text-white font-normal text-base">Ar VDU geriau negu KTU?</p>
            <div className="flex flex-row gap-1">
              <p className="flex gap-1 text-white">4</p>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M2.25 12.76c0 1.6 1.123 2.994 2.707 3.227 1.087.16 2.185.283 3.293.369V21l4.076-4.076a1.526 1.526 0 0 1 1.037-.443 48.282 48.282 0 0 0 5.68-.494c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
              </svg>
            </div>
          </div>
          <div className="flex w-full justify-center border-t-2 border-t-dark p-1 pt-2">
            <p className="text-white">Rodyti daugiau</p>
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 text-white">
              <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
            </svg>
        </div>
        </div>
      </div>

      <div>

      </div>
    </div>

    </>
  );
};

export default Home;
