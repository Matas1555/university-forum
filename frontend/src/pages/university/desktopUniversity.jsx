import {React, useState, useEffect} from 'react';
import { useStateContext } from "../../context/contextProvider";
import API, { ForumAPI } from '../../utils/API';
import { useLocation, useParams } from 'react-router-dom';
import KTU_logo from "../../../public/assets/KTU-logo.png";
import StarRating from "../../components/starRating/starRating";
import InteractiveStarRating from "../../components/starRating/interactiveStarRating";
import ProfilePicture from "../../assets/profile-default-icon.png";
import { mockData } from '../../utils/mockData';
import RichTextEditor from '../../components/richTextEditor/RichTextEditor';
import RatingsList from '../../components/lists/ratingsList';
import { AcademicIcon } from '../../components/icons';

const DesktopUniversity = () => {
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
    const [selectedDegreeType, setSelectedDegreeType] = useState(true);
    const [userRating, setUserRating] = useState(0);
    
    const [universityData, setUniversityData] = useState(null);
    const [faculties, setFaculties] = useState([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchUniversityData = async () => {
            setIsLoading(true);
            try {
                const response = await ForumAPI.getFacultiesWithPrograms(universityId);
                const facultiesWithPrograms = response.data;
                console.log(facultiesWithPrograms);
                
                setFaculties(facultiesWithPrograms);
                
                if (facultiesWithPrograms.length > 0) {
                    const firstFaculty = facultiesWithPrograms[0];
                    setSelectedFaculty(firstFaculty);
                    
                    if (firstFaculty.programs && firstFaculty.programs.length > 0) {
                        setSelectedProgram(firstFaculty.programs[0]);
                    }
                }
                
                setIsLoading(false);
            } catch (err) {
                console.error("Error fetching university data:", err);
                setError("Failed to load university data");
                setIsLoading(false);
            }
        };
        
        fetchUniversityData();
    }, [universityId]);
    
    const handleFacultySelect = async (faculty) => {
        try {
            setIsLoading(true);
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
            
            const programsResponse = await ForumAPI.getProgramsByFaculty(faculty.id);
            const programsData = programsResponse.data;
            
            const updatedFaculty = {
                ...faculty,
                programs: programsData
            };
            
            setFaculties(prevFaculties => prevFaculties.map(f => 
                f.id === faculty.id ? updatedFaculty : f
            ));
            
            setSelectedFaculty(updatedFaculty);
            
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

    const topRatingsPrograms = [
        {
            first: "Programų sistemos",
            second: "Informatikos fakultetas",
            rating: 5,
            reviewCount: 10
        },
        {
            first: "Dirbtinis intelektas",
            second: "Cheminės technologijos fakultetas",
            rating: 2.2,
            reviewCount: 5
        },
        {
            first: "Informatika",
            second: "Matematikos ir gamtos fakultetas",
            rating: 3.6,
            reviewCount: 3
        },
        {
            first: "Informatikos inžinerija",
            second: "Ekonomikos ir verslo fakultetas",
            rating: 1,
            reviewCount: 1
        }
    ]
    

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

    const handleNewReview = () => {
        setreviewScreenIsOpen(!reviewScreenIsOpen);
    }

    const handleRatingChange = (newRating) => {
        setUserRating(newRating);
    };

    return (
        <>
            <div className="flex flex-col justify-center items-center m-10">
                <div className="flex flex-row gap-10 w-full xl:w-4/5 content-center items justify-center border-t-2 border-b-2 p-10 border-light-grey">
                    <img className="size-24 xl:size-40" src={KTU_logo}/>
                    <div className="flex flex-col justify-between">
                        <h1 className="text-white font-bold text-2xl md:text-6xl">
                            {universityData ? universityData.name : "Kauno Technologijos Universitetas"}
                        </h1>
                        <div className='flex flex-row justify-between'>
                            <StarRating rating={universityData ? universityData.rating : 4.2} width={10} />
                            <button className='ring-2 p-2 rounded-md'> 
                                <div className='flex flex-row gap-2'>
                                    <p className='text-lght-blue font-medium'>Forumas</p>       
                                    <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6 text-lght-blue">
                                    <path d="M4.913 2.658c2.075-.27 4.19-.408 6.337-.408 2.147 0 4.262.139 6.337.408 1.922.25 3.291 1.861 3.405 3.727a4.403 4.403 0 0 0-1.032-.211 50.89 50.89 0 0 0-8.42 0c-2.358.196-4.04 2.19-4.04 4.434v4.286a4.47 4.47 0 0 0 2.433 3.984L7.28 21.53A.75.75 0 0 1 6 21v-4.03a48.527 48.527 0 0 1-1.087-.128C2.905 16.58 1.5 14.833 1.5 12.862V6.638c0-1.97 1.405-3.718 3.413-3.979Z" />
                                    <path d="M15.75 7.5c-1.376 0-2.739.057-4.086.169C10.124 7.797 9 9.103 9 10.609v4.285c0 1.507 1.128 2.814 2.67 2.94 1.243.102 2.5.157 3.768.165l2.782 2.781a.75.75 0 0 0 1.28-.53v-2.39l.33-.026c1.542-.125 2.67-1.433 2.67-2.94v-4.286c0-1.505-1.125-2.811-2.664-2.94A49.392 49.392 0 0 0 15.75 7.5Z" />
                                    </svg>
                                </div>
                            </button>
                        </div>
                    </div>
                </div>

                <div className='flex flex-row w-full mt-20 items-start'>
                    <div className='flex flex-row w-full gap-4 items-center'>
                        <div className="mt-5 rounded-md bg-grey p-4 min-w-96 max-w-96">
                            <div className="flex justify-between mb-6">
                                <h1 className="font-bold text-white">Pasirinkite fakultetą</h1>
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
                                <div className="flex flex-col gap-2 overflow-auto scrollbar-custom max-h-96">
                                    {faculties.map((faculty, index) => {
                                        const colorClass = colorClasses[index % colorClasses.length];
                                        return (
                                            <div 
                                                key={faculty.id || faculty.abbreviation}
                                                className={`flex fles-row gap-2 mr-2 p-2 py-4 cursor-pointer rounded-md hover:bg-dark transition-color duration-150 ease-in ${
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

                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-10 text-light-grey font-bold">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    
                        <div>
                            <div className='flex flex-row justify-center gap-10 text-white font-medium items-center'>
                                <buttons className={`ring-2 p-2 px-6 rounded-md cursor-pointer transition-colors duration-150 ease-in ring-lght-blue hover:bg-lght-blue
                                    ${
                                        selectedDegreeType ? 'bg-lght-blue' : 'bg-dark'
                                    }`} 
                                    onClick={(e) => setSelectedDegreeType(!selectedDegreeType)}>Bakalauras
                                </buttons>
                                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-light-grey">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M7.5 21 3 16.5m0 0L7.5 12M3 16.5h13.5m0-13.5L21 7.5m0 0L16.5 12M21 7.5H7.5" />
                                </svg>

                                <buttons className={`ring-2 p-2 px-6 rounded-md cursor-pointer transition-colors duration-150 ease-in ring-lght-blue hover:bg-lght-blue
                                    ${
                                        !selectedDegreeType ? 'bg-lght-blue' : 'bg-dark'
                                    }`}
                                    onClick={(e) => setSelectedDegreeType(!selectedDegreeType)}>Magistras
                                </buttons>
                            </div>
                            <div className="mt-5 rounded-md bg-grey p-4 min-w-96 max-w-96 ">
                                <div className="flex justify-between mb-6">
                                    <h1 className="font-bold text-white mb-5">Pasirinkite programą</h1>
                                </div>
                                
                                {isLoading ? (
                                    <div className="text-center p-6 text-light-grey">
                                        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-lght-blue mx-auto mb-4"></div>
                                        Kraunamos programos...
                                    </div>
                                ) : (
                                    <div className="flex flex-col gap-2 overflow-auto scrollbar-custom max-h-96">
                                        {!selectedFaculty ? (
                                            <div className="text-center p-4 text-light-grey">
                                                Pasirinkite fakultetą, kad matytumėte programas
                                            </div>
                                        ) : !selectedFaculty.programs || selectedFaculty.programs.length === 0 ? (
                                            <div className="text-center p-4 text-light-grey">
                                                Nėra programų šiam fakultetui
                                            </div>
                                        ) : (
                                            selectedFaculty.programs
                                                .filter(program => selectedDegreeType 
                                                    ? program.degree_type === 'bachelor' || program.generalInfo?.type === 'Bakalauras'
                                                    : program.degree_type === 'master' || program.generalInfo?.type === 'Magistras'
                                                )
                                                .map((program) => (
                                                <div 
                                                    key={program.id || program.name}
                                                    className={`flex flex-row justify-between items-center rounded-md p-2 border-dark py-4 mr-2 hover:bg-dark cursor-pointer transition-color duration-150 ease-in ${
                                                        selectedProgram?.id === program.id || selectedProgram?.name === program.name ? 'bg-lght-blue rounded-md' : ''
                                                    }`}
                                                    onClick={() => {
                                                        setSelectedProgram(program);
                                                        setStojimaiActive(true); 
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

                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-10 text-light-grey font-bold">
                        <path stroke-linecap="round" stroke-linejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
                        </svg>
                    </div>


                    {selectedProgram && (
                        <div className="flex flex-col justify-center mt-10 text-white w-full">
                            <div className="flex justify-center mb-4 mx-20">
                                <h1 className="text-white font-bold text-xl">{selectedProgram.name}</h1>
                            </div>
                            
                            <div className="flex flex-col justify-center w-full">
                                <table className="table-auto mx-20">
                                    <tbody>
                                        <tr className="border-b-[1px] border-t-[1px]">
                                            <td className="p-4">Metinė kaina</td>
                                            <td className="p-4 text-end">~{selectedProgram.price}€</td>
                                        </tr>
                                        <tr className="border-b-[1px] border-t-[1px]">
                                            <td className="p-4">Trukmė</td>
                                            <td className="p-4 text-end">{selectedProgram.duration} metai</td>
                                        </tr>
                                        <tr className="border-b-[1px] border-t-[1px]">
                                            <td className="p-4">Pakopa</td>
                                            <td className="p-4 text-end">{selectedProgram.degree_type}</td>
                                        </tr>
                                        <tr className="border-b-[1px] border-t-[1px]">
                                            <td className="p-4">Priemimas iki</td>
                                            <td className="p-4 text-end">2025.08.19</td>
                                        </tr>
                                        <tr className="border-b-[1px] border-t-[1px]">
                                            <td className="p-4">Priėmimo procentas</td>
                                            <td className="p-4 text-end">45%</td>
                                        </tr>
                                        <tr className="border-b-[1px] border-t-[1px]">
                                            <td className="p-4">Studentų skaičius</td>
                                            <td className="p-4 text-end">~85 tūkst.</td>
                                        </tr>
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    )}
                    </div>

                <div className='flex flex-row w-full gap-40 mt-20 justify-center'>
                    {selectedProgram && (
                        <>
                        <div className='w-full'>
                            <div className="flex flex-row justify-around mt-10 mb-20">
                                
                                <button className={` p-1 px-2 hover:text-lght-blue text-2xl font-medium transition duration-150 ease-in
                                    ${moduliaiActive ? "text-lght-blue border-b-2 border-lght-blue" : "text-white"}
                                    `}
                                    onClick={handleShowModuliai}
                                    >
                                        <div className='flex flex-row gap-2 items-center'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M12 6.042A8.967 8.967 0 0 0 6 3.75c-1.052 0-2.062.18-3 .512v14.25A8.987 8.987 0 0 1 6 18c2.305 0 4.408.867 6 2.292m0-14.25a8.966 8.966 0 0 1 6-2.292c1.052 0 2.062.18 3 .512v14.25A8.987 8.987 0 0 0 18 18a8.967 8.967 0 0 0-6 2.292m0-14.25v14.25" />
                                            </svg>
                                            Moduliai
                                        </div>
                                    </button>
                                <button className={` p-1 px-2 hover:text-lght-blue text-2xl font-medium transition duration-150 ease-in
                                    ${destytojaiActive ? "text-lght-blue border-b-2 border-lght-blue" : "text-white"}
                                    `} 
                                    onClick={handleShowDestytojai}
                                    >
                                        <div className='flex flex-row gap-2 items-center'>
                                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                                        </svg>
                                            Dėstytojai
                                        </div>
                                    </button>
                                <button className={` p-1 px-2 hover:text-lght-blue text-2xl font-medium transition duration-150 ease-in
                                    ${atsiliepimaiActive ? "text-lght-blue border-b-2 border-lght-blue" : "text-white"}
                                    `}
                                    onClick={handleShowAtsilipimai}>
                                        <div className='flex flex-row gap-2 items-center'>
                                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6">
                                            <path stroke-linecap="round" stroke-linejoin="round" d="M8.625 12a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H8.25m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0H12m4.125 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Zm0 0h-.375M21 12c0 4.556-4.03 8.25-9 8.25a9.764 9.764 0 0 1-2.555-.337A5.972 5.972 0 0 1 5.41 20.97a5.969 5.969 0 0 1-.474-.065 4.48 4.48 0 0 0 .978-2.025c.09-.457-.133-.901-.467-1.226C3.93 16.178 3 14.189 3 12c0-4.556 4.03-8.25 9-8.25s9 3.694 9 8.25Z" />
                                            </svg>
                                            Atsiliepimai
                                        </div>
                                    </button>
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
                                    <div className='flex flex-row justify-center'>
                                        <button className='bg-lght-blue rounded-md w-full p-4 font-medium text-lg text-white' onClick={handleNewReview}>Palikite atsiliepimą</button>
                                    </div>
                                )}
                                

                                {reviewScreenIsOpen && 
                                    (
                                    <div className='flex flex-col gap-2 justify-center items-center '>
                                        <p className='text-white font-semibold text-lg'>Įvertinkite programą</p>
                                        <InteractiveStarRating initialRating={userRating} width={10} onRatingChange={handleRatingChange} />
                                        <div className='hidden md:block w-full'>
                                            <RichTextEditor 
                                                value={newReview}
                                                onChange={(e) => setReview(e.target.value)}
                                                placeholder="Tekstas"
                                            />
                                        </div>
                                        <div className='md:hidden'>
                                            <textarea rows="5" cols="32" className='bg-grey rounded-md p-2' placeholder='Kokios jūsų patirtys?'>
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
                        </>
                    )} 
                    <div className='w-4/12 mr-16'>
                        <RatingsList
                        listName="Top programos"
                        IconComponent={AcademicIcon}
                        discussions={topRatingsPrograms}
                        /> 
                    </div> 
                </div>  
            </div>
        </>
    );
  };
  
  export default DesktopUniversity;

  const LecturersSection = ({ lecturers }) => (
    <>
    <div className='flex flex-col w-full justify-center items-center'>
        <div className='flex flex-row w-2/5'>
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
                <div key={index} className='flex flex-col w-60 min-w-66 justify-center rounded-md items-center p-4 bg-grey cursor-pointer hover:bg-dark transition-colors duration-150 ease-in'>
                    <img src={ProfilePicture} className='size-28' alt="lecturer" />
                    <h1 className='font-medium text-white text-2xl mt-2'>{lecturer.name}</h1>
                    <p className='font-medium text-light-grey text-lg mb-4 text-center'>{lecturer.profession}</p>
                    <StarRating rating={lecturer.rating} width={6} />
                </div>
            ))}
        </div>
    </div>
    </>
);


const ModulesSection = ({ modules }) => {
    const [selectedSemester, setSelectedSemester] = useState(null);

    useEffect(() => {
        if (modules.length > 0 && !selectedSemester) {
            setSelectedSemester(modules[0].semester);
        }
    }, [modules]);

    return (
        <>
        <div className='flex flex-row gap-4 w-full'>
            <div className="rounded-md bg-grey p-4 ">
                <div className="flex justify-between mb-6">
                    <h1 className="font-bold text-white mb-5">Pasirinkite semestrą</h1>
                </div>
                <div className="flex flex-col max-h-80 overflow-auto scrollbar-custom gap-2">
                    {modules.map((moduleGroup) => (
                        <div 
                            key={moduleGroup.semester}
                            className={`flex flex-row justify-center items-center p-2 rounded-md border-dark py-4 mr-2 cursor-pointer hover:bg-dark transition-colors ${
                                selectedSemester === moduleGroup.semester ? 'bg-lght-blue rounded-md' : ''
                            }`}
                            onClick={() => setSelectedSemester(moduleGroup.semester)}
                        >
                            <p className="text-lg text-white font-medium">{moduleGroup.semester} semestras</p>
                        </div>
                    ))}
                </div>
            </div>
            <div className="rounded-md bg-grey p-4">
                <div className="flex justify-between mb-6">
                    <h1 className="font-bold text-white mb-5">Moduliai {selectedSemester && `(${selectedSemester} semestras)`}</h1>
                </div>
                <div className="flex flex-col max-h-80 overflow-auto scrollbar-custom gap-2">
                    {selectedSemester ? (
                        modules.find(g => g.semester === selectedSemester)?.modules.map((module, idx) => (
                            <div key={idx} className="flex flex-row gap-2 justify-between rounded-md cursor-pointer items-center p-2 hover:bg-dark transition-colors duration-150 ease-in border-dark py-4 mr-2">
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
        <div className=''>
            {reviews.slice(0, visibleReviews).map((review, index) => (
                <div key={index} className='bg-grey rounded-md p-4 mt-5'>
                    <div className='flex flex-row gap-2 justify-between'>
                        <div className='flex flex-row gap-2 justify-center items-center'>
                            <img className='size-9' src={ProfilePicture} alt="user" />
                            <div>
                                <p className='font-medium text-white'>{review.username}</p>
                                <p className='font-medium text-light-grey text-sm'>Įkelta {review.date}</p>
                            </div>
                        </div>
                    </div>
                    <div className='mt-4'>
                        <StarRating rating={review.rating} width={5} />
                    </div>
                    <div className='mt-2 text-xl text-white'>
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