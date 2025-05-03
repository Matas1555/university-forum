<?php

namespace App\Http\Controllers;

use App\Models\University;
use App\Models\Program;
use App\Models\Faculty;
use App\Models\ProgramReview;
use App\Services\OpenAIService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Log;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Validator;

class RecommendationController extends Controller
{
    protected $openAIService;
    
    public function __construct(OpenAIService $openAIService)
    {
        $this->openAIService = $openAIService;
    }
    
    /**
     * Filter universities and programs based on user preferences
     *
     * @param \Illuminate\Http\Request $request
     * @return \Illuminate\Http\JsonResponse
     */
    public function filterPrograms(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'academicPreferences.degreeType' => 'nullable|string|in:bakalauras,magistras',
                'academicPreferences.fieldOfStudy' => 'nullable|array',
                'academicPreferences.locations' => 'nullable|array',
                'academicPreferences.minRating' => 'nullable|numeric|min:0|max:5',
                'financialFactors.stateFinanced' => 'nullable|boolean',
                'financialFactors.maxYearlyCost' => 'nullable|numeric|min:0',
                'programSize' => 'nullable|string|in:small,medium,large',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $preferences = $request->all();
            
            $query = Program::with(['university', 'faculty']);
            Log::info('Initial query - all programs');
            $initialCount = $query->count();
            Log::info("Initial program count: {$initialCount}");
            $steps = ['Initial count' => $initialCount];

            if (isset($preferences['academicPreferences']['degreeType'])) {
                $degreeType = $preferences['academicPreferences']['degreeType'];
                $query->where('magistras', $degreeType === 'magistras');
                $countAfterDegree = $query->count();
                Log::info("After degree type filter ({$degreeType}): {$countAfterDegree} programs");
                $steps['After degree type filter'] = $countAfterDegree;
            }

            if (!empty($preferences['academicPreferences']['fieldOfStudy'])) {
                $fields = $preferences['academicPreferences']['fieldOfStudy'];
                Log::info("Filtering for fields: " . implode(', ', $fields));
                

                $query->where(function ($query) use ($fields) {
                    foreach ($fields as $field) {
                        $fieldLower = strtolower($field);
                        Log::info("Looking for field: {$field}");
                        
                        $query->orWhere('title', 'LIKE', "%{$field}%")
                              ->orWhere(DB::raw('LOWER(title)'), 'LIKE', "%{$fieldLower}%")
                              ->orWhere('description', 'LIKE', "%{$field}%")
                              ->orWhere(DB::raw('LOWER(description)'), 'LIKE', "%{$fieldLower}%");
                        
                        $fieldStems = $this->getFieldStems($field);
                        Log::info("Field stem variations: " . implode(', ', $fieldStems));
                        
                        foreach ($fieldStems as $stem) {
                            $query->orWhere('title', 'LIKE', "%{$stem}%")
                                  ->orWhere('description', 'LIKE', "%{$stem}%");
                        }
                        
                        $query->orWhereHas('faculty', function($q) use ($field, $fieldLower, $fieldStems) {
                            $q->where('name', 'LIKE', "%{$field}%")
                              ->orWhere(DB::raw('LOWER(name)'), 'LIKE', "%{$fieldLower}%");
                              
                            foreach ($fieldStems as $stem) {
                                $q->orWhere('name', 'LIKE', "%{$stem}%");
                            }
                        });
                    }
                });
                
                $countAfterFields = $query->count();
                Log::info("After field of study filter: {$countAfterFields} programs");
                $steps['After field of study filter'] = $countAfterFields;
            }

            if (!empty($preferences['academicPreferences']['locations'])) {
                $locations = $preferences['academicPreferences']['locations'];
                Log::info("Filtering for locations: " . implode(', ', $locations));
                
                $query->whereHas('university', function ($query) use ($locations) {
                    $query->where(function($q) use ($locations) {
                        foreach ($locations as $location) {
                            $locationLower = strtolower($location);
                            Log::info("Looking for location: {$location} in university address");
                            
                            $q->orWhere('location', 'LIKE', "%{$location}%")
                              ->orWhere(DB::raw('LOWER(location)'), 'LIKE', "%{$locationLower}%");
                        }
                    });
                });
                
                $countAfterLocation = $query->count();
                Log::info("After location filter: {$countAfterLocation} programs");
                $steps['After location filter'] = $countAfterLocation;
            }

            if (isset($preferences['academicPreferences']['minRating']) && $preferences['academicPreferences']['minRating'] > 0) {
                $minRating = $preferences['academicPreferences']['minRating'];
                $query->where('rating', '>=', $minRating);
                $countAfterRating = $query->count();
                Log::info("After minimum rating filter ({$minRating}): {$countAfterRating} programs");
                $steps['After minimum rating filter'] = $countAfterRating;
            }

            if (isset($preferences['financialFactors'])) {
                if (isset($preferences['financialFactors']['stateFinanced']) && 
                    $preferences['financialFactors']['stateFinanced'] === false &&
                    isset($preferences['financialFactors']['maxYearlyCost'])) {
                    
                    $maxCost = $preferences['financialFactors']['maxYearlyCost'];
                    $query->where(function($q) use ($maxCost) {
                        $q->where('yearly_cost', '<=', $maxCost)
                          ->orWhereNull('yearly_cost')
                          ->orWhere('yearly_cost', 0);
                    });
                    
                    $countAfterCost = $query->count();
                    Log::info("After max cost filter ({$maxCost}): {$countAfterCost} programs");
                    $steps['After max cost filter'] = $countAfterCost;
                }
            }
            
            if (isset($preferences['programSize'])) {
                Log::info("Filtering for program size: {$preferences['programSize']}");
                
                
                Log::info("Program size will be used as ranking factor rather than hard filter");
                $steps['Program size as ranking factor'] = 'Enabled';
            }
            
            if (isset($preferences['studyPreferences']['difficultyLevel'])) {
                $difficultyLevel = $preferences['studyPreferences']['difficultyLevel'];
                Log::info("Filtering for difficulty level: {$difficultyLevel}");
                
                Log::info("Difficulty level will be used as ranking factor rather than hard filter");
                $steps['Difficulty level as ranking factor'] = 'Enabled';
            }

            $strictFilteredPrograms = $query->get();
            Log::info("Final strict filtered count: {$strictFilteredPrograms->count()} programs");
            $steps['Final strict filtered count'] = $strictFilteredPrograms->count();
            
            Log::info("Creating relaxed filter query to provide additional options");
            
            $relaxedQuery = Program::with(['university', 'faculty']);
            
            if (isset($preferences['academicPreferences']['degreeType'])) {
                $degreeType = $preferences['academicPreferences']['degreeType'];
                $relaxedQuery->where('magistras', $degreeType === 'magistras');
            }
            
            if (!empty($preferences['academicPreferences']['fieldOfStudy']) || 
                !empty($preferences['academicPreferences']['locations'])) {
                
                $relaxedQuery->where(function($query) use ($preferences) {
                    if (!empty($preferences['academicPreferences']['fieldOfStudy'])) {
                        $fields = $preferences['academicPreferences']['fieldOfStudy'];
                        foreach ($fields as $field) {
                            $fieldLower = strtolower($field);
                            $query->orWhere('title', 'LIKE', "%{$field}%")
                                  ->orWhere(DB::raw('LOWER(title)'), 'LIKE', "%{$fieldLower}%");
                                  
                            $query->orWhereHas('faculty', function($q) use ($field, $fieldLower) {
                                $q->where('name', 'LIKE', "%{$field}%")
                                  ->orWhere(DB::raw('LOWER(name)'), 'LIKE', "%{$fieldLower}%");
                            });
                        }
                    }
                    
                    if (!empty($preferences['academicPreferences']['locations'])) {
                        $locations = $preferences['academicPreferences']['locations'];
                        foreach ($locations as $location) {
                            $locationLower = strtolower($location);
                            $query->orWhereHas('university', function($q) use ($location, $locationLower) {
                                $q->where('location', 'LIKE', "%{$location}%")
                                  ->orWhere(DB::raw('LOWER(location)'), 'LIKE', "%{$locationLower}%");
                            });
                        }
                    }
                });
            }
            
            $strictProgramIds = $strictFilteredPrograms->pluck('id')->toArray();
            
            if (!empty($strictProgramIds)) {
                $relaxedQuery->whereNotIn('id', $strictProgramIds);
            }
            
            $relaxedFilteredPrograms = $relaxedQuery->get();
            Log::info("Relaxed filter found: {$relaxedFilteredPrograms->count()} additional programs");
            $steps['Relaxed filter additional programs'] = $relaxedFilteredPrograms->count();

            $strictResult = $strictFilteredPrograms->map(function ($program) {
                return [
                    'id' => $program->id,
                    'title' => $program->title,
                    'description' => $program->description,
                    'rating' => $program->rating,
                    'rating_count' => $program->rating_count,
                    'program_length' => $program->program_length,
                    'degree_type' => $program->magistras ? "Magistras" : "Bakalauras",
                    'student_count' => $program->student_count,
                    'yearly_cost' => $program->yearly_cost,
                    'difficulty_rating' => $program->difficulty_rating,
                    'course_content_rating' => $program->course_content_rating,
                    'practical_sessions_rating' => $program->practical_sessions_rating,
                    'professional_skills_rating' => $program->professional_skills_rating,
                    'student_community_rating' => $program->student_community_rating,
                    'university' => [
                        'id' => $program->university->id,
                        'name' => $program->university->name,
                        'location' => $program->university->location,
                        'rating' => $program->university->rating,
                        'dormitories_rating' => $program->university->dormitories_rating,
                        'facilities_rating' => $program->university->facilities_rating,
                    ],
                    'faculty' => $program->faculty ? [
                        'id' => $program->faculty->id,
                        'name' => $program->faculty->name,
                        'abbreviation' => $program->faculty->abbreviation,
                    ] : null,
                ];
            });
            
            // Transform relaxed filtered results
            $relaxedResult = $relaxedFilteredPrograms->map(function ($program) {
                return [
                    'id' => $program->id,
                    'title' => $program->title,
                    'description' => $program->description,
                    'rating' => $program->rating,
                    'rating_count' => $program->rating_count,
                    'program_length' => $program->program_length,
                    'degree_type' => $program->magistras ? "Magistras" : "Bakalauras",
                    'student_count' => $program->student_count,
                    'yearly_cost' => $program->yearly_cost,
                    'difficulty_rating' => $program->difficulty_rating,
                    'course_content_rating' => $program->course_content_rating,
                    'practical_sessions_rating' => $program->practical_sessions_rating,
                    'professional_skills_rating' => $program->professional_skills_rating,
                    'student_community_rating' => $program->student_community_rating,
                    'university' => [
                        'id' => $program->university->id,
                        'name' => $program->university->name,
                        'location' => $program->university->location,
                        'rating' => $program->university->rating,
                        'dormitories_rating' => $program->university->dormitories_rating,
                        'facilities_rating' => $program->university->facilities_rating,
                    ],
                    'faculty' => $program->faculty ? [
                        'id' => $program->faculty->id,
                        'name' => $program->faculty->name,
                        'abbreviation' => $program->faculty->abbreviation,
                    ] : null,
                ];
            });

            return response()->json([
                'strict_filtered_count' => $strictResult->count(),
                'relaxed_filtered_count' => $relaxedResult->count(),
                'filtering_steps' => $steps,
                'strict_programs' => $strictResult,
                'relaxed_programs' => $relaxedResult
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error filtering programs: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            return response()->json([
                'error' => 'Failed to filter programs: ' . $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ], 500);
        }
    }
    
    /**
     * Get word stem variations for a field name
     * This helps with Lithuanian word endings
     */
    private function getFieldStems($field)
    {
        $stems = [];
        $field = strtolower($field);
        
        $fieldMap = [
            'matematika' => ['matematikos', 'matematikai', 'matematiką', 'matematikų', 'matematik'],
            'informatika' => ['informatikos', 'informatikai', 'informatiką', 'informatik'],
            'fizika' => ['fizikos', 'fizikai', 'fiziką', 'fizik'],
            'ekonomika' => ['ekonomikos', 'ekonomikai', 'ekonomiką', 'ekonomik'],
            'verslas' => ['verslo', 'verslui', 'verslą', 'versl'],
            'psichologija' => ['psichologijos', 'psichologijai', 'psichologiją', 'psicholog'],
            'teisė' => ['teisės', 'teisei', 'teisę', 'teis'],
            'inžinerija' => ['inžinerijos', 'inžinerijai', 'inžineriją', 'inžinerij'],
            'medicina' => ['medicinos', 'medicinai', 'mediciną', 'medicin'],
        ];
        
        foreach ($fieldMap as $baseWord => $variations) {
            if ($field === $baseWord || in_array($field, $variations)) {
                $stems[] = $baseWord;
                foreach ($variations as $variation) {
                    if ($variation !== $field) {
                        $stems[] = $variation;
                    }
                }
                break;
            }
        }
        
        if (empty($stems) && strlen($field) > 3) {
            $stems[] = substr($field, 0, strlen($field) - 1);
            if (strlen($field) > 4) {
                $stems[] = substr($field, 0, strlen($field) - 2);
            }
        }
        
        return $stems;
    }
    
    /**
     * Get AI-powered program recommendations
     */
    public function getAIRecommendations(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'academicPreferences.degreeType' => 'nullable|string|in:bakalauras,magistras',
                'academicPreferences.fieldOfStudy' => 'nullable|array',
                'academicPreferences.locations' => 'nullable|array',
                'academicPreferences.minRating' => 'nullable|numeric|min:0|max:5',
                'financialFactors.stateFinanced' => 'nullable|boolean',
                'financialFactors.maxYearlyCost' => 'nullable|numeric|min:0',
                'programSize' => 'nullable|string|in:small,medium,large',
                'studyPreferences.difficultyLevel' => 'nullable|string|in:easy,moderate,challenging',
                'studyPreferences.practicalOrientation' => 'nullable|boolean',
                'interests' => 'nullable|string|max:500',
                'extracurricularActivities' => 'nullable|string|max:500',
                'careerGoals' => 'nullable|array',
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }

            $preferences = $request->all();
            
            // First, use the existing filter logic to get relevant programs
            $query = Program::with(['university', 'faculty']);
            
            // Apply basic filters
            if (isset($preferences['academicPreferences']['degreeType'])) {
                $degreeType = $preferences['academicPreferences']['degreeType'];
                $query->where('magistras', $degreeType === 'magistras');
            }
            
            // Get filtered programs
            $filteredPrograms = $query->limit(15)->get();
            
            // Transform programs for AI input
            $programsData = $filteredPrograms->map(function ($program) {
                return [
                    'id' => $program->id,
                    'title' => $program->title,
                    'description' => $program->description,
                    'rating' => $program->rating,
                    'degree_type' => $program->magistras ? "Magistras" : "Bakalauras",
                    'student_count' => $program->student_count,
                    'yearly_cost' => $program->yearly_cost,
                    'difficulty_rating' => $program->difficulty_rating,
                    'practical_sessions_rating' => $program->practical_sessions_rating,
                    'university' => [
                        'id' => $program->university->id,
                        'name' => $program->university->name,
                        'location' => $program->university->location,
                        'rating' => $program->university->rating,
                    ],
                    'faculty' => $program->faculty ? [
                        'id' => $program->faculty->id,
                        'name' => $program->faculty->name,
                    ] : null,
                ];
            })->toArray();
            
            // Get AI recommendations
            $aiRecommendations = $this->openAIService->getRecommendations($preferences, $programsData);
            
            // Process AI recommendations to match with programs
            $strictProgramIds = [];
            $relaxedProgramIds = [];
            
            if (is_array($aiRecommendations)) {
                // Extract program IDs from AI recommendations
                if (isset($aiRecommendations['strict_programs']) && is_array($aiRecommendations['strict_programs'])) {
                    foreach ($aiRecommendations['strict_programs'] as $recommendation) {
                        if (isset($recommendation['program_id'])) {
                            $strictProgramIds[] = $recommendation['program_id'];
                        }
                    }
                }
                
                if (isset($aiRecommendations['relaxed_programs']) && is_array($aiRecommendations['relaxed_programs'])) {
                    foreach ($aiRecommendations['relaxed_programs'] as $recommendation) {
                        if (isset($recommendation['program_id'])) {
                            $relaxedProgramIds[] = $recommendation['program_id'];
                        }
                    }
                }
            }
            
            $strictPrograms = $programsData;
            $relaxedPrograms = [];
            
            if (!empty($strictProgramIds) || !empty($relaxedProgramIds)) {
                $strictPrograms = array_filter($programsData, function($program) use ($strictProgramIds) {
                    return in_array($program['id'], $strictProgramIds);
                });
                
                $relaxedPrograms = array_filter($programsData, function($program) use ($relaxedProgramIds, $strictProgramIds) {
                    return in_array($program['id'], $relaxedProgramIds) && !in_array($program['id'], $strictProgramIds);
                });
                
                $strictPrograms = array_values($strictPrograms);
                $relaxedPrograms = array_values($relaxedPrograms);
            }

            if (is_array($aiRecommendations)) {
                if (isset($aiRecommendations['strict_programs']) && is_array($aiRecommendations['strict_programs'])) {
                    $explanationsMap = [];
                    foreach ($aiRecommendations['strict_programs'] as $recommendation) {
                        if (isset($recommendation['program_id'])) {
                            $explanationsMap[$recommendation['program_id']] = [
                                'explanation' => $recommendation['explanation'] ?? null,
                                'strengths' => $recommendation['strengths'] ?? [],
                                'weaknesses' => $recommendation['weaknesses'] ?? [],
                                'match_percentage' => $recommendation['match_percentage'] ?? 0
                            ];
                        }
                    }
                    
                    foreach ($strictPrograms as &$program) {
                        if (isset($explanationsMap[$program['id']])) {
                            $program['ai_explanation'] = $explanationsMap[$program['id']];
                        }
                    }
                }
                
                if (isset($aiRecommendations['relaxed_programs']) && is_array($aiRecommendations['relaxed_programs'])) {
                    $explanationsMap = [];
                    foreach ($aiRecommendations['relaxed_programs'] as $recommendation) {
                        if (isset($recommendation['program_id'])) {
                            $explanationsMap[$recommendation['program_id']] = [
                                'explanation' => $recommendation['explanation'] ?? null,
                                'strengths' => $recommendation['strengths'] ?? [],
                                'weaknesses' => $recommendation['weaknesses'] ?? [],
                                'match_percentage' => $recommendation['match_percentage'] ?? 0
                            ];
                        }
                    }
                    
                    foreach ($relaxedPrograms as &$program) {
                        if (isset($explanationsMap[$program['id']])) {
                            $program['ai_explanation'] = $explanationsMap[$program['id']];
                        }
                    }
                }
            }

            return response()->json([
                'strict_programs' => $strictPrograms,
                'relaxed_programs' => $relaxedPrograms,
                'programs_analyzed' => count($programsData)
            ], 200);

        } catch (\Exception $e) {
            Log::error('Error getting AI recommendations: ' . $e->getMessage());
            Log::error($e->getTraceAsString());
            return response()->json([
                'error' => 'Failed to get recommendations: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Analyze program's practical vs theoretical orientation
     */
    public function analyzeProgramOrientation($programId)
    {
        try {
            $program = Program::with('university')->findOrFail($programId);
            
            // Get program reviews for context
            $reviews = ProgramReview::where('program_id', $programId)
                                    ->orderBy('created_at', 'desc')
                                    ->limit(5)
                                    ->get(['content'])
                                    ->toArray();
            
            $programData = [
                'title' => $program->title,
                'description' => $program->description,
            ];
            
            $analysis = $this->openAIService->analyzeProgramOrientation($programData, $reviews);
            
            return response()->json([
                'program_id' => $programId,
                'program_title' => $program->title,
                'orientation_analysis' => $analysis
            ], 200);
            
        } catch (\Exception $e) {
            Log::error('Error analyzing program orientation: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to analyze program: ' . $e->getMessage()
            ], 500);
        }
    }
    
    /**
     * Analyze extracurricular activities relevance
     */
    public function analyzeActivitiesRelevance(Request $request)
    {
        try {
            $validator = Validator::make($request->all(), [
                'interests' => 'required|string|max:500',
                'university_id' => 'required|integer|exists:universities,id'
            ]);

            if ($validator->fails()) {
                return response()->json(['errors' => $validator->errors()], 422);
            }
            
            // This is a mockup for demonstration
            // In a real implementation, you would fetch activities from your database
            $activities = [
                ['name' => 'Studentų mokslinė draugija', 'description' => 'Mokslinių tyrimų ir projektų vykdymas studentams'],
                ['name' => 'IT klubas', 'description' => 'Programavimo, tinklų ir sistemų administravimo praktika'],
                ['name' => 'Sporto klubas', 'description' => 'Įvairios sporto sekcijos ir komandos'],
                ['name' => 'Debatų klubas', 'description' => 'Kritinio mąstymo ir viešojo kalbėjimo įgūdžių ugdymas'],
                ['name' => 'Meno kolektyvas', 'description' => 'Dainų, šokių ir teatro veikla']
            ];
            
            $analysis = $this->openAIService->analyzeActivitiesRelevance(
                $request->interests,
                $activities
            );
            
            return response()->json([
                'activities_analysis' => $analysis,
                'activities_count' => count($activities)
            ], 200);
            
        } catch (\Exception $e) {
            Log::error('Error analyzing activities: ' . $e->getMessage());
            return response()->json([
                'error' => 'Failed to analyze activities: ' . $e->getMessage()
            ], 500);
        }
    }
}
