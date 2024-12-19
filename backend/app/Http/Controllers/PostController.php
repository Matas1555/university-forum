<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Forum;
use App\Models\Comment;
use Illuminate\Http\Request;
use App\Models\Post;
use Illuminate\Support\Facades\Auth;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;

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
     *                             @OA\Property(property="name", type="string", description="Name of the category")
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

        $posts = Post::where('forum_id', $forum_id)->get();

        $postData = [];

        foreach ($posts as $post) {
            $comments = Comment::where('post_id', $post->id)->get();

            $categories = Category::join('post_categories', 'categories.id', '=', 'post_categories.category_id')
                ->where('post_categories.post_id', $post->id)
                ->get(['categories.id', 'categories.name']);

            $postData[] = [
                'id' => $post->id,
                'title' => $post->title,
                'description' => $post->description,
                'user_id' => $post->user_id,
                'forum_id' => $post->forum_id,
                'comments' => $comments,
                'categories' => $categories,
            ];
        }

        return response()->json([
            'forum_name' => $forum->title,
            'posts' => $postData,
        ], 200);
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
            $query->where('forum_id', $request->input('forum_id')); // Corrected column name
        }

        // Eager load relationships and count comments
        $posts = $query->with(['user', 'forum', 'categories'])->withCount('comments')->get();

        $postData = $posts->map(function ($post) {
            return [
                'id' => $post->id,
                'title' => $post->title,
                'description' => $post->description,
                'user' => $post->user->username, // Fetch username
                'forum' => $post->forum->title,
            ];
        });

        return response()->json($postData, 200);
    }

    public function getPostsExtended(Request $request)
    {
        $query = Post::query();

        if ($request->has('forum_id')) {
            $query->where('forum_id', $request->input('forum_id')); // Corrected column name
        }

        // Eager load relationships and count comments
        $posts = $query->with(['user', 'forum', 'categories'])->withCount('comments')->get();

        $postData = $posts->map(function ($post) {
            return [
                'id' => $post->id,
                'title' => $post->title,
                'description' => $post->description,
                'user' => $post->user->username, // Fetch username
                'forum' => $post->forum->title,
                'categories' => $post->categories->map(function ($category) {
                    return [
                        'id' => $category->id,
                        'name' => $category->name,
                    ];
                }),
                'comments_count' => $post->comments_count, // Number of comments
                'created_at' => $post->created_at->format('Y-m-d'), // Format the date
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
        $post = Post::find($id);

        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        return response()->json($post, 200);
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
     *     description="Fetch all forums from the database.",
     *     operationId="getForums",
     *     tags={"Forums"},
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
    public function getForums()
    {
        $forums = Forum::all();

        $forums->each(function ($forum) {
           $forum->university_name = $forum->university->name;
           unset($forum->university, $forum->university_id);
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

        $comment->delete();

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
            ]);

            $comment = Comment::create([
                'text' => $validatedData['text'],
                'post_id' => $validatedData['post_id'],
                'user_id' => auth('api')->user(),
            ]);
        } catch(\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }

        return response()->json(['message' => 'Comment created successfully', 'comment' => $comment], 201);
    }
}


