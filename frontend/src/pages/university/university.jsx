import { useEffect, useState } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useStateContext } from "../../context/contextProvider";
import KTU_logo from "../../../public/assets/KTU-logo.png";
import ProfilePicture from "../../assets/profile-default-icon.png";
import StarRating from "../../components/starRating/starRating";
import InteractiveStarRating from "../../components/starRating/interactiveStarRating";
import RichTextEditor from "../../components/richTextEditor/RichTextEditor";
import Tooltip from "../../components/Tooltip";

const UniversityPage = () => {
  const [activeTab, setActiveTab] = useState("programs");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1280);
  const { user } = useStateContext();
  const location = useLocation();
  const params = useParams();
  const universityId = params.universityId || (location.state && location.state.universityId) || 1;

  // University data state
  const [universityData, setUniversityData] = useState({
    id: 1,
    name: "Kauno Technologijos Universitetas",
    rating: 4.2,
    description: "Kauno technologijos universitetas (KTU) – vienas didžiausių technologijos universitetų Baltijos šalyse, žinomas dėl savo ryšių su verslu, inovacijų lyderystės.",
  });

  // Mock reviews data
  const [universityReviews, setUniversityReviews] = useState([
    {
      id: 1,
      user: {
        username: "studentas123",
        status: "Informatikos fakultetas, 3 kursas",
        profilePic: null
      },
      date: "2023-12-15",
      comment: "Puikus universitetas su daugybe galimybių. Dėstytojai labai profesionalūs ir visada pasiruošę padėti.",
      ratings: {
        quality: 4.5,
        facilities: 4.2,
        opportunities: 4.8,
        community: 4.0,
        dormitories: 3.5,
        events: 4.7
      },
      overallRating: 4.4
    },
    {
      id: 2,
      user: {
        username: "techstudent",
        status: "Mechanikos inžinerijos fakultetas, 2 kursas",
        profilePic: null
      },
      date: "2023-11-10",
      comment: "Įranga kartais pasenusi, bet dėstytojai puikūs ir studijų programos aktualios. Daug praktinių užsiėmimų, kurie tikrai praverčia.",
      ratings: {
        quality: 3.8,
        community: 4.2,
        cafeteria: 2.9
      },
      overallRating: 3.6
    },
    {
      id: 3,
      user: {
        username: "future_engineer",
        status: "Elektros ir elektronikos fakultetas, 4 kursas",
        profilePic: null
      },
      date: "2023-10-05",
      comment: "Labai geros sąlygos tyrimams ir projektams. Karjeros galimybės puikios, daug bendradarbiavimo su įmonėmis.",
      ratings: {
        opportunities: 4.9,
        facilities: 4.5,
        events: 3.8,
        library: 4.6
      },
      overallRating: 4.5
    }
  ]);

  // Mock faculties and programs data
  const [faculties, setFaculties] = useState([
    {
      id: 1,
      name: "Informatikos fakultetas",
      abbreviation: "IF",
      programs: [
        { id: 1, name: "Programų sistemos", degree: "Bakalauras", duration: "4 metai", rating: 4.8 },
        { id: 2, name: "Informatika", degree: "Bakalauras", duration: "4 metai", rating: 4.5 },
        { id: 3, name: "Dirbtinis intelektas", degree: "Magistras", duration: "2 metai", rating: 4.7 }
      ]
    },
    {
      id: 2,
      name: "Matematikos ir gamtos mokslų fakultetas",
      abbreviation: "MGMF",
      programs: [
        { id: 4, name: "Taikomoji matematika", degree: "Bakalauras", duration: "4 metai", rating: 4.2 },
        { id: 5, name: "Statistika", degree: "Bakalauras", duration: "4 metai", rating: 4.0 }
      ]
    },
    {
      id: 3,
      name: "Ekonomikos ir verslo fakultetas",
      abbreviation: "EVF",
      programs: [
        { id: 6, name: "Ekonomika", degree: "Bakalauras", duration: "3.5 metai", rating: 4.3 },
        { id: 7, name: "Verslo administravimas", degree: "Bakalauras", duration: "3.5 metai", rating: 4.4 }
      ]
    }
  ]);

  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDegreeType, setSelectedDegreeType] = useState("bakalauras");

  // New review state
  const [newReview, setNewReview] = useState({
    comment: "",
    ratings: {}
  });

  // Rating categories
  const ratingCategories = [
    { id: 'quality', name: 'Mokymo kokybė' },
    { id: 'facilities', name: 'Infrastruktūra' },
    { id: 'opportunities', name: 'Karjeros galimybės' },
    { id: 'community', name: 'Bendruomenė' },
    { id: 'dormitories', name: 'Bendrabučių kokybė' },
    { id: 'events', name: 'Renginiai' },
    { id: 'cafeteria', name: 'Valgyklos' },
    { id: 'library', name: 'Biblioteka' },
    { id: 'sports', name: 'Sporto infrastruktūra' },
    { id: 'international', name: 'Tarptautinės galimybės' }
  ];

  // Selected rating categories
  const [selectedCategories, setSelectedCategories] = useState([]);

  // Handle window resize
  const handleResize = () => {
    setIsMobile(window.innerWidth < 1280);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Initialize with first faculty on load
  useEffect(() => {
    if (faculties.length > 0) {
      setSelectedFaculty(faculties[0]);
      if (faculties[0].programs && faculties[0].programs.length > 0) {
        setSelectedProgram(faculties[0].programs[0]);
      }
    }
  }, []);

  const handleFacultySelect = (faculty) => {
    setSelectedFaculty(faculty);
    if (faculty.programs && faculty.programs.length > 0) {
      setSelectedProgram(faculty.programs[0]);
    } else {
      setSelectedProgram(null);
    }
  };

  const handleProgramSelect = (program) => {
    setSelectedProgram(program);
  };

  const handleRatingChange = (category, value) => {
    setNewReview(prev => ({
      ...prev,
      ratings: {
        ...prev.ratings,
        [category]: value
      }
    }));
  };

  // Handle category selection
  const toggleCategory = (categoryId) => {
    if (selectedCategories.includes(categoryId)) {
      // Remove category from selected list
      setSelectedCategories(prev => prev.filter(id => id !== categoryId));
      
      // Remove rating for this category
      const updatedRatings = { ...newReview.ratings };
      delete updatedRatings[categoryId];
      
      setNewReview(prev => ({
        ...prev,
        ratings: updatedRatings
      }));
    } else {
      // Add category to selected list
      setSelectedCategories(prev => [...prev, categoryId]);
    }
  };

  const handleCommentChange = (content) => {
    setNewReview(prev => ({
      ...prev,
      comment: content
    }));
  };

  const handleSubmitReview = (e) => {
    e.preventDefault();
    
    // Calculate overall rating only from selected categories
    const ratings = newReview.ratings;
    const ratingValues = Object.values(ratings);
    const overallRating = ratingValues.length > 0 
      ? ratingValues.reduce((sum, rating) => sum + rating, 0) / ratingValues.length
      : 0;
    
    // Create new review object
    const review = {
      id: universityReviews.length + 1,
      user: {
        username: user.username,
        status: user.status || "Studentas",
        profilePic: user.avatar
      },
      date: new Date().toISOString().split('T')[0],
      comment: newReview.comment,
      ratings: { ...newReview.ratings },
      overallRating: ratingValues.length > 0 ? overallRating : null
    };
    
    // Update reviews
    setUniversityReviews([review, ...universityReviews]);
    
    // Reset form
    setNewReview({
      comment: "",
      ratings: {}
    });
    setSelectedCategories([]);
  };

  const colorClasses = [
    'bg-blue', 
    'bg-red', 
    'bg-purple', 
    'bg-green', 
    'bg-orange', 
    'bg-light-blue'
  ];

  const getRatingColorClass = (rating) => {
    if (rating <= 1) return "bg-red";
    if (rating <= 2) return "bg-red/80";
    if (rating <= 3) return "bg-yellow/70";
    if (rating <= 4) return "bg-green/50";
    return "bg-green";
  };

  return (
    <div className="flex flex-col items-center px-4 py-8 max-w-screen-2xl mx-auto">
      {/* University Header */}
      <div className="flex flex-col md:flex-row gap-6 w-full justify-between items-center border-b-2 border-light-grey pb-6 mb-8">
        <div className="flex flex-row gap-6 items-center">
          <img className="size-24 md:size-32" src={KTU_logo} alt={universityData.name} />
          <div>
            <h1 className="text-white font-bold text-2xl md:text-4xl mb-2">{universityData.name}</h1>
            <div className="flex items-center gap-2">
              <StarRating rating={universityData.rating} width={6} color="white" />
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <button className="bg-lght-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
            <div className="flex flex-row gap-2">
              <p className="text-white font-medium">Forumas</p>
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 rounded-md text-white">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
              </svg>
            </div>
          </button>
        </div>
      </div>

      {/* Description */}
      <div className="w-full mb-12">
        <p className="text-white">{universityData.description}</p>
      </div>

      {/* Tabs */}
      <div className="w-full mb-6 border-b border-grey">
        <div className="flex space-x-8">
          <button
            className={`px-4 py-2 text-white font-medium border-b-2 transition-colors ${
              activeTab === "programs" ? "border-lght-blue" : "border-transparent"
            }`}
            onClick={() => setActiveTab("programs")}
          >
            Studijų programos
          </button>
          <button
            className={`px-4 py-2 text-white font-medium border-b-2 transition-colors ${
              activeTab === "reviews" ? "border-lght-blue" : "border-transparent"
            }`}
            onClick={() => setActiveTab("reviews")}
          >
            Atsiliepimai
          </button>
        </div>
      </div>

      {/* Programs Tab Content */}
      {activeTab === "programs" && (
        <div className="w-full">
          <div className={`grid grid-cols-1 ${isMobile ? "" : "lg:grid-cols-12"} gap-6`}>
            {/* Faculty Selection */}
            <div className={`${isMobile ? "w-full" : "lg:col-span-3"}`}>
              <div className="bg-grey rounded-lg p-4">
                <h2 className="text-white font-bold mb-4">Fakultetai</h2>
                <div className="flex flex-col gap-2 max-h-96 overflow-auto scrollbar-custom">
                  {faculties.map((faculty, index) => {
                    const colorClass = colorClasses[index % colorClasses.length];
                    return (
                      <div 
                        key={faculty.id}
                        className={`flex flex-row gap-2 p-3 cursor-pointer border-2 border-grey items-center rounded-md hover:bg-lght-blue/10 transition-colors ${
                          selectedFaculty?.id === faculty.id ? 'bg-dark border-2 border-lght-blue rounded-md' : ''
                        }`}
                        onClick={() => handleFacultySelect(faculty)}
                      >
                        <div>
                          <div className={`flex justify-center items-center ${colorClass} px-1 py-1 text-white rounded-md min-w-14`}>
                            {faculty.abbreviation}
                          </div>
                        </div>
                        <div className="text-white font-medium">{faculty.name}</div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>

            <div className={`${isMobile ? "w-full" : "lg:col-span-9"}`}>
              {/* Programs Display */}
              {selectedFaculty && (
                <div className="bg-grey rounded-lg p-6">
                  <div className="w-full flex items-center gap-4 justify-between mb-6">
                    <h2 className="text-white font-bold text-xl mb-4">{selectedFaculty.name} programos</h2>
                    <div className="inline-flex bg-dark rounded-lg p-1 relative">
                      <div 
                        className="absolute top-1 bottom-1 rounded-md bg-lght-blue transition-all duration-300 ease-in-out" 
                        style={{ 
                          width: selectedDegreeType === "bakalauras" ? "calc(50% - 4px)" : "calc(47% - 1px)" , 
                          left: selectedDegreeType === "bakalauras" ? "4px" : "calc(50% + 3px)" 
                        }}
                      ></div>
                      <button
                        className={`px-4 py-2 rounded-md transition-colors relative z-10 ${
                          selectedDegreeType === "bakalauras" ? "text-white" : "text-white text-opacity-60 hover:text-opacity-80"
                        }`}
                        onClick={() => setSelectedDegreeType("bakalauras")}
                      >
                        Bakalauras
                      </button>
                      <button
                        className={`px-4 py-2 rounded-md transition-colors relative z-10 ${
                          selectedDegreeType === "magistras" ? "text-white" : "text-white text-opacity-60 hover:text-opacity-80"
                        }`}
                        onClick={() => setSelectedDegreeType("magistras")}
                      >
                        Magistras
                      </button>
                    </div>
                  </div>
                 
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {selectedFaculty.programs
                      .filter(program => program.degree.toLowerCase() === selectedDegreeType)
                      .map(program => (
                        <div 
                          key={program.id} 
                          className={`bg-dark p-4 rounded-lg cursor-pointer transition-colors hover:bg-lght-blue/10 ${
                            selectedProgram?.id === program.id ? 'ring-2 ring-lght-blue' : ''
                          }`}
                          onClick={() => handleProgramSelect(program)}
                        >
                          <h3 className="text-white font-medium mb-2">{program.name}</h3>
                          <div className="flex justify-between items-center">
                            <p className="text-light-grey text-sm">{program.duration}</p>
                            <div className="flex items-center gap-1">
                              <StarRating rating={program.rating} width={4} color="white" />
                              <span className="text-white text-sm">{program.rating.toFixed(1)}</span>
                            </div>
                          </div>
                        </div>
                      ))}
                  </div>

                  {selectedFaculty.programs.filter(program => program.degree.toLowerCase() === selectedDegreeType).length === 0 && (
                    <div className="text-white text-center py-6">
                      Nėra {selectedDegreeType} programų šiame fakultete
                    </div>
                  )}
                </div>
              )}

              {/* Selected Program Details */}
              {selectedProgram && (
                <div className="bg-grey rounded-lg p-6 mt-6">
                  <h2 className="text-white font-bold text-xl mb-4">{selectedProgram.name}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h3 className="text-white font-medium mb-2">Apie programą</h3>
                      <p className="text-light-grey">
                        {selectedProgram.description || "Tai yra aukštos kokybės studijų programa, paruošianti studentus karjerai šiuolaikiniame pasaulyje. Programa suteikia reikalingus įgūdžius ir žinias, kad absolventai galėtų sėkmingai konkuruoti darbo rinkoje."}
                      </p>
                    </div>
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-white">Laipsnis:</span>
                        <span className="text-light-grey">{selectedProgram.degree}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-white">Trukmė:</span>
                        <span className="text-light-grey">{selectedProgram.duration}</span>
                      </div>
                      <div className="flex justify-between mb-2">
                        <span className="text-white">Įvertinimas:</span>
                        <div className="flex items-center gap-1">
                          <StarRating rating={selectedProgram.rating} width={4} color="white" />
                          <span className="text-white">{selectedProgram.rating.toFixed(1)}</span>
                        </div>
                      </div>
                      <div className="mt-4 flex justify-end">
                        <button className="bg-lght-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors">
                          Peržiūrėti modulius
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Reviews Tab Content */}
      {activeTab === "reviews" && (
        <div className="w-full">
          
          {/* Add Review Form - only shown for logged-in users */}
          {user && (
            <div className="bg-grey rounded-lg p-6 mb-8">
              <h3 className="text-white text-3xl font-bold mb-10">Palikite atsiliepimą apie universitetą</h3>
              
              <form onSubmit={handleSubmitReview}>
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                  <div className="space-y-4">
                    <div>
                      <div className="flex flex-row gap-2 items-center mb-3">
                        <h4 className="text-white mb-1 font-medium">Pasirinkite vertinimo kategorijas:</h4>
                        <Tooltip 
                        content="Šioje sekcijoje galite įvertinti universitetą pagal įvairais kategorijas. Galite pasirinkti kelias, visas arba nė vienos kategorijos" 
                        maxWidth={400}
                        position="bottom" 
                        />
                      </div>
                      
                      <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto pr-2 border-y py-2 pl-1 border-light-grey">
                        {ratingCategories.map(category => (
                          <div 
                            key={category.id}
                            className={`p-2 border rounded-md cursor-pointer transition-colors flex justify-between items-center ${
                              selectedCategories.includes(category.id) 
                                ? 'border-lght-blue bg-lght-blue/10 text-white' 
                                : 'border-gray-600 text-light-grey hover:border-lght-blue'
                            }`}
                            onClick={() => toggleCategory(category.id)}
                          >
                            <span>{category.name}</span>
                            {selectedCategories.includes(category.id) && (
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-lght-blue">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                              </svg>
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                    
                    {selectedCategories.length > 0 && (
                      <div className="mt-6">
                        <h4 className="text-white mb-3 font-medium">Jūsų vertinimai:</h4>
                        <div className="space-y-4">
                          {selectedCategories.map(categoryId => {
                            const category = ratingCategories.find(c => c.id === categoryId);
                            return (
                              <div key={categoryId} className="flex gap-4 p-2 border justify-between border-gray-600 rounded-md">
                                <label className="block text-white text-sm">{category.name}</label>
                                <div className="flex">
                                  <InteractiveStarRating 
                                    initialRating={newReview.ratings[categoryId] || 0} 
                                    width={5} 
                                    onRatingChange={(rating) => handleRatingChange(categoryId, rating)} 
                                  />
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      </div>
                    )}
                  </div>
                  
                  <div className="md:col-span-3">
                    <label className="block text-white mb-4">Jūsų komentaras</label>
                    <div className="border-2 rounded-md border-white p-0 w-full flex flex-col" style={{ maxHeight: "300px" }}>
                      <RichTextEditor 
                        value={newReview.comment} 
                        onChange={handleCommentChange} 
                        placeholder="Parašykite savo nuomonę apie universitetą..." 
                      />
                      <div className="flex justify-end p-2 bg-grey">
                        <button
                          type="submit"
                          className="bg-lght-blue text-white font-medium py-2 px-6 rounded-lg hover:bg-blue-600 transition-colors"
                        >
                          Pateikti
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </form>
            </div>
          )}

          {/* Reviews List */}
          <div className="space-y-6">
            {universityReviews.map(review => (
              <div key={review.id} className="bg-grey rounded-lg p-6">
                <div className="flex flex-col md:flex-row mb-4">
                  <div className="flex mb-4 md:mb-0">
                    <div className="mr-4">
                      <img 
                        src={review.user.profilePic || ProfilePicture} 
                        alt={review.user.username} 
                        className="size-14 rounded-full"
                      />
                    </div>
                    <div>
                      <p className="text-white font-medium">{review.user.username}</p>
                      <p className="text-light-grey text-sm">{review.user.status}</p>
                    </div>
                  </div>
                  <div className="md:ml-auto">
                    <p className="text-lighter-grey text-sm">{review.date}</p>
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                  {Object.keys(review.ratings).length > 0 && (
                    <div className="space-y-2 pr-4 border-r-2 border-white">
                      <div className="flex flex-col">
                        {Object.entries(review.ratings).map(([categoryId, rating]) => {
                          const category = ratingCategories.find(c => c.id === categoryId);
                          return (
                            <div key={categoryId} className="flex justify-between items-center mb-1">
                              <span className="text-white text-sm">{category?.name || categoryId}:</span>
                              <span className={`text-white ${getRatingColorClass(rating)} rounded-lg px-2 py-1 text-sm font-bold`}>
                                {typeof rating === 'number' ? rating.toFixed(1) : rating}/5
                              </span>
                            </div>
                          );
                        })}
                        
                      </div>
                    </div>
                  )}
                  
                  <div className={`p-4 border-2 border-white rounded-md ${Object.keys(review.ratings).length > 0 ? 'md:col-span-3' : 'md:col-span-4'}`}>
                    <p className="text-white">{review.comment}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversityPage;
