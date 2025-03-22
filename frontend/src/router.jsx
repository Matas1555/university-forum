import { createBrowserRouter } from "react-router-dom";
import LogIn from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import Profile from "./pages/profile";
import Post from "./pages/post";
import Posts from "./pages/posts";
import University from "./pages/university";
import DefaultLayout from "./components/layout/defaultLayout";
import CreatePost from "./pages/createPost";

const router = createBrowserRouter ([
    {
        path: '/',
        element: <DefaultLayout/>,
        children: [
            {

                path: '/home',
                element: <Home/>,
                errorElement: <div>Error loading home page!</div>,
            },
            {
                path: '/profile',
                element: <Profile/>,
                errorElement: <div>Error loading profile page!</div>,
            },
            {
                path: '/createPost',
                element: <CreatePost/>,
                errorElement: <div>Error loading profile page!</div>,
            },
            {
                path: '/post',
                element: <Post/>,
                errorElement: <div>Error loading the post!</div>,
            },
            {
                path: '/posts',
                element: <Posts/>,
                errorElement: <div>Error loading posts!</div>,
            },
            {
                path: '/university',
                element: <University/>,
                errorElement: <div>Error loading universities!</div>,
            },
            {
                path: '/register',
                element: <Register/>,
                errorElement: <div>Error loading register page!</div>,
            },
            {
                
                path: '/',
                element: <Home/>,
                errorElement: <div>Error loading home page!</div>,
            },
        ],
    },
]);

export default router;