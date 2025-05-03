<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Forum;
use App\Models\Comment;
use Illuminate\Http\Request;
use App\Models\Post;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Models\University;
use App\Models\Faculty;
use App\Models\Program;
use App\Models\PostInteraction;
use App\Models\CommentInteraction;
use App\Http\Controllers\Controller;
use App\Models\User;

/**
 * @OA\Info(title="Post API", version="0.1")
 */
class PostController extends Controller
{
    use AuthorizesRequests;

    //Sarasas
    /**
     * @OA\Get(
     *     path="/forums/{forum_id}/posts",
     *     summary="Retrieve all posts from a forum",
     *     description="Fetches all posts in the specified forum, along with their comments and categories.",
     *     operationId="getPostsByForum",
     *     tags={"Forums", "Posts"},
     *     @OA\Parameter(
     *         name="forum_id",
     *         in="path",
     *         description="ID of the forum",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Posts retrieved successfully",
     *         @OA\JsonContent(
     *             type="object",
     *             @OA\Property(property="forum_name", type="string", description="Name of the forum"),
     *             @OA\Property(
     *                 property="posts",
     *                 type="array",
     *                 @OA\Items(
     *                     type="object",
     *                     @OA\Property(property="id", type="integer", description="ID of the post"),
     *                     @OA\Property(property="title", type="string", description="Title of the post"),
     *                     @OA\Property(property="description", type="string", description="Description of the post"),
     *                     @OA\Property(property="user", type="integer", description="ID of the user who created the post"),
     *                     @OA\Property(
     *                         property="comments",
     *                         type="array",
     *                         @OA\Items(ref="#/components/schemas/Comment")
     *                     ),
     *                     @OA\Property(
     *                         property="categories",
     *                         type="array",
     *                         @OA\Items(
     *                             type="object",
     *                             @OA\Property(property="id", type="integer", description="ID of the category"),
     *                             @OA\Property(property="name", type="string", description="Name of the category"),
     *                             @OA\Property(property="color", type="string", description="Color of the category")
     *                         )
     *                     )
     *                 )
     *             )
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Forum not found"
     *     )
     * )
     */
    public function getPostsByForum($forum_id)
    {
        $forum = Forum::find($forum_id);

        if (!$forum) {
            return response()->json(['message' => 'Forum not found'], 404);
        }

        $userId = auth('api')->id();

        $posts = Post::where('forum_id', $forum_id)
            ->with(['user', 'user.status', 'categories'])
            ->withCount('comments')
            ->get()
            ->map(function ($post) use ($userId) {
                // Get the user's interaction with this post
                $userInteraction = null;
                if ($userId) {
                    $interaction = PostInteraction::where('user_id', $userId)
                        ->where('post_id', $post->id)
                        ->first();
                    if ($interaction) {
                        $userInteraction = $interaction->type;
                    }
                }

                return [
                'id' => $post->id,
                'title' => $post->title,
                'description' => $post->description,
                    'user' => $post->user->username,
                    'user_avatar' => $post->user->avatar,
                'user_id' => $post->user_id,
                    'user_status' => [
                        'id' => $post->user->status_id,
                        'name' => $post->user->status ? $post->user->status->name : null
                    ],
                    'categories' => $post->categories->map(function ($category) {
                        return [
                            'id' => $category->id,
                            'name' => $category->name,
                            'color' => $category->color,
                        ];
                    }),
                'likes' => $post->likes,
                'dislikes' => $post->dislikes,
                    'views' => $post->views,
                    'user_interaction' => $userInteraction,
                    'comments_count' => $post->comments_count,
                'created_at' => $post->created_at->format('Y-m-d'),
            ];
            });

        return response()->json([
            'forum_name' => $forum->title,
            'forum_entity_type' => $forum->entity_type,
            'forum_entity_id' => $forum->entity_id,
            'posts' => $posts,
        ], 200);
    }

