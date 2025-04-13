import React, { useState, useEffect } from "react";
import { useParams, useLocation } from "react-router-dom";
import { useStateContext } from "../context/contextProvider";
import ProfilePicture from "../assets/profile-default-icon.png";
import StarRating from "../components/starRating/starRating";
import RichTextEditor from "../components/richTextEditor/RichTextEditor";
import InteractiveStarRating from "../components/starRating/interactiveStarRating";

// Mock detailed lecturer data (in a real app this would come from an API)
const mockLecturerData = {
    1: {
        id: 1,
        name: "Rimantas Butleris",
        age: "58",
        profession: "Programų sistemų profesorius",
        faculty: "Informatikos fakultetas",
        university: "Kauno technologijos universitetas",
        overallRating: 4.9,
        ratings: {
            friendliness: 4.8,
            complexity: 3.2,
            clarity: 4.5,
            extraCategories: 4.1
        },
        reviews: [
            {
                id: 1,
                user: {
                    username: "studentas123",
                    status: "PS bakalauras",
                    profilePic: null
                },
                date: "2023-12-15",
                comment: "Labai aiškiai dėsto medžiagą, visada pasiruošęs atsakyti į klausimus. Egzaminai sunkūs, bet teisingi.",
                ratings: {
                    friendliness: 4,
                    complexity: 2,
                    clarity: 4,
                    extraCategories: 3
                }
            },
            {
                id: 2,
                user: {
                    username: "informatika_stud",
                    status: "Absolventas",
                    profilePic: null
                },
                date: "2023-11-02",
                comment: "Vienas geriausių dėstytojų fakultete. Paskaitos įdomios ir aktualios, dažnai pateikia realius pavyzdžius iš IT sektoriaus.",
                ratings: {
                    friendliness: 5,
                    complexity: 3,
                    clarity: 5,
                    extraCategories: 4
                }
            },
            {
                id: 3,
                user: {
                    username: "coding_wizard",
                    status: "PS magistras",
                    profilePic: null
                },
                date: "2023-09-18",
                comment: "Nors užduotys kartais būna per sudėtingos, dėstytojas visada padeda ir konsultuoja. Vertinu jo profesionalumą.",
                ratings: {
                    friendliness: 4,
                    complexity: 4,
                    clarity: 4,
                    extraCategories: 1
                }
            }
        ]
    },
    2: {
        id: 2,
        name: "Vita Masteikaitė",
        age: "42",
        profession: "Informatikos dėstytoja",
        faculty: "Informatikos fakultetas",
        university: "Kauno technologijos universitetas",
        overallRating: 4.7,
        ratings: {
            friendliness: 4.9,
            complexity: 3.8,
            clarity: 4.5,
            extraCategories: 4.3
        },
        reviews: [
            {
                id: 1,
                user: {
                    username: "jane_doe",
                    status: "IS bakalauras",
                    profilePic: null
                },
                date: "2023-12-10",
                comment: "Puikios paskaitos, labai aiškiai išdėstyti sudėtingi dalykai. Visada galima kreiptis pagalbos.",
                ratings: {
                    friendliness: 5,
                    complexity: 4,
                    clarity: 5,
                    extraCategories: 4
                }
            }
        ]
    }
};

// Helper function to get color class based on rating
const getRatingColorClass = (rating) => {
    if (rating <= 1) return "bg-red";
    if (rating <= 2) return "bg-red/80";
    if (rating <= 3) return "bg-yellow/70";
    if (rating <= 4) return "bg-green/50";
    return "bg-green";
};

// Helper function for text colors
const getRatingTextColorClass = (rating, starRating) => {
    if (starRating <= 1) return "text-red";
    if (starRating <= 2) return "text-red/80";
    if (starRating <= 3) return "text-yellow";
    if (starRating <= 4) return "text-green/80";
    return "text-green";
};

