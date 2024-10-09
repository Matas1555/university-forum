import { Outlet, Navigate } from "react-router-dom";
import { useStateContext } from "../context/contextProvider";
import NavBar from "./navbar";

export default function GuestLayout(){
    const {token} = useStateContext;
    // if(token){
    //     return <Navigate to='/'/>
    // }

    return(
        <>
        <NavBar/>
        <div>
            <div>
                Guest
            </div>
            <Outlet/>
        </div>
        </>
        
    )
}