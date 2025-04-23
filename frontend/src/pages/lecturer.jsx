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
        lecture_quality_rating: 0,
        availability_rating: 0,
        friendliness_rating: 0
    });

    useEffect(() => {
        const fetchLecturer = async () => {
            setLoading(true);
            
            try {
                const response = await LecturerAPI.getLecturer(id);
                setLecturer(response.data);
                setError(null);
            } catch (err) {
                console.error("Error fetching lecturer data:", err);
                setError("Failed to load lecturer data. Please try again later.");
            } finally {
                setLoading(false);
            }
        };

        fetchLecturer();
    }, [id]);

    const handleRatingChange = (category, value) => {
        let ratingKey;
        switch(category) {
            case 'friendliness':
                ratingKey = 'friendliness_rating';
                break;
            case 'complexity':
                ratingKey = 'availability_rating';
                break;
            case 'clarity':
                ratingKey = 'lecture_quality_rating';
                break;
            default:
                ratingKey = category;
        }
        
        setNewReview(prev => ({
            ...prev,
            [ratingKey]: value
        }));
    };
    
    const handleCommentChange = (content) => {
        setNewReview(prev => ({
            ...prev,
            comment: content
        }));
    };

    const handleSubmitReview = async (e) => {
        e.preventDefault();
        
        try {
            await LecturerAPI.createReview(id, newReview);
            
            // Refresh lecturer data to include the new review
            const response = await LecturerAPI.getLecturer(id);
            setLecturer(response.data);
            
            // Reset form
            setNewReview({
                comment: "",
                lecture_quality_rating: 0,
                availability_rating: 0,
                friendliness_rating: 0
            });
        } catch (err) {
            console.error("Error submitting review:", err);
            alert("Failed to submit review. Please try again later.");
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
                <div className="bg-grey rounded-lg p-6 flex flex-col items-center justify-between lg:items-start">
                    <div className="flex flex-col lg:flex-row items-center lg:items-start w-full mb-6">
                        <div className="flex-shrink-0 mb-4 lg:mb-0 lg:mr-6">
                            <img src={ProfilePicture} alt={lecturer.name} className="size-32 rounded-full" />
                        </div>
                        <div className="flex flex-col items-center lg:items-start">
                            <h1 className="text-white text-2xl font-bold mb-1">{lecturer.name}</h1>
                            <p className="text-light-grey mb-1">Amžius: {lecturer.age}</p>
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
                <div className="bg-grey rounded-lg p-6">
                    <h2 className="text-white text-xl font-bold mb-6">Vertinimo kategorijos</h2>
                    
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <div className="flex flex-row gap-2 items-center">
                                <p className="text-white flex items-center">Dėstymo kokybė</p>
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
                                <p className="text-white flex items-center">Pagarbus</p>
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
                                <p className="text-white flex items-center">Pasiekiamumas</p>
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

                {/* Add Review Form - only shown for logged-in users */}
                {user && (
                <div className="bg-grey rounded-lg p-6 my-4">
                    <h3 className="text-white text-xl font-bold mb-4">Palikite atsiliepimą</h3>
                    
                    <form onSubmit={handleSubmitReview}>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                            <div className="space-y-8">
                                <div>
                                    <label className="block text-white mb-2 text-sm">Dėstymo kokybė</label>
                                    <div className="flex">
                                        <InteractiveStarRating 
                                            initialRating={newReview.lecture_quality_rating} 
                                            width={6} 
                                            onRatingChange={(rating) => handleRatingChange('clarity', rating)} 
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-white mb-2 text-sm">Pagarbus</label>
                                    <div className="flex">
                                        <InteractiveStarRating 
                                            initialRating={newReview.availability_rating} 
                                            width={6} 
                                            onRatingChange={(rating) => handleRatingChange('complexity', rating)} 
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-white mb-2 text-sm">Pasiekiamumas</label>
                                    <div className="flex">
                                        <InteractiveStarRating 
                                            initialRating={newReview.friendliness_rating} 
                                            width={6} 
                                            onRatingChange={(rating) => handleRatingChange('friendliness', rating)} 
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="md:col-span-3">
                                <label className="block text-white mb-2">Jūsų komentaras</label>
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
                )}

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
                            <div className="md:ml-auto">
                                <p className="text-lighter-grey text-sm">{review.date}</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div className="space-y-2 pr-4 border-r-2 border-white">
                                <div className="flex flex-col">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-white text-sm">Dėstymo kokybė:</span>
                                        <span className={`text-white ${getRatingColorClass(review.ratings.lecture_quality_rating)} rounded-lg px-2 py-1 text-sm font-bold`}>{review.ratings.lecture_quality_rating}/5</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-white text-sm">Vertinimo teisingumas:</span>
                                        <span className={`text-white ${getRatingColorClass(review.ratings.availability_rating)} rounded-lg px-2 py-1 text-sm font-bold`}>{review.ratings.availability_rating}/5</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-white text-sm">Pasiekiamumas:</span>
                                        <span className={`text-white ${getRatingColorClass(review.ratings.friendliness_rating)} rounded-lg px-2 py-1 text-sm font-bold`}>{review.ratings.friendliness_rating}/5</span>
                                    </div>
                                </div>
                            </div>
                            
                            <div className="p-4 md:col-span-3 border-2 border-white rounded-md">
                                <p className="text-white">{review.comment}</p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default LecturerPage;
