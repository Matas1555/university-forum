import { NavLink, useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import LogIn from "../../pages/login";
import Register from "../../pages/register";
import { useStateContext } from "../../context/contextProvider";
import API from "../../utils/API";
import profilePicture from "../../assets/profile-default-icon.png";


const NavButtons = ({ openLoginDialog}) => {
    const {user, token, setUser, setToken, setRefreshToken} = useStateContext();
    const navigate = useNavigate();
    const [profileMenuClicked, setOpenProfileMenu] = useState(false);

    const handleSortClick = () => {
        setOpenProfileMenu(!profileMenuClicked);
    };

    const handleProfileMenuOptionClick = (text) => {
        if(text == "Atsijungti")
        {
            onLogout();
        }
    };

    useEffect(() => {
        const handleClickOutside = (event) =>{
            setOpenProfileMenu(false);
        }
        document.addEventListener('mousedown', handleClickOutside)
    },[])

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
                        <button className="">
                            Kurti įraša
                        </button>
                    </div>
                    
                    <div className="relative inline-block text-left m-auto">
                        <div className="w-10 h-10 flex items-center justify-center ring-2 ring-dark rounded-full overflow-hidden mr-3 cursor-pointer hover:ring-lght-blue transition-colors duration-200 ease-linear"
                        onClick={handleSortClick}>
                            <img 
                                src={user.avatar_url ? user.avatar_url : profilePicture}
                                className="w-full h-full object-cover"
                                alt="User Avatar"
                            />
                        </div>
                        <div className={`absolute right-0 z-10 mt-5 mr-3  origin-top-right rounded-md bg-grey ring-1 shadow-lg ring-light-grey focus:outline-hidden ${
                                profileMenuClicked ? " " : "hidden"
                                }`} 
                                role="menu" aria-orientation="vertical" aria-labelledby="menu-button" tabIndex="-1">
                            <div className="" role="none">
                            <a href="#" className="block px-4 py-2 text-sm text-white m-1 rounded-md ring-1 ring-grey hover:text-lght-blue  hover:ring-lght-blue transition: duration-100 ease-linear" role="menuitem" tabIndex="-1" id="menu-item-0" onClick={() => handleProfileMenuOptionClick("Profilis")}>Profilis</a>
                            <a href="#" className="block px-4 py-2 text-sm text-white m-1 rounded-md ring-1 ring-grey hover:text-lght-blue  hover:ring-lght-blue transition: duration-100 ease-linear" role="menuitem" tabIndex="-1" id="menu-item-1" onClick={() => handleProfileMenuOptionClick("Nustatymai")}>Nustatymai</a>
                            <a href="#" className="block px-4 py-2 text-sm text-white m-1 rounded-md ring-1 ring-grey hover:text-lght-blue  hover:ring-lght-blue transition: duration-100 ease-linear" role="menuitem" tabIndex="-1" id="menu-item-2" onClick={() => handleProfileMenuOptionClick("Atsijungti")}>Atsijungti</a>
                            </div>
                        </div>
                    </div>
                </div>

                    {/* <button 
                        className="pl-4 pr-4 pt-1 pb-2 text-center bg-lightest-blue border-blue rounded-md border-2 border-slate-300 text-blue text-xl hover:bg-blue hover:text-lightest-blue duration-300 transition-colors" 
                        onClick={onLogout}
                        >
                        Atsijungti
                    </button> */}
                </>
            ) : (
                <>
                    <button 
                        className="pl-2 pr-2 pt-1 pb-1 text-center bg-dark border-dark rounded-md border-2 border-slate-300 text-white text-lg hover:border-white duration-300 transition-colors" 
                        onClick={openLoginDialog}
                        >
                        Prisijungti
                    </button>
                    <NavLink to='/register'
                        className="pl-2 pr-2 pt-1 pb-1 text-center bg-lght-blue border-lght-blue rounded-md border-2 border-slate-300 text-white text-lg hover:bg-dark hover:text-lght-blue duration-300 transition-colors" 
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

        </>
    );
}

export default NavLinks;
