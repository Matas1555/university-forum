import { createBrowserRouter } from "react-router-dom";
import LogIn from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import Profile from "./pages/profile";
import Post from "./pages/post";
import Posts from "./pages/posts";
import University from "./pages/university/university";
import UniversityStatistics from "./pages/university/universityStatistics";
import DefaultLayout from "./components/layout/defaultLayout";
import CreatePost from "./pages/createPost";
import ForumsList from "./pages/forums/forumsList";
import LecturersPage from "./pages/lecturers";
import LecturerPage from "./pages/lecturer";
import UniversitiesPage from "./pages/universities";
import TooltipExample from "./components/TooltipExample";
import RecommendationForm from "./pages/recommendation/RecommendationForm";
import RecommendationResults from "./pages/recommendation/RecommendationResults";

const router = createBrowserRouter([
    {
        path: '/',
        element: <DefaultLayout/>,
        children: [
            {
                path: '/pagrindinis',
                element: <Home/>,
            },
            {
                path: '/tooltip',
                element: <TooltipExample/>,
            },
            {
                path: '/prisijungti',
                element: <LogIn/>,
            },
            {
                path: '/forumai',
                element: <ForumsList/>,
            },
            {
                path: '/:forumType',
                element: <Posts/>,
            },
            {
                path: 'forumai/universitetai/',
                element: <Home/>,
            },
            {
                path: '/forumai/universitetai/:universityId/irasai',
                element: <Posts/>,
            },
            {
                path: '/forumai/universitetai/:universityId/fakultetai/:facultyId/irasai',
                element: <Posts/>,
            },
            {
                path: '/forumai/universitetai/:universityId/fakultetai/:facultyId/programos/:programId/irasai',
                element: <Posts/>,
            },
            {
                path: '/forumai/universitetai/:universityId/programos/:programId/irasai',
                element: <Posts/>,
            },
            {
                path: '/forumai/kategorijos/:categoryId',
                element: <Posts/>,
            },
            {
                path: '/forumai/universitetai/:universityId/irasai/:postId',
                element: <Post/>,
            },
            {
                path: '/forumai/universitetai/:universityId/fakultetai/:facultyId/irasai/:postId',
                element: <Post/>,
            },
            {
                path: '/forumai/universitetai/:universityId/fakultetai/:facultyId/programos/:programId/irasai/:postId',
                element: <Post/>,
            },
            {
                path: '/forumai/universitetai/:universityId/programos/:programId/irasai/:postId',
                element: <Post/>,
            },
            {
                path: '/forumai/kategorijos/:categoryId/irasai/:postId',
                element: <Post/>,
            },
            {
                path: '/forumai/:forumType/irasai/:postId',
                element: <Post/>,
            },
            {
                path: '/profilis',
                element: <Profile/>,
            },
            {
                path: '/kurti-irasa',
                element: <CreatePost/>,
            },
            {
                path: '/universitetas/:universityId',
                element: <University/>,
            },
            {
                path: '/universitetas/:id/statistika',
                element: <UniversityStatistics/>,
            },
            {
                path: '/registracija',
                element: <Register/>,
            },
            {
                path: '/',
                element: <Home/>,
            },
            {
                path: '/destytojai',
                element: <LecturersPage/>,
            },
            {
                path: '/destytojai/:id',
                element: <LecturerPage/>,
            },
            {
                path: '/universitetai',
                element: <UniversitiesPage/>,
            },
            {
                path: '/rekomendacijos',
                element: <RecommendationForm/>,
            },
            {
                path: '/recommendation-results',
                element: <RecommendationResults/>,
            },
        ],
    },
]);

export default router;