<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class ReportController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $startDate = $request->input('start_date', Carbon::today()->copy()->subMonths(5)->startOfMonth()->toDateString());
        $endDate = $request->input('end_date', Carbon::today()->endOfMonth()->toDateString());
        $type = $request->input('type');
        $categoryId = $request->input('category_id');

        $baseQuery = Transaction::query()
            ->where('transactions.user_id', $user->id)
            ->whereBetween('transactions.transaction_date', [$startDate, $endDate])
            ->when($type, fn ($query) => $query->where('transactions.type', $type))
            ->when($categoryId, fn ($query) => $query->where('transactions.category_id', $categoryId));

        $monthlySpending = (clone $baseQuery)
            ->where('transactions.type', 'expense')
            ->selectRaw("DATE_FORMAT(transactions.transaction_date, '%Y-%m') as month")
            ->selectRaw('COALESCE(SUM(transactions.amount), 0) as total')
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        $financialEvolution = (clone $baseQuery)
            ->selectRaw("DATE_FORMAT(transactions.transaction_date, '%Y-%m') as month")
            ->selectRaw("COALESCE(SUM(CASE WHEN transactions.type = 'income' THEN transactions.amount ELSE 0 END), 0) as income")
            ->selectRaw("COALESCE(SUM(CASE WHEN transactions.type = 'expense' THEN transactions.amount ELSE 0 END), 0) as expense")
            ->groupBy('month')
            ->orderBy('month')
            ->get()
            ->map(function ($item) {
                $balance = (float) $item->income - (float) $item->expense;

                return [
                    'month' => $item->month,
                    'income' => (float) $item->income,
                    'expense' => (float) $item->expense,
                    'balance' => $balance,
                ];
            })
            ->values();

        $topCategories = (clone $baseQuery)
            ->join('categories', 'transactions.category_id', '=', 'categories.id')
            ->select('transactions.category_id', 'categories.name', 'categories.color')
            ->selectRaw('COALESCE(SUM(transactions.amount), 0) as total')
            ->groupBy('transactions.category_id', 'categories.name', 'categories.color')
            ->orderByDesc('total')
            ->limit(5)
            ->get();

        $totals = (clone $baseQuery)
            ->selectRaw("COALESCE(SUM(CASE WHEN transactions.type = 'income' THEN transactions.amount ELSE 0 END), 0) as income")
            ->selectRaw("COALESCE(SUM(CASE WHEN transactions.type = 'expense' THEN transactions.amount ELSE 0 END), 0) as expense")
            ->first();

        return response()->json([
            'filters' => [
                'start_date' => $startDate,
                'end_date' => $endDate,
                'type' => $type,
                'category_id' => $categoryId,
            ],
            'totals' => [
                'income' => (float) ($totals->income ?? 0),
                'expense' => (float) ($totals->expense ?? 0),
                'net' => (float) (($totals->income ?? 0) - ($totals->expense ?? 0)),
            ],
            'monthly_spending' => $monthlySpending,
            'financial_evolution' => $financialEvolution,
            'top_categories' => $topCategories,
        ]);
    }
}
