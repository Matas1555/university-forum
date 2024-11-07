import { NavLink } from "react-router-dom";
import { useState } from "react";
import LogIn from "../pages/login"; // Assuming the LogIn component is in the same folder
import Register from "../pages/register";
import { useStateContext } from "../context/contextProvider";
import API from "../API";
import profilePicture from "../../public/assets/profile-default-icon.png";


const NavButtons = ({ openLoginDialog}) => {
    const {user, token, setUser, setToken} = useStateContext();

    const onLogout = () => {
        API.get('/logout')
        .then(({}) => {
           setUser(null);
           setToken(null);
        })
    }

    return (
        <>
            {(user && token) ? (
                <>
                    <NavLink to='/profile'>
                        <div className="pl-4 pr-4 pt-1 pb-1 flex flex-row gap-3 border-2 border-blue  border-slate-300 rounded-md  hover:bg-blue hover:text-lightest-blue duration-300 transition-colors">
                            <img 
                            src={profilePicture} 
                            className="w-8 h-8"
                            />
                            <h1 className="text-center align-middle text-blue"  style={{fontFamily: "Inter", fontWeight:600, fontSize:"1em", alignContent:"center"}}>{user.username}</h1>
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
