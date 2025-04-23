import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useForumData } from '../../../context/ForumDataContext';

const ForumMegaPanel = () => {
  const navigate = useNavigate();
  const [hoveredUniversity, setHoveredUniversity] = useState(null);
  const [hoveredFaculty, setHoveredFaculty] = useState(null);
  const { universities, faculties, programs, isLoading } = useForumData();

  const disableScroll = () => {
    document.body.style.overflow = 'hidden';
  };

  const enableScroll = () => {
    document.body.style.overflow = '';
  };

  const sortedUniversities = [...universities].sort((a, b) => 
    a.name.localeCompare(b.name)
  );

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

  const handleNavigateToUniversity = (e, university) => {
    e.preventDefault();
    const forumId = university.forumId;
    navigate(`/forumai/universitetai/${university.forumId}/irasai`, {
      state: {
        forumType: 'university',
        forumId: forumId,
        forumName: university.name,
        breadcrumb: [
          { label: 'Forumai', path: '/forumai' },
          { label: 'Universitetai', path: '/pagrindinis' },
          { label: university.name, path: `/forumai/universitetai/${university.forumId}/irasai` }
        ]
      }
    });
    window.scrollTo(0, 0);
  };

  const handleNavigateToFaculty = (e, university, faculty) => {
    e.preventDefault();
    const forumId = faculty.forumId;
    navigate(`/forumai/universitetai/${university.forumId}/fakultetai/${faculty.forumId}/irasai`, {
      state: {
        forumType: 'faculty',
        forumId: forumId,
        forumName: faculty.name,
        facultyId: faculty.id,
        breadcrumb: [
          { label: 'Forumai', path: '/forumai' },
          { label: 'Universitetai', path: '/pagrindinis' },
          { label: university.name, path: `/forumai/universitetai/${university.forumId}/irasai` },
          { label: faculty.name, path: `/forumai/universitetai/${university.forumId}/fakultetai/${faculty.forumId}/irasai` }
        ]
      }
    });
    window.scrollTo(0, 0);
  };

  const handleNavigateToProgram = (e, university, faculty, program) => {
    e.preventDefault();
    const forumId = program.forumId;
    navigate(`/forumai/universitetai/${university.forumId}/fakultetai/${faculty.forumId}/programos/${program.forumId}/irasai`, {
      state: {
        forumType: 'program',
        forumId: forumId,
        forumName: program.name,
        facultyId: faculty.id,
        programId: program.id,
        breadcrumb: [
          { label: 'Forumai', path: '/forumai' },
          { label: 'Universitetai', path: '/pagrindinis' },
          { label: university.name, path: `/forumai/universitetai/${university.forumId}/irasai` },
          { label: faculty.name, path: `/forumai/universitetai/${university.forumId}/fakultetai/${faculty.forumId}/irasai` },
          { label: program.name, path: `/forumai/universitetai/${university.forumId}/fakultetai/${faculty.forumId}/programos/${program.forumId}/irasai` }
        ]
      }
    });
    window.scrollTo(0, 0);
  };

  return (
    <div 
      className="py-6 px-8 ml-24"
      onMouseEnter={disableScroll}
      onMouseLeave={enableScroll}
    >
      <div className="flex justify-center gap-20">
        {/* University Section */}
        <div className="w-1/4 px-4 relative">
          <div>
            <h3 className="text-white font-medium mb-3">Universitetai</h3>
            {isLoading ? (
              <p className="text-light-grey">Loading...</p>
            ) : (
              <div className="rtl max-h-[450px] overflow-y-auto">
                <ul className="space-y-2 ltr ml-4">
                  {sortedUniversities.map(university => {
                    // Split the university name by spaces
                    const nameParts = university.name.split(' ');
                    // The first part to be bold
                    const firstWord = nameParts[0];
                    // The rest of the name
                    const restOfName = nameParts.slice(1).join(' ');
                    
                    return (
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
                              : 'text-lighter-grey hover:text-lght-blue'
                          } transition-colors duration-150`}
                          onClick={(e) => handleNavigateToUniversity(e, university)}
                        >
                          <span className="font-bold">{firstWord}</span> {restOfName}
                        </a>
                      </li>
                    );
                  })}
                </ul>
              </div>
            )}
          </div>
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 -translate-x-0">
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
          <div className=''>
            <h3 className="text-white font-medium mb-3">Fakultetai</h3>
            {isLoading ? (
              <p className="text-light-grey">Loading...</p>
            ) : hoveredUniversity ? (
              <ul className="space-y-2">
                {getFacultiesForUniversity(hoveredUniversity).map(faculty => {
                  const university = getUniversityById(hoveredUniversity);
                  return (
                    <li 
                      key={faculty.id}
                      onMouseEnter={() => setHoveredFaculty(faculty.id)}
                    >
                      <a
                        href={`/forumai/universitetai/${hoveredUniversity}/fakultetai/${faculty.id}/irasai`}
                        className={`block text-left w-full ${
                          hoveredFaculty === faculty.id 
                            ? 'text-lght-blue' 
                            : 'text-lighter-grey hover:text-lght-blue'
                        } transition-colors duration-150`}
                        onClick={(e) => handleNavigateToFaculty(e, university, faculty)}
                      >
                        {faculty.name}
                      </a>
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="text-light-grey italic">Pasirinkite universitetą</p>
            )}
          </div>
          <div className="absolute right-0 top-1/2 transform -translate-y-1/2 translate-x-10">
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
          {isLoading ? (
            <p className="text-light-grey">Loading...</p>
          ) : hoveredFaculty ? (
            <ul className="space-y-2">
              {getProgramsForFaculty(hoveredFaculty).map(program => {
                const university = getUniversityById(hoveredUniversity);
                const faculty = getFacultyById(hoveredFaculty);
                return (
                  <li key={program.id}>
                    <a 
                      href={`/forumai/universitetai/${hoveredUniversity}/fakultetai/${hoveredFaculty}/programos/${program.id}/irasai`}
                      className="text-lighter-grey hover:text-lght-blue transition-colors duration-150"
                      onClick={(e) => handleNavigateToProgram(e, university, faculty, program)}
                    >
                      {program.name}
                    </a>
                  </li>
                );
              })}
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