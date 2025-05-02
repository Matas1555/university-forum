import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import StarRating from '../../components/starRating/starRating';
import { UniversityAPI } from '../../utils/API';

const RecommendationResults = () => {
  const navigate = useNavigate();
  const [strictPrograms, setStrictPrograms] = useState([]);
  const [relaxedPrograms, setRelaxedPrograms] = useState([]);
  const [preferences, setPreferences] = useState(null);
  const [loading, setLoading] = useState(true);
  const [sortField, setSortField] = useState('relevance');
  const [sortOrder, setSortOrder] = useState('desc');
  const [expanded, setExpanded] = useState({});
  const [searchTerm, setSearchTerm] = useState('');
  const [activeTab, setActiveTab] = useState('strict');

  useEffect(() => {
    const loadResults = () => {
      try {
        const storedPrograms = localStorage.getItem('filteredPrograms');
        const storedPreferences = localStorage.getItem('recommendationPreferences');
        
        if (!storedPrograms) {
          navigate('/recommendation');
          return;
        }
        
        const parsedData = JSON.parse(storedPrograms);
        
        if (storedPreferences) {
          const parsedPreferences = JSON.parse(storedPreferences);
          setPreferences(parsedPreferences);
          
          // Check if we have the new API response format with strict and relaxed programs
          if (parsedData.strict_programs && parsedData.relaxed_programs) {
            const strictProgramsWithRelevance = calculateRelevanceScores(parsedData.strict_programs, parsedPreferences);
            const relaxedProgramsWithRelevance = calculateRelevanceScores(parsedData.relaxed_programs, parsedPreferences);
            
            setStrictPrograms(strictProgramsWithRelevance);
            setRelaxedPrograms(relaxedProgramsWithRelevance);
          } else {
            // Backward compatibility with old format
            const programsWithRelevance = calculateRelevanceScores(parsedData, parsedPreferences);
            setStrictPrograms(programsWithRelevance);
            setRelaxedPrograms([]);
          }
        } else {
          // Handle case without preferences
          if (parsedData.strict_programs && parsedData.relaxed_programs) {
            setStrictPrograms(parsedData.strict_programs);
            setRelaxedPrograms(parsedData.relaxed_programs);
          } else {
            setStrictPrograms(parsedData);
            setRelaxedPrograms([]);
          }
        }
      } catch (error) {
        console.error('Error loading results:', error);
      } finally {
        setLoading(false);
      }
    };

    loadResults();
  }, [navigate]);

  const calculateRelevanceScores = (programs, prefs) => {
    return programs.map(program => {
      let relevanceScore = 0;
      
      relevanceScore += 50;
      
      relevanceScore += program.rating * 5;

      if (prefs.academicPreferences.fieldOfStudy.length > 0) {
        const fieldMatches = prefs.academicPreferences.fieldOfStudy.filter(field => 
          program.title.toLowerCase().includes(field.toLowerCase())
        ).length;
        
        relevanceScore += fieldMatches * 10;
      }

      if (prefs.academicPreferences.locations.includes(program.university.location)) {
        relevanceScore += 15;
      }

      // Enhanced program size scoring - now it's a ranking factor instead of hard filter
      if (prefs.programSize) {
        let studentCount = 0;
        
        if (program.student_count) {
          // Try to extract numbers from student_count field
          const matches = program.student_count.toString().match(/\d+/);
          if (matches && matches.length > 0) {
            studentCount = parseInt(matches[0], 10);
          }
        }
        
        // Assign relevance score based on preference match
        if (prefs.programSize === 'small' && (studentCount < 30 || studentCount === 0)) {
          relevanceScore += 20; // Higher weight as it's now a ranking factor
        } else if (prefs.programSize === 'medium' && studentCount >= 30 && studentCount <= 100) {
          relevanceScore += 20;
        } else if (prefs.programSize === 'large' && studentCount > 100) {
          relevanceScore += 20;
        }
      }

      // Enhanced difficulty level scoring - now it's a ranking factor instead of hard filter
      if (prefs.studyPreferences && prefs.studyPreferences.difficultyLevel !== undefined) {
        const difficultyLevel = prefs.studyPreferences.difficultyLevel;
        const programDifficulty = program.difficulty_rating || 3; // Default to medium if not specified
        
        // Assign relevance score based on how close the program's difficulty is to the preference
        if (difficultyLevel < 30 && programDifficulty <= 3) {
          relevanceScore += 15;
        } else if (difficultyLevel > 70 && programDifficulty >= 3) {
          relevanceScore += 15;
        } else if (difficultyLevel >= 30 && difficultyLevel <= 70) {
          // For middle preference, give points to programs with medium difficulty
          if (programDifficulty >= 2 && programDifficulty <= 4) {
            relevanceScore += 15;
          }
        }
      }

      if (prefs.careerGoals && prefs.careerGoals.length > 0) {
        const careerKeywords = {
          'industry': ['industry', 'industrial', 'practice', 'business', 'practical', 'industrijoje', 'praktika', 'verslas'],
          'academic': ['academic', 'research', 'theory', 'science', 'akademinis', 'tyrimai', 'mokslas'],
          'entrepreneurship': ['entrepreneur', 'startup', 'business', 'verslumas', 'startuolis', 'verslas'],
          'research': ['research', 'development', 'innovation', 'tyrimai', 'vystymas', 'inovacijos'],
          'public': ['public', 'government', 'service', 'viešasis', 'valstybinis', 'tarnyba'],
          'international': ['international', 'global', 'abroad', 'tarptautinis', 'globalus', 'užsienis']
        };
        
        let keywordMatches = 0;
        prefs.careerGoals.forEach(goal => {
          const keywords = careerKeywords[goal] || [];
          keywords.forEach(keyword => {
            if (program.description && program.description.toLowerCase().includes(keyword.toLowerCase())) {
              keywordMatches++;
            }
          });
        });
        
        relevanceScore += keywordMatches * 5;
      }

      if (prefs.housingPreferences.dormitoryImportant && program.university.dormitories_rating >= 3.5) {
        relevanceScore += 10;
      }

      if (prefs.keywordSearch && program.description) {
        const keywords = prefs.keywordSearch.toLowerCase().split(/[,\s]+/).filter(Boolean);
        const descriptionLower = program.description.toLowerCase();
        
        let matchCount = 0;
        keywords.forEach(keyword => {
          if (descriptionLower.includes(keyword)) {
            matchCount++;
          }
        });
        
        relevanceScore += matchCount * 8;
      }

      return {
        ...program,
        relevanceScore
      };
    }).sort((a, b) => b.relevanceScore - a.relevanceScore);
  };

  const sortPrograms = (programs, field, order) => {
    return [...programs].sort((a, b) => {
      let valueA, valueB;

      if (field === 'relevance') {
        valueA = a.relevanceScore || 0;
        valueB = b.relevanceScore || 0;
      }

      else if (field.includes('.')) {
        const [parent, child] = field.split('.');
        valueA = a[parent] ? a[parent][child] : 0;
        valueB = b[parent] ? b[parent][child] : 0;
      } else {
        valueA = a[field] || 0;
        valueB = b[field] || 0;
      }

      if (typeof valueA === 'string') {
        return order === 'asc' 
          ? valueA.localeCompare(valueB) 
          : valueB.localeCompare(valueA);
      }

      return order === 'asc' ? valueA - valueB : valueB - valueA;
    });
  };

  const toggleSort = (field) => {
    const newOrder = field === sortField && sortOrder === 'desc' ? 'asc' : 'desc';
    setSortField(field);
    setSortOrder(newOrder);
    
    if (activeTab === 'strict') {
      setStrictPrograms(sortPrograms(strictPrograms, field, newOrder));
    } else {
      setRelaxedPrograms(sortPrograms(relaxedPrograms, field, newOrder));
    }
  };

  const toggleExpand = (id) => {
    setExpanded(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };

  const getSortIcon = (field) => {
    if (field !== sortField) return null;
    
    return sortOrder === 'desc' 
      ? <span className="ml-1">↓</span>
      : <span className="ml-1">↑</span>;
  };

  const getFilteredPrograms = () => {
    const programs = activeTab === 'strict' ? strictPrograms : relaxedPrograms;
    
    if (!searchTerm) return programs;
    
    return programs.filter(program => 
      program.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      program.university.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      (program.faculty && program.faculty.name.toLowerCase().includes(searchTerm.toLowerCase()))
    );
  };

  const filteredPrograms = getFilteredPrograms();

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-16 w-16 border-t-2 border-b-2 border-lght-blue"></div>
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8 max-w-screen-xl">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-white text-3xl font-bold">Rekomenduojamos programos</h1>
        <Link 
          to="/rekomendacijos" 
          className="bg-dark text-white px-4 py-2 rounded-lg hover:bg-dark/80 transition-colors"
        >
          Grįžti į formą
        </Link>
      </div>

      {/* Result tabs */}
      <div className="flex mb-4">
        <button
          className={`px-4 py-2 rounded-t-lg mr-2 ${
            activeTab === 'strict' 
              ? 'bg-grey text-white font-medium' 
              : 'bg-dark text-white hover:bg-grey/80'
          }`}
          onClick={() => setActiveTab('strict')}
        >
          Tinkamos programos ({strictPrograms.length})
        </button>
        
        {relaxedPrograms.length > 0 && (
          <button
            className={`px-4 py-2 rounded-t-lg ${
              activeTab === 'relaxed' 
                ? 'bg-grey text-white font-medium' 
                : 'bg-dark text-white hover:bg-grey/80'
            }`}
            onClick={() => setActiveTab('relaxed')}
          >
            Alternatyvios programos ({relaxedPrograms.length})
          </button>
        )}
      </div>

      <div className="bg-grey rounded-lg p-6 mb-8">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-white text-xl mb-2">
              {activeTab === 'strict' 
                ? `Rasta ${filteredPrograms.length} tinkamų programų` 
                : `Rasta ${filteredPrograms.length} alternatyvių programų`}
            </h2>
            {preferences && (
              <p className="text-lighter-grey">
                Pakopa: {preferences.academicPreferences.degreeType === 'bakalauras' ? 'Bakalauras' : 'Magistras'}
                {preferences.academicPreferences.locations.length > 0 && 
                  `, Vietos: ${preferences.academicPreferences.locations.join(', ')}`}
              </p>
            )}
          </div>
          <div className="flex items-center gap-3">
            <select 
              value={`${sortField}-${sortOrder}`}
              onChange={(e) => {
                const [field, order] = e.target.value.split('-');
                setSortField(field);
                setSortOrder(order);
                
                if (activeTab === 'strict') {
                  setStrictPrograms(sortPrograms(strictPrograms, field, order));
                } else {
                  setRelaxedPrograms(sortPrograms(relaxedPrograms, field, order));
                }
              }}
              className="bg-dark text-white px-3 py-2 rounded-md border border-gray-600 focus:border-lght-blue outline-none"
            >
              <option value="relevance-desc">Rikiuoti pagal atitikimą</option>
              <option value="rating-desc">Rikiuoti pagal įvertinimą (aukšč.)</option>
              <option value="title-asc">Rikiuoti pagal pavadinimą (A-Z)</option>
              <option value="university.name-asc">Rikiuoti pagal universitetą (A-Z)</option>
            </select>
            <div className="w-64">
              <input 
                type="text"
                placeholder="Ieškoti programų..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full bg-dark text-white px-3 py-2 rounded-md border border-gray-600 focus:border-lght-blue outline-none"
              />
            </div>
          </div>
        </div>

        {activeTab === 'relaxed' && (
          <div className="mb-6 p-4 bg-dark rounded-lg border border-lght-blue">
            <p className="text-white flex items-center">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-5 h-5 mr-2 text-lght-blue">
                <path strokeLinecap="round" strokeLinejoin="round" d="M11.25 11.25l.041-.02a.75.75 0 011.063.852l-.708 2.836a.75.75 0 001.063.853l.041-.021M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9-3.75h.008v.008H12V8.25z" />
              </svg>
              Alternatyvios programos neatitinka visų jūsų nurodytų kriterijų, tačiau gali būti įdomios pagal jūsų akademinius interesus ar vietovę.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 gap-6">
          <div className="overflow-x-auto">
            <table className="min-w-full bg-dark rounded-lg text-white">
              <thead>
                <tr className="border-b border-gray-700">
                  <th className="px-4 py-3 text-left">
                    <button 
                      className="flex items-center font-semibold" 
                      onClick={() => toggleSort('title')}
                    >
                      Programa {getSortIcon('title')}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left">
                    <button 
                      className="flex items-center font-semibold" 
                      onClick={() => toggleSort('university.name')}
                    >
                      Universitetas {getSortIcon('university.name')}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-left min-w-[100px]">
                    <button 
                      className="flex items-center font-semibold" 
                      onClick={() => toggleSort('rating')}
                    >
                      Įvertinimas {getSortIcon('rating')}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-center">
                    <button 
                      className="flex items-center font-semibold" 
                      onClick={() => toggleSort('relevance')}
                    >
                      Atitikimas {getSortIcon('relevance')}
                    </button>
                  </th>
                  <th className="px-4 py-3 text-right">Veiksmai</th>
                </tr>
              </thead>
              <tbody>
                {filteredPrograms.length > 0 ? (
                  filteredPrograms.map((program) => (
                    <React.Fragment key={program.id}>
                      <tr className="border-b border-gray-700 hover:bg-grey/30">
                        <td className="px-4 py-3 text-left">
                          <div className="font-medium">{program.title}</div>
                          <div className="text-sm text-lighter-grey">{program.degree_type}</div>
                        </td>
                        <td className="px-4 py-3 text-left">
                          <div>{program.university.name}</div>
                          <div className="text-sm text-lighter-grey">{program.university.location}</div>
                          {program.faculty && <div className="text-xs text-lighter-grey">{program.faculty.name}</div>}
                        </td>
                        <td className="px-4 py-3 text-left">
                          <StarRating rating={program.rating || 0} width={5} color="white" />
                        </td>
                        <td className="px-4 py-3 text-center">
                          <div className="inline-block w-16 h-4 bg-gray-700 rounded-full overflow-hidden">
                            <div 
                              className="h-full bg-lght-blue" 
                              style={{ width: `${Math.min(100, (program.relevanceScore || 0) / 1.5)}%` }}
                            ></div>
                          </div>
                          <div className="text-xs text-lighter-grey mt-1">{Math.round(program.relevanceScore || 0)}/100</div>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <button
                            onClick={() => toggleExpand(program.id)}
                            className="text-lght-blue hover:text-blue-400 mr-3"
                          >
                            {expanded[program.id] ? 'Mažiau' : 'Daugiau'}
                          </button>
                          <Link
                            to={`/universities/${program.university.id}/programs/${program.id}`}
                            className="text-lght-blue hover:text-blue-400"
                          >
                            Atidaryti
                          </Link>
                        </td>
                      </tr>
                      {expanded[program.id] && (
                        <tr>
                          <td colSpan="5" className="px-6 py-4 bg-dark/80">
                            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                              <div className="lg:col-span-2">
                                <h3 className="text-lg font-medium mb-2">Apie programą</h3>
                                <p className="text-lighter-grey mb-4">
                                  {program.description || "Aprašymas nepateiktas"}
                                </p>
                                <div className="flex flex-wrap gap-4 mb-4">
                                  <div>
                                    <div className="text-lght-blue text-sm">Programos trukmė:</div>
                                    <div>{program.program_length || "Nenurodyta"}</div>
                                  </div>
                                  <div>
                                    <div className="text-lght-blue text-sm">Studentų skaičius:</div>
                                    <div>{program.student_count || "Nenurodyta"}</div>
                                  </div>
                                  <div>
                                    <div className="text-lght-blue text-sm">Metinė kaina:</div>
                                    <div>{program.yearly_cost ? `${program.yearly_cost} €` : "Nenurodyta"}</div>
                                  </div>
                                </div>
                              </div>
                              <div>
                                <h3 className="text-lg font-medium mb-2">Įvertinimai</h3>
                                <div className="space-y-2">
                                  <div className="flex justify-between items-center">
                                    <span className="text-lighter-grey">Bendras įvertinimas:</span>
                                    <StarRating rating={program.rating || 0} width={5} color="white" />
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-lighter-grey">Programos turinys:</span>
                                    <StarRating rating={program.course_content_rating || 0} width={5} color="white" />
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-lighter-grey">Praktiniai užsiėmimai:</span>
                                    <StarRating rating={program.practical_sessions_rating || 0} width={5} color="white" />
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-lighter-grey">Profesiniai įgūdžiai:</span>
                                    <StarRating rating={program.professional_skills_rating || 0} width={5} color="white" />
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-lighter-grey">Studentų bendruomenė:</span>
                                    <StarRating rating={program.student_community_rating || 0} width={5} color="white" />
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-lighter-grey">Universiteto infrastruktūra:</span>
                                    <StarRating rating={program.university.facilities_rating || 0} width={5} color="white" />
                                  </div>
                                  <div className="flex justify-between items-center">
                                    <span className="text-lighter-grey">Bendrabučiai:</span>
                                    <StarRating rating={program.university.dormitories_rating || 0} width={5} color="white" />
                                  </div>
                                </div>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  ))
                ) : (
                  <tr>
                    <td colSpan="5" className="px-4 py-6 text-center">
                      <div className="text-lighter-grey">
                        Programų, atitinkančių jūsų paieškos kriterijus, nerasta.
                      </div>
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default RecommendationResults; 