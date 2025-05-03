import { useState, useEffect } from "react";
import { useStateContext } from "../context/contextProvider";
import { useNavigate } from "react-router-dom";
import { ForumAPI } from "../utils/API";
import RichTextEditor from "../components/richTextEditor/RichTextEditor";

const categoryColors = {
    'Bendros diskusijos': { text: 'text-lght-blue', ring: 'ring-lght-blue', bg: 'bg-lght-blue'},
    'Kursų apžvalgos': { text: 'text-red', ring: 'ring-red', bg: 'bg-red' },
    'Socialinis gyvenimas ir renginiai': { text: 'text-orange', ring: 'ring-orange', bg: 'bg-orange' },
    'Studijų medžiaga': { text: 'text-green', ring: 'ring-green', bg: 'bg-green' },
    'Būstas ir apgyvendinimas': { text: 'text-purple', ring: 'ring-purple', bg: 'bg-purple' },
    'Praktikos ir karjeros galimybės': { text: 'text-lght-blue', ring: 'ring-lght-blue', bg: 'bg-lght-blue' },
    'Universiteto politika ir administracija': { text: 'text-red', ring: 'ring-red', bg: 'bg-red' },
};

const categories = [
    "Bendros diskusijos",
    "Kursų apžvalgos",
    "Socialinis gyvenimas ir renginiai",
    "Studijų medžiaga",
    "Būstas ir apgyvendinimas",
    "Praktikos ir karjeros galimybės",
    "Universiteto politika ir administracija",
];

