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
                <div className="bg-gradient-to-br from-dark to-grey rounded-lg border-l-2 border-lght-blue shadow-lg overflow-hidden mb-10 w-full">
                    <div className="p-8 relative">
                        {/* Background decoration */}
                        <div className="absolute top-10 right-10 w-40 h-40 bg-lght-blue/5 rounded-full blur-2xl"></div>
                        <div className="absolute bottom-10 left-10 w-32 h-32 bg-purple-500/5 rounded-full blur-xl"></div>
                        
                        {/* Header content */}
                        <div className=" flex flex-row gap-10 relative z-10 w-full">
                            <div className="w-8/12 space-y-8">
                                <div className="flex items-center gap-3 mb-4">
                                    <div className="bg-lght-blue/20 p-2 rounded-md">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8 text-lght-blue">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 6a3.75 3.75 0 1 1-7.5 0 3.75 3.75 0 0 1 7.5 0ZM4.501 20.118a7.5 7.5 0 0 1 14.998 0A17.933 17.933 0 0 1 12 21.75c-2.676 0-5.216-.584-7.499-1.632Z" />
                                        </svg>
                                    </div>
                                    <h1 className="text-white text-4xl font-bold">Dėstytojai ir akademikai</h1>
                                </div>
                                
                                <p className="text-light-grey leading-relaxed mb-6">
                                    Susipažinkite su Lietuvos universitetų dėstytojais, paskaitų vedėjais ir mokslininkais. 
                                    Šiame puslapyje rasite išsamią informaciją apie dėstytojų specializacijas, studentų atsiliepimus
                                    ir kitas aktualias detales, kurios padės geriau pažinti akademinę bendruomenę.
                                </p>

                                <p className="text-white font-medium">Naršykite, filtruokite ir atraskite dėstytojus pagal savo poreikius!</p>
                            </div>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-5 mb-6">
                                <div className="bg-dark/50 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-lght-blue">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 0 0 2.625.372 9.337 9.337 0 0 0 4.121-.952 4.125 4.125 0 0 0-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 0 1 8.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0 1 11.964-3.07M12 6.375a3.375 3.375 0 1 1-6.75 0 3.375 3.375 0 0 1 6.75 0Zm8.25 2.25a2.625 2.625 0 1 1-5.25 0 2.625 2.625 0 0 1 5.25 0Z" />
                                        </svg>
                                        <h3 className="text-white font-semibold">Daugiau nei 500+ dėstytojų</h3>
                                    </div>
                                    <p className="text-light-grey text-sm">Išsami duomenų bazė su dėstytojų profiliais iš visų Lietuvos universitetų.</p>
                                </div>
                                
                                <div className="bg-dark/50 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-lght-blue">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M11.48 3.499a.562.562 0 0 1 1.04 0l2.125 5.111a.563.563 0 0 0 .475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 0 0-.182.557l1.285 5.385a.562.562 0 0 1-.84.61l-4.725-2.885a.562.562 0 0 0-.586 0L6.982 20.54a.562.562 0 0 1-.84-.61l1.285-5.386a.562.562 0 0 0-.182-.557l-4.204-3.602a.562.562 0 0 1 .321-.988l5.518-.442a.563.563 0 0 0 .475-.345L11.48 3.5Z" />
                                        </svg>
                                        <h3 className="text-white font-semibold">Studentų įvertinimai</h3>
                                    </div>
                                    <p className="text-light-grey text-sm">Skaitykite autentiškus studentų atsiliepimus ir įvertinimus apie dėstytojų darbo metodus.</p>
                                </div>
                                
                                <div className="bg-dark/50 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-lght-blue">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="m21 21-5.197-5.197m0 0A7.5 7.5 0 1 0 5.196 5.196a7.5 7.5 0 0 0 10.607 10.607Z" />
                                        </svg>
                                        <h3 className="text-white font-semibold">Patogus filtravimas</h3>
                                    </div>
                                    <p className="text-light-grey text-sm">Naudokite paiešką ir filtrus norėdami greitai rasti dėstytojus pagal universitetą, fakultetą arba vardą.</p>
                                </div>
                                
                                <div className="bg-dark/50 rounded-lg p-4">
                                    <div className="flex items-center gap-2 mb-2">
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-lght-blue">
                                            <path strokeLinecap="round" strokeLinejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10" />
                                        </svg>
                                        <h3 className="text-white font-semibold">Palikite atsiliepimą</h3>
                                    </div>
                                    <p className="text-light-grey text-sm">Dalinkitės savo patirtimi ir padėkite kitiems studentams pasirinkti tinkamus dėstytojus.</p>
                                </div>
                            </div>
                        </div>
                    </div>
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
