<?php

namespace App\Http\Controllers;

use App\Models\Category;
use App\Models\Forum;
use App\Models\Comment;
use Illuminate\Http\Request;
use App\Models\Post;
use Illuminate\Support\Facades\Auth;

class PostController extends Controller
{
    //Sarasas
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

    public function insertPost(Request $request)
    {
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
    }

    public function showPost($id)
    {
        $post = Post::find($id);

        if (!$post) {
            return response()->json(['message' => 'Post not found'], 404);
        }

        return response()->json($post, 200);
    }

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
    public function getForums()
    {
        $forum = Forum::all();
        return response()->json($forum, 200);
    }

    public function destroyForum($id)
    {
        $forum = Forum::find($id);

        if (!$forum) {
            return response()->json(['message' => 'Forum not found'], 404);
        }

        $forum->delete();

        return response()->json(['message' => 'Forum deleted successfully'], 200);
    }

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
    public function getComments()
    {
        $comment = Comment::all();
        return response()->json($comment, 200);
    }

    public function destroyComment($id)
    {
        $comment = Comment::find($id);

        if (!$comment) {
            return response()->json(['message' => 'Comment not found'], 404);
        }

        $comment->delete();

        return response()->json(['message' => 'Comment deleted successfully'], 200);
    }

    public function updateComment(Request $request, $id)
    {
        $comment = Comment::find($id);

        if (!$comment) {
            return response()->json(['message' => 'Comment not found'], 404);
        }

        // Validate the request data
        $validatedData = $request->validate([
            'text' => 'required|string',
            'post' => 'required|int',
            'user' => 'required|int',
        ]);

        $comment->update($validatedData);

        return response()->json(['message' => 'Comment updated successfully', 'comment' => $comment], 200);
    }
    public function insertComment(Request $request)
    {
        $validatedData = $request->validate([
            'title' => 'required|string|max:255',
            'university' => 'required|int',
        ]);

        $comment = Post::create([
            'text' => $validatedData['text'],
            'post' => $validatedData['post_id'],
            'user' => Auth::id(),
        ]);

        return response()->json(['message' => 'Comment created successfully', 'comment' => $comment], 201);
    }
}