    public function like(Request $request, $postId)
    {
        try {
            $userId = auth('api')->id();
            
            if (!$postId || !$userId) {
                return response()->json(['error' => 'Post ID and user authentication required'], 400);
            }
            
            $post = Post::with('user')->findOrFail($postId);
            
            $existingInteraction = PostInteraction::where('user_id', $userId)
                ->where('post_id', $postId)
                ->first();
            
            if (!$existingInteraction) {
                $interaction = new PostInteraction();
                $interaction->user_id = $userId;
                $interaction->post_id = $postId;
                $interaction->type = 'like';
                $interaction->created_at = now();
                $interaction->updated_at = now();
                $interaction->save();

                $post->likes += 1;
                $post->save();
                
                if ($post->user && $post->user->id != $userId) {
                    $post->user->reputation += 1;
                    $post->user->save();
                }
                
                return response()->json(['message' => 'Post liked successfully', 'likes' => $post->likes]);
            } else if ($existingInteraction->type === 'dislike') {
                $existingInteraction->type = 'like';
                $existingInteraction->updated_at = now();
                $existingInteraction->save();

                $post->likes += 1;
                $post->dislikes -= 1;
                $post->save();
                
                if ($post->user && $post->user->id != $userId) {
                    $post->user->reputation += 2;
                    $post->user->save();
                }
                
                return response()->json([
                    'message' => 'Interaction changed from dislike to like', 
                    'likes' => $post->likes,
                    'dislikes' => $post->dislikes
                ]);
            } else {
                $existingInteraction->delete();

                $post->likes -= 1;
                $post->save();

                if ($post->user && $post->user->id != $userId) {
                    $post->user->reputation -= 1;
                    $post->user->save();
                }
                
                return response()->json(['message' => 'Post unliked successfully', 'likes' => $post->likes]);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to process like: ' . $e->getMessage()], 500);
        }
    }

    public function dislike(Request $request, $postId)
    {
        try {
            $userId = auth('api')->id();

            if (!$postId || !$userId) {
                return response()->json(['error' => 'Post ID and user authentication required'], 400);
            }

            $post = Post::with('user')->findOrFail($postId);

            $existingInteraction = PostInteraction::where('user_id', $userId)
                ->where('post_id', $postId)
                ->first();

            if (!$existingInteraction) {
                $interaction = new PostInteraction();
                $interaction->user_id = $userId;
                $interaction->post_id = $postId;
                $interaction->type = 'dislike';
                $interaction->created_at = now();
                $interaction->updated_at = now();
                $interaction->save();

                $post->dislikes += 1;
                $post->save();

                if ($post->user && $post->user->id != $userId) {
                    $post->user->reputation += 1;
                    $post->user->save();
                }

                return response()->json(['message' => 'Post disliked successfully', 'dislikes' => $post->dislikes]);
            } else if ($existingInteraction->type === 'like') {
                $existingInteraction->type = 'dislike';
                $existingInteraction->updated_at = now();
                $existingInteraction->save();

                $post->likes -= 1;
                $post->dislikes += 1;
                $post->save();

                if ($post->user && $post->user->id != $userId) {
                    $post->user->reputation -= 2;
                    $post->user->save();
                }

                return response()->json([
                    'message' => 'Interaction changed from like to dislike',
                    'likes' => $post->likes,
                    'dislikes' => $post->dislikes
                ]);
            } else {
                $existingInteraction->delete();

                $post->dislikes -= 1;
                $post->save();

                if ($post->user && $post->user->id != $userId) {
                    $post->user->reputation -= 1;
                    $post->user->save();
                }

                return response()->json(['message' => 'Post undisliked successfully', 'dislikes' => $post->dislikes]);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to process dislike: ' . $e->getMessage()], 500);
        }
    }


    //----------------------------------------POST CRUD-----------------------------------------------------
    /**
     * @OA\Get(
     *     path="/posts",
     *     summary="Retrieve list of posts",
     *     description="Fetch all posts from the database",
     *     operationId="getPosts",
     *     tags={"Posts"},
     *     @OA\Response(
     *         response=200,
     *         description="List of posts",
     *         @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/Post"))
     *     )
     *     @OA\Response(
     *         response=404,
     *         description="Posts not found"
     *     )
     * )
     */
    public function getPosts(Request $request)
    {
        $query = Post::query();
        $userId = auth('api')->id();

        if ($request->has('forum_id')) {
            $query->where('forum_id', $request->input('forum_id'));
        }

        if ($request->has('user_id')) {
            $query->where('user_id', $request->input('user_id'));
        }

        // Add sorting options
        if ($request->has('sort_by')) {
            $sortBy = $request->input('sort_by');
            $sortOrder = $request->input('sort_order', 'desc');

            switch ($sortBy) {
                case 'date':
                case 'created_at':
                    $query->orderBy('created_at', $sortOrder);
                    break;
                case 'likes':
                    $query->orderBy('likes', $sortOrder);
                    break;
                case 'comments':
                    $query->withCount('comments')->orderBy('comments_count', $sortOrder);
                    break;
                default:
                    $query->orderBy('created_at', 'desc');
                    break;
            }
        } else {
            // Default sorting by most recent
            $query->orderBy('created_at', 'desc');
        }

        // Apply limit if specified
        if ($request->has('limit')) {
            $query->limit($request->input('limit'));
        }

        // Eager load relationships and count comments
        $posts = $query->with(['user', 'user.status', 'forum', 'categories'])
            ->withCount('comments')
            ->get();

        $postData = $posts->map(function ($post) use ($userId) {
            // Get the user's interaction with this post
            $userInteraction = null;
            if ($userId) {
                $interaction = PostInteraction::where('user_id', $userId)
                    ->where('post_id', $post->id)
                    ->first();
                if ($interaction) {
                    $userInteraction = $interaction->type;
                }
            }

            // Build forum_info based on forum entity_type
            $forumInfo = null;
            if ($post->forum) {
                $forumInfo = [
                    'entity_type' => $post->forum->entity_type,
                    'entity_id' => $post->forum->entity_id,
                ];

                // Add additional info based on entity type
                if ($post->forum->entity_type === 'faculty') {
                    $faculty = Faculty::find($post->forum->entity_id);
                    if ($faculty) {
                        $forumInfo['university_id'] = $faculty->university_id;
                    }
                } elseif ($post->forum->entity_type === 'program') {
                    $program = Program::find($post->forum->entity_id);
                    if ($program) {
                        $faculty = Faculty::find($program->faculty_id);
                        if ($faculty) {
                            $forumInfo['faculty_id'] = $program->faculty_id;
                            $forumInfo['university_id'] = $faculty->university_id;
                        }
                    }
                }
            }

            return [
                'id' => $post->id,
                'title' => $post->title,
                'description' => $post->description,
                'user' => $post->user->username,
                'user_avatar' => $post->user->avatar,
                'user_id' => $post->user_id,
                'user_status' => [
                    'id' => $post->user->status_id,
                    'name' => $post->user->status ? $post->user->status->name : null
                ],
                'forum' => $post->forum->title,
                'forumType' => $post->forum->entity_type,
                'forum_id' => $post->forum_id,
                'forum_info' => $forumInfo,
                'likes' => $post->likes,
                'dislikes' => $post->dislikes,
                'views' => $post->views,
                'user_interaction' => $userInteraction,
                'categories' => $post->categories->map(function ($category) {
                    return [
                        'id' => $category->id,
                        'name' => $category->name,
                        'color' => $category->color,
                    ];
                }),
                'comments_count' => $post->comments_count,
                'created_at' => $post->created_at->format('Y-m-d'),
            ];
        });

        return response()->json($postData, 200);
    }

    public function getPostsExtended(Request $request)
    {
        $query = Post::query();

        if ($request->has('forum_id')) {
            $query->where('forum_id', $request->input('forum_id'));
        }

        // Eager load relationships and count comments
        $posts = $query->with(['user', 'user.status', 'forum', 'categories'])->withCount('comments')->get();

        $postData = $posts->map(function ($post) {
            return [
                'id' => $post->id,
                'title' => $post->title,
                'description' => $post->description,
                'user' => $post->user->username, // Fetch username
                'user_avatar' => $post->user->avatar,
                'user_id' => $post->user_id,
                'user_status' => [
                    'id' => $post->user->status_id,
                    'name' => $post->user->status ? $post->user->status->name : null
                ],
                'forum' => $post->forum->title,
                'forum_id' => $post->forum_id,
                'categories' => $post->categories->map(function ($category) {
                    return [
                        'id' => $category->id,
                        'name' => $category->name,
                        'color' => $category->color,
                    ];
                }),
                'comments_count' => $post->comments_count,
                'created_at' => $post->created_at->format('Y-m-d'),
            ];
        });

        return response()->json($postData, 200);
    }


    /**
     * @OA\Post(
     *     path="/posts",
     *     summary="Create a new post",
     *     description="Create a new post with title, description, forum, and university information.",
     *     operationId="insertPost",
     *     tags={"Posts"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"title", "description", "forum_id", "university_id"},
     *             @OA\Property(property="title", type="string", example="Post title"),
     *             @OA\Property(property="description", type="string", example="Post description"),
     *             @OA\Property(property="forum_id", type="integer", example=1),
     *             @OA\Property(property="university_id", type="integer", example=1)
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Post created successfully"
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Invalid input"
     *     )
     * )
     */
    public function insertPost(Request $request)
    {
        $this->authorize('create', Post::class);

        try {
            $user = auth('api')->user();
            $validatedData = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'forum_id' => 'required|integer|exists:forums,id',
                'categories' => 'nullable|array',
            ]);

            $post = Post::create([
                'title' => $validatedData['title'],
                'description' => $validatedData['description'],
                'forum_id' => $validatedData['forum_id'],
                'user_id' => $user->id,
            ]);


            $forum = Forum::findOrFail($validatedData['forum_id']);
            
            // Handle categories if provided
            if (isset($validatedData['categories']) && !empty($validatedData['categories'])) {
                foreach ($validatedData['categories'] as $categoryName) {
                    // Determine color based on category
                    $color = 'lght-blue'; // default color
                    switch ($categoryName) {
                        case 'Kursų apžvalgos':
                            $color = 'red';
                            break;
                        case 'Socialinis gyvenimas ir renginiai':
                            $color = 'orange';
                            break;
                        case 'Studijų medžiaga':
                            $color = 'green';
                            break;
                        case 'Būstas ir apgyvendinimas':
                            $color = 'purple';
                            break;
                        case 'Praktikos ir karjeros galimybės':
                            $color = 'lght-blue';
                            break;
                        case 'Universiteto politika ir administracija':
                            $color = 'red';
                            break;
                    }
                    
                    $category = Category::firstOrCreate(
                        ['name' => $categoryName],
                        [
                            'color' => $color,
                            'created_at' => now(),
                            'updated_at' => now()
                        ]
                    );
                    
                    // Use the post_categories table through the relationship
                    $post->categories()->attach($category->id);
                }
            }

            // Prepare forum navigation info
            $forumInfo = [
                'id' => $forum->id,
                'title' => $forum->title,
                'entity_type' => $forum->entity_type,
                'entity_id' => $forum->entity_id,
            ];
            
            // Add specific entity information based on type
            if ($forum->entity_type === 'university') {
                $university = University::find($forum->entity_id);
                $forumInfo['university_name'] = $university ? $university->name : null;
                $forumInfo['navigation_path'] = "/forumai/universitetai/{$forum->entity_id}/irasai";
            } 
            elseif ($forum->entity_type === 'faculty') {
                $faculty = Faculty::find($forum->entity_id);
                if ($faculty) {
                    $forumInfo['faculty_name'] = $faculty->name;
                    $forumInfo['university_id'] = $faculty->university_id;
                    $university = University::find($faculty->university_id);
                    $forumInfo['university_name'] = $university ? $university->name : null;
                    $forumInfo['navigation_path'] = "/forumai/universitetai/{$faculty->university_id}/fakultetai/{$forum->entity_id}/irasai";
                }
            } 
            elseif ($forum->entity_type === 'program') {
                $program = Program::find($forum->entity_id);
                if ($program) {
                    $forumInfo['program_name'] = $program->title;
                    $forumInfo['faculty_id'] = $program->faculty_id;
                    $forumInfo['university_id'] = $program->university_id;
                    $faculty = Faculty::find($program->faculty_id);
                    $university = University::find($program->university_id);
                    $forumInfo['faculty_name'] = $faculty ? $faculty->name : null;
                    $forumInfo['university_name'] = $university ? $university->name : null;
                    $forumInfo['navigation_path'] = "/forumai/universitetai/{$program->university_id}/fakultetai/{$program->faculty_id}/programos/{$forum->entity_id}/irasai";
                }
            }

            $post->load('categories');
            
            $forum->post_count = ($forum->post_count ?? 0) + 1;
            $forum->save();

            return response()->json([
                'message' => 'Post created successfully', 
                'post' => $post,
                'forum' => $forumInfo
            ], 201);
        } catch(\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        } catch(\Exception $e) {
            return response()->json(['errors' => ['general' => $e->getMessage()]], 500);
        }
    }


