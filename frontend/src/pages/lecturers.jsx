import React, { useState, useEffect } from "react";
import { useStateContext } from "../context/contextProvider";
import { useNavigate } from "react-router-dom";
import ProfilePicture from "../assets/profile-default-icon.png";
import StarRating from "../components/starRating/starRating";
import DiscussionList from "../components/lists/discussionList";
import RatingsList from "../components/lists/ratingsList";
import { AcademicIcon } from "../components/icons";

// Mock lecturer data
const lecturers = [
    {
        id: 1,
        name: "Rimantas Butleris",
        profession: "Programų sistemų profesorius",
        faculty: "Informatikos fakultetas",
        rating: 4.9,
        university: "Kauno technologijos universitetas"
    },
    {
        id: 2,
        name: "Vita Masteikaitė",
        profession: "Informatikos dėstytoja",
        faculty: "Informatikos fakultetas",
        rating: 4.7,
        university: "Kauno technologijos universitetas"
    },
    {
        id: 3,
        name: "Tomas Blažauskas",
        profession: "Multimedijos profesorius",
        faculty: "Informatikos fakultetas",
        rating: 4.5,
        university: "Kauno technologijos universitetas"
    },
    {
        id: 4,
        name: "Jonas Jonaitis",
        profession: "Matematikos docentas",
        faculty: "Matematikos fakultetas",
        rating: 4.2,
        university: "Vilniaus universitetas"
    },
    {
        id: 5,
        name: "Petras Petraitis",
        profession: "Fizikos profesorius",
        faculty: "Fizikos fakultetas",
        rating: 3.8,
        university: "Vilniaus universitetas"
    },
    {
        id: 6,
        name: "Ona Onaitė",
        profession: "Ekonomikos dėstytoja",
        faculty: "Ekonomikos fakultetas",
        rating: 4.1,
        university: "Vytauto Didžiojo universitetas"
    }
];

const topRatingsLecturers = [
    {
        id: 6,
        first: "Ona Onaitė",
        second: "Vytauto Didžiojo universitetas",
        rating: 5,
        reviewCount: 10
    },
    {
        id: 5,
        first: "Petras Petraitis",
        second: "Vytauto Didžiojo universitetas",
        rating: 2.2,
        reviewCount: 5
    },
    {
        id: 4,
        first: "Jonas Jonaitis",
        second: "Vytauto Didžiojo universitetas",
        rating: 3.6,
        reviewCount: 3
    },
    {
        id: 3,
        first: "Tomas Blažauskas",
        second: "Vilniaus universitetas",
        rating: 1,
        reviewCount: 1
    }
]

// Mock discussion data
const discussions = [
    { title: 'Kokia jūsų patirtis su profesoriumi Butleriu?', date: '2025-12-01', comment_count: 5 },
    { title: 'Ką manote apie Vitos Masteikaitės paskaitas?', date: '2025-12-02', comment_count: 3 },
    { title: 'Kuris dėstytojas labiausiai patiko šiais metais?', date: '2025-12-01', comment_count: 8 },
    { title: 'Ar sunkūs profesoriaus Jonaičio atsiskaitymai?', date: '2025-12-02', comment_count: 4 },
];

