import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';

// Mock data for universities, faculties, and programs
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

const ForumMegaPanel = () => {
  const navigate = useNavigate();
  const [hoveredUniversity, setHoveredUniversity] = useState(null);
  const [hoveredFaculty, setHoveredFaculty] = useState(null);

  const getFacultiesForUniversity = (universityId) => {
    return faculties.filter(faculty => faculty.universityId === universityId);
  };

  const getProgramsForFaculty = (facultyId) => {
    return programs.filter(program => program.facultyId === facultyId);
  };

  const getUniversityById = (id) => {
    return universities.find(university => university.id === id);
  };

  const getFacultyById = (id) => {
    return faculties.find(faculty => faculty.id === id);
  };

  // Navigation handlers
  const handleNavigateToGeneralForum = (e, path, forumName) => {
    e.preventDefault();
    navigate(path, {
      state: {
        forumType: 'general',
        forumId: 'general',
        forumName: forumName,
        breadcrumb: [
          { label: 'Forumai', path: '/forumai' },
          { label: forumName, path: path }
        ]
      }
    });
    window.scrollTo(0, 0);
  };

  const handleNavigateToUniversity = (e, universityId) => {
    e.preventDefault();
    const university = getUniversityById(universityId);
    navigate(`/forumai/universitetai/${universityId}/irasai`, {
      state: {
        forumType: 'university',
        forumId: universityId,
        forumName: university.name,
        breadcrumb: [
          { label: 'Forumai', path: '/forumai' },
          { label: 'Universitetai', path: '/pagrindinis' },
          { label: university.name, path: `/forumai/universitetai/${universityId}/irasai` }
        ]
      }
    });
    window.scrollTo(0, 0);
  };

  const handleNavigateToFaculty = (e, universityId, facultyId) => {
    e.preventDefault();
    const university = getUniversityById(universityId);
    const faculty = getFacultyById(facultyId);
    navigate(`/forumai/universitetai/${universityId}/fakultetai/${facultyId}/irasai`, {
      state: {
        forumType: 'university',
        forumId: universityId,
        forumName: faculty.name,
        facultyId: facultyId,
        breadcrumb: [
          { label: 'Forumai', path: '/forumai' },
          { label: 'Universitetai', path: '/pagrindinis' },
          { label: university.name, path: `/forumai/universitetai/${universityId}/irasai` },
          { label: faculty.name, path: `/forumai/universitetai/${universityId}/fakultetai/${facultyId}/irasai` }
        ]
      }
    });
    window.scrollTo(0, 0);
  };

  const handleNavigateToProgram = (e, universityId, facultyId, programId, programName) => {
    e.preventDefault();
    const university = getUniversityById(universityId);
    const faculty = getFacultyById(facultyId);
    navigate(`/forumai/universitetai/${universityId}/fakultetai/${facultyId}/programos/${programId}/irasai`, {
      state: {
        forumType: 'university',
        forumId: universityId,
        forumName: programName,
        facultyId: facultyId,
        programId: programId,
        breadcrumb: [
          { label: 'Forumai', path: '/forumai' },
          { label: 'Universitetai', path: '/pagrindinis' },
          { label: university.name, path: `/forumai/universitetai/${universityId}/irasai` },
          { label: faculty.name, path: `/forumai/universitetai/${universityId}/fakultetai/${facultyId}/irasai` },
          { label: programName, path: `/forumai/universitetai/${universityId}/fakultetai/${facultyId}/programos/${programId}/irasai` }
        ]
      }
    });
    window.scrollTo(0, 0);
  };

  return (
    <div className="py-6 px-8 ml-24">
      <div className="flex">
        {/* General Forums Section */}
        <div className="w-1/4 pr-4 border-r border-light-grey">
          <h3 className="text-white font-medium mb-3">Kategorijos</h3>
          <ul className="space-y-2">
            <li>
              <a 
                href="/forumai/bendros/irasai" 
                className="text-light-grey hover:text-lght-blue transition-colors duration-150"
                onClick={(e) => handleNavigateToGeneralForum(e, '/forumai/bendros/irasai', 'Bendros diskusijos')}
              >
                Bendros diskusijos
              </a>
            </li>
            <li>
              <a 
                href="/forumai/kategorijos/kursu-apzvalgos/irasai" 
                className="text-light-grey hover:text-lght-blue transition-colors duration-150"
                onClick={(e) => handleNavigateToGeneralForum(e, '/forumai/kategorijos/kursu-apzvalgos/irasai', 'Kursų apžvalgos')}
              >
                Kursų apžvalgos
              </a>
            </li>
            <li>
              <a 
                href="/forumai/kategorijos/studiju-medziaga/irasai" 
                className="text-light-grey hover:text-lght-blue transition-colors duration-150"
                onClick={(e) => handleNavigateToGeneralForum(e, '/forumai/kategorijos/studiju-medziaga/irasai', 'Studijų medžiaga')}
              >
                Studijų medžiaga
              </a>
            </li>
            <li>
              <a 
                href="/forumai/kategorijos/socialinis-gyvenimas/irasai" 
                className="text-light-grey hover:text-lght-blue transition-colors duration-150"
                onClick={(e) => handleNavigateToGeneralForum(e, '/forumai/kategorijos/socialinis-gyvenimas/irasai', 'Socialinis gyvenimas')}
              >
                Socialinis gyvenimas
              </a>
            </li>
          </ul>
        </div>

        {/* University Section */}
        <div className="w-1/4 px-4 relative">
          <div>
            <h3 className="text-white font-medium mb-3">Universitetai</h3>
            <ul className="space-y-2">
                {universities.map(university => (
                <li 
                  key={university.id}
                  onMouseEnter={() => {
                    setHoveredUniversity(university.id);
                    setHoveredFaculty(null);
                  }}
                >
                  <a
                    href={`/forumai/universitetai/${university.id}/irasai`}
                    className={`block text-left w-full ${
                      hoveredUniversity === university.id 
                        ? 'text-lght-blue' 
                        : 'text-light-grey hover:text-lght-blue'
                    } transition-colors duration-150`}
                    onClick={(e) => handleNavigateToUniversity(e, university.id)}
                  >
                    {university.name}
                  </a>
                </li>
                ))}
            </ul>
          </div>
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 -translate-x-10">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth="1" 
              stroke="currentColor" 
              className={`size-10 opacity-70 ${hoveredUniversity ? 'text-lght-blue' : 'text-light-grey'}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </div>

        {/* Faculty Section */}
        <div className="w-1/5 pl-4 relative">
          <div>
          <h3 className="text-white font-medium mb-3">Fakultetai</h3>
          {hoveredUniversity ? (
            <ul className="space-y-2">
              {getFacultiesForUniversity(hoveredUniversity).map(faculty => (
                <li 
                  key={faculty.id}
                  onMouseEnter={() => setHoveredFaculty(faculty.id)}
                >
                  <a
                    href={`/forumai/universitetai/${hoveredUniversity}/fakultetai/${faculty.id}/irasai`}
                    className={`block text-left w-full ${
                      hoveredFaculty === faculty.id 
                        ? 'text-lght-blue' 
                        : 'text-light-grey hover:text-lght-blue'
                    } transition-colors duration-150`}
                    onClick={(e) => handleNavigateToFaculty(e, hoveredUniversity, faculty.id)}
                  >
                    {faculty.name}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-light-grey italic">Pasirinkite universitetą</p>
          )}
          </div>
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 -translate-x-10">
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              fill="none" 
              viewBox="0 0 24 24" 
              strokeWidth="1" 
              stroke="currentColor" 
              className={`size-10 opacity-70 ${hoveredFaculty ? 'text-lght-blue' : 'text-light-grey'}`}
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
            </svg>
          </div>
        </div>

        {/* Program Section */}
        <div className="w-1/4 pl-4">
          <h3 className="text-white font-medium mb-3">Studijų programos</h3>
          {hoveredFaculty ? (
            <ul className="space-y-2">
              {getProgramsForFaculty(hoveredFaculty).map(program => (
                <li key={program.id}>
                  <a 
                    href={`/forumai/universitetai/${hoveredUniversity}/fakultetai/${hoveredFaculty}/programos/${program.id}/irasai`}
                    className="text-light-grey hover:text-lght-blue transition-colors duration-150"
                    onClick={(e) => handleNavigateToProgram(e, hoveredUniversity, hoveredFaculty, program.id, program.name)}
                  >
                    {program.name}
                  </a>
                </li>
              ))}
            </ul>
          ) : (
            <p className="text-light-grey italic">Pasirinkite fakultetą</p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ForumMegaPanel; 