    /**
     * @OA\Get(
     *     path="/posts/{id}",
     *     summary="Retrieve a specific post",
     *     description="Fetch a post by its ID.",
     *     operationId="showPost",
     *     tags={"Posts"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of the post to retrieve",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Post details",
     *         @OA\JsonContent(ref="#/components/schemas/Post")
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Post not found"
     *     )
     * )
     */
    public function showPost($id)
    {
        $userId = auth('api')->id();
        $post = Post::with([
                'user',
                'user.status',
                'forum',
                'categories',
                'comments' => function($query) {
                    $query->whereNull('parent_id')->with('user');
                },
                'comments.replies.user',
                'comments.replies.replies.user'
            ])
            ->findOrFail($id);

        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        $userInteraction = null;
        if ($userId) {
            $interaction = PostInteraction::where('user_id', $userId)
                ->where('post_id', $post->id)
                ->first();
            if ($interaction) {
                $userInteraction = $interaction->type;
            }
        }

        $formattedComments = $post->comments->map(function ($comment) use ($userId) {
            return $this->formatComment($comment, $userId);
        });

        $forum = $post->forum;
        $forumInfo = [
            'id' => $forum->id,
            'title' => $forum->title,
            'entity_type' => $forum->entity_type,
            'entity_id' => $forum->entity_id,
        ];
        
        if ($forum->entity_type === 'university') {
            $university = University::find($forum->entity_id);
            $forumInfo['university_name'] = $university ? $university->name : null;
            $forumInfo['navigation_path'] = "/forumai/universitetai/{$forum->entity_id}/irasai";
        } 
        elseif ($forum->entity_type === 'faculty') {
            $faculty = Faculty::find($forum->entity_id);
            if ($faculty) {
                $forumInfo['faculty_name'] = $faculty->name;
                $forumInfo['university_id'] = $faculty->university_id;
                $university = University::find($faculty->university_id);
                $forumInfo['university_name'] = $university ? $university->name : null;
                $forumInfo['navigation_path'] = "/forumai/universitetai/{$faculty->university_id}/fakultetai/{$forum->entity_id}/irasai";
            }
        } 
        elseif ($forum->entity_type === 'program') {
            $program = Program::find($forum->entity_id);
            if ($program) {
                $forumInfo['program_name'] = $program->title;
                $forumInfo['faculty_id'] = $program->faculty_id;
                $forumInfo['university_id'] = $program->university_id;
                $faculty = Faculty::find($program->faculty_id);
                $university = University::find($program->university_id);
                $forumInfo['faculty_name'] = $faculty ? $faculty->name : null;
                $forumInfo['university_name'] = $university ? $university->name : null;
                $forumInfo['navigation_path'] = "/forumai/universitetai/{$program->university_id}/fakultetai/{$program->faculty_id}/programos/{$forum->entity_id}/irasai";
            }
        }

        $formattedPost = [
            'id' => $post->id,
            'title' => $post->title,
            'description' => $post->description,
            'content' => $post->description,
            'user' => $post->user->username,
            'user_avatar' => $post->user->avatar,
            'user_id' => $post->user_id,
            'user_status' => [
                'id' => $post->user->status_id,
                'name' => $post->user->status ? $post->user->status->name : null
            ],
            'forum' => $post->forum->title,
            'forum_id' => $post->forum_id,
            'forum_info' => $forumInfo,
            'likes' => $post->likes,
            'dislikes' => $post->dislikes,
            'views' => $post->views,
            'user_interaction' => $userInteraction,
            'categories' => $post->categories->map(function ($category) {
                return [
                    'id' => $category->id,
                    'name' => $category->name,
                    'color' => $category->color,
                ];
            }),
            'comments' => $formattedComments,
            'comments_count' => Comment::where('post_id', $post->id)->count(),
            'created_at' => $post->created_at->format('Y-m-d'),
        ];

        return response()->json($formattedPost, 200);
    }

