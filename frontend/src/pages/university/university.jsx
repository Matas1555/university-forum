import { useEffect, useState } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { useStateContext } from "../../context/contextProvider";
import KTU_logo from "../../../public/assets/KTU-logo.png";
import ProfilePicture from "../../assets/profile-default-icon.png";
import StarRating from "../../components/starRating/starRating";
import InteractiveStarRating from "../../components/starRating/interactiveStarRating";
import RichTextEditor from "../../components/richTextEditor/RichTextEditor";
import Tooltip from "../../components/Tooltip";
import { UniversityAPI, LecturerAPI, ForumAPI } from "../../utils/API";

const UniversityPage = () => {
  const [activeTab, setActiveTab] = useState("programs");
  const [isMobile, setIsMobile] = useState(window.innerWidth < 1280);
  const { user } = useStateContext();
  const location = useLocation();
  const params = useParams();
  const universityId = params.universityId || (location.state && location.state.universityId) || 1;
  const navigate = useNavigate();

  const [universityData, setUniversityData] = useState({
    id: 1,
    name: "Kraunama...",
    rating: 0,
    rating_count: 0,
    description: "Šiuo metu universitetas neturi aprašymo.",
    quality_rating: null,
    facilities_rating: null,
    opportunities_rating: null,
    community_rating: null,
    dormitories_rating: null,
    events_rating: null,
    cafeteria_rating: null,
    library_rating: null,
    sports_rating: null,
    international_rating: null
  });

  const [universityReviews, setUniversityReviews] = useState([]);
  const [loadingReviews, setLoadingReviews] = useState(false);
  const [reviewError, setReviewError] = useState(null);
  const [hasUserReviewed, setHasUserReviewed] = useState(false);

  const [faculties, setFaculties] = useState([]);
  const [selectedFaculty, setSelectedFaculty] = useState(null);
  const [selectedProgram, setSelectedProgram] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const [selectedDegreeType, setSelectedDegreeType] = useState("bakalauras");
  const [showProgramReviews, setShowProgramReviews] = useState(false);
  const [programReviews, setProgramReviews] = useState([]);
  const [loadingProgramReviews, setLoadingProgramReviews] = useState(false);
  const [hasUserReviewedProgram, setHasUserReviewedProgram] = useState(false);
  const [newProgramReview, setNewProgramReview] = useState({
    comment: "",
    rating: 0,
    ratings: {}
  });
  const [programReviewsPage, setProgramReviewsPage] = useState(1);
  const [programReviewsTotal, setProgramReviewsTotal] = useState(0);
  const [programReviewsLastPage, setProgramReviewsLastPage] = useState(1);
  const [programCategoryRatings, setProgramCategoryRatings] = useState({
    course_content_rating: null,
    practical_sessions_rating: null,
    professional_skills_rating: null,
    difficulty_rating: null,
    student_community_rating: null
  });
  const [reviewViewType, setReviewViewType] = useState("detailed");
  
  const [selectedProgramCategories, setSelectedProgramCategories] = useState([]);
  
  const [facultyLecturers, setFacultyLecturers] = useState([]);
  const [loadingLecturers, setLoadingLecturers] = useState(false);

  const [newReview, setNewReview] = useState({
    comment: "",
    ratings: {}
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

  const [selectedCategories, setSelectedCategories] = useState([]);

  const programRatingCategories = [
    { id: 'course_content_rating', name: 'Studijų turinys' },
    { id: 'practical_sessions_rating', name: 'Praktinių užsiėmimų kokybė' },
    { id: 'professional_skills_rating', name: 'Specialybės įgūdžių ugdymas' },
    { id: 'difficulty_rating', name: 'Studijų sudėtingumas' },
    { id: 'student_community_rating', name: 'Studentų bendruomenė' }
  ];

  const loadFacultiesWithPrograms = async () => {
    setIsLoading(true);
    setError(null);
    try {
      const response = await UniversityAPI.getFacultiesWithPrograms(universityId);
      setFaculties(response.data);
      
      if (response.data && response.data.length > 0) {
        setSelectedFaculty(response.data[0]);
        if (response.data[0].programs && response.data[0].programs.length > 0) {
          const defaultProgram = response.data[0].programs.find(
            program => program.degree_type.toLowerCase() === selectedDegreeType
          ) || response.data[0].programs[0];
          
          setSelectedProgram(defaultProgram);
          loadProgramDetails(defaultProgram.id);
        }
        
        loadFacultyLecturers(response.data[0].id);
      }
    } catch (err) {
      console.error('Error loading faculties:', err);
      setError('Failed to load faculties and programs.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadFacultyLecturers = async (facultyId) => {
    setLoadingLecturers(true);
    try {
      const response = await LecturerAPI.getLecturersByFaculty(facultyId);
      setFacultyLecturers(response.data);
    } catch (err) {
      console.error('Error loading faculty lecturers:', err);
    } finally {
      setLoadingLecturers(false);
    }
  };

  const loadProgramDetails = async (programId) => {
    setIsLoading(true);
    try {
      const response = await UniversityAPI.getProgramById(programId);
      setSelectedProgram(prev => ({
        ...prev,
        ...response.data,
      }));
      
      // Update category ratings from program data
      setProgramCategoryRatings({
        course_content_rating: response.data.course_content_rating,
        practical_sessions_rating: response.data.practical_sessions_rating,
        professional_skills_rating: response.data.professional_skills_rating,
        difficulty_rating: response.data.difficulty_rating,
        student_community_rating: response.data.student_community_rating
      });
      
      loadProgramReviews(programId);
    } catch (err) {
      console.error('Error loading program details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const loadProgramReviews = async (programId, page = 1) => {
    setLoadingProgramReviews(true);
    try {
      // Get program reviews with pagination
      const response = await UniversityAPI.getProgramReviews(programId, page);
      setProgramReviews(response.data.data || response.data);
      
      if (response.data.meta) {
        setProgramReviewsTotal(response.data.meta.total);
        setProgramReviewsLastPage(response.data.meta.last_page);
        setProgramReviewsPage(response.data.meta.current_page);
      }
      
      if (user) {
        // Check if user has already reviewed
        const userReviewResponse = await UniversityAPI.hasUserReviewedProgram(programId);
        setHasUserReviewedProgram(userReviewResponse.data.hasReviewed);
        
        if (userReviewResponse.data.hasReviewed && userReviewResponse.data.review) {
          const userReview = userReviewResponse.data.review;
          setNewProgramReview({
            comment: userReview.comment || "",
            rating: userReview.rating || 0,
            ratings: userReview.ratings || {}
          });
          
          // Set selected categories based on the review
          if (userReview.ratings) {
            const selectedCats = Object.keys(userReview.ratings).map(key => 
              programRatingCategories.find(cat => cat.id.replace('_rating', '') === key)?.id
            ).filter(Boolean);
            setSelectedProgramCategories(selectedCats);
          }
        } else {
          // Reset review form
          setNewProgramReview({
            comment: "",
            rating: 0,
            ratings: {}
          });
          setSelectedProgramCategories([]);
        }
      }
    } catch (err) {
      console.error('Error loading program reviews:', err);
    } finally {
      setLoadingProgramReviews(false);
    }
  };

  const handleProgramSelect = (programId) => {
    const program = selectedFaculty.programs.find(p => p.id === programId);
    setSelectedProgram(program);
    loadProgramDetails(programId);
  };

  const handleResize = () => {
    setIsMobile(window.innerWidth < 1280);
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const loadUniversityData = async () => {
    try {
      setIsLoading(true);
      const response = await UniversityAPI.getUniversities();
      
      if (response.data && response.data.length > 0) {
        const university = response.data.find(uni => uni.id === parseInt(universityId));
        
        if (university) {
          setUniversityData({
            id: university.id,
            name: university.name,
            rating: university.rating || 0,
            rating_count: university.rating_count || 0,
            description: university.description || "Universitetas be aprašymo.",
            quality_rating: university.quality_rating,
            facilities_rating: university.facilities_rating,
            opportunities_rating: university.opportunities_rating,
            community_rating: university.community_rating,
            dormitories_rating: university.dormitories_rating,
            events_rating: university.events_rating,
            cafeteria_rating: university.cafeteria_rating,
            library_rating: university.library_rating,
            sports_rating: university.sports_rating,
            international_rating: university.international_rating
          });
        }
      }
      
    } catch (err) {
      console.error('Error loading university data:', err);
      setError('Failed to load university information.');
    } finally {
      setIsLoading(false);
    }
  };

  const loadUniversityReviews = async () => {
    try {
      setLoadingReviews(true);
      setReviewError(null);
      const response = await UniversityAPI.getUniversityReviews(universityId);
      
      if (response.data && Array.isArray(response.data)) {
        setUniversityReviews(response.data);
        
        if (user) {
          const userReview = response.data.find(review => review.user.id === user.id);
          setHasUserReviewed(!!userReview);
        }
      } else {
        console.error('Invalid reviews data format:', response.data);
        setUniversityReviews([]);
        setReviewError('Nepavyko užkrauti universiteto atsiliepimų. Neteisingas duomenų formatas.');
      }
    } catch (err) {
      console.error('Error loading university reviews:', err);
      setUniversityReviews([]);
      setReviewError('Nepavyko užkrauti universiteto atsiliepimų.');
    } finally {
      setLoadingReviews(false);
    }
  };

  useEffect(() => {
    loadUniversityData();
    loadUniversityReviews();
  }, [universityId]);

  useEffect(() => {
    loadFacultiesWithPrograms();
  }, [universityId]);

  const handleFacultySelect = (faculty) => {
    setSelectedFaculty(faculty);
    if (faculty.programs && faculty.programs.length > 0) {
      const defaultProgram = faculty.programs.find(
        program => program.degree_type.toLowerCase() === selectedDegreeType
      ) || faculty.programs[0];
      
      setSelectedProgram(defaultProgram);
      loadProgramDetails(defaultProgram.id);
    } else {
      setSelectedProgram(null);
    }
    
    loadFacultyLecturers(faculty.id);
  };

  useEffect(() => {
    if (selectedFaculty && selectedFaculty.programs && selectedFaculty.programs.length > 0) {
      const program = selectedFaculty.programs.find(
        p => p.degree_type.toLowerCase() === selectedDegreeType
      );
      
      if (program) {
        setSelectedProgram(program);
        loadProgramDetails(program.id);
      }
    }
  }, [selectedDegreeType]);

  const handleRatingChange = (category, value) => {
    setNewReview(prev => ({
      ...prev,
      ratings: {
        ...prev.ratings,
        [category]: value
      }
    }));
  };

  const toggleCategory = (categoryId) => {
    if (selectedCategories.includes(categoryId)) {
      setSelectedCategories(prev => prev.filter(id => id !== categoryId));
      
      const updatedRatings = { ...newReview.ratings };
      delete updatedRatings[categoryId];
      
      setNewReview(prev => ({
        ...prev,
        ratings: updatedRatings
      }));
    } else {
      setSelectedCategories(prev => [...prev, categoryId]);
    }
  };

  const handleCommentChange = (content) => {
    setNewReview(prev => ({
      ...prev,
      comment: content
    }));
  };

  const handleSubmitReview = async (e) => {
    e.preventDefault();
    
    if (!newReview.comment || newReview.comment.trim() === '') {
      alert("Komentaras negali būti tuščias. Prašome parašyti atsiliepimą.");
      return;
    }
    
    try {
      const reviewData = {
        comment: newReview.comment,
        ratings: newReview.ratings
      };
      
      await UniversityAPI.createUniversityReview(universityId, reviewData);
      
      loadUniversityReviews();
      
      setNewReview({
        comment: "",
        ratings: {}
      });
      setSelectedCategories([]);
      
      alert("Atsiliepimas sėkmingai pateiktas!");
      
    } catch (err) {
      console.error('Error submitting review:', err);
      alert("Įvyko klaida pateikiant atsiliepimą. Bandykite vėliau.");
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

  const getRatingColorClass = (rating) => {
    if (rating <= 1) return "bg-red";
    if (rating <= 2) return "bg-red/80";
    if (rating <= 3) return "bg-yellow/70";
    if (rating <= 4) return "bg-green/50";
    return "bg-green";
  };

  const handleProgramRatingChange = (category, value) => {
    // The backend expects field names without _rating suffix
    const backendField = category.replace('_rating', '');
    
    setNewProgramReview(prev => ({
      ...prev,
      ratings: {
        ...prev.ratings,
        [backendField]: value
      }
    }));
  };

  const toggleProgramCategory = (categoryId) => {
    if (selectedProgramCategories.includes(categoryId)) {
      setSelectedProgramCategories(prev => prev.filter(id => id !== categoryId));
      
      const updatedRatings = { ...newProgramReview.ratings };
      delete updatedRatings[categoryId.replace('_rating', '')];
      
      setNewProgramReview(prev => ({
        ...prev,
        ratings: updatedRatings
      }));
    } else {
      setSelectedProgramCategories(prev => [...prev, categoryId]);
    }
  };

  const handleProgramReviewSubmit = async (e) => {
    e.preventDefault();
    
    if (!newProgramReview.comment || newProgramReview.comment.trim() === '') {
      alert("Komentaras negali būti tuščias. Prašome parašyti atsiliepimą.");
      return;
    }
    
    try {
      // Calculate overall rating automatically as the average of category ratings
      const ratings = Object.values(newProgramReview.ratings);
      const averageRating = ratings.length > 0 
        ? parseFloat((ratings.reduce((sum, r) => sum + r, 0) / ratings.length).toFixed(1)) 
        : 0;
      
      // Prepare review data with category ratings
      const reviewData = {
        comment: newProgramReview.comment,
        ratings: newProgramReview.ratings,
        // The overall rating is calculated automatically on the backend
      };
      
      await UniversityAPI.createProgramReview(selectedProgram.id, reviewData);
      loadProgramReviews(selectedProgram.id);
      setNewProgramReview({
        comment: "",
        rating: 0,
        ratings: {}
      });
      setSelectedProgramCategories([]);
      setHasUserReviewedProgram(true);
      alert("Atsiliepimas sėkmingai pateiktas!");
    } catch (err) {
      console.error('Error submitting program review:', err);
      alert("Įvyko klaida pateikiant atsiliepimą. Bandykite vėliau.");
    }
  };

  const handleDeleteProgramReview = async (reviewId) => {
    if (window.confirm("Ar tikrai norite ištrinti šį atsiliepimą?")) {
      try {
        await UniversityAPI.deleteProgramReview(reviewId);
        alert("Atsiliepimas sėkmingai ištrintas.");
        setHasUserReviewedProgram(false);
        loadProgramReviews(selectedProgram.id);
      } catch (err) {
        console.error('Error deleting program review:', err);
        alert("Įvyko klaida trinant atsiliepimą. Bandykite vėliau.");
      }
    }
  };

  const handleDeleteUniversityReview = async (reviewId) => {
    if (window.confirm("Ar tikrai norite ištrinti šį atsiliepimą?")) {
      try {
        await UniversityAPI.deleteUniversityReview(reviewId);
        alert("Atsiliepimas sėkmingai ištrintas.");
        setHasUserReviewed(false);
        loadUniversityReviews();
      } catch (err) {
        console.error('Error deleting university review:', err);
        alert("Įvyko klaida trinant atsiliepimą. Bandykite vėliau.");
      }
    }
  };

  return (
    <div className="flex flex-col items-center px-4 py-8 max-w-screen-2xl mx-auto">
      {/* University Header */}
      <div className="flex flex-col md:flex-row gap-6 w-full justify-between items-center border-b-2 border-light-grey pb-6 mb-8">
        <div className="flex flex-row gap-6 items-center">
          <img className="size-24 md:size-32" src={KTU_logo} alt={universityData.name} />
          <div>
            <h1 className="text-white font-bold text-2xl md:text-4xl mb-2">
              {universityData.name}
              {isLoading && universityData.name === "Kraunama..." && (
                <span className="animate-pulse"> ...</span>
              )}
            </h1>
            <div className="flex items-center gap-2">
              <StarRating rating={universityData.rating} width={6} color="white" />
            </div>
          </div>
        </div>
        <div className="flex gap-4">
          <button 
            className="bg-lght-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
            onClick={() => navigate(`/forumai/universitetai/${universityId}/irasai`)}
          >
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
      <div className="w-full flex flex-col gap-14 mb-12">
        <div className="text-white whitespace-pre-line">
          {universityData.description}
        </div>

          {/* University Statistics Section */}
          <div className="bg-grey rounded-lg p-6 mb-8 border-2 border-white">
            <div className="flex flex-col justify-center items-center mb-6 translate-y-[-45px]">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-10 text-grey bg-white rounded-full p-2">
                <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
              </svg>
              <h2 className="text-white text-2xl text-center font-bold mb-6">Detalus įvertinimas</h2>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-16">
              {ratingCategories.map(category => {
                const average = universityData[`${category.id}_rating`];
                const hasRating = average !== null && average !== undefined;
                
                return (
                  <div key={category.id} className="flex flex-row justify-center text-start">
                    <div className="flex flex-row justify-between items-center mb-2 w-4/5 border-b border-light-grey">
                      <span className="text-white font-medium text-2xl">{category.name}</span>
                      <div className="flex items-center gap-2">
                        {hasRating ? (
                          <div className="flex items-center">
                            <StarRating rating={average} width={6} color="white" />
                          </div>
                        ) : (
                          <span className="text-lighter-grey text-sm">Nėra įvertinimų</span>
                        )}
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>
            
            <div className="mt-6 text-right">
              <p className="text-lighter-grey text-sm">
                Iš viso: {universityData.rating_count} {universityData.rating_count === 1 ? 'atsiliepimas' : universityData.rating_count > 1 && universityData.rating_count < 10 ? 'atsiliepimai' : 'atsiliepimų'}
              </p>
            </div>
          </div>
      </div>

      {/* Tabs */}
      <div className="w-full mb-6 border-b border-grey">
        <div className="flex mb-8 space-x-4 border-b border-light-grey pb-2 text-xl font-medium">
          <button
            className={`py-2 px-4 ${activeTab === "programs" ? "text-lght-blue border-b-2 border-lght-blue" : "text-white hover:text-lght-blue"}`}
            onClick={() => setActiveTab("programs")}
          >
            Programos
          </button>
          <button
            className={`py-2 px-4 ${activeTab === "reviews" ? "text-lght-blue border-b-2 border-lght-blue" : "text-white hover:text-lght-blue"}`}
            onClick={() => setActiveTab("reviews")}
          >
            Atsiliepimai
          </button>
        </div>
      </div>

      {/* Programs Tab Content */}
      {activeTab === "programs" && (
        <div className="w-full">

          {isLoading && faculties.length === 0 ? (
            <div className="text-white text-center py-10">
              <p className="text-xl">Kraunami duomenys...</p>
            </div>
          ) : error && faculties.length === 0 ? (
            <div className="text-red-500 text-center py-10">
              <p className="text-xl">{error}</p>
              <button 
                className="mt-4 bg-lght-blue text-white px-4 py-2 rounded-lg"
                onClick={() => loadFacultiesWithPrograms()}
              >
                Bandyti dar kartą
              </button>
            </div>
          ) : (
            <div className={`grid grid-cols-1 ${isMobile ? "" : "lg:grid-cols-12"} gap-6`}>
              {/* Faculty Selection */}
              <div className={`${isMobile ? "w-full" : "lg:col-span-3"}`}>
                <div className="bg-grey rounded-lg p-4">
                  <h2 className="text-white font-bold mb-4">Fakultetai</h2>
                  <div className="flex flex-col gap-2 max-h-500px overflow-auto scrollbar-custom">
                    {faculties.map((faculty, index) => {
                      const colorClass = colorClasses[index % colorClasses.length];
                      return (
                        <div 
                          key={faculty.id}
                          className={`flex flex-row gap-2 p-3 mr-1 cursor-pointer border-2 border-grey items-center rounded-md hover:bg-lght-blue/10 transition-colors ${
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
                      <h2 className="text-white font-bold text-xl mb-4">Programos</h2>
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
                        .filter(program => program.degree_type.toLowerCase() === selectedDegreeType)
                        .map(program => (
                          <div 
                            key={program.id} 
                            className={`bg-dark p-4 rounded-lg cursor-pointer transition-colors hover:bg-lght-blue/10 ${
                              selectedProgram?.id === program.id ? 'ring-2 ring-lght-blue' : ''
                            }`}
                            onClick={() => handleProgramSelect(program.id)}
                          >
                            <h3 className="text-white font-medium mb-2">{program.title}</h3>
                            <div className="flex justify-between items-center">
                              <p className="text-light-grey text-sm">{program.program_length}</p>
                              <div className="flex items-center gap-1">
                                <StarRating rating={program.rating} width={4} color="white" />
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>

                    {selectedFaculty.programs.filter(program => program.degree_type.toLowerCase() === selectedDegreeType).length === 0 && (
                      <div className="text-white text-center py-6">
                        Nėra programų šiame fakultete
                      </div>
                    )}
                  </div>
                )}

                {/* Selected Program Details */}
                {selectedProgram && (
                  <>
                    {isLoading ? (
                      <div className="text-white text-center py-4">
                        <p>Kraunami programos duomenys...</p>
                      </div>
                    ) : (
                      <div className="flex flex-col">
                        <div className="bg-grey rounded-lg p-6 mb-6 border-2 border-white mt-10">
                          <div className="flex flex-col justify-center items-center translate-y-[-45px]">
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-10 text-grey bg-white rounded-full p-2">
                              <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                            </svg>
                            <h2 className="text-white text-2xl text-center font-bold mb-6">Detalus programos įvertinimas</h2>
                          </div>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-x-24 gap-y-8">
                            {programRatingCategories.map(category => {
                              const average = programCategoryRatings[category.id];
                              const hasRating = average !== null && average !== undefined;
                              
                              return (
                                <div key={category.id} className="flex flex-row justify-center text-start">
                                  <div className="flex flex-row justify-between items-center mb-2 w-4/5 border-b border-light-grey">
                                    <span className="text-white font-medium text-xl">{category.name}</span>
                                    <div className="flex items-center gap-2">
                                      {hasRating ? (
                                        <div className="flex items-center">
                                          <StarRating rating={average} width={5} color="white" />
                                        </div>
                                      ) : (
                                        <span className="text-lighter-grey text-sm">Nėra įvertinimų</span>
                                      )}
                                    </div>
                                  </div>
                                </div>
                              );
                            })}
                          </div>
                          
                          <div className="mt-6 text-right">
                            <p className="text-lighter-grey text-sm">
                              Iš viso: {selectedProgram.rating_count || 0} {selectedProgram.rating_count === 1 ? 'atsiliepimas' : selectedProgram.rating_count > 1 && selectedProgram.rating_count < 10 ? 'atsiliepimai' : 'atsiliepimų'}
                            </p>
                          </div>
                        </div>
                        <div className="flex flex-row gap-6 w-full">
                          <div className="bg-grey rounded-lg p-6 mt-6 flex-1">
                            <div className="flex flex-col h-full">
                              <div className="flex-1">
                                <h3 className="text-white font-medium text-lg mb-2">Apie programą</h3>
                                <p className="text-lighter-grey">
                                  {selectedProgram.description || "Tai yra aukštos kokybės studijų programa, paruošianti studentus karjerai šiuolaikiniame pasaulyje. Programa suteikia reikalingus įgūdžius ir žinias, kad absolventai galėtų sėkmingai konkuruoti darbo rinkoje."}
                                </p>
                              </div>
                              <div className="flex justify-between items-center mt-4">
                                <button 
                                  className="bg-lght-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                  onClick={() => setShowProgramReviews(!showProgramReviews)}
                                >
                                  <div className="flex flex-row gap-2">
                                    <p className="text-white font-medium">
                                      {showProgramReviews ? "Slėpti atsiliepimus" : "Skaitykite atsiliepimus"}
                                    </p>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 rounded-md text-white">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M7.5 8.25h9m-9 3H12m-9.75 1.51c0 1.6 1.123 2.994 2.707 3.227 1.129.166 2.27.293 3.423.379.35.026.67.21.865.501L12 21l2.755-4.133a1.14 1.14 0 0 1 .865-.501 48.172 48.172 0 0 0 3.423-.379c1.584-.233 2.707-1.626 2.707-3.228V6.741c0-1.602-1.123-2.995-2.707-3.228A48.394 48.394 0 0 0 12 3c-2.392 0-4.744.175-7.043.513C3.373 3.746 2.25 5.14 2.25 6.741v6.018Z" />
                                    </svg>
                                  </div>
                                </button>
                                <button 
                                  className="bg-lght-blue text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition-colors"
                                  onClick={() => navigate(`/forumai/universitetai/${universityId}/programos/${selectedProgram.id}/irasai`)}
                                >
                                  <div className="flex flex-row gap-2">
                                    <p className="text-white font-medium">Forumas</p>
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 rounded-md text-white">
                                      <path strokeLinecap="round" strokeLinejoin="round" d="M20.25 8.511c.884.284 1.5 1.128 1.5 2.097v4.286c0 1.136-.847 2.1-1.98 2.193-.34.027-.68.052-1.02.072v3.091l-3-3c-1.354 0-2.694-.055-4.02-.163a2.115 2.115 0 0 1-.825-.242m9.345-8.334a2.126 2.126 0 0 0-.476-.095 48.64 48.64 0 0 0-8.048 0c-1.131.094-1.976 1.057-1.976 2.192v4.286c0 .837.46 1.58 1.155 1.951m9.345-8.334V6.637c0-1.621-1.152-3.026-2.76-3.235A48.455 48.455 0 0 0 11.25 3c-2.115 0-4.198.137-6.24.402-1.608.209-2.76 1.614-2.76 3.235v6.226c0 1.621 1.152 3.026 2.76 3.235.577.075 1.157.14 1.74.194V21l4.155-4.155" />
                                    </svg>
                                  </div>
                                </button>
                              </div>
                            </div>
                          </div>
                          <div className="bg-dark rounded-lg p-6 space-y-10 mt-3 w-2/6">
                            <h3 className="text-white font-medium text-lg mb-4">Papildoma informacija</h3>
                            <div className="flex justify-between mb-2">
                              <span className="text-white">Laipsnis:</span>
                              <span className="text-lighter-grey">{selectedProgram.degree_type}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                              <span className="text-white">Trukmė:</span>
                              <span className="text-lighter-grey">{selectedProgram.program_length}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                              <span className="text-white">Studentų skaičius:</span>
                              <span className="text-lighter-grey">~{selectedProgram.student_count || "N/A"}</span>
                            </div>
                            <div className="flex justify-between mb-2">
                              <span className="text-white">Įvertinimas:</span>
                              <div className="flex gap-1">
                                <StarRating rating={selectedProgram.rating} width={4} color="white" />
                                <p className="text-lighter-grey">({selectedProgram.rating_count || 0})</p>
                              </div>
                            </div>
                            <div className="flex justify-end mt-4 gap-2">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6 text-lght-blue">
                                <path strokeLinecap="round" strokeLinejoin="round" d="M13.5 4.5 21 12m0 0-7.5 7.5M21 12H3" />
                              </svg>
                              <a className="text-lght-blue border-b border-dark hover:border-b hover:border-lght-blue" href={selectedProgram.additional_information_link || "#"} target="_blank" rel="noopener noreferrer">Sužinokite daugiau</a>
                            </div>
                          </div>
                        </div>

                        {showProgramReviews && (
                          <div className="bg-grey rounded-lg p-6 mt-10">
                            <div className="flex flex-col justify-center items-center translate-y-[-45px]">
                              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-10 text-grey bg-white rounded-full p-2">
                                <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                              </svg>
                              <h2 className="text-white text-2xl text-center font-bold mb-6">Programos atsiliepimai</h2>
                            </div>
                            
                            {loadingProgramReviews ? (
                              <div className="text-white text-center py-4">
                                <p>Kraunami atsiliepimai...</p>
                              </div>
                            ) : (
                              <>
                                {/* Add Review Form - only shown for logged-in users who haven't reviewed yet */}
                                {user && !hasUserReviewedProgram && (
                                  <div className="bg-grey rounded-lg p-6 mb-8">
                                    <h3 className="text-white text-3xl font-bold mb-10">Palikite atsiliepimą apie programą</h3>
                                    
                                    <form onSubmit={handleProgramReviewSubmit}>
                                      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                                        <div className="space-y-4">
                                          <div>
                                            <div className="flex flex-row gap-2 items-center mb-3">
                                              <h4 className="text-white mb-1 font-medium">Pasirinkite vertinimo kategorijas:</h4>
                                              <Tooltip 
                                                content="Šioje sekcijoje galite įvertinti programą pagal įvairias kategorijas. Galite pasirinkti kelias, visas arba nė vienos kategorijos" 
                                                maxWidth={400}
                                                position="bottom" 
                                              />
                                            </div>
                                            
                                            <div className="grid grid-cols-1 gap-2 max-h-80 overflow-y-auto pr-2 border-y py-2 pl-1 border-light-grey">
                                              {programRatingCategories.map(category => (
                                                <div 
                                                  key={category.id}
                                                  className={`p-2 border rounded-md cursor-pointer transition-colors flex justify-between items-center ${
                                                    selectedProgramCategories.includes(category.id) 
                                                      ? 'border-lght-blue bg-lght-blue/10 text-white' 
                                                      : 'border-gray-400 text-lighter-grey hover:border-lght-blue'
                                                  }`}
                                                  onClick={() => toggleProgramCategory(category.id)}
                                                >
                                                  <span>{category.name}</span>
                                                  {selectedProgramCategories.includes(category.id) && (
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 text-lght-blue">
                                                      <path strokeLinecap="round" strokeLinejoin="round" d="M4.5 12.75l6 6 9-13.5" />
                                                    </svg>
                                                  )}
                                                </div>
                                              ))}
                                            </div>
                                          </div>
                                          
                                          {selectedProgramCategories.length > 0 && (
                                            <div className="mt-6">
                                              <h4 className="text-white mb-3 font-medium">Jūsų vertinimai:</h4>
                                              <div className="space-y-4">
                                                {selectedProgramCategories.map(categoryId => {
                                                  const category = programRatingCategories.find(c => c.id === categoryId);
                                                  const ratingKey = categoryId.replace('_rating', '');
                                                  return (
                                                    <div key={categoryId} className="flex gap-4 p-2 border justify-between border-gray-600 rounded-md">
                                                      <label className="block text-white text-sm">{category?.name}</label>
                                                      <div className="flex">
                                          <InteractiveStarRating 
                                                          initialRating={newProgramReview.ratings[ratingKey] || 0} 
                                            width={5} 
                                                          onRatingChange={(rating) => handleProgramRatingChange(categoryId, rating)} 
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
                                            value={newProgramReview.comment} 
                                            onChange={(content) => setNewProgramReview(prev => ({ ...prev, comment: content }))} 
                                            placeholder="Parašykite savo nuomonę apie programą..." 
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
                                
                                {/* View toggle buttons */}
                                <div className="flex justify-end mb-4">
                                  <div className="inline-flex relative bg-dark rounded-lg p-1">
                                    <div 
                                      className="absolute top-1 bottom-1 rounded-md bg-lght-blue transition-all duration-300 ease-in-out" 
                                      style={{ 
                                        width: reviewViewType === "detailed" ? "calc(50% - 30px)" : "calc(70% - 30px)",
                                        left: reviewViewType === "detailed" ? "4px" : "calc(40% + 3px)" 
                                      }}
                                    ></div>
                                    <button
                                      className={`px-4 py-2 rounded-md transition-colors relative z-10 ${
                                        reviewViewType === "detailed" ? "text-white" : "text-white text-opacity-60 hover:text-opacity-80"
                                      }`}
                                      onClick={() => setReviewViewType("detailed")}
                                    >
                                      Detalus
                                    </button>
                                    <button
                                      className={`px-4 py-2 rounded-md transition-colors relative z-10 ${
                                        reviewViewType === "simplified" ? "text-white" : "text-white text-opacity-60 hover:text-opacity-80"
                                      }`}
                                      onClick={() => setReviewViewType("simplified")}
                                    >
                                      Supaprastintas
                                    </button>
                                  </div>
                                </div>
                                
                                {programReviews.length > 0 ? (
                                  <div className="min-h-[400px] relative overflow-hidden">
                                    <div 
                                      className={`transition-all duration-500 ${
                                          reviewViewType === "detailed" 
                                              ? "opacity-100 translate-x-0 relative" 
                                              : "opacity-0 -translate-x-full absolute top-0 left-0 w-full invisible"
                                      }`}
                                    >
                                      <div className="space-y-6">
                                        {programReviews.map(review => (
                                          <div key={review.id} className="bg-grey rounded-lg p-6">
                                            <div className="flex flex-col md:flex-row mb-4">
                                              <div className="flex mb-4 md:mb-0">
                                                <div className="mr-4">
                                                  <img 
                                                    src={review.user.profilePic || ProfilePicture} 
                                                    alt={review.user.username} 
                                                    className="size-11 rounded-full"
                                                  />
                                                </div>
                                                <div>
                                                  <p className="text-white font-medium">{review.user.username}</p>
                                                  <p className="text-light-grey text-sm">{review.user.status}</p>
                                                </div>
                                              </div>
                                              <div className="md:ml-auto flex items-center gap-3">
                                                <p className="text-lighter-grey text-sm">{review.date}</p>
                                                {user && review.user.id === user.id && (
                                                  <button 
                                                    onClick={() => handleDeleteProgramReview(review.id)}
                                                    className="text-red/50 hover:text-red"
                                                    title="Ištrinti atsiliepimą"
                                                  >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                                      <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                    </svg>
                                                  </button>
                                                )}
                                              </div>
                                            </div>
                                            
                                            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                                              {/* Check if ratings are in a "ratings" object or directly on the review */}
                                              {(review.ratings && Object.keys(review.ratings).length > 0) || 
                                               (review.course_content_rating || review.practical_sessions_rating || 
                                                review.professional_skills_rating || review.difficulty_rating || 
                                                review.student_community_rating) ? (
                                                <div className="space-y-2 pr-4 border-r-2 border-white">
                                                  <div className="flex flex-col">
                                                    {review.ratings && Object.entries(review.ratings).map(([categoryId, rating]) => {
                                                      const category = programRatingCategories.find(c => c.id.replace('_rating', '') === categoryId);
                                                      return (
                                                        <div key={categoryId} className="flex justify-between items-center mb-1">
                                                          <span className="text-white text-sm">{category?.name || categoryId}:</span>
                                                          <span className={`text-white ${getRatingColorClass(rating)} rounded-lg px-2 py-1 text-sm font-bold`}>
                                                            {rating}/5
                                                          </span>
                                                        </div>
                                                      );
                                                    })}

                                                    {/* Handle ratings as direct properties on review */}
                                                    {!review.ratings && (
                                                      <>
                                                        {review.course_content_rating && (
                                                          <div className="flex justify-between items-center mb-1">
                                                            <span className="text-white text-sm">Studijų turinys:</span>
                                                            <span className={`text-white ${getRatingColorClass(review.course_content_rating)} rounded-lg px-2 py-1 text-sm font-bold`}>
                                                              {review.course_content_rating}/5
                                                            </span>
                                                          </div>
                                                        )}
                                                        {review.practical_sessions_rating && (
                                                          <div className="flex justify-between items-center mb-1">
                                                            <span className="text-white text-sm">Praktinių užsiėmimų kokybė:</span>
                                                            <span className={`text-white ${getRatingColorClass(review.practical_sessions_rating)} rounded-lg px-2 py-1 text-sm font-bold`}>
                                                              {review.practical_sessions_rating}/5
                                                            </span>
                                                          </div>
                                                        )}
                                                        {review.professional_skills_rating && (
                                                          <div className="flex justify-between items-center mb-1">
                                                            <span className="text-white text-sm">Specialybės įgūdžių ugdymas:</span>
                                                            <span className={`text-white ${getRatingColorClass(review.professional_skills_rating)} rounded-lg px-2 py-1 text-sm font-bold`}>
                                                              {review.professional_skills_rating}/5
                                                            </span>
                                                          </div>
                                                        )}
                                                        {review.difficulty_rating && (
                                                          <div className="flex justify-between items-center mb-1">
                                                            <span className="text-white text-sm">Studijų sudėtingumas:</span>
                                                            <span className={`text-white ${getRatingColorClass(review.difficulty_rating)} rounded-lg px-2 py-1 text-sm font-bold`}>
                                                              {review.difficulty_rating}/5
                                                            </span>
                                                          </div>
                                                        )}
                                                        {review.student_community_rating && (
                                                          <div className="flex justify-between items-center mb-1">
                                                            <span className="text-white text-sm">Studentų bendruomenė:</span>
                                                            <span className={`text-white ${getRatingColorClass(review.student_community_rating)} rounded-lg px-2 py-1 text-sm font-bold`}>
                                                              {review.student_community_rating}/5
                                                            </span>
                                                          </div>
                                                        )}
                                                      </>
                                                    )}
                                                  </div>
                                                </div>
                                              ) : null}
                                              
                                              <div className={`p-4 border-2 border-white rounded-md ${
                                                ((review.ratings && Object.keys(review.ratings).length > 0) || 
                                                 review.course_content_rating || review.practical_sessions_rating || 
                                                 review.professional_skills_rating || review.difficulty_rating || 
                                                 review.student_community_rating) 
                                                ? 'md:col-span-3' : 'md:col-span-4'}`}>
                                                <div className="text-white" dangerouslySetInnerHTML={{ __html: review.comment }}></div>
                                              </div>
                                            </div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>

                                    <div 
                                      className={`transition-all duration-500 ${
                                          reviewViewType === "simplified" 
                                              ? "opacity-100 translate-x-0 relative" 
                                              : "opacity-0 translate-x-full absolute top-0 left-0 w-full invisible"
                                      }`}
                                    >
                                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                        {programReviews.map(review => (
                                          <div key={review.id} className="bg-dark rounded-lg p-4">
                                            <div className="flex justify-between items-center mb-2">
                                              <div className="flex items-center gap-2">
                                                <img 
                                                  src={review.user.profilePic || ProfilePicture} 
                                                  alt={review.user.username} 
                                                  className="size-8 rounded-full"
                                                />
                                                <div>
                                                  <p className="text-white font-medium">{review.user.username}</p>
                                                  <p className="text-light-grey text-sm">{review.user.status}</p>
                                                </div>
                                              </div>
                                              <div className="flex items-center gap-3">
                                                <div className="flex flex-col items-center">
                                                  {review.rating ? (
                                                    <StarRating rating={review.rating} width={4} color="white" />
                                                  ) : (
                                                    <span className="text-lighter-grey text-sm">Neįvertinta</span>
                                                  )}
                                                  <p className="text-lighter-grey text-sm">{review.date}</p>
                                                </div>
                                                {user && review.user.id === user.id && (
                                                  <button 
                                                    onClick={() => handleDeleteProgramReview(review.id)}
                                                    className="text-red/50 hover:text-red"
                                                    title="Ištrinti atsiliepimą"
                                                  >
                                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                                      <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                                    </svg>
                                                  </button>
                                                )}
                                              </div>
                                            </div>
                                            <div className="text-white" dangerouslySetInnerHTML={{ __html: review.comment }}></div>
                                          </div>
                                        ))}
                                      </div>
                                    </div>
                                    
                                    {/* Pagination */}
                                    {programReviewsLastPage > 1 && (
                                      <div className="flex justify-center mt-8">
                                        <div className="flex space-x-2">
                                          <button 
                                            className={`px-4 py-2 rounded-lg ${programReviewsPage === 1 ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-dark text-white hover:bg-lght-blue/20'}`}
                                            disabled={programReviewsPage === 1}
                                            onClick={() => loadProgramReviews(selectedProgram.id, programReviewsPage - 1)}
                                          >
                                            Ankstesnis
                                          </button>
                                          
                                          {[...Array(Math.min(programReviewsLastPage, 5))].map((_, i) => {
                                            let pageNumber;
                                            if (programReviewsLastPage <= 5) {
                                              pageNumber = i + 1;
                                            } else if (programReviewsPage <= 3) {
                                              pageNumber = i + 1;
                                            } else if (programReviewsPage >= programReviewsLastPage - 2) {
                                              pageNumber = programReviewsLastPage - 4 + i;
                                            } else {
                                              pageNumber = programReviewsPage - 2 + i;
                                            }
                                            
                                            return (
                                              <button 
                                                key={i}
                                                className={`px-4 py-2 rounded-lg ${programReviewsPage === pageNumber ? 'bg-lght-blue text-white' : 'bg-dark text-white hover:bg-lght-blue/20'}`}
                                                onClick={() => loadProgramReviews(selectedProgram.id, pageNumber)}
                                              >
                                                {pageNumber}
                                              </button>
                                            );
                                          })}
                                          
                                          <button 
                                            className={`px-4 py-2 rounded-lg ${programReviewsPage === programReviewsLastPage ? 'bg-gray-700 text-gray-400 cursor-not-allowed' : 'bg-dark text-white hover:bg-lght-blue/20'}`}
                                            disabled={programReviewsPage === programReviewsLastPage}
                                            onClick={() => loadProgramReviews(selectedProgram.id, programReviewsPage + 1)}
                                          >
                                            Sekantis
                                          </button>
                                        </div>
                                      </div>
                                    )}
                                  </div>
                                ) : (
                                  <div className="text-white text-center py-4">
                                    <p>Ši programa dar neturi atsiliepimų.</p>
                                    {user && !hasUserReviewedProgram && (
                                      <p className="text-light-grey mt-2">Būkite pirmas, kuris palieka atsiliepimą!</p>
                                    )}
                                  </div>
                                )}
                              </>
                            )}
                          </div>
                        )}
                      </div>
                    )}
                  </>
                )}

                {/* Faculty Lecturers Section */}
                {selectedFaculty && (
                  <div className="bg-grey rounded-lg p-6 mt-10">
                    <div className="flex flex-col justify-center items-center translate-y-[-45px]">
                      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-10 text-grey bg-white rounded-full p-2">
                        <path stroke-linecap="round" stroke-linejoin="round" d="M4.26 10.147a60.438 60.438 0 0 0-.491 6.347A48.62 48.62 0 0 1 12 20.904a48.62 48.62 0 0 1 8.232-4.41 60.46 60.46 0 0 0-.491-6.347m-15.482 0a50.636 50.636 0 0 0-2.658-.813A59.906 59.906 0 0 1 12 3.493a59.903 59.903 0 0 1 10.399 5.84c-.896.248-1.783.52-2.658.814m-15.482 0A50.717 50.717 0 0 1 12 13.489a50.702 50.702 0 0 1 7.74-3.342M6.75 15a.75.75 0 1 0 0-1.5.75.75 0 0 0 0 1.5Zm0 0v-3.675A55.378 55.378 0 0 1 12 8.443m-7.007 11.55A5.981 5.981 0 0 0 6.75 15.75v-1.5" />
                      </svg>
                      <h2 className="text-white text-2xl text-center font-bold mb-6">Fakulteto dėstytojai</h2>
                    </div>
                    
                    {loadingLecturers ? (
                      <div className="text-white text-center py-4">
                        <p>Kraunami dėstytojai...</p>
                      </div>
                    ) : facultyLecturers.length > 0 ? (
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {facultyLecturers.map(lecturer => (
                          <div 
                            key={lecturer.id} 
                            className="bg-dark p-4 rounded-lg cursor-pointer transition-colors hover:bg-lght-blue/10"
                            onClick={() => navigate(`/destytojai/${lecturer.id}`)}
                          >
                            <div className="flex items-center gap-3 mb-2">
                              <div className="size-12 bg-grey rounded-full overflow-hidden">
                                <img 
                                  src={lecturer.avatar || ProfilePicture} 
                                  alt={lecturer.name} 
                                  className="w-full h-full object-cover" 
                                />
                              </div>
                              <div>
                                <h3 className="text-white font-medium">{lecturer.name}</h3>
                                <p className="text-light-grey text-sm">{lecturer.profession || "Dėstytojas"}</p>
                              </div>
                            </div>
                            
                            <div className="flex justify-between items-center mt-2">
                              <div className="flex items-center gap-1">
                                <StarRating rating={lecturer.overall_rating || 0} width={4} color="white" />
                                <p className="text-light-grey">({lecturer.rating_count || 0})</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-white text-center py-6">
                        Nėra dėstytojų, priskirtų šiam fakultetui
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Reviews Tab Content */}
      {activeTab === "reviews" && (
        <div className="w-full">
          {/* Add Review Form - only shown for logged-in users who haven't reviewed yet */}
          {user && !hasUserReviewed && (
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

          {/* View toggle buttons for University Reviews */}
          {universityReviews && universityReviews.length > 0 && (
            <div className="flex justify-end mb-4">
              <div className="inline-flex relative bg-grey rounded-lg p-1">
                <div 
                  className="absolute top-1 bottom-1 rounded-md bg-lght-blue transition-all duration-300 ease-in-out" 
                  style={{ 
                      width: reviewViewType === "detailed" ? "calc(50% - 30px)" : "calc(70% - 30px)",
                      left: reviewViewType === "detailed" ? "4px" : "calc(40% + 3px)" 
                  }}
                ></div>
                <button
                  className={`px-4 py-2 rounded-md transition-colors relative z-10 ${
                      reviewViewType === "detailed" ? "text-white" : "text-white text-opacity-60 hover:text-opacity-80"
                  }`}
                  onClick={() => setReviewViewType("detailed")}
                >
                  Detalus
                </button>
                <button
                  className={`px-4 py-2 rounded-md transition-colors relative z-10 ${
                      reviewViewType === "simplified" ? "text-white" : "text-white text-opacity-60 hover:text-opacity-80"
                  }`}
                  onClick={() => setReviewViewType("simplified")}
                >
                  Supaprastintas
                </button>
              </div>
            </div>
          )}

          {/* University Reviews Container with Transition */}
          <div className="relative">
            {/* Detailed View */}
            <div 
              className={`transition-all duration-500 ${
                  reviewViewType === "detailed" 
                      ? "opacity-100 translate-x-0 relative" 
                      : "opacity-0 -translate-x-full absolute top-0 left-0 w-full invisible"
              }`}
            >
              {/* Existing detailed review content */}
              {loadingReviews ? (
                <div className="bg-grey rounded-lg p-6 text-center">
                  <p className="text-white text-xl">Kraunami atsiliepimai...</p>
                </div>
              ) : reviewError ? (
                <div className="bg-grey rounded-lg p-6 text-center">
                  <p className="text-red-500 text-xl">{reviewError}</p>
                  <button 
                    className="mt-4 bg-lght-blue text-white px-4 py-2 rounded-lg"
                    onClick={() => loadUniversityReviews()}
                  >
                    Bandyti dar kartą
                  </button>
                </div>
              ) : !Array.isArray(universityReviews) || universityReviews.length === 0 ? (
                <div className="bg-grey rounded-lg p-6 text-center">
                  <p className="text-white text-xl">Šis universitetas dar neturi atsiliepimų.</p>
                  {user && (
                    <p className="text-light-grey mt-2">Būkite pirmas, kuris palieka atsiliepimą!</p>
                  )}
                </div>
              ) : (
                <div className="min-h-[500px]">
                  <div 
                    className={`${reviewViewType === "detailed" ? "block" : "hidden"}`}
                  >
                    <div className="space-y-6">
                      {universityReviews.map(review => (
                        <div key={review.id} className="bg-grey rounded-lg p-6">
                          <div className="flex flex-col md:flex-row mb-4">
                            <div className="flex mb-4 md:mb-0">
                              <div className="mr-4">
                                <img 
                                  src={review.user.profilePic || ProfilePicture} 
                                  alt={review.user.username} 
                                  className="size-11 rounded-full"
                                />
                              </div>
                              <div>
                                <p className="text-white font-medium">{review.user.username}</p>
                                <p className="text-light-grey text-sm">{review.user.status}</p>
                              </div>
                            </div>
                            <div className="md:ml-auto flex items-center gap-3">
                              <p className="text-lighter-grey text-sm">{review.date}</p>
                              {user && review.user.id === user.id && (
                                <button 
                                  onClick={() => handleDeleteUniversityReview(review.id)}
                                  className="text-red/50 hover:text-red"
                                  title="Ištrinti atsiliepimą"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </div>
                          
                          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            {/* Check if ratings are in a "ratings" object or directly on the review */}
                            {(review.ratings && Object.keys(review.ratings).length > 0) || 
                             (review.course_content_rating || review.practical_sessions_rating || 
                              review.professional_skills_rating || review.difficulty_rating || 
                              review.student_community_rating) ? (
                              <div className="space-y-2 pr-4 border-r-2 border-white">
                                <div className="flex flex-col">
                                  {review.ratings && Object.entries(review.ratings).map(([categoryId, rating]) => {
                                    const category = ratingCategories.find(c => c.id === categoryId);
                                    return (
                                      <div key={categoryId} className="flex justify-between items-center mb-1">
                                        <span className="text-white text-sm">{category?.name || categoryId}:</span>
                                        <span className={`text-white ${getRatingColorClass(rating)} rounded-lg px-2 py-1 text-sm font-bold`}>
                                          {rating}/5
                                        </span>
                                      </div>
                                    );
                                  })}

                                  {/* Handle ratings as direct properties on review */}
                                  {!review.ratings && (
                                    <>
                                      {review.course_content_rating && (
                                        <div className="flex justify-between items-center mb-1">
                                          <span className="text-white text-sm">Studijų turinys:</span>
                                          <span className={`text-white ${getRatingColorClass(review.course_content_rating)} rounded-lg px-2 py-1 text-sm font-bold`}>
                                            {review.course_content_rating}/5
                                          </span>
                                        </div>
                                      )}
                                      {review.practical_sessions_rating && (
                                        <div className="flex justify-between items-center mb-1">
                                          <span className="text-white text-sm">Praktinių užsiėmimų kokybė:</span>
                                          <span className={`text-white ${getRatingColorClass(review.practical_sessions_rating)} rounded-lg px-2 py-1 text-sm font-bold`}>
                                            {review.practical_sessions_rating}/5
                                          </span>
                                        </div>
                                      )}
                                      {review.professional_skills_rating && (
                                        <div className="flex justify-between items-center mb-1">
                                          <span className="text-white text-sm">Specialybės įgūdžių ugdymas:</span>
                                          <span className={`text-white ${getRatingColorClass(review.professional_skills_rating)} rounded-lg px-2 py-1 text-sm font-bold`}>
                                            {review.professional_skills_rating}/5
                                          </span>
                                        </div>
                                      )}
                                      {review.difficulty_rating && (
                                        <div className="flex justify-between items-center mb-1">
                                          <span className="text-white text-sm">Studijų sudėtingumas:</span>
                                          <span className={`text-white ${getRatingColorClass(review.difficulty_rating)} rounded-lg px-2 py-1 text-sm font-bold`}>
                                            {review.difficulty_rating}/5
                                          </span>
                                        </div>
                                      )}
                                      {review.student_community_rating && (
                                        <div className="flex justify-between items-center mb-1">
                                          <span className="text-white text-sm">Studentų bendruomenė:</span>
                                          <span className={`text-white ${getRatingColorClass(review.student_community_rating)} rounded-lg px-2 py-1 text-sm font-bold`}>
                                            {review.student_community_rating}/5
                                          </span>
                                        </div>
                                      )}
                                    </>
                                  )}
                                </div>
                              </div>
                            ) : null}
                            
                            <div className={`p-4 border-2 border-white rounded-md ${
                              ((review.ratings && Object.keys(review.ratings).length > 0) || 
                               review.course_content_rating || review.practical_sessions_rating || 
                               review.professional_skills_rating || review.difficulty_rating || 
                               review.student_community_rating) 
                              ? 'md:col-span-3' : 'md:col-span-4'}`}>
                              <div className="text-white" dangerouslySetInnerHTML={{ __html: review.comment }}></div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div 
                    className={`${reviewViewType === "simplified" ? "block" : "hidden"}`}>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {universityReviews.map(review => (
                        <div key={review.id} className="bg-dark rounded-lg p-4">
                          <div className="flex justify-between items-center mb-2">
                            <div className="flex items-center gap-2">
                              <img 
                                src={review.user.profilePic || ProfilePicture} 
                                alt={review.user.username} 
                                className="size-8 rounded-full"
                              />
                              <div>
                                <p className="text-white font-medium">{review.user.username}</p>
                                <p className="text-light-grey text-sm">{review.user.status}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-3">
                              <div className="flex flex-col items-center">
                                {review.overallRating ? (
                                  <StarRating rating={review.overallRating} width={4} color="white" />
                                ) : (
                                  <span className="text-lighter-grey text-sm">Neįvertinta</span>
                                )}
                                <p className="text-lighter-grey text-sm">{review.date}</p>
                              </div>
                              {user && review.user.id === user.id && (
                                <button 
                                  onClick={() => handleDeleteUniversityReview(review.id)}
                                  className="text-red/50 hover:text-red"
                                  title="Ištrinti atsiliepimą"
                                >
                                  <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                                    <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                                  </svg>
                                </button>
                              )}
                            </div>
                          </div>
                          <div className="text-white" dangerouslySetInnerHTML={{ __html: review.comment }}></div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Simplified View */}
            <div 
              className={`transition-all duration-500 ${
                  reviewViewType === "simplified" 
                      ? "opacity-100 translate-x-0 relative" 
                      : "opacity-0 translate-x-full absolute top-0 left-0 w-full invisible"
              }`}
            >
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {universityReviews.map(review => (
                  <div key={review.id} className="bg-dark rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <div className="flex items-center gap-2">
                        <img 
                          src={review.user.profilePic || ProfilePicture} 
                          alt={review.user.username} 
                          className="size-8 rounded-full"
                        />
                        <div>
                          <p className="text-white font-medium">{review.user.username}</p>
                          <p className="text-light-grey text-sm">{review.user.status}</p>
                        </div>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="flex flex-col items-center">
                          {review.overallRating ? (
                            <StarRating rating={review.overallRating} width={4} color="white" />
                          ) : (
                            <span className="text-lighter-grey text-sm">Neįvertinta</span>
                          )}
                          <p className="text-lighter-grey text-sm">{review.date}</p>
                        </div>
                        {user && review.user.id === user.id && (
                          <button 
                            onClick={() => handleDeleteUniversityReview(review.id)}
                            className="text-red/50 hover:text-red"
                            title="Ištrinti atsiliepimą"
                          >
                            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="w-5 h-5">
                              <path stroke-linecap="round" stroke-linejoin="round" d="m14.74 9-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 0 1-2.244 2.077H8.084a2.25 2.25 0 0 1-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 0 0-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 0 1 3.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 0 0-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 0 0-7.5 0" />
                            </svg>
                          </button>
                        )}
                      </div>
                    </div>
                    <div className="text-white" dangerouslySetInnerHTML={{ __html: review.comment }}></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default UniversityPage;
