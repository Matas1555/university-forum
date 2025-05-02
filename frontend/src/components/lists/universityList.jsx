import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import API from "../../utils/API";
import StarRating from "../starRating/starRating";

export default function UniversityList() {
    const [universities, setUniversities] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState("");
    const [cityFilter, setCityFilter] = useState("");
    const navigate = useNavigate();

    useEffect(() => {
        setIsLoading(true);
        API.get('/universities').then((response) => {
            setUniversities(response.data);
            setIsLoading(false);
        }).catch(error => {
            console.error("Error fetching universities:", error);
            setIsLoading(false);
            // Fallback to mock data if API fails
            setUniversities([
                {
                    id: 1,
                    name: "Kauno Technologijos universitetas",
                    location: "Kaunas",
                    rating: 4.5,
                    reviewCount: 154,
                    facultiesCount: 12,
                    programsCount: 96,
                    discussionsCount: 542,
                    picture: "ktu-logo.jpg"
                },
                {
                    id: 2,
                    name: "Vilniaus universitetas",
                    location: "Vilnius",
                    rating: 4.7,
                    reviewCount: 210,
                    facultiesCount: 14,
                    programsCount: 103,
                    discussionsCount: 685,
                    picture: "vu-logo.jpg"
                },
                {
                    id: 3,
                    name: "Vytauto Didžiojo universitetas",
                    location: "Kaunas",
                    rating: 4.2,
                    reviewCount: 89,
                    facultiesCount: 10,
                    programsCount: 74,
                    discussionsCount: 423,
                    picture: "vdu-logo.jpg"
                },
                {
                    id: 4,
                    name: "Klaipėdos universitetas",
                    location: "Klaipėda",
                    rating: 4.0,
                    reviewCount: 65,
                    facultiesCount: 8,
                    programsCount: 52,
                    discussionsCount: 287,
                    picture: "ku-logo.jpg"
                }
            ]);
        });
    }, []);

    const handleSearch = () => {
        console.log("Searching with:", searchQuery, cityFilter);
    };

    const handleOpenUniversity = (id, name) => {
        navigate(`/universitetas/${id}`, { 
            state: { 
                universityName: name,
                breadcrumbs: [
                    { label: 'Pagrindinis', path: '/' },
                    { label: 'Universitetai', path: '/universitetai' },
                    { label: name, path: `/universitetas/${id}` }
                ]
            } 
        });
    };

    const filteredUniversities = universities.filter(uni => {
        const matchesSearch = uni.name.toLowerCase().includes(searchQuery.toLowerCase());
        const matchesCity = cityFilter ? uni.location.toLowerCase() === cityFilter.toLowerCase() : true;
        return matchesSearch && matchesCity;
    });

    return (
        <div className="flex flex-col gap-8 lg:flex-row">
            {/* Sidebar filters */}
            <div className="top-32 h-auto w-full lg:w-1/5 lg:sticky lg:self-start bg-gradient-to-br from-dark to-grey border-l-2 border-lght-blue rounded-md p-4">
                <h2 className="text-white font-bold text-xl mb-4">Filtrai</h2>
                
                <div className="mb-4">
                    <label className="text-white block mb-2">Raktažodis</label>
                    <input 
                        type="text" 
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-full bg-dark text-white rounded-md p-2 border border-light-grey"
                        placeholder="Ieškoti universiteto..."
                    />
                </div>
                
                <div className="mb-6">
                    <label className="text-white block mb-2">Miestas</label>
                    <select 
                        value={cityFilter}
                        onChange={(e) => setCityFilter(e.target.value)}
                        className="w-full bg-dark text-white rounded-md p-2 border border-light-grey"
                    >
                        <option value="">Visi miestai</option>
                        <option value="Vilnius">Vilnius</option>
                        <option value="Kaunas">Kaunas</option>
                        <option value="Klaipėda">Klaipėda</option>
                        <option value="Šiauliai">Šiauliai</option>
                    </select>
                </div>
                
                <button 
                    onClick={handleSearch}
                    className="w-full bg-lght-blue text-white font-medium py-2 px-4 rounded-md hover:bg-blue-600 transition-colors"
                >
                    Ieškoti
                </button>
            </div>
            
            {/* University grid */}
            {isLoading ? (
                <div className="flex-1 flex justify-center items-center py-20">
                    <div className="w-12 h-12 border-4 border-t-lght-blue border-r-lght-blue border-light-grey rounded-full animate-spin"></div>
                </div>
            ) : (
                <div className="flex-1">
                    <div className="grid grid-cols-1 gap-6 lg:grid-cols-2 xl:grid-cols-3 md:gap-8">
                        {filteredUniversities.map((university) => (
                            <div 
                                key={university.id}
                                className="flex flex-col bg-grey rounded-md text-white overflow-hidden hover:bg-dark transition-colors duration-300 cursor-pointer group"
                                onClick={() => handleOpenUniversity(university.id, university.name)}
                            >
                                <div className="relative">
                                    <img 
                                        src="../assets/KTU.jpg" 
                                        alt={university.name}
                                        className="w-full h-48 object-cover"
                                        onError={(e) => {
                                            e.target.onerror = null;
                                            e.target.src = "/assets/university-placeholder.jpg";
                                        }}
                                    />
                                    <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-dark to-transparent h-1/2"></div>
                                </div>
                                <div className="p-4 flex flex-col h-full">
                                    <h3 className="text-lg font-bold group-hover:text-lght-blue transition-colors duration-300">
                                        {university.name}
                                    </h3>
                                    
                                    <div className="flex-grow"></div>
                                    <div className="flex items-center mt-2 mb-3">
                                        <StarRating rating={university.rating} width={4} />
                                        <span className="ml-2 text-light-grey text-sm">
                                            ({university.rating_count} {university.rating_count === 1 
                                            ? 'atsiliepimas' 
                                            : (university.rating_count >= 2 && university.rating_count <= 9) 
                                                ? 'atsiliepimai' 
                                                : 'atsiliepimų'})
                                        </span>
                                    </div>
                                    <div className="flex justify-between items-end text-sm mt-auto">
                                        <div>
                                            <p className="text-light-grey">Fakultetai</p>
                                            <p className="font-medium">{university.faculty_count}</p>
                                        </div>
                                        <div>
                                            <p className="text-light-grey">Studijų programos</p>
                                            <p className="font-medium">{university.program_count}</p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                    
                    {filteredUniversities.length === 0 && (
                        <div className="bg-grey rounded-md p-8 text-center">
                            <p className="text-light-grey">Nerasta universitetų pagal pasirinktus kriterijus.</p>
                        </div>
                    )}
                </div>
            )}
        </div>
    );
}