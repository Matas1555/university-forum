import React, { useState } from 'react';

const FilterComponent = ({ onFilter }) => {
  // State for all filter options
  const [searchQuery, setSearchQuery] = useState('');
  const [matchWord, setMatchWord] = useState(false);
  const [ignoreCase, setIgnoreCase] = useState(true);
  const [lastUpdated, setLastUpdated] = useState('');
  const [sortBy, setSortBy] = useState('date');
  const [sortOrder, setSortOrder] = useState('desc'); // 'asc' or 'desc'
  const [isFilterOpen, setIsFilterOpen] = useState(false);

  // Handle search input change
  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  // Handle form submission
  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Collect all filter criteria
    const filterCriteria = {
      searchQuery,
      matchWord,
      ignoreCase,
      lastUpdated,
      sortBy,
      sortOrder
    };
    
    // Pass filter criteria to parent component
    if (onFilter) {
      onFilter(filterCriteria);
    }
    
    // Optionally close the filter after submission
    // setIsFilterOpen(false);
  };

  // Toggle sort order between ascending and descending
  const toggleSortOrder = () => {
    setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
  };

  // Toggle filter visibility
  const toggleFilter = () => {
    setIsFilterOpen(!isFilterOpen);
  };

  const lastUpdatedOptions = [
    { value: 'any', label: 'Bet kada' },
    { value: 'today', label: 'Dieną' },
    { value: 'week', label: '7 dienas' },
    { value: 'month', label: '30 dienų' },
    { value: 'half_year', label: '6 mėnesius' },
    { value: 'year', label: 'Metus' },
  ];

  const sortByOptions = [
    { value: 'date', label: 'Datą' },
    { value: 'title', label: 'Titulą' },
    { value: 'likes', label: 'Patikimus' },
    { value: 'comments', label: 'Komentarus' },
  ];

  return (
    <div className="bg-grey rounded-md p-4 text-white w-full">
      <h1 className='text-sm font-normal mb-2 ml-1'>Ieškokite pagal raktąžodį:</h1>
      {/* Search bar with toggle button */}
      <div className="flex items-center space-x-2">
        <div className="relative flex-grow">
          <input
            type="text"
            value={searchQuery}
            onChange={handleSearchChange}
            placeholder=""
            className="w-full bg-dark text-white px-4 py-2 rounded-md focus:ring-2 focus:ring-lght-blue outline-none"
          />
          <button 
            type="button"
            onClick={() => setSearchQuery(searchQuery && handleSubmit({ preventDefault: () => {} }))}
            className="absolute right-2 top-1/2 transform -translate-y-1/2"
          >
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-light-grey hover:text-lght-blue">
              <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3" />
            </svg>
          </button>
        </div>
        <button
          type="button"
          onClick={toggleFilter}
          className={`p-2 rounded-md ${isFilterOpen ? 'bg-lght-blue' : 'bg-dark'} text-white`}
        >
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-white">
            <path strokeLinecap="round" strokeLinejoin="round" d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 01-.659 1.591l-5.432 5.432a2.25 2.25 0 00-.659 1.591v2.927a2.25 2.25 0 01-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 00-.659-1.591L3.659 7.409A2.25 2.25 0 013 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0112 3z" />
          </svg>
        </button>
      </div>

      {isFilterOpen && (
        <form onSubmit={handleSubmit} className="space-y-2 animate-fade-in">
          <div className="flex flex-col space-y-2 mt-2 mb-10">
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="matchWord"
                checked={matchWord}
                onChange={() => setMatchWord(!matchWord)}
                className="w-4 h-4 bg-dark rounded-sm checked:border-none"
              />
              <label htmlFor="matchWord" className="text-sm">Tikslus žodžio atitikimas</label>
            </div>
            
            <div className="flex items-center space-x-2">
              <input
                type="checkbox"
                id="ignoreCase"
                checked={ignoreCase}
                onChange={() => setIgnoreCase(!ignoreCase)}
                className="w-4 h-4 bg-dark rounded-sm checked:border-none"
              />
              <label htmlFor="ignoreCase" className="text-sm">Ignoruoti didžiąsias raides</label>
            </div>
          </div>

          {/* Last updated dropdown */}
          <h1 className='text-sm font-normal ml-1'>Paskutinį kartą atnaujinta:</h1>
          <div className='mt-0'>
            <select
              value={lastUpdated}
              onChange={(e) => setLastUpdated(e.target.value)}
              className="w-full bg-dark text-white px-4 py-2 rounded-md focus:ring-2 focus:ring-lght-blue outline-none"
            >
              <option value=""></option>
              {lastUpdatedOptions.map(option => (
                <option key={option.value} value={option.value}>
                  {option.label}
                </option>
              ))}
            </select>
          </div>

          {/* Sort options and filter button row */}
          <h1 className='text-sm font-normal ml-1'>Rikiuoti pagal:</h1>
          <div className="flex flex-wrap gap-2">
            {/* Sort By dropdown */}
            <div className="flex-1 min-w-[120px]">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value)}
                className="w-full bg-dark text-white px-4 py-2 rounded-md focus:ring-2 focus:ring-lght-blue outline-none"
              >
                <option value="" disabled></option>
                {sortByOptions.map(option => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </div>

            {/* Ascending/Descending toggle */}
            <button
              type="button"
              onClick={toggleSortOrder}
              className="bg-dark text-white px-4 py-2 rounded-md hover:bg-lght-blue transition-colors min-w-[140px]"
            >
              {sortOrder === 'asc' ? 'Didėjant' : 'Mažėjant'}
            </button>

            {/* Filter button */}
            <button
              type="submit"
              className="bg-lght-blue text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
            >
              Filter
            </button>
          </div>
        </form>
      )}
    </div>
  );
};

export default FilterComponent; 