<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\FinancialGoalStoreRequest;
use App\Http\Requests\FinancialGoalUpdateRequest;
use App\Models\FinancialGoal;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class FinancialGoalController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $goals = $request->user()
            ->financialGoals()
            ->with('category:id,name,color')
            ->orderByRaw("FIELD(status, 'active', 'completed', 'cancelled')")
            ->orderBy('end_date')
            ->orderByDesc('created_at')
            ->get();

        return response()->json($goals);
    }

    public function store(FinancialGoalStoreRequest $request): JsonResponse
    {
        $goal = $request->user()->financialGoals()->create($request->validated());

        return response()->json($goal->load('category:id,name,color'), 201);
    }

    public function show(Request $request, FinancialGoal $financialGoal): JsonResponse
    {
        abort_if($financialGoal->user_id !== $request->user()->id, 404);

        return response()->json($financialGoal->load('category:id,name,color'));
    }

    public function update(FinancialGoalUpdateRequest $request, FinancialGoal $financialGoal): JsonResponse
    {
        abort_if($financialGoal->user_id !== $request->user()->id, 404);

        $financialGoal->update($request->validated());

        return response()->json($financialGoal->fresh()->load('category:id,name,color'));
    }

    public function destroy(Request $request, FinancialGoal $financialGoal): JsonResponse
    {
        abort_if($financialGoal->user_id !== $request->user()->id, 404);

        $financialGoal->delete();

        return response()->json([
            'message' => 'Meta removida com sucesso.',
        ]);
    }
}
