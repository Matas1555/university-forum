import {React, useState, useEffect} from "react";
import { NavLink } from "react-router-dom"
import NavLinks from "./navLinks"
import MegaMenu from "./megaMenu"

const NavBar = () => {
  const [filtersClicked, setOpenFilters] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);

  const handleClick = () => {
    setOpenFilters(!filtersClicked);
  };

  useEffect(() => {
    const handleScroll = () => {
      if (megaMenuOpen) {
        setMegaMenuOpen(false);
      }
    };

    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, [megaMenuOpen]);

  return (
    <header className="bg-dark top-0 flex-col w-full z-[20] flex p-5">
      <div className="flex flex-row justify-between items-center">  
        <div className="flex items-center gap-10">
          <NavLink style={{ fontWeight:600, fontSize:"1.5em"}} className="text-white hover:text-lght-blue transition: duration-150 ease-linear" to='/pagrindinis'>UniForum</NavLink>  
          <MegaMenu isOpen={megaMenuOpen} setIsOpen={setMegaMenuOpen} />
        </div>
        <NavLinks></NavLinks>
      </div>
      
      <div className="flex flex-col w-full items-center m-auto md:w-6/12">
        <div className="mt-5 mb-10 w-full flex flex-row m-auto"> {/* Search bar */}
          <button  className={`rounded-lg p-2 pl-4 pr-4 mr-2 hover:bg-lght-blue transition-colors transition: duration-150 ease-linear ${
                      filtersClicked ? "bg-lght-blue " : "bg-grey"
                    }`}
          onClick={handleClick}>
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-white">
              <path d="M6 12a.75.75 0 0 1-.75-.75v-7.5a.75.75 0 1 1 1.5 0v7.5A.75.75 0 0 1 6 12ZM18 12a.75.75 0 0 1-.75-.75v-7.5a.75.75 0 0 1 1.5 0v7.5A.75.75 0 0 1 18 12ZM6.75 20.25v-1.5a.75.75 0 0 0-1.5 0v1.5a.75.75 0 0 0 1.5 0ZM18.75 18.75v1.5a.75.75 0 0 1-1.5 0v-1.5a.75.75 0 0 1 1.5 0ZM12.75 5.25v-1.5a.75.75 0 0 0-1.5 0v1.5a.75.75 0 0 0 1.5 0ZM12 21a.75.75 0 0 1-.75-.75v-7.5a.75.75 0 0 1 1.5 0v7.5A.75.75 0 0 1 12 21ZM3.75 15a2.25 2.25 0 1 0 4.5 0 2.25 2.25 0 0 0-4.5 0ZM12 11.25a2.25 2.25 0 1 1 0-4.5 2.25 2.25 0 0 1 0 4.5ZM15.75 15a2.25 2.25 0 1 0 4.5 0 2.25 2.25 0 0 0-4.5 0Z" />
            </svg>
          </button>
          <input className="bg-grey text-white rounded-md p-4 pl-4 pr-4 text-xs w-full focus:border-lght-blue" placeholder="Ieškokite per visus forumus..."/>
          <button className="bg-grey border-lght-blue border-2 rounded-lg p-2 pl-4 pr-4 ml-2 hover:bg-dark transition-colors transition: duration-150 ease-linear">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-lght-blue">
            <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
          </svg>
          </button>
        </div>

        <div className={`grid grid-cols-2 grid-rows-1 gap-5 w-10/12 mb-10 ${
          filtersClicked ? " " : "hidden"
        }`}> {/* Filter screen*/}
          <select className="bg-grey text-white p-3 rounded-md">
            <option value="none">Pasirinkite universiteta...</option>
            <option value="KTU" className="">Kauno Technologijos universitetas</option>
            <option value="KTU">Kauno Technologijos universitetas</option>
            <option value="KTU">Kauno Technologijos universitetas</option>
            <option value="KTU">Kauno Technologijos universitetas</option>
            <option value="KTU">Kauno Technologijos universitetas</option>
          </select>
          <select className="bg-grey text-white p-3 rounded-m">
            <option value="none">Pasirinkite universiteta...</option>
            <option value="KTU" className="">Kauno Technologijos universitetas</option>
            <option value="KTU">Kauno Technologijos universitetas</option>
            <option value="KTU">Kauno Technologijos universitetas</option>
            <option value="KTU">Kauno Technologijos universitetas</option>
            <option value="KTU">Kauno Technologijos universitetas</option>
          </select>
          <select className="bg-grey text-white p-3 rounded-md">
            <option value="none">Pasirinkite universiteta...</option>
            <option value="KTU" className="">Kauno Technologijos universitetas</option>
            <option value="KTU">Kauno Technologijos universitetas</option>
            <option value="KTU">Kauno Technologijos universitetas</option>
            <option value="KTU">Kauno Technologijos universitetas</option>
            <option value="KTU">Kauno Technologijos universitetas</option>
          </select>
          <select className="bg-grey text-white p-3 rounded-md">
            <option value="none">Pasirinkite universiteta...</option>
            <option value="KTU" className="">Kauno Technologijos universitetas</option>
            <option value="KTU">Kauno Technologijos universitetas</option>
            <option value="KTU">Kauno Technologijos universitetas</option>
            <option value="KTU">Kauno Technologijos universitetas</option>
            <option value="KTU">Kauno Technologijos universitetas</option>
          </select>
        </div>
       </div>
    </header>
  )
}

export default NavBar
