import { Outlet, Navigate, useLocation } from "react-router-dom";
import { useStateContext } from "../../context/contextProvider";
import NavBar from "../navbar/navbar";
import Footer from "../footer/footer";
import PageTransition from "../transitions/PageTransition";
import { AnimatePresence } from "framer-motion";

export default function DefaultLayout(){
    const {user, token} = useStateContext;
    const location = useLocation();
    
    // if(!token){
    //     return <Navigate to='/login'/>
    // }

    return (
      <div className="flex flex-col min-h-screen bg-dark">
        <NavBar />
        <main className="flex-grow relative overflow-hidden">
          <AnimatePresence mode="wait" initial={false}>
            <PageTransition key={location.pathname} type="zoom">
              <Outlet />
            </PageTransition>
          </AnimatePresence>
        </main>
        {/* <Footer /> */}
      </div>
    );
}