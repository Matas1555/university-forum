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
            transition: width 0.3s ease-in;
          }

          .tab-underline:hover::after {
            width: 120%;
          }

          .tab-underline-selected::after {
            width: 120%;
          }
        `}
      </style>

      <div className="flex h-screen w-full justify-center pt-20 px-4">
        <TabGroup>
          <TabList className="flex flex-row gap-40">
            {/* Use the selected state from Headless UI to add the selected class */}
            <Tab style={{fontFamily: "Inter", fontWeight:400, fontSize:"1.5em"}}
              className={({ selected }) =>
                selected
                  ? "tab-underline tab-underline-selected text-blue pb-2 "
                  : "tab-underline text-blue-500 pb-2"
              }
            >
              Įrašai
            </Tab>
            <Tab style={{fontFamily: "Inter", fontWeight:400, fontSize:"1.5em"}}
              className={({ selected }) =>
                selected
                  ? "tab-underline tab-underline-selected text-blue pb-2"
                  : "tab-underline text-blue-500 pb-2"
              }
            >
              Universitetai
            </Tab>
            <Tab style={{fontFamily: "Inter", fontWeight:400, fontSize:"1.5em"}}
              className={({ selected }) =>
                selected
                  ? "tab-underline tab-underline-selected text-blue pb-2"
                  : "tab-underline text-blue-500 pb-2"
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
