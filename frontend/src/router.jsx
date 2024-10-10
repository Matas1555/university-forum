import { createBrowserRouter } from "react-router-dom";
import LogIn from "./pages/login";
import Register from "./pages/register";
import Home from "./pages/home";
import DefaultLayout from "./components/defaultLayout";
import GuestLayout from "./components/guestLayout";
import Profile from "./pages/profile";

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