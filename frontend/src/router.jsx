import { createBrowserRouter } from "react-router-dom";
import LogIn from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import DefaultLayout from "./components/defaultLayout";
import GuestLayout from "./components/guestLayout";
import Profile from "./pages/profile";
import Dashboard from "./pages/dashboard";
import Post from "./pages/post";
import University from "./pages/university";

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
                path: '/dashboard',
                element: <Dashboard/>,
                errorElement: <div>Error loading dashboard page!</div>,
            },
            {
                path: '/post',
                element: <Post/>,
                errorElement: <div>Error loading the post!</div>,
            },
            {
                path: '/university',
                element: <University/>,
                errorElement: <div>Error loading the post!</div>,
            },
            {
                
                path: '/',
                element: <Home/>,
                errorElement: <div>Error loading home page!</div>,
            },
        ],
    },
    {
        path: '/',
        element: <GuestLayout/>,
        children: [
            {
                path: '/login',
                element: <LogIn/>,
                errorElement: <div>Error loading login page!</div>,
            },
            {
                path: '/register',
                element: <Register/>,
                errorElement: <div>Error loading register page!</div>,
            },
        ],
    },

]);

export default router;