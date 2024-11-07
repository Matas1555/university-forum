import React from "react";
import { TabGroup, TabList, Tab, TabPanels, TabPanel } from "@headlessui/react";
import UniversityList from "../components/universityList";
import PostList from "../components/postList";

const Home = () => {
  return (
    <>
      {/* Custom CSS for hover and active (selected) border */}
      <style>
        {`
          .tab-underline::after {
            content: '';
            display: block;
            width: 0;
            height: 2px;
            background-color: #176B87; 
            transition: width 0.2s ease-in;
          }

          .tab-underline:hover::after {
            width: 120%;
          }

          .tab-underline-selected::after {
            width: 120%;
          }
        `}
      </style>

      <div className="flex h-screen w-full h-full justify-center pt-8 px-4">
        <TabGroup className="w-full h-full">
          <TabList className="flex flex-row gap-40 justify-center">
            {/* Use the selected state from Headless UI to add the selected class */}
            <Tab style={{fontFamily: "Inter", fontWeight:400, fontSize:"1.5em"}}
              className={({ selected }) =>
                selected
                  ? "tab-underline tab-underline-selected text-blue pb-2 outline-none"
                  : "tab-underline text-blue-500 pb-2 outline-none"
              }
            >
              Įrašai
            </Tab>
            <Tab style={{fontFamily: "Inter", fontWeight:400, fontSize:"1.5em"}}
              className={({ selected }) =>
                selected
                  ? "tab-underline tab-underline-selected text-blue pb-2 outline-none"
                  : "tab-underline text-blue-500 pb-2 outline-none"
              }
            >
              Universitetai
            </Tab>
            <Tab style={{fontFamily: "Inter", fontWeight:400, fontSize:"1.5em"}}
              className={({ selected }) =>
                selected
                  ? "tab-underline tab-underline-selected text-blue pb-2 outline-none"
                  : "tab-underline text-blue-500 pb-2 outline-none"
              }
            >
              Kategorijos
            </Tab>
          </TabList>
          <TabPanels className="mt-10">
            <TabPanel>
              <PostList/>
            </TabPanel>
            <TabPanel>
              <UniversityList/>
            </TabPanel>
            <TabPanel>Content 3</TabPanel>
          </TabPanels>
        </TabGroup>
      </div>
    </>
  );
};

export default Home;