const LecturersPage = () => {
    const { user } = useStateContext();
    const navigate = useNavigate();
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedUniversity, setSelectedUniversity] = useState(null);
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [sortBy, setSortBy] = useState("rating"); // Default sort by rating
    const [sortOrder, setSortOrder] = useState("desc"); // Default sort order (descending)
    const [sortDropdownOpen, setSortDropdownOpen] = useState(false);
    const [filteredLecturers, setFilteredLecturers] = useState(lecturers);

    // Get unique universities from lecturer data
    const universities = [...new Set(lecturers.map(lecturer => lecturer.university))];
    
    // Get unique faculties based on selected university
    const faculties = selectedUniversity
        ? [...new Set(lecturers
            .filter(lecturer => lecturer.university === selectedUniversity)
            .map(lecturer => lecturer.faculty))]
        : [];

    // Filter and sort lecturers
    useEffect(() => {
        let result = [...lecturers];
        
        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            result = result.filter(lecturer => 
                lecturer.name.toLowerCase().includes(query) || 
                lecturer.profession.toLowerCase().includes(query)
            );
        }
        
        // Apply university filter
        if (selectedUniversity) {
            result = result.filter(lecturer => lecturer.university === selectedUniversity);
        }
        
        // Apply faculty filter
        if (selectedFaculty) {
            result = result.filter(lecturer => lecturer.faculty === selectedFaculty);
        }
        
        // Apply sorting
        result.sort((a, b) => {
            if (sortBy === "rating") {
                return sortOrder === "desc" ? b.rating - a.rating : a.rating - b.rating;
            } else if (sortBy === "name") {
                return sortOrder === "desc" 
                    ? b.name.localeCompare(a.name) 
                    : a.name.localeCompare(b.name);
            }
            return 0;
        });
        
        setFilteredLecturers(result);
    }, [searchQuery, selectedUniversity, selectedFaculty, sortBy, sortOrder]);

    const handleSortChange = (sortType) => {
        if (sortBy === sortType) {
            // Toggle sort order if clicking the same sort type
            setSortOrder(sortOrder === "desc" ? "asc" : "desc");
        } else {
            // Set new sort type and reset to descending order
            setSortBy(sortType);
            setSortOrder("desc");
        }
        
        // Close dropdown
        setSortDropdownOpen(false);
    };

    const handleUniversityChange = (e) => {
        const universityName = e.target.value === "all" ? null : e.target.value;
        setSelectedUniversity(universityName);
        setSelectedFaculty(null); // Reset faculty when university changes
    };

    const handleFacultyChange = (e) => {
        setSelectedFaculty(e.target.value === "all" ? null : e.target.value);
    };

    const handleLecturerClick = (lecturerId) => {
        navigate(`/destytojai/${lecturerId}`);
    };

    return (
        <div className="flex flex-col justify-center items-center mt-10">
            <div className="flex flex-row gap-5 justify-center w-full">
                <div className="flex flex-col items-center w-11/12 lg:w-7/12">
                    <h1 className="text-white font-bold text-2xl mb-6 self-start">Dėstytojai</h1>
                    
                    {/* Search and Filter Section */}
                    <div className="w-full bg-grey rounded-md p-6 mb-8">
                        <div className="flex flex-col md:flex-row gap-4 mb-4">
                            {/* Search Input */}
                            <div className="flex-1">
                                <label className="block text-white mb-2 font-medium">Ieškoti dėstytojo</label>
                                <div className="flex">
                                    <input 
                                        type="text" 
                                        className="w-full bg-dark text-white rounded-md p-2 border border-light-grey focus:border-lght-blue"
                                        placeholder="Įveskite dėstytojo vardą arba specializaciją..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                    <button className="bg-dark border-lght-blue border-2 rounded-lg p-2 pl-4 pr-4 ml-2 hover:bg-light-grey transition-colors transition-duration-150 ease-linear">
                                        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-lght-blue">
                                            <path fillRule="evenodd" d="M10.5 3.75a6.75 6.75 0 100 13.5 6.75 6.75 0 000-13.5zM2.25 10.5a8.25 8.25 0 1114.59 5.28l4.69 4.69a.75.75 0 11-1.06 1.06l-4.69-4.69A8.25 8.25 0 012.25 10.5z" clipRule="evenodd" />
                                        </svg>
                                    </button>
                                </div>
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
                        
                        <div className="flex flex-col md:flex-row gap-4">
                            {/* University Filter */}
                            <div className="flex-1">
                                <label className="block text-white mb-2 font-medium">Universitetas</label>
                                <select 
                                    className="w-full bg-dark text-white rounded-md p-2 border border-light-grey"
                                    value={selectedUniversity || "all"}
                                    onChange={handleUniversityChange}
                                >
                                    <option value="all">Visi universitetai</option>
                                    {universities.map(university => (
                                        <option key={university} value={university}>
                                            {university}
                                        </option>
                                    ))}
                                </select>
                            </div>
                            
                            {/* Faculty Filter */}
                            <div className="flex-1">
                                <label className="block text-white mb-2 font-medium">Fakultetas</label>
                                <select 
                                    className="w-full bg-dark text-white rounded-md p-2 border border-light-grey"
                                    disabled={!selectedUniversity}
                                    value={selectedFaculty || "all"}
                                    onChange={handleFacultyChange}
                                >
                                    <option value="all">Visi fakultetai</option>
                                    {faculties.map(faculty => (
                                        <option key={faculty} value={faculty}>
                                            {faculty}
                                        </option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    
                    {/* Lecturers Grid */}
                    {filteredLecturers.length > 0 ? (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 w-full">
                            {filteredLecturers.map((lecturer) => (
                                <div 
                                    key={lecturer.id} 
                                    className="flex flex-col justify-center rounded-md items-center p-6 bg-grey cursor-pointer hover:bg-dark transition-colors duration-150 ease-in"
                                    onClick={() => handleLecturerClick(lecturer.id)}
                                >
                                    <img src={ProfilePicture} className="size-28 mb-4" alt={lecturer.name} />
                                    <h2 className="font-medium text-white text-xl mb-1">{lecturer.name}</h2>
                                    <p className="font-medium text-light-grey text-sm mb-1">{lecturer.profession}</p>
                                    <p className="font-medium text-light-grey text-xs mb-4">{lecturer.university}</p>
                                    <StarRating rating={lecturer.rating} width={6} />
                                </div>
                            ))}
                        </div>
                    ) : (
                        <div className="w-full p-8 bg-grey rounded-md text-center">
                            <p className="text-light-grey">Nerasta dėstytojų pagal pasirinktus kriterijus.</p>
                        </div>
                    )}
                </div>
                
                {/* Sidebar */}
                <div className="w-2/12 hidden sticky top-0 lg:block md:w-3/12">
                    <RatingsList
                        listName="Top dėstytojai"
                        IconComponent={AcademicIcon}
                        discussions={topRatingsLecturers}
                    />
                </div>
            </div>
        </div>
    );
}

export default LecturersPage;
