import { createBrowserRouter } from "react-router-dom";
import LogIn from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import Profile from "./pages/profile";
import Post from "./pages/post";
import Posts from "./pages/posts";
import University from "./pages/university/university";
import DefaultLayout from "./components/layout/defaultLayout";
import CreatePost from "./pages/createPost";
import ForumsList from "./pages/forums/forumsList";

const router = createBrowserRouter([
    {
        path: '/',
        element: <DefaultLayout/>,
        children: [
            {
                path: '/pagrindinis',
                element: <Home/>,
            },
            // Pagrindinė forumų struktūra su dinaminiais įrašais
            {
                path: '/forumai',
                element: <ForumsList/>,
            },
            {
                path: '/forumai/:forumType',
                element: <Posts/>,
            },
            {
                path: '/forumai/universitetai/:universityId',
                element: <University/>,
            },
            {
                path: '/forumai/universitetai/:universityId/irasai',
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
            // Single post view
            {
                path: '/forumai/universitetai/:universityId/irasai/:postId',
                element: <Post/>,
            },
            // Original routes
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
            // Originalūs maršrutai
            {
                path: '/profilis',
                element: <Profile/>,
            },
            {
                path: '/kurti-irasa',
                element: <CreatePost/>,
            },
            {
                path: '/universitetas',
                element: <University/>,
            },
            {
                path: '/registracija',
                element: <Register/>,
            },
            {
                path: '/',
                element: <Home/>,
            },
        ],
    },
]);

export default router;