
import { NavLink } from "react-router-dom"
import NavLinks from "./navLinks"

const NavBar = () => {
  return (
    <header className="bg-lighter-blue sticky top-0 flex-wrap w-full z-[20] mx-auto flex items-center justify-between p-5 border-b-2 border-blue shadow-lg">
        <NavLink style={{fontFamily: "Inter", fontWeight:800, fontSize:"2em"}} className="text-blue" to='/home'>UniForum</NavLink>
        <NavLinks></NavLinks>
    </header>
  )
}

export default NavBar
