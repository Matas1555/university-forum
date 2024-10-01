import { NavLink } from "react-router-dom";

import Auth from '../auth/Auth';

import './NavMenu.scss'


/**
 * Navigation menu. React component.
 * @returns Component HTML.
 */
function NavMenu() {
	//render component HTML
	let html =		
		<header>
			<nav 
				className="
					navbar 
					shadow-sm bg-body rounded m-1 
					d-flex justify-content-between align-items-center"
				>
				<span className="d-flex">
					<NavLink 
						to="/" 
						className={it => "nav-link " + (it.isActive ? "active" : "")}
						>Home</NavLink>
					<NavLink 
						to="/entityCrud"
						className={it => "nav-link " + (it.isActive ? "active" : "")}
						>Entity CRUD</NavLink>
				</span>
				<span>
					<Auth/>
				</span>
			</nav>
		</header>;

	//
	return html;
}

//export component
export default NavMenu;