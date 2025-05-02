import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useStateContext } from "../context/contextProvider";
import ProfilePicture from "../assets/profile-default-icon.png";
import StarRating from "../components/starRating/starRating";
import RichTextEditor from "../components/richTextEditor/RichTextEditor";
import InteractiveStarRating from "../components/starRating/interactiveStarRating";
import Tooltip from "../components/Tooltip";
import { LecturerAPI } from "../utils/API";

const getRatingColorClass = (rating) => {
    if (rating <= 1) return "bg-red";
    if (rating <= 2) return "bg-red/80";
    if (rating <= 3) return "bg-yellow/70";
    if (rating <= 4) return "bg-green/50";
    return "bg-green";
};


const LecturerPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const { user } = useStateContext();
    const [lecturer, setLecturer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [newReview, setNewReview] = useState({
        comment: "",
        ratings: {}
    });
    const [reviewViewType, setReviewViewType] = useState("detailed");
    const [hasUserReviewed, setHasUserReviewed] = useState(false);

    const ratingCategories = [
        { id: 'lecture_quality', name: 'Dėstymo kokybė', tooltip: 'Dėstytojas (-ja) dėsto / aiškina / kalba įtaigiai ir suprantamai' },
        { id: 'friendliness', name: 'Pagarbus', tooltip: 'Išlaikomi kolegialūs (pagarbūs) dėstytojo (-jos) ir studentų santykiai' },
        { id: 'availability', name: 'Pasiekiamumas', tooltip: 'Studentams teikiamas grįžtamasis ryšys apie jų atliktą darbą (aptariami atsiskaitymų rezultatai, savarankiški darbai ir pan.)' }
    ];

    const [selectedCategories, setSelectedCategories] = useState([]);

    useEffect(() => {
        const fetchLecturer = async () => {
            setLoading(true);
            
            try {
                const response = await LecturerAPI.getLecturer(id);
                setLecturer(response.data);
                
                // Check if the current user has already reviewed this lecturer
                if (user && response.data.reviews) {
                    const userReview = response.data.reviews.find(review => review.user.id === user.id);
                    setHasUserReviewed(!!userReview);
                }
                
                setError(null);
            } catch (err) {
                console.error("Error fetching lecturer data:", err);
                setError("Failed to load lecturer data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchLecturer();
    }, [id, user]);

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
            await LecturerAPI.createReview(id, newReview);
            
            const response = await LecturerAPI.getLecturer(id);
            setLecturer(response.data);
            setNewReview({
                comment: "",
                ratings: {}
            });
            setSelectedCategories([]);
            setHasUserReviewed(true);
        } catch (err) {
            console.error("Error submitting review:", err);
            if (err.response && err.response.status === 422) {
                alert("Jūs jau palikote atsiliepimą šiam dėstytojui.");
                setHasUserReviewed(true);
            } else {
                alert("Įvyko klaida pateikiant atsiliepimą. Bandykite vėliau.");
            }
        }
    };

    const handleDeleteReview = async (reviewId) => {
        if (window.confirm("Ar tikrai norite ištrinti šį atsiliepimą?")) {
            try {
                await LecturerAPI.deleteReview(reviewId);
                const response = await LecturerAPI.getLecturer(id);
                setLecturer(response.data);
                setHasUserReviewed(false);
                alert("Atsiliepimas sėkmingai ištrintas.");
            } catch (err) {
                console.error("Error deleting review:", err);
                alert("Įvyko klaida trinant atsiliepimą. Bandykite vėliau.");
            }
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <p className="text-white">Kraunama...</p>
            </div>
        );
    }

    if (error || !lecturer) {
        return (
            <div className="flex justify-center items-center h-96">
                <p className="text-white">{error || "Dėstytojas nerastas."}</p>
            </div>
        );
    }

    return (
        <div className="flex flex-col items-center px-4 py-8 max-w-7xl mx-auto">
            {/* Main content grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 w-full mb-10">
                {/* Lecturer Info Card */}
                <div className="bg-grey rounded-lg p-6 flex flex-col items-center justify-between lg:items-start border-2 border-white">
                    <div className="flex flex-col items-center gap-2 translate-y-[-45px] w-full border-b border-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-10 text-dark bg-white rounded-full p-2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M15 9h3.75M15 12h3.75M15 15h3.75M4.5 19.5h15a2.25 2.25 0 0 0 2.25-2.25V6.75A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25v10.5A2.25 2.25 0 0 0 4.5 19.5Zm6-10.125a1.875 1.875 0 1 1-3.75 0 1.875 1.875 0 0 1 3.75 0Zm1.294 6.336a6.721 6.721 0 0 1-3.17.789 6.721 6.721 0 0 1-3.168-.789 3.376 3.376 0 0 1 6.338 0Z" />
                        </svg>
                        <h2 className="text-white text-xl font-bold mb-6">Dėstytojo informacija</h2>
                    </div>
                    <div className="flex flex-col lg:flex-row items-center lg:items-start w-full mb-6">
                        <div className="flex-shrink-0 mb-4 lg:mb-0 lg:mr-6">
                            <img src={ProfilePicture} alt={lecturer.name} className="size-32 rounded-full" />
                        </div>
                        <div className="flex flex-col items-center lg:items-start">
                            <h1 className="text-white text-2xl font-bold mb-1">{lecturer.name}</h1>
                            <p className="text-lighter-grey mb-1">Amžius: {lecturer.age}</p>
                            <div className="flex flex-row items-center justify-center mt-4 lg:items-start">
                                <div className="mt-[6px]">
                                    <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-6 text-white">
                                        <path stroke-linecap="round" stroke-linejoin="round" d="M12 21v-8.25M15.75 21v-8.25M8.25 21v-8.25M3 9l9-6 9 6m-1.5 12V10.332A48.36 48.36 0 0 0 12 9.75c-2.551 0-5.056.2-7.5.582V21M3 21h18M12 6.75h.008v.008H12V6.75Z" />
                                    </svg>
                                </div>
                                <div className="flex flex-col items-center lg:items-start w-full">
                                    <div className=" rounded p-2 w-full">
                                        <p className="text-white">{lecturer.university}</p>
                                    </div>
                                    <div className=" rounded p-2 w-full">
                                        <p className="text-white">{lecturer.faculty}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className="border-2 rounded-md border-white p-4 w-full">
                        <div className="flex justify-center items-center">
                            <p className="text-white text-2xl mr-2 font-medium">Bendras įvertinimas:</p>
                            <div className="flex items-center">
                                <StarRating rating={lecturer.overallRating} width={6} color='white' />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ratings Card */}
                <div className="flex flex-col gap-0 bg-grey rounded-lg p-6 border-2 border-white">
                    <div className="flex flex-col items-center gap-2 translate-y-[-45px] border-b border-white">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="size-10 text-grey bg-white rounded-full p-2">
                            <path stroke-linecap="round" stroke-linejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09ZM18.259 8.715 18 9.75l-.259-1.035a3.375 3.375 0 0 0-2.455-2.456L14.25 6l1.036-.259a3.375 3.375 0 0 0 2.455-2.456L18 2.25l.259 1.035a3.375 3.375 0 0 0 2.456 2.456L21.75 6l-1.035.259a3.375 3.375 0 0 0-2.456 2.456ZM16.894 20.567 16.5 21.75l-.394-1.183a2.25 2.25 0 0 0-1.423-1.423L13.5 18.75l1.183-.394a2.25 2.25 0 0 0 1.423-1.423l.394-1.183.394 1.183a2.25 2.25 0 0 0 1.423 1.423l1.183.394-1.183.394a2.25 2.25 0 0 0-1.423 1.423Z" />
                        </svg>
                        <h2 className="text-white text-xl font-bold mb-6">Vertinimo kategorijos</h2>
                    </div>
                    
                    
                    <div className="space-y-12">
                        <div className="flex justify-between items-center">
                            <div className="flex flex-row gap-2 items-center">
                                <p className="text-white flex items-center font-medium text-xl">Dėstymo kokybė</p>
                                <Tooltip 
                                content="Dėstytojas (-ja) dėsto / aiškina / kalba įtaigiai ir suprantamai" 
                                maxWidth={400}
                                position="bottom" 
                                />
                            </div>
                            <div className="flex items-center">
                                <StarRating rating={lecturer.ratings.clarity} width={6} color='white' />
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                        <div className="flex flex-row gap-2 items-center">
                                <p className="text-white flex items-center font-medium text-xl">Pagarbus</p>
                                <Tooltip 
                                content="Išlaikomi kolegialūs (pagarbūs) dėstytojo (-jos) ir studentų santykiai" 
                                maxWidth={400}
                                position="bottom" 
                                />
                            </div>
                            <div className="flex items-center">
                                <StarRating rating={lecturer.ratings.friendliness} width={6} color='white' />
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                            <div className="flex flex-row gap-2 items-center">
                                <p className="text-white flex items-center font-medium text-xl">Pasiekiamumas</p>
                                <Tooltip 
                                content="Studentams teikiamas grįžtamasis ryšys apie jų atliktą darbą (aptariami atsiskaitymų rezultatai, savarankiški darbai ir pan.) " 
                                maxWidth={400}
                                position="bottom" 
                                />
                            </div>
                            <div className="flex items-center">
                                <StarRating rating={lecturer.ratings.availability} width={6} color='white' />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            

            {/* Student Reviews Section */}
            <div className="w-full">
                <h2 className="text-white text-2xl font-bold mb-4 border-b border-grey pb-2">Studentų įvertinimai</h2>

                {/* Add Review Form - only shown for logged-in users who haven't reviewed yet */}
                {user && !hasUserReviewed ? (
                    <div className="bg-grey rounded-lg p-6 my-4">
                        <h3 className="text-white text-xl font-bold mb-4">Palikite atsiliepimą</h3>
                        
                        <form onSubmit={handleSubmitReview}>
                            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex flex-row gap-2 items-center mb-3">
                                            <h4 className="text-white mb-1 font-medium">Pasirinkite vertinimo kategorijas:</h4>
                                            <Tooltip 
                                                content="Šioje sekcijoje galite įvertinti dėstytoją pagal įvairias kategorijas. Galite pasirinkti kelias, visas arba nė vienos kategorijos" 
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
                                                            <div className="flex flex-row gap-2 items-center">
                                                                <label className="block text-white text-sm">{category.name}</label>
                                                                <Tooltip 
                                                                    content={category.tooltip}
                                                                    maxWidth={400}
                                                                    position="bottom" 
                                                                />
                                                            </div>
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
                                    <div className="border-2 rounded-md border-white p-0 w-full">
                                        <RichTextEditor 
                                            value={newReview.comment} 
                                            onChange={handleCommentChange} 
                                            placeholder="Parašykite savo nuomonę apie dėstytoją..." 
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
                ) : user && hasUserReviewed ? (
                    <div className="bg-grey rounded-lg p-6 my-4 text-center">
                        <p className="text-white text-lg">Jūs jau palikote atsiliepimą šiam dėstytojui.</p>
                        <p className="text-light-grey mt-2">Jūs galite ištrinti savo atsiliepimą ir parašyti naują.</p>
                    </div>
                ) : null}

                {/* View toggle buttons */}
                {lecturer.reviews && lecturer.reviews.length > 0 && (
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

                {/* Reviews Container with Transition */}
                <div className="relative">
                    {/* Detailed View */}
                    <div 
                        className={`transition-all duration-500 ${
                            reviewViewType === "detailed" 
                                ? "opacity-100 translate-x-0 relative" 
                                : "opacity-0 -translate-x-full absolute top-0 left-0 w-full invisible"
                        }`}
                    >
                        {lecturer.reviews && lecturer.reviews.map(review => (
                            <div key={review.id} className="bg-grey rounded-lg p-6 mb-4">
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
                                    <div className="md:ml-auto flex items-center gap-3">
                                        <p className="text-lighter-grey text-sm">{review.date}</p>
                                        {user && user.id === review.user.id && (
                                            <button 
                                                onClick={() => handleDeleteReview(review.id)}
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
                                    {/* Only show the ratings section if at least one rating exists */}
                                    {(review.ratings.lecture_quality_rating || 
                                    review.ratings.availability_rating || 
                                    review.ratings.friendliness_rating) && (
                                        <div className="space-y-2 pr-4 border-r-2 border-white">
                                            <div className="flex flex-col">
                                                {review.ratings.lecture_quality_rating && (
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-white text-sm">Dėstymo kokybė:</span>
                                                        <span className={`text-white ${getRatingColorClass(review.ratings.lecture_quality_rating)} rounded-lg px-2 py-1 text-sm font-bold`}>
                                                            {review.ratings.lecture_quality_rating}/5
                                                        </span>
                                                    </div>
                                                )}
                                                
                                                {review.ratings.availability_rating && (
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-white text-sm">Pasiekiamumas:</span>
                                                        <span className={`text-white ${getRatingColorClass(review.ratings.availability_rating)} rounded-lg px-2 py-1 text-sm font-bold`}>
                                                            {review.ratings.availability_rating}/5
                                                        </span>
                                                    </div>
                                                )}
                                                
                                                {review.ratings.friendliness_rating && (
                                                    <div className="flex justify-between items-center mb-1">
                                                        <span className="text-white text-sm">Pagarbus:</span>
                                                        <span className={`text-white ${getRatingColorClass(review.ratings.friendliness_rating)} rounded-lg px-2 py-1 text-sm font-bold`}>
                                                            {review.ratings.friendliness_rating}/5
                                                        </span>
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    
                                    <div className={`p-4 border-2 border-white rounded-md ${
                                        (review.ratings.lecture_quality_rating || 
                                        review.ratings.availability_rating || 
                                        review.ratings.friendliness_rating) 
                                        ? 'md:col-span-3' : 'md:col-span-4'
                                    }`}>
                                        <div className="text-white" dangerouslySetInnerHTML={{ __html: review.comment }}></div>
                                    </div>
                                </div>
                            </div>
                        ))}
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
                            {lecturer.reviews && lecturer.reviews.map(review => (
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
                                            <p className="text-lighter-grey text-sm">{review.date}</p>
                                            {user && user.id === review.user.id && (
                                                <button 
                                                    onClick={() => handleDeleteReview(review.id)}
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
                                    <div className="text-white mt-2" dangerouslySetInnerHTML={{ __html: review.comment }}></div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                {/* If no reviews */}
                {(!lecturer.reviews || lecturer.reviews.length === 0) && (
                    <div className="bg-grey rounded-lg p-6 text-center">
                        <p className="text-white text-lg">Šis dėstytojas dar neturi atsiliepimų.</p>
                        {user && (
                            <p className="text-light-grey mt-2">Būkite pirmas, kuris palieka atsiliepimą!</p>
                        )}
                    </div>
                )}
            </div>
        </div>
    );
};

export default LecturerPage;
