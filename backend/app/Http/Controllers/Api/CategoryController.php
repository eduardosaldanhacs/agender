<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\CategoryStoreRequest;
use App\Http\Requests\CategoryUpdateRequest;
use App\Models\Category;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class CategoryController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        return response()->json(
            $request->user()->categories()->orderBy('name')->get()
        );
    }

    public function store(CategoryStoreRequest $request): JsonResponse
    {
        $category = $request->user()->categories()->create($request->validated());

        return response()->json($category, 201);
    }

    public function show(Request $request, Category $category): JsonResponse
    {
        abort_if($category->user_id !== $request->user()->id, 404);

        return response()->json($category);
    }

    public function update(CategoryUpdateRequest $request, Category $category): JsonResponse
    {
        abort_if($category->user_id !== $request->user()->id, 404);

        $category->update($request->validated());

        return response()->json($category);
    }

    public function destroy(Request $request, Category $category): JsonResponse
    {
        abort_if($category->user_id !== $request->user()->id, 404);

        $category->delete();

        return response()->json([
            'message' => 'Categoria removida com sucesso.',
        ]);
    }
}
