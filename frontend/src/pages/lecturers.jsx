import React, { useState, useEffect } from "react";
import { useStateContext } from "../context/contextProvider";
import { useNavigate } from "react-router-dom";
import ProfilePicture from "../assets/profile-default-icon.png";
import StarRating from "../components/starRating/starRating";
import RatingsList from "../components/lists/ratingsList";
import { AcademicIcon } from "../components/icons";
import { LecturerAPI } from "../utils/API";
import forumData from "../utils/forumData.json";

const LecturersPage = () => {
    const { user } = useStateContext();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [sortBy, setSortBy] = useState("rating"); 
    const [sortOrder, setSortOrder] = useState("desc"); 
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
    const [lecturers, setLecturers] = useState([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [pagination, setPagination] = useState({
        currentPage: 1,
        perPage: 24,
        total: 0,
        lastPage: 1
    });
    const [topRatedLecturers, setTopRatedLecturers] = useState([]);
    const [selectedUniversity, setSelectedUniversity] = useState("");
    const [selectedFaculty, setSelectedFaculty] = useState("");
    const [availableFaculties, setAvailableFaculties] = useState([]);

    const sortedUniversities = [...forumData.universities].sort((a, b) => 
        a.name.localeCompare(b.name, 'lt')
    );

    const fetchLecturers = async (page = 1) => {
        setLoading(true);
        setError(null);
        
        try {
            const params = {
                page,
                per_page: pagination.perPage,
                sort_by: sortBy === 'rating' ? 'overall_rating' : 'name',
                sort_order: sortOrder,
                search: searchQuery || undefined,
                university_id: selectedUniversity || undefined,
                faculty_id: selectedFaculty || undefined
            };
            
            const response = await LecturerAPI.getLecturers(params);
            
            setLecturers(response.data.data);
            setPagination({
                currentPage: response.data.current_page,
                perPage: response.data.per_page,
                total: response.data.total,
                lastPage: response.data.last_page
            });
        } catch (err) {
            console.error("Error fetching lecturers:", err);
            setError("Failed to load lecturers. Please try again later.");
        } finally {
            setLoading(false);
        }
    };
    
    const fetchTopRatedLecturers = async () => {
        try {
            const response = await LecturerAPI.getTopRatedLecturers();
            setTopRatedLecturers(response.data.map(lecturer => ({
                id: lecturer.id,
                first: lecturer.name,
                second: lecturer.university,
                rating: Number(lecturer.rating),
                reviewCount: lecturer.rating_count
            })));
        } catch (err) {
            console.error("Error fetching top rated lecturers:", err);
        }
    };

    useEffect(() => {
        if (selectedUniversity) {
            const universityFaculties = forumData.faculties
                .filter(faculty => faculty.universityId === Number(selectedUniversity))
                .sort((a, b) => a.name.localeCompare(b.name, 'lt'));
            setAvailableFaculties(universityFaculties);
        } else {
            setAvailableFaculties([]);
        }
        setSelectedFaculty("");
    }, [selectedUniversity]);

    useEffect(() => {
        fetchLecturers();
        fetchTopRatedLecturers();
    }, []);

    useEffect(() => {
        fetchLecturers(1); 
    }, [searchQuery, sortBy, sortOrder, selectedUniversity, selectedFaculty]);

    const handleSortChange = (sortType) => {
        if (sortBy === sortType) {
 
            setSortOrder(sortOrder === "desc" ? "asc" : "desc");
        } else {

            setSortBy(sortType);
            setSortOrder("desc");
        }
        
        setSortDropdownOpen(false);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        fetchLecturers(1);
    };

    const handleLecturerClick = (lecturerId) => {
        navigate(`/destytojai/${lecturerId}`);
    };

    const handlePageChange = (page) => {
        if (page >= 1 && page <= pagination.lastPage) {
            fetchLecturers(page);
        }
    };

    const handleUniversityChange = (e) => {
        setSelectedUniversity(e.target.value);
    };

    const handleFacultyChange = (e) => {
        setSelectedFaculty(e.target.value);
    };

    const renderPagination = () => {
        const buttons = [];
        const currentPage = pagination.currentPage;
        const lastPage = pagination.lastPage;

        buttons.push(
            <button 
                key="prev" 
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
                className="px-3 py-1 mx-1 bg-dark text-white rounded-md disabled:opacity-50"
            >
                &laquo;
            </button>
        );
        
        for (let i = 1; i <= lastPage; i++) {
            if (i === 1 || i === lastPage || (i >= currentPage - 1 && i <= currentPage + 1)) {
                buttons.push(
                    <button 
                        key={i}
                        onClick={() => handlePageChange(i)}
                        className={`px-3 py-1 mx-1 rounded-md ${
                            i === currentPage 
                                ? 'bg-lght-blue text-white' 
                                : 'bg-dark text-white'
                        }`}
                    >
                        {i}
                    </button>
                );
            } else if (i === currentPage - 2 || i === currentPage + 2) {
                buttons.push(
                    <span key={`ellipsis-${i}`} className="px-3 py-1 mx-1 text-white">
                        ...
                    </span>
                );
            }
        }
        
        buttons.push(
            <button 
                key="next" 
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === lastPage}
                className="px-3 py-1 mx-1 bg-dark text-white rounded-md disabled:opacity-50"
            >
                &raquo;
            </button>
        );
        
        return buttons;
    };

    return (
        <div className="flex flex-col justify-center items-center mt-10">
            <div className="flex flex-col gap-5 justify-center items-center w-10/12">
                <div className='flex flex-col bg-grey p-4 gap-3 rounded-md items-center justify-center mb-6 w-full'>
                    <h1 className="text-white text-4xl font-bold mb-8 mt-6">Dėstytojai</h1>
                    <p className="text-white mb-6 font-medium">Čia galite rasti žinomus universitetų dėstytojus, bendrą informaciją apie juos ir jų įvertinimus. Nepamirškite palikti savo atsiliepimu.</p>
                </div>
                <div className="flex flex-row gap-5 justify-center w-full">
                <div className="flex flex-col items-center w-full lg:w-full">
                    {/* Search and Filter Section */}
                    <div className="w-full bg-grey rounded-md p-6 mb-8">
                        <div className="flex flex-col md:flex-row gap-4 mb-4">
                            {/* Search Input */}
                            <div className="flex-1">
                                <label className="block text-white mb-2 font-medium">Ieškoti dėstytojo</label>
                                <form onSubmit={handleSearch} className="flex">
                                    <input 
                                        type="text" 
                                        className="w-full bg-dark text-white rounded-md p-2 border border-light-grey focus:border-lght-blue"
                                        placeholder="Įveskite dėstytojo vardą arba specializaciją..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <button 
                                        type="submit"
                                        className="bg-dark border-lght-blue border-2 rounded-lg p-2 pl-4 pr-4 ml-2 hover:bg-grey transition-colors transition-duration-150 ease-linear"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-lght-blue">
                                            <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </form>
                            </div>
                            
                            {/* Sort Dropdown */}
                            <div className="md:w-1/4">
                                <label className="block text-white mb-2 font-medium">Rikiuoti pagal</label>
                                <div className="relative">
                                    <button 
                                        className="w-full bg-dark text-white rounded-md p-2 border border-light-grey hover:border-lght-blue flex justify-between items-center"
                                        onClick={() => setSortDropdownOpen(!sortDropdownOpen)}
                                    >
                                        <span>
                                            {sortBy === "rating" ? "Įvertinimus" : 
                                            sortBy === "name" ? "Vardą" : "Įvertinimus"}
                                            {" "}
                                            ({sortOrder === "desc" ? "↓" : "↑"})
                                        </span>
                                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                                            <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                    
                                    {sortDropdownOpen && (
                                        <div className="absolute z-10 w-full mt-1 bg-dark border border-light-grey rounded-md shadow-lg">
                                            <button 
                                                className="w-full text-left px-4 py-2 text-white hover:bg-grey"
                                                onClick={() => handleSortChange("rating")}
                                            >
                                                Įvertinimus
                                            </button>
                                            <button 
                                                className="w-full text-left px-4 py-2 text-white hover:bg-grey"
                                                onClick={() => handleSortChange("name")}
                                            >
                                                Vardą
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </div>
                        </div>

                        {/* University and Faculty Filter */}
                        <div className="flex flex-col md:flex-row gap-4 mt-4">
                            {/* University Filter */}
                            <div className="flex-1">
                                <label className="block text-white mb-2 font-medium">Universitetas</label>
                                <select 
                                    className="w-full bg-dark text-white rounded-md p-2 border border-light-grey focus:border-lght-blue"
                                    value={selectedUniversity}
                                    onChange={handleUniversityChange}
                                >
                                    <option value="">Visi universitetai</option>
                                    {sortedUniversities.map(university => (
                                        <option key={university.id} value={university.id}>
                                            {university.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            {/* Faculty Filter */}
                            <div className="flex-1">
                                <label className="block text-white mb-2 font-medium">Fakultetas</label>
                                <select 
                                    className="w-full bg-dark text-white rounded-md p-2 border border-light-grey focus:border-lght-blue"
                                    disabled={!selectedUniversity}
                                    value={selectedFaculty}
                                    onChange={handleFacultyChange}
                                >
                                    <option value="">Visi fakultetai</option>
                                    {availableFaculties.map(faculty => (
                                        <option key={faculty.id} value={faculty.id}>
                                            {faculty.name}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>

                    {/* Loading and Error States */}
                    {loading && (
                        <div className="w-full p-8 bg-grey rounded-md text-center">
                            <p className="text-white">Kraunami dėstytojai...</p>
                        </div>
                    )}

                    {error && (
                        <div className="w-full p-8 bg-grey rounded-md text-center">
                            <p className="text-red-500">{error}</p>
                        </div>
                    )}

                    {/* Lecturers Grid */}
                    {!loading && !error && (
                        <>
                            {lecturers.length > 0 ? (
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-3 gap-4 w-full">
                                    {lecturers.map((lecturer) => (
                                        <div 
                                            key={lecturer.id} 
                                            className="flex flex-col justify-center rounded-md items-center p-6 bg-grey cursor-pointer hover:bg-dark transition-colors duration-150 ease-in"
                                            onClick={() => handleLecturerClick(lecturer.id)}
                                        >
                                            <img src={ProfilePicture} className="size-28 mb-4" alt={lecturer.name} />
                                            <h2 className="font-medium text-center text-white text-3xl mb-1">{lecturer.name}</h2>
                                            <p className="font-medium text-center text-lighter-grey text-lg mb-1">{lecturer.profession}</p>
                                            <p className="font-medium text-center text-light-grey text-mb mb-4">{lecturer.university}</p>
                                            <StarRating rating={lecturer.rating} width={6} color="lighter-grey" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <div className="w-full p-8 bg-grey rounded-md text-center">
                                    <p className="text-light-grey">Nerasta dėstytojų pagal pasirinktus kriterijus.</p>
                                </div>
                            )}
                            
                            {/* Pagination */}
                            {lecturers.length > 0 && (
                                <div className="flex justify-center mt-8">
                                    {renderPagination()}
                                </div>
                            )}
                        </>
                    )}
                    </div>

                    {/* Sidebar */}
                    <div className="w-2/12 hidden sticky top-0 lg:block md:w-3/12">
                        <RatingsList
                            listName="Top dėstytojai"
                            IconComponent={AcademicIcon}
                            discussions={topRatedLecturers}
                        />
                    </div>
                </div>
            </div>
        </div>
    );
}

export default LecturersPage;
