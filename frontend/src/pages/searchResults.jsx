import React, { useState, useEffect } from 'react';
import { useLocation, Link, useNavigate } from 'react-router-dom';
import { ForumAPI } from '../utils/API';
import { useStateContext } from '../context/contextProvider';
import PostCard from '../components/cards/postCard';
import Breadcrumb from '../components/navigation/breadcrumb';

const SearchResults = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useStateContext();
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pagination, setPagination] = useState({});
  
  const [searchParams, setSearchParams] = useState({
    keyword: '',
    university_id: '',
    faculty_id: '',
    program_id: '',
    category_id: '',
    from_date: '',
    to_date: '',
    min_likes: '',
    user_id: '',
    sort_by: 'date',
    sort_order: 'desc',
    per_page: 10,
    page: 1
  });
  
  const [universities, setUniversities] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [categories, setCategories] = useState([]);
  const [filtersVisible, setFiltersVisible] = useState(false);
  
  useEffect(() => {
    console.log('SearchResults: Location changed', { 
      search: location.search,
      state: location.state 
    });
    
    const queryParams = new URLSearchParams(location.search);
    const keyword = queryParams.get('q') || '';
    
    const newParams = {...searchParams};
    
    for (const [key, value] of queryParams.entries()) {
      if (key === 'q') {
        newParams.keyword = value;
      } else {
        newParams[key] = value;
      }
    }
    
    console.log('Search parameters from URL:', newParams);
    
    const hasActualSearchCriteria = newParams.keyword || 
                                   newParams.university_id || 
                                   newParams.faculty_id || 
                                   newParams.program_id ||
                                   newParams.category_id ||
                                   newParams.from_date ||
                                   newParams.to_date ||
                                   newParams.min_likes ||
                                   newParams.user_id;
    
    if (Object.keys(newParams).length > 0) {
      setSearchParams(newParams);
      
      if (hasActualSearchCriteria) {
        const cleanParams = {};
        Object.keys(newParams).forEach(key => {
          if (newParams[key] !== '' && newParams[key] !== null) {
            cleanParams[key] = newParams[key];
          }
        });
        
        if (cleanParams.keyword) {
          cleanParams.q = cleanParams.keyword;
          delete cleanParams.keyword;
        }
        
        setTimeout(() => {
          console.log('Performing immediate search with URL parameters:', cleanParams);
          setLoading(true);
          ForumAPI.searchPosts(cleanParams)
            .then(response => {
              if (response.data) {
                setSearchResults(response.data.data || []);
                setPagination(response.data.pagination || {});
                console.log(`Found ${response.data.data?.length || 0} results`);
              }
              setLoading(false);
            })
            .catch(error => {
              console.error('Error in immediate search:', error);
              setError('Failed to load search results. Please try again.');
              setSearchResults([]);
              setLoading(false);
            });
        }, 0);
      }
    } else if (location.state?.searchParams) {
      console.log('Using search params from location state:', location.state.searchParams);
      setSearchParams(location.state.searchParams);
    }
    
    loadFilterOptions();
    
  }, [location]);
  
  useEffect(() => {
    console.log('Search parameters changed:', searchParams);
    
    const hasSearchCriteria = searchParams.keyword || 
                             searchParams.university_id || 
                             searchParams.faculty_id || 
                             searchParams.program_id ||
                             searchParams.category_id ||
                             searchParams.from_date ||
                             searchParams.to_date ||
                             searchParams.min_likes ||
                             searchParams.user_id;
    
    if (hasSearchCriteria) {
      console.log('Performing search with criteria:', hasSearchCriteria);
      performSearch();
    } else {
      setLoading(false);
      console.log('No search criteria provided, skipping search');
    }
  }, [
    searchParams.keyword,
    searchParams.university_id,
    searchParams.faculty_id,
    searchParams.program_id,
    searchParams.category_id,
    searchParams.from_date,
    searchParams.to_date,
    searchParams.min_likes,
    searchParams.user_id,
    searchParams.page, 
    searchParams.per_page, 
    searchParams.sort_by, 
    searchParams.sort_order,
  ]);

  const loadFilterOptions = async () => {
    try {
      console.log('Loading filter options');
      
      const universitiesResponse = await ForumAPI.getUniversityForums();
      setUniversities(universitiesResponse.data || []);
      
      const categoriesResponse = await ForumAPI.getCategories();
      setCategories(categoriesResponse.data || []);
      
      if (searchParams.university_id) {
        loadFaculties(searchParams.university_id);
      }
      
      if (searchParams.faculty_id) {
        loadPrograms(searchParams.faculty_id);
      }
    } catch (error) {
      console.error('Error loading filter options:', error);
    }
  };
  
  const loadFaculties = async (universityId) => {
    try {
      console.log('Loading faculties for university:', universityId);
      const response = await ForumAPI.getFacultiesByUniversity(universityId);
      setFaculties(response.data || []);
    } catch (error) {
      console.error('Error loading faculties:', error);
    }
  };
  
  const loadPrograms = async (facultyId) => {
    try {
      console.log('Loading programs for faculty:', facultyId);
      const response = await ForumAPI.getProgramsByFaculty(facultyId);
      setPrograms(response.data || []);
    } catch (error) {
      console.error('Error loading programs:', error);
    }
  };
  
  const performSearch = async () => {
    console.log('🔍 Beginning search operation with params:', searchParams);
    setLoading(true);
    setError(null);
    
    try {
      const cleanParams = {};
      Object.keys(searchParams).forEach(key => {
        if (searchParams[key] !== '' && searchParams[key] !== null) {
          cleanParams[key] = searchParams[key];
        }
      });
      
      console.log('Cleaned search parameters:', cleanParams);
      
      if (Object.keys(cleanParams).length === 0) {
        console.warn('No search parameters provided after cleaning');
        setSearchResults([]);
        setPagination({});
        setLoading(false);
        return;
      }
      
      if (cleanParams.keyword) {
        cleanParams.q = cleanParams.keyword;
        delete cleanParams.keyword;
      }
      
      console.log('Calling API.searchPosts with params:', cleanParams);
      const response = await ForumAPI.searchPosts(cleanParams);
      
      console.log('Search response received:', response);
      
      if (response.data) {
        setSearchResults(response.data.data || []);
        setPagination(response.data.pagination || {});
        console.log(`Found ${response.data.data?.length || 0} results`);
      } else {
        console.warn('No data in search response');
        setSearchResults([]);
        setPagination({});
      }
    } catch (error) {
      console.error('Error performing search:', error);
      setError('Failed to load search results. Please try again.');
      setSearchResults([]);
    } finally {
      setLoading(false);
      console.log('Search operation completed');
    }
  };
  
  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log('Search form submitted with params:', searchParams);
    setSearchParams(prev => ({ ...prev, page: 1 }));
    performSearch();
    
    const queryParams = new URLSearchParams();
    if (searchParams.keyword) {
      queryParams.set('q', searchParams.keyword);
    }
    if (searchParams.university_id) queryParams.set('university_id', searchParams.university_id);
    if (searchParams.faculty_id) queryParams.set('faculty_id', searchParams.faculty_id);
    if (searchParams.program_id) queryParams.set('program_id', searchParams.program_id);
    if (searchParams.category_id) queryParams.set('category_id', searchParams.category_id);
    if (searchParams.from_date) queryParams.set('from_date', searchParams.from_date);
    if (searchParams.to_date) queryParams.set('to_date', searchParams.to_date);
    if (searchParams.min_likes) queryParams.set('min_likes', searchParams.min_likes);
    if (searchParams.user_id) queryParams.set('user_id', searchParams.user_id);
    
    navigate({ 
      pathname: '/paieska', 
      search: queryParams.toString()
    }, { replace: true });
  };
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    console.log(`Search input changed: ${name} = ${value}`);
    setSearchParams(prev => ({ ...prev, [name]: value }));
    
    if (name === 'university_id' && value) {
      loadFaculties(value);
      setSearchParams(prev => ({ ...prev, faculty_id: '', program_id: '' }));
    } else if (name === 'faculty_id' && value) {
      loadPrograms(value);
      setSearchParams(prev => ({ ...prev, program_id: '' }));
    }
  };
  
  const handleSortChange = (e) => {
    const value = e.target.value;
    const [sortBy, sortOrder] = value.split('-');
    console.log(`Sort changed: ${sortBy}-${sortOrder}`);
    setSearchParams(prev => ({ ...prev, sort_by: sortBy, sort_order: sortOrder }));
  };
  
  const handlePageChange = (newPage) => {
    if (newPage > 0 && newPage <= pagination.last_page) {
      console.log(`Page changed to: ${newPage}`);
      setSearchParams(prev => ({ ...prev, page: newPage }));
    }
  };
  
  const toggleFilters = () => {
    setFiltersVisible(!filtersVisible);
  };
  
  const clearFilters = () => {
    console.log('Clearing filters');
    setSearchParams({
      keyword: searchParams.keyword,
      university_id: '',
      faculty_id: '',
      program_id: '',
      category_id: '',
      from_date: '',
      to_date: '',
      min_likes: '',
      user_id: '',
      sort_by: 'date',
      sort_order: 'desc',
      per_page: 10,
      page: 1
    });
    setFaculties([]);
    setPrograms([]);
  };
  
  return (
    <div className="container mx-auto px-4 py-8 max-w-screen-xl">
      {/* Breadcrumb */}
      <Breadcrumb items={[
        { label: 'Pagrindinis', path: '/pagrindinis' },
        { label: 'Paieška', path: '/paieska' }
      ]} />
      
      {/* Search Header */}
      <div className="bg-dark/90 border border-light-grey/20 rounded-lg p-6 mb-8 shadow-lg">
        <h1 className="text-2xl font-bold text-white mb-4">
          {searchParams.keyword ? 
            `Paieškos rezultatai: "${searchParams.keyword}"` : 
            'Išplėstinė paieška'
          }
        </h1>
        
        <form onSubmit={handleSearchSubmit} className="space-y-4">
          {/* Main search input */}
          <div className="flex flex-col md:flex-row gap-3">
            <div className="flex-1">
              <input
                type="text"
                name="keyword"
                value={searchParams.keyword}
                onChange={handleInputChange}
                placeholder="Įveskite paieškos raktažodį..."
                className="w-full bg-grey/80 text-white px-4 py-3 rounded-md border border-light-grey/30 focus:border-lght-blue focus:outline-none"
              />
            </div>
            <button
              type="submit"
              className="bg-lght-blue hover:bg-blue-600 text-white px-6 py-3 rounded-md transition duration-200"
            >
              Ieškoti
            </button>
            <button
              type="button"
              onClick={toggleFilters}
              className={`flex items-center justify-center gap-2 px-6 py-3 rounded-md transition duration-200 ${
                filtersVisible ? 'bg-lght-blue/80 text-white' : 'bg-grey text-white'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
                <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
              </svg>
              Filtrai
            </button>
          </div>
          
          {/* Advanced filters panel */}
          {filtersVisible && (
            <div className="bg-dark/70 border border-light-grey/20 rounded-md p-4 mt-4 animate-fade-in">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                {/* University filter */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Universitetas</label>
                  <select
                    name="university_id"
                    value={searchParams.university_id}
                    onChange={handleInputChange}
                    className="w-full bg-grey/80 text-white px-3 py-2 rounded-md border border-light-grey/30 focus:border-lght-blue focus:outline-none"
                  >
                    <option value="">Visi universitetai</option>
                    {universities.map(uni => (
                      <option key={uni.id} value={uni.entity_id}>
                        {uni.entity_name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Faculty filter */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Fakultetas</label>
                  <select
                    name="faculty_id"
                    value={searchParams.faculty_id}
                    onChange={handleInputChange}
                    disabled={!searchParams.university_id}
                    className="w-full bg-grey/80 text-white px-3 py-2 rounded-md border border-light-grey/30 focus:border-lght-blue focus:outline-none disabled:opacity-50"
                  >
                    <option value="">Visi fakultetai</option>
                    {faculties.map(faculty => (
                      <option key={faculty.id} value={faculty.id}>
                        {faculty.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Program filter */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Programa</label>
                  <select
                    name="program_id"
                    value={searchParams.program_id}
                    onChange={handleInputChange}
                    disabled={!searchParams.faculty_id}
                    className="w-full bg-grey/80 text-white px-3 py-2 rounded-md border border-light-grey/30 focus:border-lght-blue focus:outline-none disabled:opacity-50"
                  >
                    <option value="">Visos programos</option>
                    {programs.map(program => (
                      <option key={program.id} value={program.id}>
                        {program.title}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Category filter */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Kategorija</label>
                  <select
                    name="category_id"
                    value={searchParams.category_id}
                    onChange={handleInputChange}
                    className="w-full bg-grey/80 text-white px-3 py-2 rounded-md border border-light-grey/30 focus:border-lght-blue focus:outline-none"
                  >
                    <option value="">Visos kategorijos</option>
                    {categories.map(category => (
                      <option key={category.id} value={category.id}>
                        {category.name}
                      </option>
                    ))}
                  </select>
                </div>
                
                {/* Date range - from */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Nuo datos</label>
                  <input
                    type="date"
                    name="from_date"
                    value={searchParams.from_date}
                    onChange={handleInputChange}
                    className="w-full bg-grey/80 text-white px-3 py-2 rounded-md border border-light-grey/30 focus:border-lght-blue focus:outline-none"
                  />
                </div>
                
                {/* Date range - to */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Iki datos</label>
                  <input
                    type="date"
                    name="to_date"
                    value={searchParams.to_date}
                    onChange={handleInputChange}
                    className="w-full bg-grey/80 text-white px-3 py-2 rounded-md border border-light-grey/30 focus:border-lght-blue focus:outline-none"
                  />
                </div>
                
                {/* Min likes */}
                <div>
                  <label className="block text-white text-sm font-medium mb-2">Min. įvertinimas</label>
                  <input
                    type="number"
                    name="min_likes"
                    value={searchParams.min_likes}
                    onChange={handleInputChange}
                    min="0"
                    className="w-full bg-grey/80 text-white px-3 py-2 rounded-md border border-light-grey/30 focus:border-lght-blue focus:outline-none"
                  />
                </div>
                
                {/* User posts filter (if logged in) */}
                {user && (
                  <div className="flex items-center mt-2">
                    <label className="flex items-center text-white text-sm cursor-pointer">
                      <input
                        type="checkbox"
                        name="show_own_posts"
                        checked={searchParams.user_id === user.id}
                        onChange={(e) => {
                          setSearchParams(prev => ({
                            ...prev,
                            user_id: e.target.checked ? user.id : ''
                          }));
                        }}
                        className="mr-2 h-4 w-4"
                      />
                      Tik mano įrašai
                    </label>
                  </div>
                )}
              </div>
              
              <div className="flex justify-between mt-4">
                <button
                  type="button"
                  onClick={clearFilters}
                  className="bg-grey hover:bg-grey/60 text-white px-4 py-2 rounded-md transition duration-200"
                >
                  Išvalyti filtrus
                </button>
                <button
                  type="submit"
                  className="bg-lght-blue hover:bg-blue-600 text-white px-4 py-2 rounded-md transition duration-200"
                >
                  Pritaikyti filtrus
                </button>
              </div>
            </div>
          )}
        </form>
      </div>
      
      {/* Results and Sorting Section */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row justify-between items-center bg-dark/90 border border-light-grey/20 rounded-lg p-4 mb-4">
          <div className="text-white mb-4 md:mb-0">
            {pagination.total !== undefined && (
              <p>Rasta rezultatų: <span className="font-bold">{pagination.total}</span></p>
            )}
          </div>
          
          <div className="flex items-center gap-3">
            <label className="text-white text-sm">Rikiuoti pagal:</label>
            <select
              value={`${searchParams.sort_by}-${searchParams.sort_order}`}
              onChange={handleSortChange}
              className="bg-grey/80 text-white px-3 py-2 rounded-md border border-light-grey/30 focus:border-lght-blue focus:outline-none"
            >
              <option value="date-desc">Naujausias</option>
              <option value="date-asc">Seniausias</option>
              <option value="likes-desc">Daugiausiai įvertinimų</option>
              <option value="comments-desc">Daugiausiai komentarų</option>
              <option value="views-desc">Daugiausiai peržiūrų</option>
            </select>
            
            <select
              name="per_page"
              value={searchParams.per_page}
              onChange={handleInputChange}
              className="bg-grey/80 text-white px-3 py-2 rounded-md border border-light-grey/30 focus:border-lght-blue focus:outline-none"
            >
              <option value="10">10 per puslapį</option>
              <option value="20">20 per puslapį</option>
              <option value="50">50 per puslapį</option>
            </select>
          </div>
        </div>
      </div>
      
      {/* Search Results */}
      <div className="space-y-4">
        {loading ? (
          <div className="flex justify-center my-12">
            <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-lght-blue"></div>
          </div>
        ) : error ? (
          <div className="bg-red-600/20 border border-red-600/30 text-white p-4 rounded-md">
            {error}
          </div>
        ) : searchResults.length === 0 ? (
          <div className="bg-dark/90 border border-light-grey/20 rounded-lg p-8 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-16 h-16 mx-auto text-light-grey mb-4">
              <path strokeLinecap="round" strokeLinejoin="round" d="M15.182 16.318A4.486 4.486 0 0012.016 15a4.486 4.486 0 00-3.198 1.318M21 12a9 9 0 11-18 0 9 9 0 0118 0zM9.75 9.75c0 .414-.168.75-.375.75S9 10.164 9 9.75 9.168 9 9.375 9s.375.336.375.75zm-.375 0h.008v.015h-.008V9.75zm5.625 0c0 .414-.168.75-.375.75s-.375-.336-.375-.75.168-.75.375-.75.375.336.375.75zm-.375 0h.008v.015h-.008V9.75z" />
            </svg>
            <h3 className="text-xl font-medium text-white mb-2">Nėra rezultatų</h3>
            <p className="text-light-grey">
              Nerasta įrašų, atitinkančių jūsų paieškos kriterijus. 
              Pabandykite pakeisti paieškos nuostatas arba išvalyti filtrus.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            {searchResults.map(post => (
              <PostCard 
                key={post.id} 
                post={post} 
                onClick={() => {
                  let postUrl = '/irasai/' + post.id;
                  
                  if (post.forum_info) {
                    const { forum_info } = post;
                    
                    if (forum_info.entity_type === 'university') {
                      postUrl = `/forumai/universitetai/${forum_info.entity_id}/irasai/${post.id}`;
                    } else if (forum_info.entity_type === 'faculty') {
                      postUrl = `/forumai/universitetai/${forum_info.university_id}/fakultetai/${forum_info.entity_id}/irasai/${post.id}`;
                    } else if (forum_info.entity_type === 'program') {
                      postUrl = `/forumai/universitetai/${forum_info.university_id}/fakultetai/${forum_info.faculty_id}/programos/${forum_info.entity_id}/irasai/${post.id}`;
                    } else if (forum_info.entity_type === 'general') {
                      postUrl = `/forumai/bendros-diskusijos/irasai/${post.id}`;
                    } else if (forum_info.entity_type === 'category') {
                      postUrl = `/forumai/kategorijos/${forum_info.entity_id}/irasai/${post.id}`;
                    }
                  }
                  
                  navigate(postUrl);
                }}
              />
            ))}
          </div>
        )}
      </div>
      
      {/* Pagination */}
      {!loading && pagination.total > 0 && (
        <div className="flex justify-center mt-8">
          <nav className="flex items-center space-x-2">
            <button
              onClick={() => handlePageChange(1)}
              disabled={pagination.current_page === 1}
              className="px-3 py-1 bg-grey/80 rounded-md text-white disabled:opacity-50"
            >
              «
            </button>
            <button
              onClick={() => handlePageChange(pagination.current_page - 1)}
              disabled={pagination.current_page === 1}
              className="px-3 py-1 bg-grey/80 rounded-md text-white disabled:opacity-50"
            >
              ‹
            </button>
            
            <div className="flex items-center space-x-1">
              {[...Array(Math.min(5, pagination.last_page)).keys()].map(i => {
                let pageNum;
                if (pagination.last_page <= 5) {
                  pageNum = i + 1;
                } else if (pagination.current_page <= 3) {
                  pageNum = i + 1;
                } else if (pagination.current_page >= pagination.last_page - 2) {
                  pageNum = pagination.last_page - 4 + i;
                } else {
                  pageNum = pagination.current_page - 2 + i;
                }
                
                return (
                  <button
                    key={i}
                    onClick={() => handlePageChange(pageNum)}
                    className={`px-3 py-1 rounded-md ${
                      pagination.current_page === pageNum
                        ? 'bg-lght-blue text-white'
                        : 'bg-grey/80 text-white'
                    }`}
                  >
                    {pageNum}
                  </button>
                );
              })}
            </div>
            
            <button
              onClick={() => handlePageChange(pagination.current_page + 1)}
              disabled={pagination.current_page === pagination.last_page}
              className="px-3 py-1 bg-grey/80 rounded-md text-white disabled:opacity-50"
            >
              ›
            </button>
            <button
              onClick={() => handlePageChange(pagination.last_page)}
              disabled={pagination.current_page === pagination.last_page}
              className="px-3 py-1 bg-grey/80 rounded-md text-white disabled:opacity-50"
            >
              »
            </button>
          </nav>
        </div>
      )}
    </div>
  );
};

export default SearchResults; 