<?php

namespace App\Http\Controllers;

use App\Models\Category;
use Illuminate\Http\Request;
use Illuminate\Foundation\Auth\Access\AuthorizesRequests;
use App\Http\Requests\CategoryRequest;

class CategoryController extends Controller
{
    use AuthorizesRequests;
    public function getCategories(Request $request)
    {
        $categories = Category::all();

        return response()->json($categories, 200);
    }

    public function updateCategory(Request $request, $id)
    {
        echo($request);
        $category = Category::find($id);

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        $this->authorize('update', $category);

        try{
            $validatedData = $request->validate([
                'name' => 'required|string|max:255',
            ]);

            $category->update($validatedData);
        } catch(\Illuminate\Validation\ValidationException $e) {
            return response()->json(['errors' => $e->errors()], 422);
        }

        return response()->json($category, 200);
    }

    public function insertCategory(CategoryRequest $request)
    {
        $this->authorize('create', Category::class);

        $data = $request->validated();

        $category = Category::create([
            'name' => $data['name'],
        ]);

        return response()->json($category, 200);
    }

    public function deleteCategory($id)
    {
        $category = Category::find($id);

        $this->authorize('delete', $category);

        if (!$category) {
            return response()->json(['message' => 'Category not found'], 404);
        }

        $category->delete();
    }
}
