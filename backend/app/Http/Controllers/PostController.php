<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Forum;
use App\Models\Comment;
use Illuminate\Http\Request;
use App\Models\Post;
use Illuminate\Support\Facades\Auth;

/**
 * @OA\Info(title="Post API", version="0.1")
 */
class PostController extends Controller
{
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

        $posts = Post::where('forum', $forum_id)->get();

        $postData = [];

        foreach ($posts as $post) {
            $comments = Comment::where('post', $post->id)->get();

            $categories = Category::join('post_categories', 'categories.id', '=', 'post_categories.categoryID')
                ->where('post_categories.postID', $post->id)
                ->get(['categories.id', 'categories.name']);

            $postData[] = [
                'id' => $post->id,
                'title' => $post->title,
                'description' => $post->description,
                'user' => $post->user,
                'comments' => $comments,
                'categories' => $categories,
            ];
        }

        return response()->json([
            'forum_name' => $forum->name,
            'posts' => $postData,
        ], 200);
    }


    //POST CRUD
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
     * )
     */
    public function index(Request $request)
    {
        $query = Post::query();

        if ($request->has('university_id')) {
            $query->where('university', $request->input('university_id'));
        }

        if ($request->has('forum_id')) {
            $query->where('forum', $request->input('forum_id'));
        }

        $posts = $query->get();

        return response()->json($posts, 200);
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
        try {
            $validatedData = $request->validate([
                'title' => 'required|string|max:255',
                'description' => 'required|string',
                'forum_id' => 'required|integer|exists:forums,id',
                'university_id' => 'required|integer|exists:universities,id',
            ]);

            $post = Post::create([
                'title' => $validatedData['title'],
                'description' => $validatedData['description'],
                'forum' => $validatedData['forum_id'],
                'university' => $validatedData['university_id'],
                'user' => 19,
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

        // Validate the request data
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
        ]);

        $post->update($validatedData);

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

        $post->delete();

        return response()->json(['message' => 'Post deleted successfully'], 200);
    }


    //FORUM CRUD
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
     * )
     */
    public function getForums()
    {
        $forum = Forum::all();
        return response()->json($forum, 200);
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

        // Validate the request data
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'university' => 'required|integer',
        ]);

        $forum->update($validatedData);

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
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'university' => 'required|integer',
        ]);

        $forum = Forum::create([
            'title' => $validatedData['title'],
            'university' => $validatedData['university'],
        ]);

        return response()->json(['message' => 'Forum created successfully', 'forum' => $forum], 201);
    }


    //Comment CRUD

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
     * )
     */
    public function getComments()
    {
        $comment = Comment::all();
        return response()->json($comment, 200);
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

        // Validate the request data
        $validatedData = $request->validate([
            'text' => 'required|string',
            'post_id' => 'required|integer',
            'user' => 'required|integer',
        ]);

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
        $validatedData = $request->validate([
            'text' => 'required|string',
            'post_id' => 'required|integer|exists:posts,id',
        ]);

        $comment = Comment::create([
            'text' => $validatedData['text'],
            'post' => $validatedData['post_id'],
            'user' => 19,
        ]);

        return response()->json(['message' => 'Comment created successfully', 'comment' => $comment], 201);
    }
}


