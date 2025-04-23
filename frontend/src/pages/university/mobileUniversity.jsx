import {React, useState, useEffect} from 'react';
import { useStateContext } from "../../context/contextProvider";
import API, { ForumAPI } from "../../utils/API";
import { useLocation, useParams } from 'react-router-dom';
import KTU_logo from "../../../public/assets/KTU-logo.png";
import StarRating from "../../components/starRating/starRating";
import InteractiveStarRating from "../../components/starRating/interactiveStarRating";
import ProfilePicture from "../../assets/profile-default-icon.png";
import { mockData } from '../../utils/mockData';
import RichTextEditor from '../../components/richTextEditor/RichTextEditor';

const MobileUniversity = () => {
    const {user} = useStateContext();
    const location = useLocation();
    const params = useParams();
    

    const universityId = params.universityId || (location.state && location.state.universityId) || 1;

    
    const [destytojaiActive, setStojimaiActive] = useState(true);
    const [moduliaiActive, setModuliaiActive] = useState(false);
    const [atsiliepimaiActive, setAtsiliepimaiActive] = useState(false);
    const [selectedFaculty, setSelectedFaculty] = useState(null);
    const [selectedProgram, setSelectedProgram] = useState(null);
    const [newReview, setReview] = useState("");
    const [reviewScreenIsOpen, setreviewScreenIsOpen] = useState(false);
    const [userRating, setUserRating] = useState(0);
    
    // State for dynamic data
    const [universityData, setUniversityData] = useState(null);
    const [faculties, setFaculties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);
    
    // Fetch university data, faculties, and programs
    useEffect(() => {
        const fetchUniversityData = async () => {
            setIsLoading(true);
            try {
                // Fetch university details
                const universityResponse = await ForumAPI.getUniversityById(universityId);
                setUniversityData(universityResponse.data);
                
                // Fetch faculties for this university
                const facultiesResponse = await ForumAPI.getFacultiesByUniversity(universityId);
                const facultiesData = facultiesResponse.data;
                setFaculties(facultiesData);
                
                // Select first faculty by default if available
                if (facultiesData.length > 0) {
                    const firstFaculty = facultiesData[0];
                    setSelectedFaculty(firstFaculty);
                    
                    // Fetch programs for the first faculty
                    const programsResponse = await ForumAPI.getProgramsByFaculty(firstFaculty.id);
                    const programsData = programsResponse.data;
                    
                    // Set the faculty with programs loaded
                    setSelectedFaculty({
                        ...firstFaculty,
                        programs: programsData
                    });
                    
                    // Select first program by default if available
                    if (programsData.length > 0) {
                        setSelectedProgram(programsData[0]);
                    }
                }
                setIsLoading(false);
            } catch (err) {
                console.error("Error fetching university data:", err);
                setError("Failed to load university data");
                setIsLoading(false);
                
                // Fallback to mock data if API fails
                if (mockData.length > 0) {
                    setFaculties(mockData);
                    setSelectedFaculty(mockData[0]);
                    if (mockData[0].programs.length > 0) {
                        setSelectedProgram(mockData[0].programs[0]);
                    }
                }
            }
        };
        
        fetchUniversityData();
    }, [universityId]);
    
    // Handler for faculty selection
    const handleFacultySelect = async (faculty) => {
        try {
            setIsLoading(true);
            // If the programs are already loaded, use them
            if (faculty.programs) {
                setSelectedFaculty(faculty);
                if (faculty.programs.length > 0) {
                    setSelectedProgram(faculty.programs[0]);
                } else {
                    setSelectedProgram(null);
                }
                setIsLoading(false);
                return;
            }
            
            // Otherwise, fetch the programs for the faculty
            const programsResponse = await ForumAPI.getProgramsByFaculty(faculty.id);
            const programsData = programsResponse.data;
            
            // Update the selected faculty with programs
            const updatedFaculty = {
                ...faculty,
                programs: programsData
            };
            
            // Update the faculties array to include the loaded programs
            setFaculties(prevFaculties => prevFaculties.map(f => 
                f.id === faculty.id ? updatedFaculty : f
            ));
            
            setSelectedFaculty(updatedFaculty);
            
            // Select first program by default
            if (programsData.length > 0) {
                setSelectedProgram(programsData[0]);
            } else {
                setSelectedProgram(null);
            }
            
            setIsLoading(false);
        } catch (err) {
            console.error("Error fetching programs:", err);
            setError("Failed to load programs");
            setIsLoading(false);
        }
    };

    const colorClasses = [
        'bg-blue', 
        'bg-red', 
        'bg-purple', 
        'bg-green', 
        'bg-orange', 
        'bg-light-blue'
    ];

    const handleShowDestytojai = () => {
        setStojimaiActive(true);
        setModuliaiActive(false);
        setAtsiliepimaiActive(false);
    }

    const handleShowModuliai = () => {
        setModuliaiActive(true);
        setAtsiliepimaiActive(false);
        setStojimaiActive(false);
    }

    const handleShowAtsilipimai = () => {
        setAtsiliepimaiActive(true);
        setModuliaiActive(false);
        setStojimaiActive(false);
    }

    const handleRatingChange = (newRating) => {
        setUserRating(newRating);
    };

    const handleNewReview = () => {
        setreviewScreenIsOpen(!reviewScreenIsOpen);
    }

    return (
        <>
            <div className="flex flex-col justify-center items-center m-10">
                <div className="flex flex-row gap-10 w-full xl:w-4/5 content-center items justify-center border-t-2 border-b-2 p-10 border-light-grey">
                    <img className="size-24 xl:size-40" src={KTU_logo}/>
                    <div className="flex flex-col justify-between">
                        <h1 className="text-white font-bold text-2xl md:text-6xl">
                            {universityData ? universityData.name : "Kauno Technologijos Universitetas"}
                        </h1>
                        <StarRating rating={universityData ? universityData.rating : 4.2} width={4} />
                    </div>
                </div>

                <div className='flex flex-col w-full'>
                    <div className="flex flex-row mt-20 gap-2">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-white">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                        </svg>
                        <h1 className="text-white font-medium">Programų informacija</h1>
                    </div>

                    <div className="mt-5 rounded-md bg-grey p-4 w-full">
                        <div className="flex justify-between mb-6">
                            <h1 className="font-bold text-white">Pasirinkite fakultetą</h1>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-white">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                        </div>
                        
                        {isLoading ? (
                            <div className="text-center p-6 text-light-grey">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lght-blue mx-auto mb-4"></div>
                                Kraunami fakultetai...
                            </div>
                        ) : error ? (
                            <div className="text-center p-6 text-red-500">
                                {error}
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 max-h-80 overflow-auto scrollbar-custom ">
                                {faculties.map((faculty, index) => {
                                    const colorClass = colorClasses[index % colorClasses.length];
                                    return (
                                        <div 
                                            key={faculty.id || faculty.abbreviation}
                                            className={`flex fles-row gap-2 mr-2 p-2 py-4 transition-color duration-150 ease-in ${
                                                selectedFaculty?.id === faculty.id || selectedFaculty?.name === faculty.name ? 'bg-lght-blue rounded-md' : ''
                                            }`}
                                            onClick={() => handleFacultySelect(faculty)}
                                        >
                                            <div>
                                                <div className={`flex justify-center ${colorClass} px-4 text-white rounded-md max-w-14 min-w-14`}>
                                                    {faculty.abbreviation || faculty.name.substring(0, 3)}
                                                </div>
                                            </div>
                                            <h1 className="text-white font-medium">{faculty.name}</h1>
                                        </div>
                                    );
                                })}
                            </div>
                        )}
                    </div>
                

                    <div className="mt-5 rounded-md bg-grey p-4 w-full">
                        <div className="flex justify-between mb-6">
                            <h1 className="font-bold text-white mb-5">Pasirinkite programą</h1>
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-white">
                                <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                            </svg>
                        </div>
                        {isLoading ? (
                            <div className="text-center p-6 text-light-grey">
                                <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lght-blue mx-auto mb-4"></div>
                                Kraunamos programos...
                            </div>
                        ) : (
                            <div className="flex flex-col gap-2 max-h-80 overflow-auto scrollbar-custom">
                                {!selectedFaculty ? (
                                    <div className="text-center p-4 text-light-grey">
                                        Pasirinkite fakultetą, kad matytumėte programas
                                    </div>
                                ) : !selectedFaculty.programs || selectedFaculty.programs.length === 0 ? (
                                    <div className="text-center p-4 text-light-grey">
                                        Nėra programų šiam fakultetui
                                    </div>
                                ) : (
                                    selectedFaculty.programs.map((program) => (
                                        <div 
                                            key={program.id || program.name}
                                            className={`flex flex-row justify-between items-center rounded-md p-2 border-dark py-4 mr-2 cursor-pointer transition-color duration-150 ease-in ${
                                                selectedProgram?.id === program.id || selectedProgram?.name === program.name ? 'bg-lght-blue rounded-md' : ''
                                            }`}
                                            onClick={() => {
                                                setSelectedProgram(program);
                                                setStojimaiActive(true); // Reset to default tab
                                                setModuliaiActive(false);
                                                setAtsiliepimaiActive(false);
                                            }}
                                        >
                                            <p className="text-sm text-white font-medium">{program.name}</p>
                                            <StarRating rating={program.rating || 0} width={4} />
                                        </div>
                                    ))
                                )}
                            </div>
                        )}
                    </div>
                </div>

                
                {selectedProgram && (
                    <div className="flex flex-col justify-center mt-10 text-white w-full">
                        <div className="flex justify-center mb-4">
                            <h1 className="text-white font-bold text-xl">{selectedProgram.name}</h1>
                        </div>
                        
                        <div className="flex flex-col justify-center w-auto">
                            <table className="table-auto w-full">
                                <tbody>
                                    <tr className="border-b-[1px] border-t-[1px]">
                                        <td className="p-4">Kaina</td>
                                        <td className="p-4 text-end">~{selectedProgram.price || selectedProgram.generalInfo?.price || 'N/A'}€</td>
                                    </tr>
                                    <tr className="border-b-[1px] border-t-[1px]">
                                        <td className="p-4">Trukmė</td>
                                        <td className="p-4 text-end">{selectedProgram.length || selectedProgram.generalInfo?.length || 'N/A'} metai</td>
                                    </tr>
                                    <tr className="border-b-[1px] border-t-[1px]">
                                        <td className="p-4">Pakopa</td>
                                        <td className="p-4 text-end">{selectedProgram.degree_type === 'bachelor' ? 'Bakalauras' : selectedProgram.degree_type === 'master' ? 'Magistras' : selectedProgram.generalInfo?.type || 'N/A'}</td>
                                    </tr>
                                </tbody>
                            </table>
                            <div className='flex flex-col justify-center items-center mt-2 text-lght-blue'>
                                <p>Rodyti daugiau</p>
                            </div>

                            <div className="flex flex-row justify-around mt-10">
                            
                            <button className={` p-1 px-2 hover:text-lght-blue transition duration-150 ease-in
                                ${moduliaiActive ? "text-lght-blue border-b-2" : "text-white"}
                                `}
                                onClick={handleShowModuliai}
                                >Moduliai</button>
                            <button className={` p-1 px-2 hover:text-lght-blue transition duration-150 ease-in
                                ${destytojaiActive ? "text-lght-blue border-b-2" : "text-white"}
                                `} 
                                onClick={handleShowDestytojai}
                                >Dėstytojai</button>
                            <button className={` p-1 px-2 hover:text-lght-blue transition duration-150 ease-in
                                ${atsiliepimaiActive ? "text-lght-blue border-b-2" : "text-white"}
                                `}
                                onClick={handleShowAtsilipimai}>Atsiliepimai</button>
                        </div>
                        
                            {destytojaiActive && (
                                <LecturersSection lecturers={selectedProgram.lecturers} />
                            )}
                            
                            {moduliaiActive && (
                                <ModulesSection modules={selectedProgram.modules} />
                            )}

                            {atsiliepimaiActive && (
                                <>
                                {!reviewScreenIsOpen && (
                                    <div className='flex flex-row justify-center mt-10'>
                                        <button className='bg-lght-blue rounded-md w-full p-4 font-medium text-lg' onClick={handleNewReview}>Palikite atsiliepimą</button>
                                    </div>
                                )}
                                

                                {reviewScreenIsOpen && 
                                    (
                                        <div className='flex flex-col gap-2 justify-center items-center mt-10'>
                                        <p className='text-white'>Įvertinkite programą</p>
                                        <InteractiveStarRating initialRating={userRating} width={10} onRatingChange={handleRatingChange} />
                                        <div className='hidden md:block w-full'>
                                            <RichTextEditor 
                                                value={newReview}
                                                onChange={(e) => setReview(e.target.value)}
                                                placeholder="Tekstas"
                                            />
                                        </div>
                                        <div className='md:hidden w-full'>
                                            <textarea rows="5" cols="32" className='bg-grey rounded-md p-2 w-full' placeholder='Kokios jūsų patirtys?'>
                                            </textarea>
                                        </div>
                                        <div className='flex flex-row gap-4 justify-end w-full text-white'>
                                            <button className='bg-grey rounded-md p-2 px-4' onClick={handleNewReview}>Atšaukti</button>
                                            <button className='bg-lght-blue rounded-md p-2 px-6 font-semibold'>Įkelti</button>
                                        </div>
                                    </div>
                                    )
                                }

                                <ReviewsSection reviews={selectedProgram.reviews} />
                                </>
                                
                                
                            )}
                        </div>
                    </div>
                )}    
            </div>
        </>
    );
  };
  
  export default MobileUniversity;

  const LecturersSection = ({ lecturers }) => (
    <>
        <div className='flex flex-row mt-10'>
            <input className="bg-grey text-white rounded-md p-4 pl-4 pr-4 text-xs w-full focus: border-blue focus:border-lght-blue" 
                   placeholder="Ieškokite dėstytojo..."/>
            <button className="bg-grey border-lght-blue border-2 rounded-lg p-2 pl-4 pr-4 ml-2 hover:bg-dark transition-colors transition: duration-150 ease-linear">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-lght-blue">
                    <path fillRule="evenodd" d="M16.28 11.47a.75.75 0 0 1 0 1.06l-7.5 7.5a.75.75 0 0 1-1.06-1.06L14.69 12 7.72 5.03a.75.75 0 0 1 1.06-1.06l7.5 7.5Z" clipRule="evenodd" />
                </svg>
            </button>
        </div>
        <div className='flex flex-row mt-4 gap-4 overflow-auto pb-3'>
            {lecturers.map((lecturer, index) => (
                <div key={index} className='flex flex-col w-44 min-w-44 justify-center rounded-md items-center p-4 bg-grey'>
                    <img src={ProfilePicture} className='size-14' alt="lecturer" />
                    <h1 className='font-medium'>{lecturer.name}</h1>
                    <p className='font-medium text-light-grey text-sm mb-4 text-center'>{lecturer.profession}</p>
                    <StarRating rating={lecturer.rating} width={4} />
                </div>
            ))}
        </div>
    </>
);


