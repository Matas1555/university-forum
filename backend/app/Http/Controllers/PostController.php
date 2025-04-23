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

        $posts = Post::where('forum_id', $forum_id)
            ->with(['user', 'user.status', 'categories'])
            ->withCount('comments')
            ->get()
            ->map(function ($post) {
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

        if ($request->has('forum_id')) {
            $query->where('forum_id', $request->input('forum_id'));
        }


        // Add sorting options
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
                default:
                    $query->orderBy('created_at', 'desc');
                    break;
            }
        } else {
            // Default sorting by most recent
            $query->orderBy('created_at', 'desc');
        }

        // Eager load relationships and count comments
        $posts = $query->with(['user', 'user.status', 'forum', 'categories'])
            ->withCount('comments')
            ->get();

        $postData = $posts->map(function ($post) {
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
                'likes' => $post->likes,
                'dislikes' => $post->dislikes,
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
            ]);

            $post = Post::create([
                'title' => $validatedData['title'],
                'description' => $validatedData['description'],
                'forum_id' => $validatedData['forum_id'],
                'user_id' => $user->id,
            ]);

            return response()->json(['message' => 'Post created successfully', 'post' => $post], 201);
        } catch(\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
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

        // Format comments hierarchically
        $formattedComments = $post->comments->map(function ($comment) {
            return $this->formatComment($comment);
        });

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
            'likes' => $post->likes,
            'dislikes' => $post->dislikes,
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

        Comment::where('post_id', $post->id)->delete();

        $post->delete();

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

        // Add post count and entity information
        $forums->each(function ($forum) {

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

            $level = 1;

            if ($request->has('parent_id') && $request->parent_id) {
                $parentComment = Comment::findOrFail($request->parent_id);

                if ($request->has('level')) {
                    $level = $request->level;
                } else {
                    $level = $parentComment->level + 1;
                }
            }

            $comment = Comment::create([
                'text' => $validatedData['text'],
                'post_id' => $validatedData['post_id'],
                'user_id' => auth('api')->id(),
                'parent_id' => $request->parent_id,
                'level' => $level
            ]);

            $post = Post::findOrFail($validatedData['post_id']);
            $post->comments_count = ($post->comments_count ?? 0) + 1;
            $post->save();
        } catch(\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }

        return response()->json(['message' => 'Comment created successfully', 'comment' => $comment], 201);
    }

    public function getUserPostInteractions()
    {
        $userId = auth('api')->id();

        if (!$userId) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        try {
            $interactions = PostInteraction::where('user_id', $userId)
                ->select('post_id', 'type')
                ->get();

            return response()->json($interactions, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch interactions: ' . $e->getMessage()], 500);
        }
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

        // Get top-level comments (parent_id is null)
        $comments = Comment::where('post_id', $postId)
            ->whereNull('parent_id')
            ->with(['user', 'replies.user', 'replies.replies.user'])
            ->orderBy('created_at', 'asc')
            ->get();

        // Format the comments with their replies
        $formattedComments = $comments->map(function ($comment) {
            return $this->formatComment($comment);
        });

        return response()->json($formattedComments, 200);
    }

    /**
     * Helper function to recursively format comments with their replies
     */
    private function formatComment($comment)
    {
        $formattedComment = [
            'id' => $comment->id,
            'content' => $comment->text,
            'date' => $comment->created_at->format('Y-m-d'),
            'user' => $comment->user->username,
            'user_avatar' => $comment->user->avatar,
            'user_id' => $comment->user_id,
            'level' => $comment->level,
            'like_count' => $comment->like_count ?? 0,
            'dislike_count' => $comment->dislike_count ?? 0,
        ];

        if ($comment->replies && $comment->replies->count() > 0) {
            $formattedComment['replies'] = $comment->replies->map(function ($reply) {
                return $this->formatComment($reply);
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

    public function getUserCommentInteractions()
    {
        $userId = auth('api')->id();

        if (!$userId) {
            return response()->json(['error' => 'User not authenticated'], 401);
        }

        try {
            $interactions = CommentInteraction::where('user_id', $userId)
                ->select('comment_id', 'type')
                ->get();

            return response()->json($interactions, 200);
        } catch (\Exception $e) {
            return response()->json(['error' => 'Failed to fetch comment interactions: ' . $e->getMessage()], 500);
        }
    }
}


