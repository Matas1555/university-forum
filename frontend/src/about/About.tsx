/**
 * Prints some information about the app. React component.
 * @returns Component HTML.
 */
function About() {
	//render component html
	let html = 
		<>
		<div className="d-flex flex-column h-100 overflow-auto">
			<p>Demo react application.</p>
			<p>Click on <q>EntityCRUD</q> in top navigation bar for demo CRUD interface on an entity.</p>
		</div>
		</>

	//
	return html;
}

//
export default About;