const CreatePost = () => {
  const { user } = useStateContext();
  const navigate = useNavigate();
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [categoriesOpen, setCategoriesOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(false);
  const [successMessage, setSuccessMessage] = useState('');
  
  // Forum selection state
  const [universities, setUniversities] = useState([]);
  const [faculties, setFaculties] = useState([]);
  const [programs, setPrograms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [generalForum, setGeneralForum] = useState(null);
  
  // Selected forum hierarchy
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [selectedForumLevel, setSelectedForumLevel] = useState('general');
  
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    forum_id: "",
  });
  
  // Fetch universities on component mount
  useEffect(() => {
    const fetchUniversities = async () => {
      setLoading(true);
      try {
        const response = await ForumAPI.getUniversityForums();
        setUniversities(response.data);
      } catch (error) {
        console.error("Error fetching universities:", error);
        setError("Nepavyko gauti universitetų sąrašo");
      } finally {
        setLoading(false);
      }
    };
    
    const fetchGeneralForum = async () => {
      setLoading(true);
      try {
        // Assuming forum ID 358 is the general discussion forum
        const generalForumId = 358;
        const response = await ForumAPI.getAllForums();
        const forum = response.data.find(f => f.id === generalForumId);
        
        if (forum) {
          setGeneralForum(forum);
          // Set the general forum as the default selected forum
          setFormData(prev => ({
            ...prev,
            forum_id: forum.id
          }));
        }
      } catch (error) {
        console.error("Error fetching general forum:", error);
      } finally {
        setLoading(false);
      }
    };
    
    fetchUniversities();
    fetchGeneralForum();
  }, []);
  
  // Fetch faculties when university is selected
  useEffect(() => {
    if (selectedUniversity) {
      const fetchFaculties = async () => {
        setLoading(true);
        try {
          const response = await ForumAPI.getFacultyForums(selectedUniversity.id);
          setFaculties(response.data);
        } catch (error) {
          console.error("Error fetching faculties:", error);
          setError("Nepavyko gauti fakultetų sąrašo");
        } finally {
          setLoading(false);
        }
      };
      
      fetchFaculties();
    } else {
      setFaculties([]);
      setSelectedFaculty(null);
    }
  }, [selectedUniversity]);
  
  // Fetch programs when faculty is selected
  useEffect(() => {
    if (selectedFaculty) {
      const fetchPrograms = async () => {
        setLoading(true);
        try {
          const response = await ForumAPI.getProgramForums(selectedFaculty.id);
          setPrograms(response.data);
        } catch (error) {
          console.error("Error fetching programs:", error);
          setError("Nepavyko gauti programų sąrašo");
        } finally {
          setLoading(false);
        }
      };
      
      fetchPrograms();
    } else {
      setPrograms([]);
      setSelectedProgram(null);
    }
  }, [selectedFaculty]);
  
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  
  const handleContentChange = (content) => {
    setFormData({
      ...formData,
      description: content,
    });
  };
  
  const handleCategoryModal = () => {
    setCategoriesOpen(!categoriesOpen);
  };

  const toggleCategory = (category) => {
    if (selectedCategories.includes(category)) {
      setSelectedCategories(selectedCategories.filter(cat => cat !== category));
    } else {
      setSelectedCategories([...selectedCategories, category]);
    }
  };

  const handleApply = () => {
    setCategoriesOpen(false);
  };

  const handleCancel = () => {
    setSelectedCategories([]);
    setCategoriesOpen(false);
  };
  
  const handleUniversityChange = (e) => {
    const uni = universities.find(u => u.id === parseInt(e.target.value));
    setSelectedUniversity(uni || null);
    setSelectedForumLevel('university');
    
    if (uni) {
      setFormData({
        ...formData,
        forum_id: uni.id
      });
    }
  };
  
  const handleFacultyChange = (e) => {
    const fac = faculties.find(f => f.id === parseInt(e.target.value));
    setSelectedFaculty(fac || null);
    setSelectedForumLevel('faculty');
    
    if (fac) {
      setFormData({
        ...formData,
        forum_id: fac.id
      });
    }
  };
  
  const handleProgramChange = (e) => {
    const prog = programs.find(p => p.id === parseInt(e.target.value));
    setSelectedProgram(prog || null);
    setSelectedForumLevel('program');
    
    if (prog) {
      setFormData({
        ...formData,
        forum_id: prog.id
      });
    }
  };
  
  const handleForumLevelChange = (level) => {
    setSelectedForumLevel(level);
    
    // Update forum_id based on the selected level
    if (level === 'general' && generalForum) {
      setFormData({
        ...formData,
        forum_id: generalForum.id
      });
    } else if (level === 'university' && selectedUniversity) {
      setFormData({
        ...formData,
        forum_id: selectedUniversity.id
      });
    } else if (level === 'faculty' && selectedFaculty) {
      setFormData({
        ...formData,
        forum_id: selectedFaculty.id
      });
    } else if (level === 'program' && selectedProgram) {
      setFormData({
        ...formData,
        forum_id: selectedProgram.id
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate form data
    if (!formData.title.trim()) {
      setError("Įveskite įrašo pavadinimą");
      return;
    }
    
    if (!formData.description.trim()) {
      setError("Įveskite įrašo turinį");
      return;
    }
    
    if (!formData.forum_id) {
      setError("Pasirinkite forumą");
      return;
    }
    
    setIsSubmitting(true);
    setError(null);
    
    try {
      // Prepare the post data
      const postData = {
        title: formData.title,
        description: formData.description,
        forum_id: formData.forum_id,
        categories: selectedCategories
      };
      
      // Create the post
      const response = await ForumAPI.createPost(postData);
      
      // Store the forum info and post info for confirmation
      const forumInfo = response.data.forum;
      const createdPost = response.data.post;
      
      // Show success message with forum name
      let successMessage = '';
      if (forumInfo && forumInfo.title) {
        if (forumInfo.entity_type === 'university') {
          successMessage = `Įrašas sukurtas „${forumInfo.university_name}" universiteto forume.`;
        } else if (forumInfo.entity_type === 'faculty') {
          successMessage = `Įrašas sukurtas „${forumInfo.faculty_name}" fakulteto forume.`;
        } else if (forumInfo.entity_type === 'program') {
          successMessage = `Įrašas sukurtas „${forumInfo.program_name}" programos forume.`;
        } else {
          successMessage = `Įrašas sukurtas forume „${forumInfo.title}".`;
        }
      }
      
      setSuccess(true);
      setSuccessMessage(successMessage);
      
      // Redirect to the appropriate path after a short delay
      setTimeout(() => {
        if (forumInfo && forumInfo.navigation_path) {
          // Redirect to the forum where the post was created
          navigate(forumInfo.navigation_path, { state: { newPostId: createdPost.id } });
        } else {
          // Fallback to the post page if navigation path is not available
          navigate(`/forumai/irasai/${createdPost.id}`);
        }
      }, 1500);
    } catch (error) {
      console.error("Error submitting post:", error);
      setError(error.response?.data?.errors?.title || error.response?.data?.errors?.description || "Įvyko klaida kuriant įrašą. Bandykite dar kartą.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-6">
      {/* Category Selection Modal */}
      {categoriesOpen && (
        <div className="fixed inset-0 bg-dark/90 flex items-center justify-center z-50">
          <div className="bg-grey rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-white text-xl font-bold">Pasirinkite kategorijas</h2>
              <button 
                onClick={handleCategoryModal}
                className="text-light-grey hover:text-white transition-colors"
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
              </button>
                  </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-3 mb-6">
              {categories.map((category, index) => {
                        const { text, ring, bg } = categoryColors[category] || {
                        text: 'text-light-grey',
                        ring: 'ring-light-grey',
                        bg: 'bg-dark'
                        };

                        const isSelected = selectedCategories.includes(category);
                const bgColorClass = isSelected ? bg : 'bg-dark/20';

                        return (
                        <button
                    key={index}
                    className={`flex items-center text-left p-3 rounded-md transition-all ${ring} ${isSelected ? 'text-white' : text} ${bgColorClass} hover:bg-opacity-20`}
                            onClick={() => toggleCategory(category)}
                        >
                    <div className={`mr-3 ${isSelected ? 'text-white' : text}`}>
                      {isSelected ? (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                        </svg>
                      ) : (
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                        </svg>
                      )}
                    </div>
                    <span className="flex-1">{category}</span>
                        </button>
                        );
                    })}
                </div>
            
            <div className="flex justify-end gap-3">
              <button 
                className="px-4 py-2 border border-light-grey text-light-grey rounded-md hover:bg-light-grey/10 transition-colors"
                onClick={handleCancel}
              >
                Atšaukti
              </button>
              <button 
                className="px-4 py-2 bg-lght-blue text-white rounded-md hover:bg-blue-600 transition-colors"
                onClick={handleApply}
              >
                Patvirtinti ({selectedCategories.length})
              </button>
            </div>
          </div>
        </div>
      )}
      
      {/* Main Form */}
      <div className="bg-grey rounded-lg border border-light-grey/20 overflow-hidden">
        <div className="bg-dark p-4 border-b border-light-grey/20">
          <h1 className="text-white text-xl font-bold">Naujas įrašas</h1>
        </div>
        
        {error && (
          <div className="bg-red/10 border border-red text-red p-3 m-4 rounded-md flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
            {error}
            <button 
              onClick={() => setError(null)} 
              className="ml-auto text-red"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
              </svg>
            </button>
          </div>
        )}
        
        {success && (
          <div className="bg-green/10 border border-green text-green p-4 m-4 rounded-md">
            <div className="flex items-center mb-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-2" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
              <span className="font-medium">Įrašas sėkmingai sukurtas!</span>
            </div>
            <p className="pl-7 text-sm">{successMessage}</p>
            <p className="pl-7 mt-2 text-sm italic">Jūs būsite nukreipti į forumą po kelių sekundžių...</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit} className="p-6">
          {/* Post title */}
          <div className="mb-6">
            <label className="block text-white font-medium mb-2">Įrašo pavadinimas</label>
        <input
              type="text"
              name="title"
              value={formData.title}
          onChange={handleInputChange}
              className="w-full bg-dark border border-light-grey/30 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-lght-blue"
              placeholder="Įveskite įrašo pavadinimą"
            />
          </div>
          
          {/* Forum selection */}
          <div className="mb-6">
            <label className="block text-white font-medium mb-2">Pasirinkite forumą</label>
            
            {/* Forum level tabs */}
            <div className="flex mb-4 border-b border-light-grey/20">
              <button
                type="button"
                className={`px-4 py-2 ${selectedForumLevel === 'general' ? 'text-lght-blue border-b-2 border-lght-blue' : 'text-lighter-grey'}`}
                onClick={() => handleForumLevelChange('general')}
              >
                Bendros diskusijos
              </button>
              <button
                type="button"
                className={`px-4 py-2 ${selectedForumLevel === 'university' ? 'text-lght-blue border-b-2 border-lght-blue' : 'text-lighter-grey'}`}
                onClick={() => handleForumLevelChange('university')}
              >
                Universitetas
              </button>
              <button
                type="button"
                className={`px-4 py-2 ${selectedForumLevel === 'faculty' ? 'text-lght-blue border-b-2 border-lght-blue' : 'text-lighter-grey'} ${!selectedUniversity ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => selectedUniversity && handleForumLevelChange('faculty')}
                disabled={!selectedUniversity}
              >
                Fakultetas
              </button>
              <button
                type="button"
                className={`px-4 py-2 ${selectedForumLevel === 'program' ? 'text-lght-blue border-b-2 border-lght-blue' : 'text-lighter-grey'} ${!selectedFaculty ? 'opacity-50 cursor-not-allowed' : ''}`}
                onClick={() => selectedFaculty && handleForumLevelChange('program')}
                disabled={!selectedFaculty}
              >
                Programa
              </button>
            </div>
            
            {/* General forum selection */}
            <div className={selectedForumLevel === 'general' ? 'block' : 'hidden'}>
              <div className="p-4 bg-dark/50 border border-light-grey/20 rounded-md text-white">
                <div className="flex items-center gap-3 mb-3">
                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-6 h-6 text-lght-blue">
                    <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                  </svg>
                  <h3 className="font-medium">Bendros diskusijos</h3>
                </div>
                <p className="text-lighter-grey text-sm">
                  Tai yra forumas bendroms diskusijoms apie viską, kas susiję su universiteto gyvenimu, nepriklausomai nuo konkretaus universiteto, fakulteto ar programos.
                </p>
                <div className="mt-3 p-2 bg-lght-blue/10 rounded-md text-sm">
                  <p className="text-lght-blue">Pasirinktas forumas: Bendros diskusijos</p>
                </div>
              </div>
            </div>
            
            {/* University selection */}
            <div className={selectedForumLevel === 'university' ? 'block' : 'hidden'}>
              <select
                className="w-full bg-dark border border-light-grey/30 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-lght-blue"
                onChange={handleUniversityChange}
                value={selectedUniversity?.id || ''}
              >
                <option value="">Pasirinkite universitetą</option>
                {universities.map(uni => (
                  <option key={uni.id} value={uni.id}>{uni.title || uni.entity_name}</option>
                ))}
              </select>
            </div>
            
            {/* Faculty selection */}
            <div className={selectedForumLevel === 'faculty' ? 'block' : 'hidden'}>
              <div className="flex items-center mb-2 text-lght-blue text-sm">
                <span>Universitetas: {selectedUniversity?.title || selectedUniversity?.entity_name}</span>
                <button 
                  type="button"
                  className="ml-2 text-lght-blue text-sm underline"
                  onClick={() => handleForumLevelChange('university')}
                >
                  Keisti
                </button>
              </div>
              <select
                className="w-full bg-dark border border-light-grey/30 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-lght-blue"
                onChange={handleFacultyChange}
                value={selectedFaculty?.id || ''}
                disabled={!selectedUniversity}
              >
                <option value="">Pasirinkite fakultetą</option>
                {faculties.map(fac => (
                  <option key={fac.id} value={fac.id}>{fac.title || fac.faculty_name}</option>
                ))}
              </select>
            </div>
            
            {/* Program selection */}
            <div className={selectedForumLevel === 'program' ? 'block' : 'hidden'}>
              <div className="flex flex-col mb-2 text-sm">
                <div className="text-lght-blue mb-1">
                  <span>Universitetas: {selectedUniversity?.title || selectedUniversity?.entity_name}</span>
                  <button 
                    type="button"
                    className="ml-2 text-lght-blue text-sm underline"
                    onClick={() => handleForumLevelChange('university')}
                  >
                    Keisti
                  </button>
                </div>
                <div className="text-lght-blue">
                  <span>Fakultetas: {selectedFaculty?.title || selectedFaculty?.faculty_name}</span>
                  <button 
                    type="button"
                    className="ml-2 text-lght-blue text-sm underline"
                    onClick={() => handleForumLevelChange('faculty')}
                  >
                    Keisti
                  </button>
                </div>
              </div>
              <select
                className="w-full bg-dark border border-light-grey/30 rounded-md p-3 text-white focus:outline-none focus:ring-2 focus:ring-lght-blue"
                onChange={handleProgramChange}
                value={selectedProgram?.id || ''}
                disabled={!selectedFaculty}
              >
                <option value="">Pasirinkite programą</option>
                {programs.map(prog => (
                  <option key={prog.id} value={prog.id}>{prog.title || prog.program_name}</option>
                ))}
              </select>
            </div>
          </div>
          
          {/* Categories */}
          <div className="mb-6">
            <label className="block text-white font-medium mb-2">Kategorijos</label>
        <button
          type="button"
          onClick={handleCategoryModal}
              className="w-full bg-dark border border-light-grey/30 rounded-md p-3 text-white hover:bg-dark/70 transition-colors text-left flex justify-between items-center"
        >
              <span>{selectedCategories.length ? `Pasirinkta: ${selectedCategories.length}` : 'Pasirinkite kategorijas'}</span>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
              </svg>
        </button>
        
        {/* Show selected categories */}
        {selectedCategories.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
            {selectedCategories.map((category, index) => {
              const { text, ring } = categoryColors[category] || {
                text: 'text-light-grey',
                ring: 'ring-light-grey'
              };
              
              return (
                    <div key={index} className={`${ring} ${text} ring-1 px-3 py-1.5 rounded-full text-sm flex items-center`}>
                  {category}
                      <button 
                        type="button"
                        className="ml-2 text-current hover:text-white"
                        onClick={() => toggleCategory(category)}
                      >
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                </div>
              );
            })}
          </div>
        )}
          </div>
        
          {/* Content editor */}
          <div className="mb-6">
            <label className="block text-white font-medium mb-2">Įrašo turinys</label>
            <div className="border border-light-grey/30 rounded-md overflow-hidden">
        <RichTextEditor 
                value={formData.description}
          onChange={handleContentChange}
                placeholder="Įrašo turinys..."
              />
            </div>
          </div>
          
          {/* Submit button */}
          <div className="flex justify-end">
        <button
          type="submit"
              disabled={isSubmitting || success}
              className={`px-6 py-3 bg-lght-blue text-white rounded-md font-medium hover:bg-blue-600 transition-colors
                ${(isSubmitting || success) ? 'opacity-60 cursor-not-allowed' : ''}`}
            >
              {isSubmitting ? (
                <span className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-2 h-4 w-4 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  Siunčiama...
                </span>
              ) : (
                'Paskelbti įrašą'
              )}
        </button>
          </div>
      </form>
      </div>
    </div>
  );
};

export default CreatePost;