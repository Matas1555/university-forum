
import { NavLink } from "react-router-dom"
import NavLinks from "./navLinks"

const NavBar = () => {
  return (
    <header className="bg-dark top-0 flex-wrap w-full z-[20] mx-auto flex items-center justify-between p-5">
        <NavLink style={{ fontWeight:600, fontSize:"1.5em"}} className="text-white" to='/home'>UniForum</NavLink>
        <NavLinks></NavLinks>
    </header>
  )
}

export default NavBar
