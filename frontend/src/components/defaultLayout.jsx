import { Outlet, Navigate } from "react-router-dom";
import { useStateContext } from "../context/contextProvider";
import NavBar from "./navbar";

export default function DefaultLayout(){
    const {user, token} = useStateContext;
    // if(!token){
    //     return <Navigate to='/login'/>
    // }

    return(
        <>
        <NavBar/>
        <div>
            <div>
             
            </div>
            <Outlet/>
        </div>
        </>
    )
}