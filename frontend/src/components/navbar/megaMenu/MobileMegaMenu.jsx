import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';

// Reuse the same data from ForumMegaPanel
const universities = [
  { id: 1, name: 'Kauno Technologijos universitetas' },
  { id: 2, name: 'Vilniaus universitetas' },
  { id: 3, name: 'Vytauto Didžiojo universitetas' }
];

const faculties = [
  { id: 1, universityId: 1, name: 'Informatikos fakultetas' },
  { id: 2, universityId: 1, name: 'Ekonomikos fakultetas' },
  { id: 3, universityId: 1, name: 'Mechanikos fakultetas' },
  { id: 4, universityId: 2, name: 'Matematikos fakultetas' },
  { id: 5, universityId: 2, name: 'Fizikos fakultetas' },
  { id: 6, universityId: 3, name: 'Politikos mokslų fakultetas' }
];

const programs = [
  { id: 1, facultyId: 1, name: 'Programų sistemos' },
  { id: 2, facultyId: 1, name: 'Dirbtinis intelektas' },
  { id: 3, facultyId: 1, name: 'Informacinės sistemos' },
  { id: 4, facultyId: 2, name: 'Finansai' },
  { id: 5, facultyId: 2, name: 'Ekonomika' },
  { id: 6, facultyId: 3, name: 'Mechanikos inžinerija' },
  { id: 7, facultyId: 4, name: 'Matematika ir statistika' },
  { id: 8, facultyId: 5, name: 'Fizika' },
  { id: 9, facultyId: 6, name: 'Politikos mokslai' }
];

const MobileMegaMenu = ({ isOpen }) => {
  const [activeMenu, setActiveMenu] = useState(null);
  const [selectedUniversity, setSelectedUniversity] = useState(null);
  const [selectedFaculty, setSelectedFaculty] = useState(null);

  const openSubmenu = (menuName) => {
    setActiveMenu(activeMenu === menuName ? null : menuName);
  };

  const getFacultiesForUniversity = (universityId) => {
    return faculties.filter(faculty => faculty.universityId === universityId);
  };

  const getProgramsForFaculty = (facultyId) => {
    return programs.filter(program => program.facultyId === facultyId);
  };

  if (!isOpen) return null;

  return (
    <div className="md:hidden mt-4 bg-grey rounded-md p-4">
      <div className="space-y-4">
        {/* Main Navigation Menu */}
        <div>
          <button 
            className={`flex items-center justify-between w-full text-white hover:text-lght-blue transition-colors duration-150 py-2 ${activeMenu === 'forumai' ? 'text-lght-blue' : ''}`}
            onClick={() => openSubmenu('forumai')}
          >
            <span>Forumai</span>
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              className={`h-5 w-5 transition-transform ${activeMenu === 'forumai' ? 'rotate-180' : ''}`} 
              viewBox="0 0 20 20" 
              fill="currentColor"
            >
              <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
            </svg>
          </button>
          
          {activeMenu === 'forumai' && (
            <div className="pl-4 pt-2 space-y-2">
              {/* General Forums */}
              <div className="border-l-2 border-light-grey pl-2">
                <h3 className="text-white font-medium mb-2">Bendros diskusijos</h3>
                <ul className="space-y-1 pl-2">
                  <li>
                    <NavLink 
                      to="/forumai/bendros/irasai" 
                      className="text-light-grey hover:text-lght-blue transition-colors duration-150"
                    >
                      Bendros diskusijos
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="/forumai/kategorijos/kursu-apzvalgos/irasai" 
                      className="text-light-grey hover:text-lght-blue transition-colors duration-150"
                    >
                      Kursų apžvalgos
                    </NavLink>
                  </li>
                  <li>
                    <NavLink 
                      to="/forumai/kategorijos/studiju-medziaga/irasai" 
                      className="text-light-grey hover:text-lght-blue transition-colors duration-150"
                    >
                      Studijų medžiaga
                    </NavLink>
                  </li>
                </ul>
              </div>

              {/* Universities */}
              <div className="border-l-2 border-light-grey pl-2">
                <h3 className="text-white font-medium mb-2">Universitetai</h3>
                <ul className="space-y-1 pl-2">
                  {universities.map(university => (
                    <li key={university.id}>
                      <button 
                        className={`text-left ${selectedUniversity === university.id ? 'text-lght-blue' : 'text-light-grey hover:text-lght-blue'} transition-colors duration-150`}
                        onClick={() => {
                          setSelectedUniversity(selectedUniversity === university.id ? null : university.id);
                          setSelectedFaculty(null);
                        }}
                      >
                        {university.name}
                        {selectedUniversity === university.id && (
                          <div className="mt-1 pl-2">
                            <h4 className="text-white text-sm font-medium mb-1">Fakultetai:</h4>
                            <ul className="space-y-1 pl-2">
                              {getFacultiesForUniversity(university.id).map(faculty => (
                                <li key={faculty.id}>
                                  <button 
                                    className={`text-left ${selectedFaculty === faculty.id ? 'text-lght-blue' : 'text-light-grey hover:text-lght-blue'} transition-colors duration-150`}
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      setSelectedFaculty(selectedFaculty === faculty.id ? null : faculty.id);
                                    }}
                                  >
                                    {faculty.name}
                                    {selectedFaculty === faculty.id && (
                                      <div className="mt-1 pl-2">
                                        <h5 className="text-white text-sm font-medium mb-1">Programos:</h5>
                                        <ul className="space-y-1 pl-2">
                                          {getProgramsForFaculty(faculty.id).map(program => (
                                            <li key={program.id}>
                                              <NavLink 
                                                to={`/forumai/universitetai/${university.id}/fakultetai/${faculty.id}/programos/${program.id}/irasai`}
                                                className="text-light-grey hover:text-lght-blue transition-colors duration-150"
                                              >
                                                {program.name}
                                              </NavLink>
                                            </li>
                                          ))}
                                        </ul>
                                      </div>
                                    )}
                                  </button>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </div>

        <NavLink to="/universitetai" className="block text-white hover:text-lght-blue transition-colors duration-150 py-2">
          Universitetai
        </NavLink>
        
        <NavLink to="/destytojai" className="block text-white hover:text-lght-blue transition-colors duration-150 py-2">
          Dėstytojai
        </NavLink>
        
        <NavLink to="/rekomendacijos" className="block bg-gradient-to-r from-lght-blue to-blue-500 text-white font-semibold py-3 px-4 rounded-lg shadow-lg hover:from-blue-600 hover:to-blue-400 transition-all duration-300 transform hover:scale-105 flex items-center justify-center gap-2 relative">
          <span className="text-lg">Rekomendacijos</span>
          <svg xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24" stroke="none" className="w-6 h-6 text-yellow-300 animate-pulse">
            <path strokeLinecap="round" strokeLinejoin="round" d="M9.813 15.904 9 18.75l-.813-2.846a4.5 4.5 0 0 0-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 0 0 3.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 0 0 3.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 0 0-3.09 3.09Z" />
          </svg>
        </NavLink>
      </div>
    </div>
  );
};

export default MobileMegaMenu; 