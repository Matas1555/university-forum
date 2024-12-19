import { Outlet, Navigate } from "react-router-dom";
import { useStateContext } from "../context/contextProvider";
import NavBar from "./navbar";
import Footer from "./footer";

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
               
            </div>
            <Outlet/>
        </div>
        <Footer></Footer>
        </>
        
    )
}