const ModulesSection = ({ modules }) => {
    const [selectedSemester, setSelectedSemester] = useState(null);

    // Auto-select first semester when modules load
    useEffect(() => {
        if (modules.length > 0 && !selectedSemester) {
            setSelectedSemester(modules[0].semester);
        }
    }, [modules]);

    return (
        <>
            <div className="mt-5 rounded-md bg-grey p-4 ">
                <div className="flex justify-between mb-6">
                    <h1 className="font-bold text-white mb-5">Pasirinkite semestrą</h1>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 text-white">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>
                <div className="flex flex-col max-h-80 overflow-auto scrollbar-custom">
                    {modules.map((moduleGroup) => (
                        <div 
                            key={moduleGroup.semester}
                            className={`flex flex-row justify-center items-center p-2 border-dark py-4 mr-2 cursor-pointer hover:bg-dark transition-colors ${
                                selectedSemester === moduleGroup.semester ? 'bg-lght-blue rounded-md' : ''
                            }`}
                            onClick={() => setSelectedSemester(moduleGroup.semester)}
                        >
                            <p className="text-lg text-white font-medium">{moduleGroup.semester} semestras</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="mt-5 rounded-md bg-grey p-4 ">
                <div className="flex justify-between mb-6">
                    <h1 className="font-bold text-white mb-5">Moduliai {selectedSemester && `(${selectedSemester} semestras)`}</h1>
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" className="size-6 text-white">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m19.5 8.25-7.5 7.5-7.5-7.5" />
                    </svg>
                </div>
                <div className="flex flex-col max-h-80 overflow-auto scrollbar-custom">
                    {selectedSemester ? (
                        modules.find(g => g.semester === selectedSemester)?.modules.map((module, idx) => (
                            <div key={idx} className="flex flex-row justify-between items-center border-t-[1px] p-2 border-dark py-4 mr-2">
                                <p className="text-sm text-white font-medium">{module.name}</p>
                                <StarRating rating={module.rating} width={4} />
                            </div>
                        ))
                    ) : (
                        <div className="text-center p-4 text-light-grey">
                            Pasirinkite semestrą, kad matytumėte modulius
                        </div>
                    )}
                </div>
            </div>
        </>
    );
};


const ReviewsSection = ({ reviews }) => {
    const [visibleReviews, setVisibleReviews] = useState(3);
    
    const loadMoreReviews = () => {
        setVisibleReviews(prev => prev + 3);
    };

    return (
        <div className='mt-5'>
            {reviews.slice(0, visibleReviews).map((review, index) => (
                <div key={index} className='bg-grey rounded-md p-4 mt-5'>
                    <div className='flex flex-row gap-2 justify-between'>
                        <div className='flex flex-row gap-2 justify-center items-center'>
                            <img className='size-9' src={ProfilePicture} alt="user" />
                            <div>
                                <p className='font-medium'>{review.username}</p>
                                <p className='font-medium text-light-grey text-sm'>Įkelta {review.date}</p>
                            </div>
                        </div>
                    </div>
                    <div className='mt-4'>
                        <StarRating rating={review.rating} width={4} />
                    </div>
                    <div className='mt-2'>
                        {review.comment}
                    </div>
                </div>
            ))}
            
            {visibleReviews < reviews.length && (
                <div className='flex flex-col justify-center items-center mt-4'>
                    <button 
                        onClick={loadMoreReviews}
                        className='text-lght-blue hover:underline'
                    >
                        Rodyti daugiau
                    </button>
                </div>
            )}
        </div>
    );
};