import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useStateContext } from "../../context/contextProvider";
import StarRating from "../../components/starRating/starRating";
import InteractiveStarRating from "../../components/starRating/interactiveStarRating";
import RichTextEditor from "../../components/richTextEditor/RichTextEditor";
import Tooltip from "../../components/Tooltip";
import { UniversityAPI, LecturerAPI, ForumAPI } from "../../utils/API";

const RecommendationForm = () => {
  const { user } = useStateContext();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1280);
  const [error, setError] = useState(null);
  const [activeSection, setActiveSection] = useState("academic");
  const [showExtracurricular, setShowExtracurricular] = useState(false);
  const [filteredPrograms, setFilteredPrograms] = useState([]);

  const [preferences, setPreferences] = useState({
    interests: [],
    importantCategories: [],
    academicPreferences: {
      degreeType: "bakalauras",
      fieldOfStudy: [],
      locations: [],
      minRating: 0,
    },
    learningPreferences: {
      practicalVsTheoretical: 50,
    },
    personalFactors: {
      extracurricularImportant: false,
    },
    financialFactors: {
      stateFinanced: false,
      maxYearlyCost: 3000,
    },
    studyPreferences: {
      difficultyLevel: 50,
    },
    housingPreferences: {
      dormitoryImportant: false,
    },
    programSize: null,
    careerGoals: [],
    keywordSearch: "",
    freeFormDescription: ""
  });

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

  const fieldsOfStudy = [
    "Informatika",
    "Programų sistemos",
    "Ekonomika",
    "Verslo administravimas",
    "Inžinerija",
    "Medicina",
    "Teisė",
    "Fizika",
    "Chemija",
    "Biologija",
    "Psichologija",
    "Filosofija",
    "Istorija",
    "Filologija",
    "Matematika"
  ];

  const cityOptions = [
    "Vilnius",
    "Kaunas",
    "Klaipėda",
    "Šiauliai",
    "Panevėžys"
  ];

  const handleResize = () => {
    setIsMobile(window.innerWidth < 1280);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleFieldOfStudyToggle = (field) => {
    setPreferences(prev => {
      const currentFields = [...prev.academicPreferences.fieldOfStudy];
      const fieldIndex = currentFields.indexOf(field);
      
      if (fieldIndex > -1) {
        currentFields.splice(fieldIndex, 1);
      } else {
        currentFields.push(field);
      }
      
      return {
        ...prev,
        academicPreferences: {
          ...prev.academicPreferences,
          fieldOfStudy: currentFields
        }
      };
    });
  };

  const handleLocationToggle = (location) => {
    setPreferences(prev => {
      const currentLocations = [...prev.academicPreferences.locations];
      const locationIndex = currentLocations.indexOf(location);
      
      if (locationIndex > -1) {
        currentLocations.splice(locationIndex, 1);
      } else {
        currentLocations.push(location);
      }
      
      return {
        ...prev,
        academicPreferences: {
          ...prev.academicPreferences,
          locations: currentLocations
        }
      };
    });
  };

  const handleCategoryToggle = (categoryId) => {
    setPreferences(prev => {
      const currentCategories = [...prev.importantCategories];
      const categoryIndex = currentCategories.indexOf(categoryId);
      
      if (categoryIndex > -1) {
        currentCategories.splice(categoryIndex, 1);
      } else {
        currentCategories.push(categoryId);
      }
      
      return {
        ...prev,
        importantCategories: currentCategories
      };
    });
  };

  const handleInterestKeyDown = (e) => {
    if (e.key === 'Enter' && e.target.value.trim()) {
      e.preventDefault();
      const newInterest = e.target.value.trim();
      
      if (!preferences.interests.includes(newInterest)) {
        setPreferences(prev => ({
          ...prev,
          interests: [...prev.interests, newInterest]
        }));
      }
      
      e.target.value = '';
    }
  };

  const removeInterest = (interest) => {
    setPreferences(prev => ({
      ...prev,
      interests: prev.interests.filter(i => i !== interest)
    }));
  };

  const handleExtracurricularToggle = (isImportant) => {
    setShowExtracurricular(isImportant);
    setPreferences(prev => ({
      ...prev,
      personalFactors: {
        ...prev.personalFactors,
        extracurricularImportant: isImportant
      }
    }));
  };

  const handleExtracurricularInput = (value) => {
    setPreferences(prev => ({
      ...prev,
      personalFactors: {
        ...prev.personalFactors,
        extracurricularInterests: value
      }
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Submitting preferences:", preferences);
      
      // Map the numeric difficulty level to string values
      const mapDifficultyLevel = (level) => {
        if (level < 33) return 'easy';
        if (level < 66) return 'moderate';
        return 'challenging';
      };
      
      // Format preferences for API
      const formattedPreferences = {
        ...preferences,
        interests: Array.isArray(preferences.interests) ? preferences.interests.join(', ') : preferences.interests,
        studyPreferences: {
          ...preferences.studyPreferences,
          difficultyLevel: mapDifficultyLevel(preferences.studyPreferences.difficultyLevel)
        }
      };
      
      console.log("Formatted preferences:", formattedPreferences);
      
      // First attempt with AI-powered recommendations
      try {
        console.log("Getting AI recommendations...");
        const aiResponse = await UniversityAPI.getAIRecommendations(formattedPreferences);
        console.log("AI recommendations:", aiResponse.data);
        
        localStorage.setItem('filteredPrograms', JSON.stringify(aiResponse.data));
        localStorage.setItem('recommendationPreferences', JSON.stringify(preferences));
        localStorage.setItem('isAIRecommendation', 'true');
        
        navigate('/recommendation-results');
        return;
      } catch (aiError) {
        console.error("Error getting AI recommendations, falling back to regular filtering:", aiError);
        // Continue with fallback to regular filtering
      }
      
      // Fallback to regular filtering if AI fails
      const response = await UniversityAPI.filterRecommendations(formattedPreferences);
      console.log("Regular filtered programs:", response.data);
      
      localStorage.setItem('filteredPrograms', JSON.stringify(response.data));
      localStorage.setItem('recommendationPreferences', JSON.stringify(preferences));
      localStorage.setItem('isAIRecommendation', 'false');
      
      navigate('/recommendation-results');
      
    } catch (err) {
      console.error("Error generating recommendations:", err);
      if (err.response && err.response.data && err.response.data.errors) {
        setError("Įvyko klaida: " + Object.values(err.response.data.errors).flat().join(", "));
      } else {
        setError("Įvyko klaida generuojant rekomendacijas. Bandykite vėliau.");
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleTestFilter = async () => {
    setIsLoading(true);
    setError(null);
    
    try {
      console.log("Testing filter with preferences:", preferences);
      
      // Map the numeric difficulty level to string values
      const mapDifficultyLevel = (level) => {
        if (level < 33) return 'easy';
        if (level < 66) return 'moderate';
        return 'challenging';
      };
      
      // Format preferences for API
      const formattedPreferences = {
        ...preferences,
        interests: Array.isArray(preferences.interests) ? preferences.interests.join(', ') : preferences.interests,
        studyPreferences: {
          ...preferences.studyPreferences,
          difficultyLevel: mapDifficultyLevel(preferences.studyPreferences.difficultyLevel)
        }
      };
      
      console.log("Formatted preferences:", formattedPreferences);
      
      // First try AI recommendations
      try {
        console.log("Getting AI test recommendations...");
        const aiResponse = await UniversityAPI.getAIRecommendations(formattedPreferences);
        console.log("AI test recommendations:", aiResponse.data);
        
        localStorage.setItem('filteredPrograms', JSON.stringify(aiResponse.data));
        localStorage.setItem('recommendationPreferences', JSON.stringify(preferences));
        localStorage.setItem('isAIRecommendation', 'true');
        
        navigate('/recommendation-results');
        return;
      } catch (aiError) {
        console.error("Error getting AI test recommendations, falling back to regular filtering:", aiError);
      }
      
      // Fallback to regular filtering
      const response = await UniversityAPI.filterRecommendations(formattedPreferences);
      console.log("Regular test filtered programs:", response.data);
      
      localStorage.setItem('filteredPrograms', JSON.stringify(response.data));
      localStorage.setItem('recommendationPreferences', JSON.stringify(preferences));
      localStorage.setItem('isAIRecommendation', 'false');
      
      navigate('/recommendation-results');
    } catch (err) {
      console.error("Error testing filter:", err);
      if (err.response && err.response.data && err.response.data.errors) {
        setError("Įvyko klaida: " + Object.values(err.response.data.errors).flat().join(", "));
      } else {
        setError("Įvyko klaida testuojant filtrą: " + (err.response?.data?.error || err.message));
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex flex-col items-center px-4 py-8 max-w-screen-2xl mx-auto">
      <h1 className="text-white font-bold text-3xl mb-8">Universiteto rekomendacijų sistema</h1>
      
      {/* Introduction section */}
      <div className="w-full bg-dark rounded-lg p-6 mb-8 border border-light-grey">
        <h2 className="text-white text-xl font-semibold mb-4">Kaip tai veikia?</h2>
        <p className="text-lighter-grey mb-4">
          Ši rekomendacijos sistema padės jums atrasti geriausiai tinkančius universitetus ir studijų programas, 
          remiantis jūsų interesais, akademiniais prioritetais ir asmeniniais poreikiais.
        </p>
        <p className="text-lighter-grey mb-4">
          Sistema analizuos forumo diskusijas, studentų atsiliepimus ir programų aprašymus, kad pateiktų 
          personalizuotas rekomendacijas.
        </p>
        <div className="flex items-center text-lght-blue gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5">
            <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
          </svg>
          <p>Kuo daugiau informacijos pateiksite, tuo tikslesnės bus rekomendacijos</p>
        </div>
      </div>
      
      {/* Progress indicator */}
      <div className="w-full mb-8">
        <div className="flex justify-between">
          <button 
            className={`text-white px-4 py-2 rounded-t-lg ${activeSection === 'academic' ? 'bg-grey font-medium' : 'bg-dark hover:bg-grey/80'}`}
            onClick={() => setActiveSection('academic')}
          >
            1. Akademiniai interesai
          </button>
          <button 
            className={`text-white px-4 py-2 rounded-t-lg ${activeSection === 'university' ? 'bg-grey font-medium' : 'bg-dark hover:bg-grey/80'}`}
            onClick={() => setActiveSection('university')}
          >
            2. Universiteto savybės
          </button>
          <button 
            className={`text-white px-4 py-2 rounded-t-lg ${activeSection === 'personal' ? 'bg-grey font-medium' : 'bg-dark hover:bg-grey/80'}`}
            onClick={() => setActiveSection('personal')}
          >
            3. Asmeniniai prioritetai
          </button>
          <button 
            className={`text-white px-4 py-2 rounded-t-lg ${activeSection === 'additional' ? 'bg-grey font-medium' : 'bg-dark hover:bg-grey/80'}`}
            onClick={() => setActiveSection('additional')}
          >
            4. Papildoma informacija
          </button>
        </div>
      </div>
      
      {/* Main form container */}
      <div className="w-full bg-grey rounded-lg p-6 mb-8">
        <form onSubmit={handleSubmit}>
          
          {/* Academic Interests Section */}
          {activeSection === 'academic' && (
            <div className="space-y-8">
              <h2 className="text-white text-2xl font-bold mb-6">Akademiniai interesai</h2>
              
              {/* Degree Type Selection */}
              <div>
                <h3 className="text-white text-lg font-medium mb-4">Studijų pakopa</h3>
                <div className="inline-flex bg-dark rounded-lg p-1 relative mb-4">
                  <div 
                    className="absolute top-1 bottom-1 rounded-md bg-lght-blue transition-all duration-300 ease-in-out" 
                    style={{ 
                      width: preferences.academicPreferences.degreeType === "bakalauras" ? "calc(50% - 4px)" : "calc(47% - 1px)" , 
                      left: preferences.academicPreferences.degreeType === "bakalauras" ? "4px" : "calc(50% + 3px)" 
                    }}
                  ></div>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-md transition-colors relative z-10 ${
                      preferences.academicPreferences.degreeType === "bakalauras" ? "text-white" : "text-white text-opacity-60 hover:text-opacity-80"
                    }`}
                    onClick={() => setPreferences(prev => ({
                      ...prev, 
                      academicPreferences: {
                        ...prev.academicPreferences,
                        degreeType: "bakalauras"
                      }
                    }))}
                  >
                    Bakalauras
                  </button>
                  <button
                    type="button"
                    className={`px-4 py-2 rounded-md transition-colors relative z-10 ${
                      preferences.academicPreferences.degreeType === "magistras" ? "text-white" : "text-white text-opacity-60 hover:text-opacity-80"
                    }`}
                    onClick={() => setPreferences(prev => ({
                      ...prev, 
                      academicPreferences: {
                        ...prev.academicPreferences,
                        degreeType: "magistras"
                      }
                    }))}
                  >
                    Magistras
                  </button>
                </div>
              </div>
              
              {/* Fields of Study */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-white text-lg font-medium">Studijų kryptys</h3>
                  <Tooltip 
                    content="Pasirinkite jus dominančias studijų kryptis. Galite pasirinkti kelias." 
                    position="right"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-3 gap-3 mb-4">
                  {fieldsOfStudy.map(field => (
                    <div 
                      key={field}
                      onClick={() => handleFieldOfStudyToggle(field)}
                      className={`
                        p-3 border rounded-md cursor-pointer transition-colors
                        ${preferences.academicPreferences.fieldOfStudy.includes(field) 
                          ? 'border-lght-blue bg-lght-blue/10 text-white' 
                          : 'border-gray-400 text-lighter-grey hover:border-lght-blue'
                        }
                      `}
                    >
                      <div className="flex justify-between items-center">
                        <span>{field}</span>
                        {preferences.academicPreferences.fieldOfStudy.includes(field) && (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-lght-blue">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Location Preferences */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-white text-lg font-medium">Vieta</h3>
                  <Tooltip 
                    content="Pasirinkite miestus, kuriuose norėtumėte studijuoti." 
                    position="right"
                  />
                </div>
                
                <div className="flex flex-wrap gap-3 mb-4">
                  {cityOptions.map(city => (
                    <div 
                      key={city}
                      onClick={() => handleLocationToggle(city)}
                      className={`
                        px-4 py-2 border rounded-full cursor-pointer transition-colors
                        ${preferences.academicPreferences.locations.includes(city) 
                          ? 'border-lght-blue bg-lght-blue/10 text-white' 
                          : 'border-gray-400 text-lighter-grey hover:border-lght-blue'
                        }
                      `}
                    >
                      {city}
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Minimum Rating */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-white text-lg font-medium">Minimalus įvertinimas</h3>
                  <Tooltip 
                    content="Nurodykite, koks minimalus universiteto vertinimas jus domina." 
                    position="right"
                  />
                </div>
                
                <div className="flex items-center gap-4">
                  <input
                    type="range"
                    min="0"
                    max="5"
                    step="0.5"
                    value={preferences.academicPreferences.minRating}
                    onChange={(e) => setPreferences(prev => ({
                      ...prev,
                      academicPreferences: {
                        ...prev.academicPreferences,
                        minRating: parseFloat(e.target.value)
                      }
                    }))}
                    className="w-64 accent-lght-blue"
                  />
                  <div className="flex items-center gap-2">
                    <StarRating rating={preferences.academicPreferences.minRating} width={5} color="white" />
                  </div>
                </div>
              </div>
              
              {/* Interests */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-white text-lg font-medium">Jūsų interesai</h3>
                  <Tooltip 
                    content="Įveskite jūsų mokslinus ir asmeninius interesus. Spauskite Enter po kiekvieno." 
                    position="right"
                  />
                </div>
                
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Įveskite interesą ir spauskite Enter..."
                    className="w-full bg-dark text-white px-4 py-2 rounded-md border border-gray-600 focus:border-lght-blue outline-none"
                    onKeyDown={handleInterestKeyDown}
                  />
                </div>
                
                {preferences.interests.length > 0 && (
                  <div className="flex flex-wrap gap-2 mb-4">
                    {preferences.interests.map(interest => (
                      <div 
                        key={interest}
                        className="flex items-center gap-2 bg-lght-blue/20 text-white px-3 py-1 rounded-full"
                      >
                        {interest}
                        <button
                          type="button"
                          onClick={() => removeInterest(interest)}
                          className="text-white hover:text-red-400"
                        >
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18L18 6M6 6l12 12" />
                          </svg>
                        </button>
                      </div>
                    ))}
                  </div>
                )}
              </div>
              
              <div className="flex justify-end">
                <button
                  type="button"
                  className="bg-lght-blue text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={() => setActiveSection('university')}
                >
                  Toliau
                </button>
              </div>
            </div>
          )}
          
          {/* University Characteristics Section */}
          {activeSection === 'university' && (
            <div className="space-y-8">
              <h2 className="text-white text-2xl font-bold mb-6">Universiteto savybės</h2>
              
              {/* Rating Categories */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-white text-lg font-medium">Svarbiausi vertinimo aspektai</h3>
                  <Tooltip 
                    content="Pasirinkite jums svarbiausius universiteto vertinimo kriterijus. Sistema labiau atsižvelgs į šiuos aspektus." 
                    position="right"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {ratingCategories.map(category => (
                    <div 
                      key={category.id}
                      onClick={() => handleCategoryToggle(category.id)}
                      className={`
                        p-3 border rounded-md cursor-pointer transition-colors
                        ${preferences.importantCategories.includes(category.id) 
                          ? 'border-lght-blue bg-lght-blue/10 text-white' 
                          : 'border-gray-400 text-lighter-grey hover:border-lght-blue'
                        }
                      `}
                    >
                      <div className="flex justify-between items-center">
                        <span>{category.name}</span>
                        {preferences.importantCategories.includes(category.id) && (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-lght-blue">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              {/* Learning Preferences */}
              <div>
                <h3 className="text-white text-lg font-medium mb-4">Mokymo stilius</h3>
                
                <div className="space-y-6 mb-4">
                  {/* Practical vs Theoretical */}
                  <div>
                    <div className="flex justify-between text-white mb-2">
                      <span>Praktinis</span>
                      <span>Teorinis</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={preferences.learningPreferences.practicalVsTheoretical}
                      onChange={(e) => setPreferences(prev => ({
                        ...prev,
                        learningPreferences: {
                          ...prev.learningPreferences,
                          practicalVsTheoretical: parseInt(e.target.value)
                        }
                      }))}
                      className="w-full accent-lght-blue"
                    />
                  </div>
                </div>
              </div>
              
              {/* Program Size Preferences */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-white text-lg font-medium">Programos dydis</h3>
                  <Tooltip 
                    content="Pasirinkite, kokio dydžio programa jus domina. Programos bus reitinguojamos pagal jūsų pasirinkimą, bet ne atfiltruotos." 
                    position="right"
                  />
                </div>
                
                <div className="flex gap-4 mb-4">
                  <div 
                    className={`
                      flex-1 p-4 border rounded-md cursor-pointer transition-colors text-center
                      ${preferences.programSize === 'small' 
                        ? 'border-lght-blue bg-lght-blue/10 text-white' 
                        : 'border-gray-400 text-lighter-grey hover:border-lght-blue'
                      }
                    `}
                    onClick={() => setPreferences(prev => ({...prev, programSize: 'small'}))}
                  >
                    <div className="flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M15 19.128a9.38 9.38 0 002.625.372 9.337 9.337 0 004.121-.952 4.125 4.125 0 00-7.533-2.493M15 19.128v-.003c0-1.113-.285-2.16-.786-3.07M15 19.128v.106A12.318 12.318 0 018.624 21c-2.331 0-4.512-.645-6.374-1.766l-.001-.109a6.375 6.375 0 0111.964-3.07M12 6.375a3.375 3.375 0 11-6.75 0 3.375 3.375 0 016.75 0zm8.25 2.25a2.625 2.625 0 11-5.25 0 2.625 2.625 0 015.25 0z" />
                      </svg>
                      <span className="font-medium">Maža grupė</span>
                      <span className="text-sm text-lighter-grey">&lt;30 studentų</span>
                    </div>
                  </div>
                  
                  <div 
                    className={`
                      flex-1 p-4 border rounded-md cursor-pointer transition-colors text-center
                      ${preferences.programSize === 'medium' 
                        ? 'border-lght-blue bg-lght-blue/10 text-white' 
                        : 'border-gray-400 text-lighter-grey hover:border-lght-blue'
                      }
                    `}
                    onClick={() => setPreferences(prev => ({...prev, programSize: 'medium'}))}
                  >
                    <div className="flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M18 18.72a9.094 9.094 0 003.741-.479 3 3 0 00-4.682-2.72m.94 3.198l.001.031c0 .225-.012.447-.037.666A11.944 11.944 0 0112 21c-2.17 0-4.207-.576-5.963-1.584A6.062 6.062 0 016 18.719m12 0a5.971 5.971 0 00-.941-3.197m0 0A5.995 5.995 0 0012 12.75a5.995 5.995 0 00-5.058 2.772m0 0a3 3 0 00-4.681 2.72 8.986 8.986 0 003.74.477m.94-3.197a5.971 5.971 0 00-.94 3.197M15 6.75a3 3 0 11-6 0 3 3 0 016 0zm6 3a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0zm-13.5 0a2.25 2.25 0 11-4.5 0 2.25 2.25 0 014.5 0z" />
                      </svg>
                      <span className="font-medium">Vidutinė grupė</span>
                      <span className="text-sm text-lighter-grey">30-100 studentų</span>
                    </div>
                  </div>
                  
                  <div 
                    className={`
                      flex-1 p-4 border rounded-md cursor-pointer transition-colors text-center
                      ${preferences.programSize === 'large' 
                        ? 'border-lght-blue bg-lght-blue/10 text-white' 
                        : 'border-gray-400 text-lighter-grey hover:border-lght-blue'
                      }
                    `}
                    onClick={() => setPreferences(prev => ({...prev, programSize: 'large'}))}
                  >
                    <div className="flex flex-col items-center">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-8 h-8 mb-2">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 7.5h1.5m-1.5 3h1.5m-7.5 3h7.5m-7.5 3h7.5m3-9h3.375c.621 0 1.125.504 1.125 1.125V18a2.25 2.25 0 01-2.25 2.25M16.5 7.5V18a2.25 2.25 0 002.25 2.25M16.5 7.5V4.875c0-.621-.504-1.125-1.125-1.125H4.125C3.504 3.75 3 4.254 3 4.875V18a2.25 2.25 0 002.25 2.25h13.5M6 7.5h3v3H6v-3z" />
                      </svg>
                      <span className="font-medium">Didelė grupė</span>
                      <span className="text-sm text-lighter-grey">&gt;100 studentų</span>
                    </div>
                  </div>
                </div>
                <p className="text-lighter-grey text-sm">
                  <span className="text-lght-blue mr-1">*</span>
                  Programos nebus atfiltruotos pagal dydį, tačiau jūsų pasirinkimą atitinkančios programos bus reitinguojamos aukščiau.
                </p>
              </div>
              
              {/* Financial Considerations */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-white text-lg font-medium">Finansiniai aspektai</h3>
                  <Tooltip 
                    content="Nurodykite finansinius aspektus, kurie svarbūs renkantis universitetą" 
                    position="right"
                  />
                </div>
                
                <div className="rounded-md mb-4">
                  <label className="flex items-center gap-3 mb-4">
                    <input
                      type="checkbox"
                      checked={preferences.financialFactors.stateFinanced}
                      onChange={(e) => setPreferences(prev => ({
                        ...prev,
                        financialFactors: {
                          ...prev.financialFactors,
                          stateFinanced: e.target.checked
                        }
                      }))}
                      className="w-5 h-5 accent-lght-blue cursor-pointer"
                    />
                    <span className="text-white">Planuoju stoti į valstybės finansuojamą vietą</span>
                  </label>
                  
                  {!preferences.financialFactors.stateFinanced && (
                    <div>
                      <div className="flex justify-between text-white mb-2">
                        <span>Metinė kaina: {preferences.financialFactors.maxYearlyCost} €</span>
                      </div>
                      <input
                        type="range"
                        min="0"
                        max="25000"
                        step="100"
                        value={preferences.financialFactors.maxYearlyCost}
                        onChange={(e) => setPreferences(prev => ({
                          ...prev,
                          financialFactors: {
                            ...prev.financialFactors,
                            maxYearlyCost: parseInt(e.target.value)
                          }
                        }))}
                        className="w-full accent-lght-blue"
                      />
                      <div className="flex justify-between text-white text-sm mt-2">
                        <span>0 €</span>
                        <span>25000 €</span>
                      </div>
                    </div>
                  )}
                </div>
              </div>
              
              {/* Study Difficulty Preference */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-white text-lg font-medium">Studijų sudėtingumas</h3>
                  <Tooltip 
                    content="Nurodykite, kokio sudėtingumo studijų programos jus domina. Programos bus reitinguojamos pagal jūsų pasirinkimą, bet ne atfiltruotos." 
                    position="right"
                  />
                </div>
                
                <div className="rounded-md mb-4">
                  <div className="mb-2">
                    <div className="flex justify-between text-white mb-2">
                      <span>Lengvesnės studijos</span>
                      <span>Sudėtingesnės studijos</span>
                    </div>
                    <input
                      type="range"
                      min="0"
                      max="100"
                      value={preferences.studyPreferences.difficultyLevel}
                      onChange={(e) => setPreferences(prev => ({
                        ...prev,
                        studyPreferences: {
                          ...prev.studyPreferences,
                          difficultyLevel: parseInt(e.target.value)
                        }
                      }))}
                      className="w-full accent-lght-blue"
                    />
                  </div>
                  <p className="text-lighter-grey text-sm mt-2">
                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 inline-block mr-1">
                      <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                    </svg>
                    Sudėtingesnės studijos reikalauja daugiau laiko ir pastangų, bet gali suteikti gilesnes žinias. Programos nebus atfiltruotos pagal sudėtingumą, tačiau jūsų pasirinkimą atitinkančios programos bus reitinguojamos aukščiau.
                  </p>
                </div>
              </div>
              
              {/* Advanced Options (Keyword search) */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-white text-lg font-medium">Paieška pagal raktinius žodžius</h3>
                  <Tooltip 
                    content="Įveskite specifinius raktinius žodžius, kurie jums svarbūs programoje" 
                    position="right"
                  />
                </div>
                
                <div className="mb-4">
                  <input
                    type="text"
                    placeholder="Pvz.: dirbtinis intelektas, robotika, finansinė analizė..."
                    value={preferences.keywordSearch}
                    onChange={(e) => setPreferences(prev => ({...prev, keywordSearch: e.target.value}))}
                    className="w-full bg-dark text-white px-4 py-2 rounded-md border border-gray-600 focus:border-lght-blue outline-none"
                  />
                </div>
              </div>
              
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  className="border border-lght-blue text-white px-6 py-2 rounded-lg hover:bg-lght-blue/10 transition-colors"
                  onClick={() => setActiveSection('university')}
                >
                  Atgal
                </button>
                <button
                  type="button"
                  className="bg-lght-blue text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={() => setActiveSection('personal')}
                >
                  Toliau
                </button>
              </div>
            </div>
          )}
          
          {/* Personal Factors Section */}
          {activeSection === 'personal' && (
            <div className="space-y-8">
              <h2 className="text-white text-2xl font-bold mb-6">Asmeniniai prioritetai</h2>
              
              {/* Extracurricular Activities */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-white text-lg font-medium">Užklasinės veiklos</h3>
                  <Tooltip 
                    content="Nurodykite, ar jums svarbios užklasinės veiklos universitete" 
                    position="right"
                  />
                </div>
                
                <div className="mb-4">
                  <label className="flex items-center gap-3 text-white mb-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={preferences.personalFactors.extracurricularImportant}
                      onChange={(e) => handleExtracurricularToggle(e.target.checked)}
                      className="w-5 h-5 accent-lght-blue cursor-pointer"
                    />
                    <span className="text-lg">Noriu, kad rekomendacijose būtų atsižvelgta į užklasines veiklas</span>
                  </label>
                </div>

                {showExtracurricular && (
                  <div className="mb-6 mt-2 p-4 bg-dark rounded-md border border-light-grey">
                    <p className="text-lighter-grey">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 inline-block mr-2 text-lght-blue">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
                      </svg>
                      Sistema naudos "Jūsų interesai" skiltyje įvestą informaciją, kad rastų jums tinkamas užklasines veiklas universitetuose. Įsitikinkite, kad skiltyje "Jūsų interesai" (žr. skiltį "Akademiniai interesai") įvedėte visus savo pomėgius.
                    </p>
                  </div>
                )}
              </div>
              
              {/* Housing Preferences */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-white text-lg font-medium">Apgyvendinimas</h3>
                  <Tooltip 
                    content="Nurodykite, ar jums svarbu gyventi universiteto bendrabutyje" 
                    position="right"
                  />
                </div>
                
                <div className="rounded-md mb-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={preferences.housingPreferences.dormitoryImportant}
                      onChange={(e) => setPreferences(prev => ({
                        ...prev,
                        housingPreferences: {
                          ...prev.housingPreferences,
                          dormitoryImportant: e.target.checked
                        }
                      }))}
                      className="w-5 h-5 accent-lght-blue cursor-pointer"
                    />
                    <span className="text-white">Man svarbu gyventi universiteto bendrabutyje</span>
                  </label>
                </div>
              </div>
              
              {/* Career Goals */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-white text-lg font-medium">Karjeros tikslai</h3>
                  <Tooltip 
                    content="Pasirinkite jūsų karjeros tikslus" 
                    position="right"
                  />
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-4">
                  {[
                    { id: 'industry', name: 'Darbas industrijoje' },
                    { id: 'academic', name: 'Akademinė karjera' },
                    { id: 'entrepreneurship', name: 'Savo verslo kūrimas' },
                    { id: 'research', name: 'Moksliniai tyrimai' },
                    { id: 'public', name: 'Darbas viešajame sektoriuje' },
                    { id: 'international', name: 'Tarptautinė karjera' }
                  ].map(goal => (
                    <div 
                      key={goal.id}
                      onClick={() => {
                        setPreferences(prev => {
                          const currentGoals = [...(prev.careerGoals || [])];
                          const index = currentGoals.indexOf(goal.id);
                          
                          if (index > -1) {
                            currentGoals.splice(index, 1);
                          } else {
                            currentGoals.push(goal.id);
                          }
                          
                          return {
                            ...prev,
                            careerGoals: currentGoals
                          };
                        });
                      }}
                      className={`
                        p-3 border rounded-md cursor-pointer transition-colors
                        ${(preferences.careerGoals || []).includes(goal.id) 
                          ? 'border-lght-blue bg-lght-blue/10 text-white' 
                          : 'border-gray-400 text-lighter-grey hover:border-lght-blue'
                        }
                      `}
                    >
                      <div className="flex justify-between items-center">
                        <span>{goal.name}</span>
                        {(preferences.careerGoals || []).includes(goal.id) && (
                          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-lght-blue">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                          </svg>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
              
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  className="border border-lght-blue text-white px-6 py-2 rounded-lg hover:bg-lght-blue/10 transition-colors"
                  onClick={() => setActiveSection('university')}
                >
                  Atgal
                </button>
                <button
                  type="button"
                  className="bg-lght-blue text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                  onClick={() => setActiveSection('additional')}
                >
                  Toliau
                </button>
              </div>
            </div>
          )}
          
          {/* Additional Information Section */}
          {activeSection === 'additional' && (
            <div className="space-y-8">
              <h2 className="text-white text-2xl font-bold mb-6">Papildoma informacija</h2>
              
              {/* Free-form description */}
              <div>
                <div className="flex items-center gap-2 mb-4">
                  <h3 className="text-white text-lg font-medium">Aprašykite savo idealių studijų viziją</h3>
                  <Tooltip 
                    content="Aprašykite savo lūkesčius, ko tikitės iš studijų ir ką norėtumėte veikti ateityje" 
                    position="right"
                  />
                </div>
                
                <div className="mb-4">
                  <div className="border-2 rounded-md border-white p-0 w-full flex flex-col" style={{ minHeight: "150px" }}>
                    <RichTextEditor 
                      value={preferences.freeFormDescription} 
                      onChange={(content) => setPreferences(prev => ({...prev, freeFormDescription: content}))} 
                      placeholder="Aprašykite, ko ieškote studijose, kokių žinių norite įgyti, kokioje aplinkoje norėtumėte studijuoti, kokie jūsų ilgalaikiai karjeros tikslai..." 
                    />
                  </div>
                </div>
              </div>
              
              {/* Current progress information */}
              <div className="bg-dark rounded-lg p-6 border border-light-grey">
                <h3 className="text-white text-lg font-medium mb-4">Jūsų pasirinkti prioritetai</h3>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {/* Academic Preferences Summary */}
                  <div>
                    <h4 className="text-lght-blue font-medium mb-2">Akademiniai interesai</h4>
                    <ul className="list-disc list-inside text-white">
                      <li>Studijų pakopa: {preferences.academicPreferences.degreeType === 'bakalauras' ? 'Bakalauras' : 'Magistras'}</li>
                      <li>
                        Studijų kryptys: {preferences.academicPreferences.fieldOfStudy.length > 0 
                          ? preferences.academicPreferences.fieldOfStudy.join(', ') 
                          : 'Nepasirinkta'}
                      </li>
                      <li>
                        Vietovės: {preferences.academicPreferences.locations.length > 0 
                          ? preferences.academicPreferences.locations.join(', ') 
                          : 'Nepasirinkta'}
                      </li>
                      <li>Minimalus įvertinimas: {preferences.academicPreferences.minRating}</li>
                    </ul>
                  </div>
                  
                  {/* University Characteristics Summary */}
                  <div>
                    <h4 className="text-lght-blue font-medium mb-2">Universiteto savybės</h4>
                    <ul className="list-disc list-inside text-white">
                      <li>
                        Svarbūs aspektai: {preferences.importantCategories.length > 0 
                          ? preferences.importantCategories.map(id => ratingCategories.find(c => c.id === id)?.name).join(', ') 
                          : 'Nepasirinkta'}
                      </li>
                      <li>Mokymo stilius: {preferences.learningPreferences.practicalVsTheoretical < 30 
                          ? 'Labiau praktinis' 
                          : preferences.learningPreferences.practicalVsTheoretical > 70 
                            ? 'Labiau teorinis' 
                            : 'Subalansuotas'}
                      </li>
                      <li>Programos dydis: {preferences.programSize 
                          ? preferences.programSize === 'small' 
                            ? 'Maža grupė' 
                            : preferences.programSize === 'medium' 
                              ? 'Vidutinė grupė' 
                              : 'Didelė grupė'
                          : 'Nepasirinkta'}
                      </li>
                      <li>Finansiniai aspektai: {preferences.financialFactors.stateFinanced 
                          ? 'Planuoja stoti į valstybės finansuojamą vietą' 
                          : `Maksimali metinė kaina: ${preferences.financialFactors.maxYearlyCost} €`}
                      </li>
                      <li>Studijų sudėtingumas: {preferences.studyPreferences.difficultyLevel < 30 
                          ? 'Lengvesnės studijos' 
                          : preferences.studyPreferences.difficultyLevel > 70 
                            ? 'Sudėtingesnės studijos' 
                            : 'Vidutinio sudėtingumo studijos'}
                      </li>
                    </ul>
                  </div>
                  
                  {/* Personal Factors Summary */}
                  <div>
                    <h4 className="text-lght-blue font-medium mb-2">Asmeniniai prioritetai</h4>
                    <ul className="list-disc list-inside text-white">
                      <li>
                        Užklasinės veiklos: {preferences.personalFactors.extracurricularImportant 
                          ? 'Svarbios' 
                          : 'Nesvarbu'}
                      </li>
                      <li>
                        Apgyvendinimas: {preferences.housingPreferences.dormitoryImportant
                          ? 'Svarbu gyventi bendrabutyje'
                          : 'Nesvarbu gyventi bendrabutyje'}
                      </li>
                    </ul>
                  </div>
                  
                  {/* Interests Summary */}
                  <div>
                    <h4 className="text-lght-blue font-medium mb-2">Interesai ir tikslai</h4>
                    <ul className="list-disc list-inside text-white">
                      <li>
                        Interesai: {preferences.interests.length > 0 
                          ? preferences.interests.join(', ') 
                          : 'Nepasirinkta'}
                      </li>
                      <li>
                        Karjeros tikslai: {preferences.careerGoals && preferences.careerGoals.length > 0 
                          ? preferences.careerGoals.map(id => {
                              const goals = {
                                'industry': 'Darbas industrijoje',
                                'academic': 'Akademinė karjera',
                                'entrepreneurship': 'Savo verslo kūrimas',
                                'research': 'Moksliniai tyrimai',
                                'public': 'Darbas viešajame sektoriuje',
                                'international': 'Tarptautinė karjera'
                              };
                              return goals[id];
                            }).join(', ') 
                          : 'Nepasirinkta'}
                      </li>
                      <li>Raktiniai žodžiai: {preferences.keywordSearch || 'Nepasirinkta'}</li>
                    </ul>
                  </div>
                </div>
              </div>
              
              {/* AI Processing Information */}
              <div className="bg-dark rounded-lg p-6 border border-lght-blue">
                <h3 className="text-white text-lg font-medium mb-4">Dirbtinio intelekto rekomendacijų sistema</h3>
                <p className="text-lighter-grey mb-4">
                  Jūsų pateikta informacija bus apdorota naudojant dirbtinio intelekto algoritmus. Sistema analizuos:
                </p>
                <ul className="list-disc list-inside text-lighter-grey mb-4">
                  <li>Forumo diskusijas apie universitetus ir programas</li>
                  <li>Studentų atsiliepimus ir vertinimus</li>
                  <li>Programų aprašymus ir turinio atitikimą jūsų interesams</li>
                  <li>Panašių studentų pasirinkimus ir patirtis</li>
                  <li>Universiteto bendruomenės aspektus</li>
                </ul>
                <p className="text-lighter-grey">
                  Jūsų pateiktos informacijos kokybė tiesiogiai įtakos rekomendacijų tikslumą.
                </p>
              </div>
              
              <div className="flex justify-between mt-8">
                <button
                  type="button"
                  className="border border-lght-blue text-white px-6 py-2 rounded-lg hover:bg-lght-blue/10 transition-colors"
                  onClick={() => setActiveSection('personal')}
                >
                  Atgal
                </button>
                <div className="flex gap-2">
                  {/* <button
                    type="button"
                    onClick={handleTestFilter}
                    className="bg-dark text-white px-4 py-2 rounded-lg hover:bg-dark/80 transition-colors border border-lght-blue"
                  >
                    Testuoti filtrą
                  </button> */}
                  <button
                    type="submit"
                    disabled={isLoading}
                    className="bg-lght-blue text-white px-6 py-3 rounded-lg hover:bg-blue-600 transition-colors disabled:opacity-50"
                  >
                    {isLoading ? "Generuojama..." : "Gauti rekomendacijas"}
                  </button>
                </div>
              </div>
            </div>
          )}
          
          {error && (
            <div className="mt-4 p-3 bg-red-500 bg-opacity-20 border border-red-500 rounded-lg">
              <p className="text-red-500">{error}</p>
            </div>
          )}
        </form>
      </div>
    </div>
  );
};

export default RecommendationForm; 