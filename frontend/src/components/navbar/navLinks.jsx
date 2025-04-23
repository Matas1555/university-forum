import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import LogIn from "../../pages/login";
import Register from "../../pages/register";
import { useStateContext } from "../../context/contextProvider";
import API from "../../utils/API";
import profilePicture from "../../assets/profile-default-icon.png";
import { MobileMegaMenu } from "./megaMenu";

const NavButtons = ({ openLoginDialog}) => {
    const {user, token, setUser, setToken, setRefreshToken} = useStateContext();
    const navigate = useNavigate();
    const [profileMenuClicked, setOpenProfileMenu] = useState(false);
    const menuRef = useRef(null);

    const handleSortClick = () => {
        setOpenProfileMenu(!profileMenuClicked);
    };

    const handleProfileClick = () => {
        navigate('/profile');
        setOpenProfileMenu(false);
    };

    const handleSettingsClick = () => {
        // Handle settings navigation
        setOpenProfileMenu(false);
    };

    const handleLogout = async () => {
        console.log("Logging out...");
        try {
            // Clear token from backend
            await API.post('/logout');
        } catch (error) {
            console.error("Logout API call failed", error);
            // Continue with logout even if API call fails
        }
        
        // Clear all local storage and state
        localStorage.removeItem('ACCESS_TOKEN');
        localStorage.removeItem('REFRESH_TOKEN');
        localStorage.removeItem('USER');
        
        // Update context state
        setUser(null);
        setToken(null);
        setRefreshToken(null);
        
        // Navigate to home and close menu
        navigate('/pagrindinis');
        setOpenProfileMenu(false);
    };

    const handleCreatePost = () => {
        navigate('/kurti-irasa');
    }

    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setOpenProfileMenu(false);
            }
        }
        
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, []);
    
    return (
        <>
            {(user != null && user.status_id === 1) ? (
                <>

                </>
            ):(<></>)}
            {(user && token) ? (
                <>
                <div className="flex flex-row gap-10">
                    <div className="flex flex-row items-center gap-2 px-3 cursor-pointer p-0 ring-2 ring-lght-blue text-white rounded-3xl bg-lght-blue hover:bg-dark transition-colors duration-100 ease-linear">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth="1.5" stroke="currentColor" className="size-6">
                        <path strokeLinecap="round" strokeLinejoin="round" d="M12 4.5v15m7.5-7.5h-15" />
                        </svg>
                        <button className="" onClick={handleCreatePost}>
                            Kurti įraša
                        </button>
                    </div>
                    
                    <div className="relative inline-block text-left m-auto" ref={menuRef}>
                        <div className="w-10 h-10 flex items-center justify-center ring-2 ring-dark rounded-full overflow-hidden mr-3 cursor-pointer hover:ring-lght-blue transition-colors duration-200 ease-linear"
                        onClick={handleSortClick}>
                            <img 
                                src={user.avatar_url ? user.avatar_url : profilePicture}
                                className="w-full h-full object-cover"
                                alt="User Avatar"
                            />
                        </div>
                        {profileMenuClicked && (
                            <div className="absolute right-0 pr-2 z-10 mt-5 mr-3 origin-top-right rounded-md bg-grey ring-1 shadow-lg ring-light-grey focus:outline-hidden" 
                                role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
                                <div className="" role="none">
                                    <button 
                                        className="block w-full text-left px-4 py-2 text-sm text-white m-1 rounded-md ring-1 ring-grey hover:text-lght-blue hover:ring-lght-blue transition-duration-100 ease-linear" 
                                        role="menuitem" 
                                        tabIndex="-1" 
                                        id="menu-item-0" 
                                        onClick={handleProfileClick}
                                    >
                                        Profilis
                                    </button>
                                    <button 
                                        className="block w-full text-left px-4 py-2 text-sm text-white m-1 rounded-md ring-1 ring-grey hover:text-lght-blue hover:ring-lght-blue transition-duration-100 ease-linear" 
                                        role="menuitem" 
                                        tabIndex="-1" 
                                        id="menu-item-1" 
                                        onClick={handleSettingsClick}
                                    >
                                        Nustatymai
                                    </button>
                                    <button 
                                        className="block w-full text-left px-4 py-2 text-sm text-white m-1 rounded-md ring-1 ring-grey hover:text-lght-blue hover:ring-lght-blue transition-duration-100 ease-linear" 
                                        role="menuitem" 
                                        tabIndex="-1" 
                                        id="menu-item-2" 
                                        onClick={handleLogout}
                                    >
                                        Atsijungti
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
                </>
            ) : (
                <>
                    <button 
                        className="pl-2 pr-2 pt-1 pb-1 text-center bg-dark border-white rounded-md border-2 text-white text-lg hover:bg-lght-blue duration-300 transition-colors" 
                        onClick={openLoginDialog}
                        >
                        Prisijungti
                    </button>
                    <NavLink to='/registracija'
                        className="pl-2 pr-2 pt-1 pb-1 text-center bg-lght-blue rounded-md border-2 border-slate-300 text-white text-lg hover:bg-dark duration-300 transition-colors" 
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
            {isOpen && (
                <div className="flex basis-full gap-2 flex-col items-center transition-all duration-100">
                    <NavButtons openLoginDialog={openLoginDialog}></NavButtons>
                </div>
                )
            }
            <nav className="w-1/6 flex justify-end">
                <div className="hidden flex justify-between md:flex gap-4">
                    <NavButtons openLoginDialog={openLoginDialog}/>
                </div>
                <LogIn isOpen={isLoginOpen} setIsOpen={setIsLoginOpen} />

                <div className="md:hidden">
                    <button onClick={toggleNavBar}>{isOpen ? 
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
                        </svg>
                    :   <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="size-6 text-white">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 5.25h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5m-16.5 4.5h16.5" />
                        </svg>
                        } 
                    </button>
                </div>
            </nav>

            {/* Mobile mega menu */}
            <MobileMegaMenu isOpen={isOpen} />
        </>
    );
}

export default NavLinks;