const LecturerPage = () => {
    const { id } = useParams();
    const location = useLocation();
    const { user } = useStateContext();
    const [lecturer, setLecturer] = useState(null);
    const [loading, setLoading] = useState(true);
    const [newReview, setNewReview] = useState({
        comment: "",
        ratings: {
            friendliness: 0,
            complexity: 0,
            clarity: 0,
            extraCategories: 0
        }
    });

    useEffect(() => {
        const fetchLecturer = () => {
            setLoading(true);
            
            setTimeout(() => {
                const lecturerData = mockLecturerData[id];
                if (lecturerData) {
                    setLecturer(lecturerData);
                }
                setLoading(false);
            }, 500);
        };

        fetchLecturer();
    }, [id]);

    const handleRatingChange = (category, value) => {
        setNewReview(prev => ({
            ...prev,
            ratings: {
                ...prev.ratings,
                [category]: value
            }
        }));
    };
    
    const handleCommentChange = (content) => {
        setNewReview(prev => ({
            ...prev,
            comment: content
        }));
    };

    const handleSubmitReview = (e) => {
        e.preventDefault();
        console.log("Submitting review:", newReview);
        
        setNewReview({
            comment: "",
            ratings: {
                friendliness: 0,
                complexity: 0,
                clarity: 0,
                extraCategories: 0
            }
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center h-96">
                <p className="text-white">Kraunama...</p>
            </div>
        );
    }

    if (!lecturer) {
        return (
            <div className="flex justify-center items-center h-96">
                <p className="text-white">Dėstytojas nerastas.</p>
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
                                <StarRating rating={lecturer.overallRating} width={6} />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Ratings Card */}
                <div className="bg-grey rounded-lg p-6">
                    <h2 className="text-white text-xl font-bold mb-6">Vertinimo kategorijos</h2>
                    
                    <div className="space-y-6">
                        <div className="flex justify-between items-center">
                            <p className="text-white flex items-center">Dėstymo kokybė</p>
                            <div className="flex items-center">
                                <StarRating rating={lecturer.ratings.friendliness} width={6} />
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                            <p className="text-white flex items-center">Vertinimo teisingumas</p>
                            <div className="flex items-center">
                                <StarRating rating={lecturer.ratings.complexity} width={6} />
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                            <p className="text-white flex items-center">Pasiekiamumas</p>
                            <div className="flex items-center">
                                <StarRating rating={lecturer.ratings.clarity} width={6} />
                            </div>
                        </div>
                        
                        <div className="flex justify-between items-center">
                            <p className="text-white flex items-center">Organizuotumas</p>
                            <div className="flex items-center">
                                <StarRating rating={lecturer.ratings.extraCategories} width={6} />
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            

            {/* Student Reviews Section */}
            <div className="w-full">
                <h2 className="text-white text-2xl font-bold mb-4 border-b border-grey pb-2">Studentų įvertinimai</h2>

                {/* Add Review Form - only shown for logged-in users */}
                {/* {user && ( */}
                <div className="bg-grey rounded-lg p-6 my-4">
                    <h3 className="text-white text-xl font-bold mb-4">Palikite atsiliepimą</h3>
                    
                    <form onSubmit={handleSubmitReview}>
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
                            <div className="space-y-8">
                                <div>
                                    <label className="block text-white mb-2 text-sm">Dėstymo kokybė</label>
                                    <div className="flex">
                                        <InteractiveStarRating 
                                            initialRating={newReview.ratings.friendliness} 
                                            width={6} 
                                            onRatingChange={(rating) => handleRatingChange('friendliness', rating)} 
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-white mb-2 text-sm">Vertinimo teisingumas</label>
                                    <div className="flex">
                                        <InteractiveStarRating 
                                            initialRating={newReview.ratings.complexity} 
                                            width={6} 
                                            onRatingChange={(rating) => handleRatingChange('complexity', rating)} 
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-white mb-2 text-sm">Pasiekiamumas</label>
                                    <div className="flex">
                                        <InteractiveStarRating 
                                            initialRating={newReview.ratings.clarity} 
                                            width={6} 
                                            onRatingChange={(rating) => handleRatingChange('clarity', rating)} 
                                        />
                                    </div>
                                </div>
                                
                                <div>
                                    <label className="block text-white mb-2 text-sm">Organizuotumas</label>
                                    <div className="flex">
                                        <InteractiveStarRating 
                                            initialRating={newReview.ratings.extraCategories} 
                                            width={6} 
                                            onRatingChange={(rating) => handleRatingChange('extraCategories', rating)} 
                                        />
                                    </div>
                                </div>
                            </div>
                            
                            <div className="md:col-span-3">
                                <label className="block text-white mb-2">Jūsų komentaras</label>
                                <div className="border-2 rounded-md border-light-grey p-0 w-full">
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
                {/* )} */}

                {lecturer.reviews.map(review => (
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
                                <p className="text-light-grey text-sm">{review.date}</p>
                            </div>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-4">
                            <div className="space-y-2 pr-4 border-r-2 border-white">
                                <div className="flex flex-col">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-white text-sm">Dėstymo kokybė:</span>
                                        <span className={`text-white ${getRatingColorClass(review.ratings.friendliness)} rounded-lg px-2 py-1 text-sm font-bold`}>{review.ratings.friendliness}/5</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-white text-sm">Vertinimo teisingumas:</span>
                                        <span className={`text-white ${getRatingColorClass(review.ratings.complexity)} rounded-lg px-2 py-1 text-sm font-bold`}>{review.ratings.complexity}/5</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-white text-sm">Pasiekiamumas:</span>
                                        <span className={`text-white ${getRatingColorClass(review.ratings.clarity)} rounded-lg px-2 py-1 text-sm font-bold`}>{review.ratings.clarity}/5</span>
                                    </div>
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="text-white text-sm">Organizuotumas:</span>
                                        <span className={`text-white ${getRatingColorClass(review.ratings.extraCategories)} rounded-lg px-2 py-1 text-sm font-bold`}>{review.ratings.extraCategories}/5</span>
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