    /**
     * @OA\Put(
     *     path="/posts/{id}",
     *     summary="Update a post",
     *     description="Update an existing post by its ID.",
     *     operationId="updatePost",
     *     tags={"Posts"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of the post to update",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"title", "description"},
     *             @OA\Property(property="title", type="string", example="Updated title"),
     *             @OA\Property(property="description", type="string", example="Updated description")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Post updated successfully"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Post not found"
     *     )
     * )
     */
    public function updatePost(Request $request, $id)
    {
        $post = Post::find($id);

        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        $this->authorize('update', $post);

        try{
            // Validate the request data
            $validatedData = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
            ]);

            $post->update($validatedData);
        } catch(\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }

        return response()->json(['message' => 'Post updated successfully', 'post' => $post], 200);
    }

    /**
     * @OA\Delete(
     *     path="/posts/{id}",
     *     summary="Delete a post",
     *     description="Delete a post by its ID.",
     *     operationId="destroyPost",
     *     tags={"Posts"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of the post to delete",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Post deleted successfully"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Post not found"
     *     )
     * )
     */
    public function destroyPost($id)
    {
        $post = Post::find($id);

        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        $this->authorize('delete', $post);

        $forum = null;
        if ($post->forum_id) {
            $forum = Forum::find($post->forum_id);
        }

        Comment::where('post_id', $post->id)->delete();
        $post->delete();
        
        if ($forum) {
            $forum->post_count = max(($forum->post_count ?? 0) - 1, 0);
            $forum->save();
        }

        return response()->json(['message' => 'Post deleted successfully'], 200);
    }


    //--------------------------------------FORUM CRUD-------------------------------------------------
    /**
     * @OA\Get(
     *     path="/forums",
     *     summary="Retrieve list of forums",
     *     description="Fetch all forums from the database. Can be filtered by entity_type and university_id.",
     *     operationId="getForums",
     *     tags={"Forums"},
     *     @OA\Parameter(
     *         name="entity_type",
     *         in="query",
     *         description="Filter forums by entity type (university, faculty, program)",
     *         required=false,
     *         @OA\Schema(type="string", enum={"university", "faculty", "program"})
     *     ),
     *     @OA\Parameter(
     *         name="university_id",
     *         in="query",
     *         description="Filter faculty forums by university ID",
     *         required=false,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="List of forums",
     *         @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/Forum"))
     *     )
     *     @OA\Response(
     *         response=404,
     *         description="Forums not found"
     *     )
     * )
     */
    public function getForums(Request $request)
    {
        $query = Forum::query();

        // Filter by entity_type if specified
        if ($request->has('entity_type')) {
            $entityType = $request->input('entity_type');
            $query->where('entity_type', $entityType);
        }

        // Filter faculty forums by university_id if both parameters are provided
        if ($request->has('university_id') && $request->has('entity_type') && $request->input('entity_type') === 'faculty') {
            $universityId = $request->input('university_id');
            // Join with faculties table to filter by university_id
            $query->whereIn('entity_id', function($subquery) use ($universityId) {
                $subquery->select('id')
                         ->from('faculties')
                         ->where('university_id', $universityId);
            });
        }

        // Filter program forums by faculty_id if both parameters are provided
        if ($request->has('faculty_id') && $request->has('entity_type') && $request->input('entity_type') === 'program') {
            $facultyForumId = $request->input('faculty_id');
            $facultyForum = Forum::find($facultyForumId);

            if ($facultyForum && $facultyForum->entity_type === 'faculty') {
                $actualFacultyId = $facultyForum->entity_id;
                $query->whereIn('entity_id', function($subquery) use ($actualFacultyId) {
                    $subquery->select('id')
                             ->from('programs')
                             ->where('faculty_id', $actualFacultyId);
                });
            } else {
                $query->where('id', 0);
            }
        }

        $forums = $query->get();

        $forums->each(function ($forum) {
            $forum->logo_path = $forum->logo;

            if ($forum->entity_type === 'university') {
                $entity = University::find($forum->entity_id);
                $forum->university_name = $entity ? $entity->name : 'Unknown University';
            } elseif ($forum->entity_type === 'faculty') {
                $entity = Faculty::find($forum->entity_id);
                $forum->university_name = $entity && $entity->university ? $entity->university->name : 'Unknown University';
                $forum->faculty_name = $entity ? $entity->name : 'Unknown Faculty';
            } elseif ($forum->entity_type === 'program') {
                $entity = Program::find($forum->entity_id);
                $forum->university_name = $entity && $entity->university ? $entity->university->name : 'Unknown University';
                $forum->faculty_name = $entity && $entity->faculty ? $entity->faculty->name : 'Unknown Faculty';
                $forum->program_name = $entity ? $entity->title : 'Unknown Program';
            }
            $forum->entity_name = $entity ? ($entity->name ?? $entity->title ?? 'Unnamed') : 'Unknown';
        });

        return response()->json($forums, 200);
    }

    /**
     * @OA\Delete(
     *     path="/forums/{id}",
     *     summary="Delete a forum",
     *     description="Delete a forum by its ID.",
     *     operationId="destroyForum",
     *     tags={"Forums"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of the forum to delete",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Forum deleted successfully"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Forum not found"
     *     )
     * )
     */
    public function destroyForum($id)
    {
        $forum = Forum::find($id);

        if (!$forum) {
            return response()->json(['message' => 'Forum not found'], 404);
        }

        $this->authorize('delete', $forum);

        $posts = Post::where('forum_id', $forum->id)->get();
        foreach ($posts as $post) {
            Comment::where('post_id', $post->id)->delete();
            $post->delete();
        }

        $forum->delete();

        return response()->json(['message' => 'Forum deleted successfully'], 200);
    }

    /**
     * @OA\Put(
     *     path="/forums/{id}",
     *     summary="Update a forum",
     *     description="Update an existing forum by its ID.",
     *     operationId="updateForum",
     *     tags={"Forums"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of the forum to update",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"title", "university_id"},
     *             @OA\Property(property="title", type="string", example="Updated title"),
     *             @OA\Property(property="university_id", type="integer", example=1)
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Forum updated successfully"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Forum not found"
     *     )
     * )
     */
    public function updateForum(Request $request, $id)
    {
        $forum = Forum::find($id);

        if (!$forum) {
            return response()->json(['message' => 'Forum not found'], 404);
        }

        $this->authorize('update', $forum);

        try{
            $validatedData = $request->validate([
                'title' => 'required|string|max:255',
                'university_id' => 'required|integer|exists:universities,id',
            ]);

            $forum->update($validatedData);
        } catch(\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }

        return response()->json(['message' => 'Forum updated successfully', 'forum' => $forum], 200);
    }

    /**
     * @OA\Post(
     *     path="/forums",
     *     summary="Create a new forum",
     *     description="Create a new forum with title and university information.",
     *     operationId="insertForum",
     *     tags={"Forums"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"title", "university_id"},
     *             @OA\Property(property="title", type="string", example="Forum title"),
     *             @OA\Property(property="university_id", type="integer", example=1)
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Forum created successfully"
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Invalid input"
     *     )
     * )
     */
    public function insertForum(Request $request)
    {
        $this->authorize('create', Forum::class);

        try{
            $validatedData = $request->validate([
                'title' => 'required|string|max:255',
                'university_id' => 'required|integer',
            ]);

            $forum = Forum::create([
                'title' => $validatedData['title'],
                'university_id' => $validatedData['university_id'],
            ]);
        } catch(\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }

        return response()->json(['message' => 'Forum created successfully', 'forum' => $forum], 201);
    }


    //--------------------------------------Comment CRUD------------------------------------------------------------
    /**
     * @OA\Get(
     *     path="/comments",
     *     summary="Retrieve list of comments",
     *     description="Fetch all comments from the database.",
     *     operationId="getComments",
     *     tags={"Comments"},
     *     @OA\Response(
     *         response=200,
     *         description="List of comments",
     *         @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/Comment"))
     *     )
     *     @OA\Response(
     *         response=404,
     *         description="Comments not found"
     *     )
     * )
     */
    public function getComments()
    {
        $comments = Comment::all();

        $comments->each(function ($comment) {
            $comment->post_title = $comment->post->title;
            $comment->username = $comment->user->username;
            unset($comment->post_id, $comment->user_id, $comment->post, $comment->user);
        });

        return response()->json($comments, 200);
    }

    /**
     * @OA\Delete(
     *     path="/comments/{id}",
     *     summary="Delete a comment",
     *     description="Delete a comment by its ID.",
     *     operationId="destroyComment",
     *     tags={"Comments"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of the comment to delete",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Comment deleted successfully"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Comment not found"
     *     )
     * )
     */
    public function destroyComment($id)
    {
        $comment = Comment::find($id);

        if (!$comment) {
            return response()->json(['message' => 'Comment not found'], 404);
        }

        $this->authorize('delete', $comment);

        $postId = $comment->post_id;

        $comment->delete();
        $post = Post::findOrFail($postId);
        $post->comments_count = max(($post->comments_count ?? 0) - 1, 0);
        $post->save();

        return response()->json(['message' => 'Comment deleted successfully'], 200);
    }


    /**
     * @OA\Put(
     *     path="/comments/{id}",
     *     summary="Update a comment",
     *     description="Update an existing comment by its ID.",
     *     operationId="updateComment",
     *     tags={"Comments"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of the comment to update",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"text"},
     *             @OA\Property(property="text", type="string", example="Updated comment text")
     *         )
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="Comment updated successfully"
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Comment not found"
     *     )
     * )
     */
    public function updateComment(Request $request, $id)
    {
        $comment = Comment::find($id);

        if (!$comment) {
            return response()->json(['message' => 'Comment not found'], 404);
        }

        $this->authorize('update', $comment);

        try{
            // Validate the request data
            $validatedData = $request->validate([
                'text' => 'required|string',
                'post_id' => 'required|integer',
                'user_id' => 'required|integer',
            ]);
        } catch(\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }

        $comment->update($validatedData);

        return response()->json(['message' => 'Comment updated successfully', 'comment' => $comment], 200);
    }

    /**
     * @OA\Post(
     *     path="/comments",
     *     summary="Create a new comment",
     *     description="Create a new comment with text and post information.",
     *     operationId="insertComment",
     *     tags={"Comments"},
     *     @OA\RequestBody(
     *         required=true,
     *         @OA\JsonContent(
     *             required={"text", "post_id"},
     *             @OA\Property(property="text", type="string", example="Comment text"),
     *             @OA\Property(property="post_id", type="integer", example=1)
     *         )
     *     ),
     *     @OA\Response(
     *         response=201,
     *         description="Comment created successfully"
     *     ),
     *     @OA\Response(
     *         response=400,
     *         description="Invalid input"
     *     )
     * )
     */
    public function insertComment(Request $request)
    {
        $this->authorize('create', Comment::class);

        try{
            $validatedData = $request->validate([
                'text' => 'required|string',
                'post_id' => 'required|integer|exists:posts,id',
                'parent_id' => 'nullable|integer|exists:comments,id',
            ]);

            $comment = Comment::create([
                'text' => $validatedData['text'],
                'post_id' => $validatedData['post_id'],
                'user_id' => auth('api')->id(),
                'parent_id' => $request->parent_id,
            ]);

            $post = Post::findOrFail($validatedData['post_id']);
            $post->comments_count = ($post->comments_count ?? 0) + 1;
            $post->save();
        } catch(\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }

        return response()->json(['message' => 'Comment created successfully', 'comment' => $comment], 201);
    }

    /**
     * @OA\Get(
     *     path="/posts/{post_id}/comments",
     *     summary="Retrieve comments for a specific post",
     *     description="Fetch all comments associated with a specific post.",
     *     operationId="getPostComments",
     *     tags={"Posts", "Comments"},
     *     @OA\Parameter(
     *         name="post_id",
     *         in="path",
     *         description="ID of the post to retrieve comments for",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="List of comments for the post",
     *         @OA\JsonContent(type="array", @OA\Items(ref="#/components/schemas/Comment"))
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Post not found"
     *     )
     * )
     */
    public function getPostComments($postId)
    {
        $post = Post::findOrFail($postId);
        $userId = auth('api')->id();

        $comments = Comment::where('post_id', $postId)
            ->whereNull('parent_id')
            ->with(['user', 'replies.user', 'replies.replies.user'])
            ->orderBy('created_at', 'asc')
            ->get();

        $formattedComments = $comments->map(function ($comment) use ($userId) {
            return $this->formatComment($comment, $userId);
        });

        return response()->json($formattedComments, 200);
    }

    /**
     * Helper function to recursively format comments with their replies
     */
    private function formatComment($comment, $userId = null)
    {
        $userInteraction = null;
        if ($userId) {
            $interaction = CommentInteraction::where('user_id', $userId)
                ->where('comment_id', $comment->id)
                ->first();
            if ($interaction) {
                $userInteraction = $interaction->type;
            }
        }

        $formattedComment = [
            'id' => $comment->id,
            'content' => $comment->text,
            'date' => $comment->created_at->format('Y-m-d'),
            'user' => $comment->user->username,
            'user_avatar' => $comment->user->avatar,
            'user_id' => $comment->user_id,
            'parent_id' => $comment->parent_id,
            'like_count' => $comment->like_count ?? 0,
            'dislike_count' => $comment->dislike_count ?? 0,
            'user_interaction' => $userInteraction,
        ];

        if ($comment->replies && $comment->replies->count() > 0) {
            $formattedComment['replies'] = $comment->replies->map(function ($reply) use ($userId) {
                return $this->formatComment($reply, $userId);
            });
        } else {
            $formattedComment['replies'] = [];
        }

        return $formattedComment;
    }

    private function getCommentInteractions($commentId)
    {
        $interactions = CommentInteraction::where('comment_id', $commentId)
            ->select('type')
            ->get();

        return $interactions;
    }

    public function likeComment(Request $request, $commentId)
    {
        try {
            $userId = auth('api')->id();

            if (!$commentId || !$userId) {
                return response()->json(['error' => 'Comment ID and user authentication required'], 400);
            }

            $comment = Comment::with('user')->findOrFail($commentId);

            $existingInteraction = CommentInteraction::where('user_id', $userId)
                ->where('comment_id', $commentId)
                ->first();

            if (!$existingInteraction) {
                $interaction = new CommentInteraction();
                $interaction->user_id = $userId;
                $interaction->comment_id = $commentId;
                $interaction->type = 'like';
                $interaction->created_at = now();
                $interaction->updated_at = now();
                $interaction->save();

                $comment->like_count = ($comment->like_count ?? 0) + 1;
                $comment->save();

                if ($comment->user && $comment->user->id != $userId) {
                    $comment->user->reputation = ($comment->user->reputation ?? 0) + 1;
                    $comment->user->save();
                }

                return response()->json(['message' => 'Comment liked successfully', 'like_count' => $comment->like_count]);

            } else if ($existingInteraction->type === 'dislike') {
                $existingInteraction->type = 'like';
                $existingInteraction->updated_at = now();
                $existingInteraction->save();

                $comment->like_count = ($comment->like_count ?? 0) + 1;
                $comment->dislike_count = max(($comment->dislike_count ?? 0) - 1, 0);
                $comment->save();

                if ($comment->user && $comment->user->id != $userId) {
                    $comment->user->reputation = ($comment->user->reputation ?? 0) + 2;
                    $comment->user->save();
                }

                return response()->json([
                    'message' => 'Interaction changed from dislike to like',
                    'like_count' => $comment->like_count,
                    'dislike_count' => $comment->dislike_count
                ]);

            } else {
                $existingInteraction->delete();

                $comment->like_count = max(($comment->like_count ?? 0) - 1, 0);
                $comment->save();

                if ($comment->user && $comment->user->id != $userId) {
                    $comment->user->reputation = max(($comment->user->reputation ?? 0) - 1, 0);
                    $comment->user->save();
                }

                return response()->json(['message' => 'Comment unliked successfully', 'like_count' => $comment->like_count]);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to process like: ' . $e->getMessage()], 500);
        }
    }

    public function dislikeComment(Request $request, $commentId)
    {
        try {
            $userId = auth('api')->id();

            if (!$commentId || !$userId) {
                return response()->json(['error' => 'Comment ID and user authentication required'], 400);
            }

            $comment = Comment::with('user')->findOrFail($commentId);

            $existingInteraction = CommentInteraction::where('user_id', $userId)
                ->where('comment_id', $commentId)
                ->first();

            if (!$existingInteraction) {
                $interaction = new CommentInteraction();
                $interaction->user_id = $userId;
                $interaction->comment_id = $commentId;
                $interaction->type = 'dislike';
                $interaction->created_at = now();
                $interaction->updated_at = now();
                $interaction->save();

                $comment->dislike_count = ($comment->dislike_count ?? 0) + 1;
                $comment->save();

                if ($comment->user && $comment->user->id != $userId) {
                    $comment->user->reputation = ($comment->user->reputation ?? 0) - 1;
                    $comment->user->save();
                }

                return response()->json(['message' => 'Comment disliked successfully', 'dislike_count' => $comment->dislike_count]);

            } else if ($existingInteraction->type === 'like') {
                $existingInteraction->type = 'dislike';
                $existingInteraction->updated_at = now();
                $existingInteraction->save();

                $comment->like_count = max(($comment->like_count ?? 0) - 1, 0);
                $comment->dislike_count = ($comment->dislike_count ?? 0) + 1;
                $comment->save();

                if ($comment->user && $comment->user->id != $userId) {
                    $comment->user->reputation = max(($comment->user->reputation ?? 0) - 2, 0);
                    $comment->user->save();
                }

                return response()->json([
                    'message' => 'Interaction changed from like to dislike',
                    'like_count' => $comment->like_count,
                    'dislike_count' => $comment->dislike_count
                ]);

            } else {
                $existingInteraction->delete();

                $comment->dislike_count = max(($comment->dislike_count ?? 0) - 1, 0);
                $comment->save();

                if ($comment->user && $comment->user->id != $userId) {
                    $comment->user->reputation = ($comment->user->reputation ?? 0) + 1;
                    $comment->user->save();
                }

                return response()->json(['message' => 'Comment undisliked successfully', 'dislike_count' => $comment->dislike_count]);
            }
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to process dislike: ' . $e->getMessage()], 500);
        }
    }

    /**
     * @OA\Post(
     *     path="/posts/{id}/view",
     *     summary="Increment post view count",
     *     description="Increment the view count for a specific post",
     *     operationId="incrementViews",
     *     tags={"Posts"},
     *     @OA\Parameter(
     *         name="id",
     *         in="path",
     *         description="ID of the post",
     *         required=true,
     *         @OA\Schema(type="integer")
     *     ),
     *     @OA\Response(
     *         response=200,
     *         description="View count updated successfully",
     *         @OA\JsonContent(
     *             @OA\Property(property="message", type="string"),
     *             @OA\Property(property="views", type="integer")
     *         )
     *     ),
     *     @OA\Response(
     *         response=404,
     *         description="Post not found"
     *     )
     * )
     */
    public function incrementViews($postId)
    {
        try {
            $post = Post::findOrFail($postId);
            $post->views = ($post->views ?? 0) + 1;
            $post->save();
            
            return response()->json([
                'message' => 'View count updated successfully',
                'views' => $post->views
            ], 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to update view count: ' . $e->getMessage()], 500);
        }
    }

    public function getForumPosts($forumId)
    {
        $forum = Forum::find($forumId);

        if (!$forum) {
            return response()->json(['message' => 'Forum not found'], 404);
        }

        $userId = auth('api')->id();

        $posts = Post::where('forum_id', $forumId)
            ->with(['user', 'user.status', 'categories'])
            ->withCount('comments')
            ->get()
            ->map(function ($post) use ($userId) {
                $userInteraction = null;
                if ($userId) {
                    $interaction = PostInteraction::where('user_id', $userId)
                        ->where('post_id', $post->id)
                        ->first();
                    if ($interaction) {
                        $userInteraction = $interaction->type;
                    }
                }

                return [
                    'id' => $post->id,
                    'title' => $post->title,
                    'description' => $post->description,
                    'user' => $post->user->username,
                    'user_avatar' => $post->user->avatar,
                    'user_id' => $post->user_id,
                    'user_status' => [
                        'id' => $post->user->status_id,
                        'name' => $post->user->status ? $post->user->status->name : null
                    ],
                    'categories' => $post->categories->map(function ($category) {
                        return [
                            'id' => $category->id,
                            'name' => $category->name,
                            'color' => $category->color,
                        ];
                    }),
                    'likes' => $post->likes,
                    'dislikes' => $post->dislikes,
                    'views' => $post->views,
                    'user_interaction' => $userInteraction,
                    'comments_count' => $post->comments_count,
                    'created_at' => $post->created_at->format('Y-m-d'),
                ];
            });

        return response()->json([
            'forum_name' => $forum->title,
            'forum_entity_type' => $forum->entity_type,
            'forum_entity_id' => $forum->entity_id,
            'posts' => $posts,
        ], 200);
    }

    /**
     * Search posts with advanced filtering options
     *
     * @param  \Illuminate\Http\Request  $request
     * @return \Illuminate\Http\Response
     */
    public function searchPosts(Request $request)
    {
        $query = Post::query();
        $userId = auth('api')->id();

        // Log search parameters for debugging
        \Log::info('Search params received:', $request->all());

        // Check for either 'q' or 'keyword' parameter
        if ($request->has('q') && !empty($request->q)) {
            $keyword = $request->q;
            \Log::info('Searching with q parameter: ' . $keyword);
            $query->where(function($q) use ($keyword) {
                $q->where('title', 'LIKE', "%{$keyword}%")
                  ->orWhere('description', 'LIKE', "%{$keyword}%");
            });
        } 
        // Fallback support for 'keyword' parameter
        else if ($request->has('keyword') && !empty($request->keyword)) {
            $keyword = $request->keyword;
            \Log::info('Searching with keyword parameter: ' . $keyword);
            $query->where(function($q) use ($keyword) {
                $q->where('title', 'LIKE', "%{$keyword}%")
                  ->orWhere('description', 'LIKE', "%{$keyword}%");
            });
        }

        if ($request->has('forum_id') && !empty($request->forum_id)) {
            $query->where('forum_id', $request->forum_id);
        }

        if ($request->has('university_id') && !empty($request->university_id)) {
            $universityId = $request->university_id;
            
            $universityForums = Forum::where('entity_type', 'university')
                ->where('entity_id', $universityId)
                ->pluck('id');
                

            $facultyIds = Faculty::where('university_id', $universityId)->pluck('id');
            $facultyForums = Forum::where('entity_type', 'faculty')
                ->whereIn('entity_id', $facultyIds)
                ->pluck('id');
                
            $programIds = Program::where('university_id', $universityId)->pluck('id');
            $programForums = Forum::where('entity_type', 'program')
                ->whereIn('entity_id', $programIds)
                ->pluck('id');
                
            $allForumIds = $universityForums->concat($facultyForums)->concat($programForums);
            
            $query->whereIn('forum_id', $allForumIds);
        }


        if ($request->has('faculty_id') && !empty($request->faculty_id)) {
            $facultyId = $request->faculty_id;
            
            $facultyForum = Forum::where('entity_type', 'faculty')
                ->where('entity_id', $facultyId)
                ->pluck('id');
                
            $programIds = Program::where('faculty_id', $facultyId)->pluck('id');
            $programForums = Forum::where('entity_type', 'program')
                ->whereIn('entity_id', $programIds)
                ->pluck('id');
                
            $allForumIds = $facultyForum->concat($programForums);
            
            $query->whereIn('forum_id', $allForumIds);
        }

        if ($request->has('program_id') && !empty($request->program_id)) {
            $programId = $request->program_id;
            
            $programForum = Forum::where('entity_type', 'program')
                ->where('entity_id', $programId)
                ->pluck('id');
                
            $query->whereIn('forum_id', $programForum);
        }

        if ($request->has('category_id') && !empty($request->category_id)) {
            $categoryId = $request->category_id;
            $query->whereHas('categories', function($q) use ($categoryId) {
                $q->where('categories.id', $categoryId);
            });
        }

        if ($request->has('from_date') && !empty($request->from_date)) {
            $query->whereDate('created_at', '>=', $request->from_date);
        }

        if ($request->has('to_date') && !empty($request->to_date)) {
            $query->whereDate('created_at', '<=', $request->to_date);
        }

        if ($request->has('min_likes') && !empty($request->min_likes)) {
            $query->where('likes', '>=', $request->min_likes);
        }

        if ($request->has('user_id') && !empty($request->user_id)) {
            $query->where('user_id', $request->user_id);
        }

        if ($request->has('sort_by')) {
            $sortBy = $request->input('sort_by');
            $sortOrder = $request->input('sort_order', 'desc');

            switch ($sortBy) {
                case 'date':
                    $query->orderBy('created_at', $sortOrder);
                    break;
                case 'likes':
                    $query->orderBy('likes', $sortOrder);
                    break;
                case 'comments':
                    $query->withCount('comments')->orderBy('comments_count', $sortOrder);
                    break;
                case 'views':
                    $query->orderBy('views', $sortOrder);
                    break;
                default:
                    $query->orderBy('created_at', 'desc');
                    break;
            }
        } else {
            $query->orderBy('created_at', 'desc');
        }

        $perPage = $request->input('per_page', 10);
        $posts = $query->with(['user', 'user.status', 'forum', 'categories'])
            ->withCount('comments')
            ->paginate($perPage);

        $formattedPosts = $posts->map(function ($post) use ($userId) {
            $userInteraction = null;
            if ($userId) {
                $interaction = PostInteraction::where('user_id', $userId)
                    ->where('post_id', $post->id)
                    ->first();
                if ($interaction) {
                    $userInteraction = $interaction->type;
                }
            }

            $forum = $post->forum;
            $forumInfo = [
                'id' => $forum->id,
                'title' => $forum->title,
                'entity_type' => $forum->entity_type,
                'entity_id' => $forum->entity_id,
            ];

            if ($forum->entity_type === 'university') {
                $university = University::find($forum->entity_id);
                $forumInfo['university_name'] = $university ? $university->name : null;
                $forumInfo['navigation_path'] = "/forumai/universitetai/{$forum->entity_id}/irasai";
            } elseif ($forum->entity_type === 'faculty') {
                $faculty = Faculty::find($forum->entity_id);
                if ($faculty) {
                    $forumInfo['faculty_name'] = $faculty->name;
                    $forumInfo['university_id'] = $faculty->university_id;
                    $university = University::find($faculty->university_id);
                    $forumInfo['university_name'] = $university ? $university->name : null;
                    $forumInfo['navigation_path'] = "/forumai/universitetai/{$faculty->university_id}/fakultetai/{$forum->entity_id}/irasai";
                }
            } elseif ($forum->entity_type === 'program') {
                $program = Program::find($forum->entity_id);
                if ($program) {
                    $forumInfo['program_name'] = $program->title;
                    $forumInfo['faculty_id'] = $program->faculty_id;
                    $forumInfo['university_id'] = $program->university_id;
                    $faculty = Faculty::find($program->faculty_id);
                    $university = University::find($program->university_id);
                    $forumInfo['faculty_name'] = $faculty ? $faculty->name : null;
                    $forumInfo['university_name'] = $university ? $university->name : null;
                    $forumInfo['navigation_path'] = "/forumai/universitetai/{$program->university_id}/fakultetai/{$program->faculty_id}/programos/{$forum->entity_id}/irasai";
                }
            }

            return [
                'id' => $post->id,
                'title' => $post->title,
                'description' => $post->description,
                'user' => $post->user->username,
                'user_avatar' => $post->user->avatar,
                'user_id' => $post->user_id,
                'user_status' => [
                    'id' => $post->user->status_id,
                    'name' => $post->user->status ? $post->user->status->name : null
                ],
                'forum' => $post->forum->title,
                'forum_id' => $post->forum_id,
                'forum_info' => $forumInfo,
                'likes' => $post->likes,
                'dislikes' => $post->dislikes,
                'views' => $post->views,
                'user_interaction' => $userInteraction,
                'categories' => $post->categories->map(function ($category) {
                    return [
                        'id' => $category->id,
                        'name' => $category->name,
                        'color' => $category->color,
                    ];
                }),
                'comments_count' => $post->comments_count,
                'created_at' => $post->created_at->format('Y-m-d'),
            ];
        });

        return response()->json([
            'data' => $formattedPosts,
            'pagination' => [
                'total' => $posts->total(),
                'per_page' => $posts->perPage(),
                'current_page' => $posts->currentPage(),
                'last_page' => $posts->lastPage(),
                'from' => $posts->firstItem(),
                'to' => $posts->lastItem(),
            ],
        ], 200);
    }
}


