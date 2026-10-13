<?php

namespace App\Http\Controllers;

use App\Http\Requests\StoreCategoryRequest;
use App\Http\Requests\UpdateCategoryRequest;
use App\Models\Category;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request)
    {
        return Category::query()
            ->where(function ($query) use ($request) {
                $query->where('user_id', $request->user()->id)
                    ->orWhereNull('user_id');
            })
            ->orderBy('name')
            ->get();
    }

    public function store(StoreCategoryRequest $request)
    {
        $category = Category::create([
            ...$request->validated(),
            'user_id' => $request->user()->id,
        ]);

        return response()->json($category, 201);
    }

    public function update(
        UpdateCategoryRequest $request,
        Category $category
    ) {
        if ($category->user_id === null || $category->user_id !== $request->user()->id) {
            abort(403);
        }

        $category->update($request->validated());

        return response()->json($category->fresh());
    }

    public function destroy(Request $request, Category $category)
    {
        if ($category->user_id === null || $category->user_id !== $request->user()->id) {
            abort(403);
        }

        $category->delete();

        return response()->noContent();
    }
}
