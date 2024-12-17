import { NavLink, useNavigate } from "react-router-dom";
import { useState } from "react";
import LogIn from "../pages/login"; // Assuming the LogIn component is in the same folder
import Register from "../pages/register";
import { useStateContext } from "../context/contextProvider";
import API from "../API";
import profilePicture from "../../public/assets/profile-default-icon.png";


const NavButtons = ({ openLoginDialog}) => {
    const {user, token, setUser, setToken, setRefreshToken} = useStateContext();
    const navigate = useNavigate();

    const onLogout = async () => {
        try {
            await API.post('/logout');
            setUser({});
            setToken();
            setRefreshToken();
            navigate('/home');
        } catch (error) {
            console.error("Logout failed", error.response?.data || error.message);
        }
    }
    
    return (
        <>
            {(user.status_id === 1) ? (
                <>
                <NavLink to ="/dashboard">
                    <div 
                        className="pl-4 pr-4 pt-1 pb-2 text-center shadow-inner bg-lightest-blue border-blue rounded-md border-2 border-slate-300 text-blue text-xl hover:bg-blue hover:text-lightest-blue duration-300 transition-colors" 
                        >
                        Dashboard
                    </div>
                </NavLink>
                </>
            ):(<></>)}
            {(user && token) ? (
                <>
                    <NavLink to="/profile">
                        <div
                        className="px-6 py-1 flex items-center group justify-center gap-3 border-2 border-slate-300 rounded-md bg-lightest-blue border-blue hover:bg-blue hover:text-lightest-blue transition-colors duration-300"
                        >
                            <img 
                                src={profilePicture} 
                                alt="Profile" 
                                className="w-8 h-8 rounded-full"
                            />
                            <h1
                                className="text-blue text-sm font-semibold group-hover:text-lightest-blue transition-colors duration-300"
                                style={{ fontFamily: "Inter" }}
                            >
                                {user.username}
                            </h1>
                        </div>
                    </NavLink>
                    <button 
                        className="pl-4 pr-4 pt-1 pb-2 text-center bg-lightest-blue border-blue rounded-md border-2 border-slate-300 text-blue text-xl hover:bg-blue hover:text-lightest-blue duration-300 transition-colors" 
                        onClick={onLogout}
                        >
                        Atsijungti
                    </button>
                </>
            ) : (
                <>
                    <button 
                        className="pl-4 pr-4 pt-1 pb-2 text-center bg-lightest-blue border-blue rounded-md border-2 border-slate-300 text-blue text-xl hover:bg-blue hover:text-lightest-blue duration-300 transition-colors" 
                        onClick={openLoginDialog}
                        >
                        Prisijungti
                    </button>
                    <NavLink to='/register'
                        className="pl-4 pr-4 pt-1 pb-2 text-center bg-lightest-blue border-blue rounded-md border-2 border-slate-300 text-blue text-xl hover:bg-blue hover:text-lightest-blue duration-300 transition-colors" 
                        >
                        Registruotis
                    </NavLink>
                </>
            )}
        </>
    );
}

const NavLinks = () => {
    const [isLoginOpen, setIsLoginOpen] = useState(false);
    const [isRegsiterOpen, setIsRegisterOpen] = useState(false);
    const [isOpen, setIsOpen] = useState(false);

    const toggleNavBar = () =>{
        setIsOpen(!isOpen);
    }

    const openLoginDialog = () => {
        setIsLoginOpen(true);
    };

    const openRegisterDialog = () => {
        setIsRegisterOpen(true);
    };

    return (
        <>
            <nav className="w-1/6 flex justify-end">
                <div className="hidden flex justify-between md:flex gap-4">
                    <NavButtons openLoginDialog={openLoginDialog}/>
                </div>
                <LogIn isOpen={isLoginOpen} setIsOpen={setIsLoginOpen} />

                <div className="md:hidden">
                    <button onClick={toggleNavBar}>{isOpen ? 
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    :   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
                        </svg>
                        } 
                    </button>
                </div>
            </nav>
            {isOpen && (
                <div className="flex basis-full gap-2 flex-col items-center">
                    <NavButtons openLoginDialog={openLoginDialog}></NavButtons>
                </div>
            )

            }
        </>
    );
}

export default NavLinks;
