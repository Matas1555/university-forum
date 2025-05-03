import {React, useState, useEffect} from "react";
import { NavLink, useNavigate } from "react-router-dom";
import NavLinks from "./navLinks"
import MegaMenu from "./megaMenu"
import { ForumAPI } from "../../utils/API";
import { useStateContext } from "../../context/contextProvider";

const NavBar = () => {
  const { user } = useStateContext();
  const [filtersClicked, setOpenFilters] = useState(false);
  const [megaMenuOpen, setMegaMenuOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedUniversity, setSelectedUniversity] = useState("");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [fromDate, setFromDate] = useState("");
  const [toDate, setToDate] = useState("");
  const [minLikes, setMinLikes] = useState("");
  const [showOwnPosts, setShowOwnPosts] = useState(false);

  const [universities, setUniversities] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [categories, setCategories] = useState([]);
  
  const navigate = useNavigate();

  const handleClick = () => {
    setOpenFilters(!filtersClicked);

    if (!filtersClicked && universities.length === 0) {
      loadFilterOptions();
    }
  };

  const loadFilterOptions = async () => {
    try {
      const universitiesResponse = await ForumAPI.getUniversityForums();
      setUniversities(universitiesResponse.data || []);
      
      const categoriesResponse = await ForumAPI.getCategories();
      setCategories(categoriesResponse.data || []);
      
      console.log('Loaded filter options:', {
        universities: universitiesResponse.data,
        categories: categoriesResponse.data
      });
    } catch (error) {
      console.error('Error loading filter options:', error);
    }
  };
  
  useEffect(() => {
    const loadFaculties = async () => {
      if (selectedUniversity) {
        try {
          const response = await ForumAPI.getFacultiesByUniversity(selectedUniversity);
          setFaculties(response.data || []);
          console.log('Loaded faculties for university ID', selectedUniversity, ':', response.data);
        } catch (error) {
          console.error('Error loading faculties:', error);
        }
      } else {
        setFaculties([]);
      }
      setSelectedFaculty("");
      setSelectedProgram("");
      setPrograms([]);
    };
    
    loadFaculties();
  }, [selectedUniversity]);
  
  useEffect(() => {
    const loadPrograms = async () => {
      if (selectedFaculty) {
        try {
          const response = await ForumAPI.getProgramsByFaculty(selectedFaculty);
          setPrograms(response.data || []);
          console.log('Loaded programs for faculty ID', selectedFaculty, ':', response.data);
        } catch (error) {
          console.error('Error loading programs:', error);
        }
      } else {
        setPrograms([]);
      }
      setSelectedProgram("");
    };
    
    loadPrograms();
  }, [selectedFaculty]);

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

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    
    if (searchQuery.trim()) {
      const params = new URLSearchParams();
      params.append('q', searchQuery.trim());
      
      if (selectedUniversity) params.append('university_id', selectedUniversity);
      if (selectedFaculty) params.append('faculty_id', selectedFaculty);
      if (selectedProgram) params.append('program_id', selectedProgram);
      if (selectedCategory) params.append('category_id', selectedCategory);
      if (fromDate) params.append('from_date', fromDate);
      if (toDate) params.append('to_date', toDate);
      if (minLikes) params.append('min_likes', minLikes);
      if (showOwnPosts && user) params.append('user_id', user.id);
      
      // Log search parameters
      const searchParams = {};
      for (const [key, value] of params.entries()) {
        searchParams[key] = value;
      }
      console.log('Quick search with parameters:', searchParams);
      
      navigate(`/paieska?${params.toString()}`);
      setSearchQuery("");
      setOpenFilters(false);
    }
  };

  const handleAdvancedSearch = () => {
    const params = new URLSearchParams();
    if (searchQuery.trim()) params.append('q', searchQuery.trim());
    if (selectedUniversity) params.append('university_id', selectedUniversity);
    if (selectedFaculty) params.append('faculty_id', selectedFaculty);
    if (selectedProgram) params.append('program_id', selectedProgram);
    if (selectedCategory) params.append('category_id', selectedCategory);
    if (fromDate) params.append('from_date', fromDate);
    if (toDate) params.append('to_date', toDate);
    if (minLikes) params.append('min_likes', minLikes);
    if (showOwnPosts && user) params.append('user_id', user.id);
    
    // Log search parameters
    const searchParams = {};
    for (const [key, value] of params.entries()) {
      searchParams[key] = value;
    }
    console.log('Advanced search with parameters:', searchParams);
    
    // If no parameters are provided, add debug info
    if (Object.keys(searchParams).length === 0) {
      console.log('No search parameters provided. Form state:', {
        searchQuery,
        selectedUniversity,
        selectedFaculty,
        selectedProgram,
        selectedCategory,
        fromDate,
        toDate,
        minLikes,
        showOwnPosts,
        userId: user?.id
      });
    }
    
    navigate(`/paieska?${params.toString()}`);
    setOpenFilters(false);
  };
  
  const clearFilters = () => {
    setSelectedUniversity("");
    setSelectedFaculty("");
    setSelectedProgram("");
    setSelectedCategory("");
    setFromDate("");
    setToDate("");
    setMinLikes("");
    setShowOwnPosts(false);
    console.log('Filters cleared');
  };

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
        <form onSubmit={handleSearchSubmit} className="mt-5 mb-4 w-full flex flex-row"> {/* Search bar */}
          <div className="relative flex-grow flex h-12">
            <input 
              type="text" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="bg-grey/80 text-white rounded-l-md p-3 pl-4 pr-4 text-sm w-full focus:border-lght-blue focus:outline-none focus:ring-1 focus:ring-lght-blue" 
              placeholder="Ieškokite per visus forumus..."
            />
            <button
              type="button"
              onClick={handleClick}
              className={`h-full px-4 flex items-center justify-center ${filtersClicked ? 'bg-lght-blue' : 'bg-grey/90 hover:bg-grey'} transition-colors duration-150`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
              </svg>
            </button>
            <button 
              type="submit"
              className="h-full bg-lght-blue hover:bg-blue-600 text-white px-5 rounded-r-md flex items-center justify-center transition-colors duration-150"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-5.197-5.197m0 0A7.5 7.5 0 105.196 5.196a7.5 7.5 0 0010.607 10.607z" />
              </svg>
            </button>
          </div>
        </form>

        <div className={`bg-dark/90 rounded-md p-4 w-full mb-4 border border-light-grey/20 shadow-lg transition-all duration-300 ${
          filtersClicked ? "opacity-100 max-h-[500px] overflow-y-auto" : "opacity-0 max-h-0 overflow-hidden p-0 border-0"
        }`}> {/* Filter screen*/}
          <p className="text-white text-sm mb-3">Išplėstinė paieška</p>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            {/* Academic hierarchy filters */}
            <div>
              <label className="block text-white text-xs mb-1">Universitetas</label>
              <select 
                className="w-full bg-grey/80 text-white p-2 text-sm rounded-md border border-light-grey/30"
                value={selectedUniversity}
                onChange={(e) => setSelectedUniversity(e.target.value)}
              >
                <option value="">Visi universitetai</option>
                {universities.map(uni => (
                  <option key={uni.id} value={uni.entity_id}>
                    {uni.entity_name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-white text-xs mb-1">Fakultetas</label>
              <select 
                className="w-full bg-grey/80 text-white p-2 text-sm rounded-md border border-light-grey/30"
                value={selectedFaculty}
                onChange={(e) => setSelectedFaculty(e.target.value)}
                disabled={!selectedUniversity}
              >
                <option value="">Visi fakultetai</option>
                {faculties.map(faculty => (
                  <option key={faculty.id} value={faculty.id}>
                    {faculty.name}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-white text-xs mb-1">Programa</label>
              <select 
                className="w-full bg-grey/80 text-white p-2 text-sm rounded-md border border-light-grey/30"
                value={selectedProgram}
                onChange={(e) => setSelectedProgram(e.target.value)}
                disabled={!selectedFaculty}
              >
                <option value="">Visos programos</option>
                {programs.map(program => (
                  <option key={program.id} value={program.id}>
                    {program.title}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-white text-xs mb-1">Kategorija</label>
              <select 
                className="w-full bg-grey/80 text-white p-2 text-sm rounded-md border border-light-grey/30"
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
              >
                <option value="">Visos kategorijos</option>
                {categories.map(category => (
                  <option key={category.id} value={category.id}>
                    {category.name}
                  </option>
                ))}
              </select>
            </div>
            
            {/* Date range filters */}
            <div>
              <label className="block text-white text-xs mb-1">Nuo datos</label>
              <input 
                type="date"
                className="w-full bg-grey/80 text-white p-2 text-sm rounded-md border border-light-grey/30"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
              />
            </div>
            <div>
              <label className="block text-white text-xs mb-1">Iki datos</label>
              <input 
                type="date"
                className="w-full bg-grey/80 text-white p-2 text-sm rounded-md border border-light-grey/30"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
              />
            </div>
            
            {/* Additional filters */}
            <div>
              <label className="block text-white text-xs mb-1">Min. patiktukų</label>
              <input 
                type="number"
                min="0"
                className="w-full bg-grey/80 text-white p-2 text-sm rounded-md border border-light-grey/30"
                value={minLikes}
                onChange={(e) => setMinLikes(e.target.value)}
                placeholder="0"
              />
            </div>
            
            {/* User posts filter */}
            {user && (
              <div className="flex items-center">
                <label className="flex items-center space-x-2 cursor-pointer mt-4">
                  <input 
                    type="checkbox"
                    className="form-checkbox h-4 w-4 text-lght-blue rounded focus:ring-lght-blue"
                    checked={showOwnPosts}
                    onChange={(e) => setShowOwnPosts(e.target.checked)}
                  />
                  <span className="text-white text-xs">Tik mano įrašai</span>
                </label>
              </div>
            )}
          </div>
          
          <div className="flex justify-between mt-4">
            <button 
              type="button"
              onClick={clearFilters}
              className="bg-grey hover:bg-grey/60 text-white text-sm px-4 py-2 rounded-md transition-colors duration-150"
            >
              Išvalyti
            </button>
            <button 
              type="button"
              onClick={handleAdvancedSearch}
              className="bg-lght-blue hover:bg-blue-600 text-white text-sm px-4 py-2 rounded-md transition-colors duration-150"
            >
              Išplėstinė paieška
            </button>
          </div>
        </div>
       </div>
    </header>
  )
}

export default NavBar
