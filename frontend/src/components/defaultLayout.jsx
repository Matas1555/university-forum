import { Outlet, Navigate } from "react-router-dom";
import { useStateContext } from "../context/contextProvider";
import NavBar from "./navbar";
import Footer from "./footer";

export default function DefaultLayout(){
    const {user, token} = useStateContext;
    // if(!token){
    //     return <Navigate to='/login'/>
    // }

    return (
      <div className="flex flex-col min-h-screen">
        <NavBar />
        <main className="flex-grow">
          <Outlet />
        </main>
        <Footer />
      </div>
      );
}