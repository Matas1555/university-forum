<?php

namespace App\Services;

use OpenAI;
use Illuminate\Support\Facades\Log;

class OpenAIService
{
    protected $client;
    protected $model;
    
    public function __construct()
    {
        $this->client = OpenAI::client(config('services.openai.api_key'));
        $this->model = config('services.openai.model');
    }
    
    /**
     * Get recommendations based on user interests and program data
     */
    public function getRecommendations($userPreferences, $programsData, $programForumData = [])
    {
        try {
            $prompt = $this->buildRecommendationPrompt($userPreferences, $programsData, $programForumData);
            
            $response = $this->client->chat()->create([
                'model' => $this->model,
                'messages' => [
                    ['role' => 'system', 'content' => 'You are a university recommendation assistant for Lithuanian students. Your task is to analyze program data, reviews, forum discussions and match it with student preferences to provide personalized university and program recommendations.'],
                    ['role' => 'user', 'content' => $prompt]
                ],
                'temperature' => 0.7,
                'max_tokens' => 1500,
            ]);
            
            return $response->choices[0]->message->content;
        } catch (\Exception $e) {
            Log::error('OpenAI API error: ' . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Analyze program's practical vs theoretical orientation
     */
    public function analyzeProgramOrientation($programData, $reviews = [], $forumPosts = [])
    {
        try {
            $prompt = "Analyze this university program and determine its practical vs theoretical orientation on a scale of 1-10 (1 being purely theoretical, 10 being purely practical).\n\n";
            $prompt .= "Program title: " . $programData['title'] . "\n";
            $prompt .= "Program description: " . $programData['description'] . "\n\n";
            
            if (!empty($reviews)) {
                $prompt .= "Student reviews:\n";
                foreach ($reviews as $review) {
                    $prompt .= "- " . $review['content'] . "\n";
                }
                $prompt .= "\n";
            }
            
            if (!empty($forumPosts)) {
                $prompt .= "Forum discussions about this program:\n";
                foreach ($forumPosts as $post) {
                    $prompt .= "- Post: " . $post['content'] . "\n";
                    if (!empty($post['comments'])) {
                        foreach ($post['comments'] as $comment) {
                            $prompt .= "  * Comment: " . $comment['content'] . "\n";
                        }
                    }
                    $prompt .= "\n";
                }
            }
            
            $prompt .= "Please provide the practical vs theoretical rating (1-10) and a brief explanation.";
            
            $response = $this->client->chat()->create([
                'model' => $this->model,
                'messages' => [
                    ['role' => 'system', 'content' => 'You are an educational analyst specializing in university programs.'],
                    ['role' => 'user', 'content' => $prompt]
                ],
                'temperature' => 0.3,
                'max_tokens' => 500,
            ]);
            
            return $response->choices[0]->message->content;
        } catch (\Exception $e) {
            Log::error('OpenAI API error: ' . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Analyze extracurricular activities for relevance to user interests
     */
    public function analyzeActivitiesRelevance($userInterests, $universityClubs, $clubForumData = [])
    {
        try {
            $prompt = "A student has the following interests: " . $userInterests . "\n\n";
            $prompt .= "Here are the university clubs and extracurricular activities available:\n";
            
            foreach ($universityClubs as $club) {
                $prompt .= "- " . $club['title'] . " at " . $club['university']['name'] . "\n";
                $prompt .= "  Description: " . $club['description'] . "\n";
                
                if (!empty($club['website_url'])) {
                    $prompt .= "  Website: " . $club['website_url'] . "\n";
                }
                
                // Add forum discussions about this club if available
                if (!empty($clubForumData[$club['id']])) {
                    $prompt .= "  Club forum discussions and reviews:\n";
                    foreach ($clubForumData[$club['id']] as $post) {
                        $prompt .= "    * " . substr($post['content'], 0, 150) . "...\n";
                        
                        // Include relevant comments if available
                        if (!empty($post['comments']) && count($post['comments']) > 0) {
                            $relevantComments = array_slice($post['comments'], 0, 3);
                            foreach ($relevantComments as $comment) {
                                $prompt .= "      - " . substr($comment['content'], 0, 100) . "...\n";
                            }
                        }
                    }
                }
                $prompt .= "\n";
            }
            
            $prompt .= "Based on the student's interests, analyze which university clubs would be most relevant and beneficial. Consider both direct interest matches and complementary activities that might enhance their university experience.\n\n";
            $prompt .= "Identify the top 5 clubs most relevant to the student's interests and explain why each would be a good match. Rank them from most to least relevant, and provide a paragraph explaining the benefits of each club for this specific student.";
            
            $response = $this->client->chat()->create([
                'model' => $this->model,
                'messages' => [
                    ['role' => 'system', 'content' => 'You are a student advisor helping match students with relevant university clubs and extracurricular activities. Your goal is to find the best activities that align with their interests and would enhance their university experience.'],
                    ['role' => 'user', 'content' => $prompt]
                ],
                'temperature' => 0.5,
                'max_tokens' => 1000,
            ]);
            
            return $response->choices[0]->message->content;
        } catch (\Exception $e) {
            Log::error('OpenAI API error: ' . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Analyze forum content for a specific program or university
     */
    public function analyzeForumContent($entityId, $entityType, $forumData)
    {
        try {
            $prompt = "Analyze the following forum discussions about " . 
                      ($entityType === 'program' ? "a university program" : "a university") . ":\n\n";
            
            foreach ($forumData as $post) {
                $prompt .= "Post title: " . $post['title'] . "\n";
                $prompt .= "Post content: " . $post['content'] . "\n";
                
                if (!empty($post['comments'])) {
                    $prompt .= "Comments:\n";
                    foreach ($post['comments'] as $comment) {
                        $prompt .= "- " . $comment['content'] . "\n";
                    }
                }
                $prompt .= "\n";
            }
            
            $prompt .= "Please extract the following information:\n";
            $prompt .= "1. Overall sentiment (positive, neutral, negative)\n";
            $prompt .= "2. Common themes or topics discussed\n";
            $prompt .= "3. Practical vs theoretical orientation mentions\n";
            $prompt .= "4. Student satisfaction level\n";
            $prompt .= "5. Any mentioned strengths and weaknesses\n";
            $prompt .= "6. Career prospects mentioned\n";
            
            $response = $this->client->chat()->create([
                'model' => $this->model,
                'messages' => [
                    ['role' => 'system', 'content' => 'You are an educational content analyst specializing in extracting insights from student discussions.'],
                    ['role' => 'user', 'content' => $prompt]
                ],
                'temperature' => 0.3,
                'max_tokens' => 1000,
            ]);
            
            return $response->choices[0]->message->content;
        } catch (\Exception $e) {
            Log::error('OpenAI API error: ' . $e->getMessage());
            return null;
        }
    }
    
    /**
     * Build detailed prompt for program recommendations
     */
    private function buildRecommendationPrompt($userPreferences, $programsData, $programForumData = [])
    {
        $prompt = "User preferences:\n";
        
        // Academic preferences
        if (isset($userPreferences['academicPreferences'])) {
            $academic = $userPreferences['academicPreferences'];
            $prompt .= "- Degree type: " . ($academic['degreeType'] ?? 'Any') . "\n";
            
            if (!empty($academic['fieldOfStudy'])) {
                $prompt .= "- Fields of study: " . implode(', ', $academic['fieldOfStudy']) . "\n";
            }
            
            if (!empty($academic['locations'])) {
                $prompt .= "- Preferred locations: " . implode(', ', $academic['locations']) . "\n";
            }
            
            if (isset($academic['minRating'])) {
                $prompt .= "- Minimum rating: " . $academic['minRating'] . "\n";
            }
        }
        
        // Financial factors
        if (isset($userPreferences['financialFactors'])) {
            $financial = $userPreferences['financialFactors'];
            $prompt .= "- Requires state financing: " . ($financial['stateFinanced'] ? 'Yes' : 'No') . "\n";
            
            if (isset($financial['maxYearlyCost'])) {
                $prompt .= "- Maximum yearly cost: " . $financial['maxYearlyCost'] . " EUR\n";
            }
        }
        
        // Program size
        if (isset($userPreferences['programSize'])) {
            $prompt .= "- Preferred program size: " . $userPreferences['programSize'] . "\n";
        }
        
        // Study preferences
        if (isset($userPreferences['studyPreferences'])) {
            $study = $userPreferences['studyPreferences'];
            
            if (isset($study['difficultyLevel'])) {
                $prompt .= "- Preferred difficulty level: " . $study['difficultyLevel'] . "\n";
            }
            
            if (isset($study['practicalOrientation'])) {
                $prompt .= "- Practical orientation importance: " . $study['practicalOrientation'] . "\n";
            }
        }
        
        // User interests (free text)
        if (isset($userPreferences['interests'])) {
            $prompt .= "- User interests: " . $userPreferences['interests'] . "\n";
        }
        
        // Program data
        $prompt .= "\nAvailable programs:\n";
        foreach ($programsData as $index => $program) {
            $prompt .= ($index + 1) . ". " . $program['title'] . " at " . $program['university']['name'] . "\n";
            $prompt .= "   - Description: " . $program['description'] . "\n";
            $prompt .= "   - Degree type: " . $program['degree_type'] . "\n";
            $prompt .= "   - Rating: " . $program['rating'] . "/5\n";
            $prompt .= "   - Location: " . $program['university']['location'] . "\n";
            $prompt .= "   - Yearly cost: " . ($program['yearly_cost'] ? $program['yearly_cost'] . " EUR" : "Not specified") . "\n";
            $prompt .= "   - Student count: " . ($program['student_count'] ?? "Not specified") . "\n";
            
            if (isset($program['practical_sessions_rating'])) {
                $prompt .= "   - Practical sessions rating: " . $program['practical_sessions_rating'] . "/5\n";
            }
            
            if (isset($program['difficulty_rating'])) {
                $prompt .= "   - Difficulty rating: " . $program['difficulty_rating'] . "/5\n";
            }
            
            // Add reviews if available
            if (!empty($program['reviews'])) {
                $prompt .= "   - Student reviews:\n";
                foreach ($program['reviews'] as $review) {
                    $prompt .= "     * " . substr($review['content'], 0, 200) . "...\n";
                }
            }
            
            // Add forum discussions if available
            if (!empty($programForumData[$program['id']])) {
                $prompt .= "   - Forum discussions:\n";
                foreach ($programForumData[$program['id']] as $post) {
                    $prompt .= "     * Post: " . substr($post['content'], 0, 150) . "...\n";
                    
                    // Include most relevant comments
                    if (!empty($post['comments']) && count($post['comments']) > 0) {
                        $relevantComments = array_slice($post['comments'], 0, 2);
                        foreach ($relevantComments as $comment) {
                            $prompt .= "       - Comment: " . substr($comment['content'], 0, 100) . "...\n";
                        }
                    }
                }
            }
            
            $prompt .= "\n";
        }
        
        $prompt .= "Please recommend the top 3 programs for this student based on the provided preferences and all available information (program details, reviews, and forum discussions). For each recommendation, explain why it's a good match and any potential drawbacks. Provide the recommendations in Lithuanian language.";
        
        return $prompt;
    }
} 