<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use App\Services\BalanceSummaryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request, BalanceSummaryService $balanceSummaryService): JsonResponse
    {
        $user = $request->user();
        $today = Carbon::today();
        $periodStart = $request->filled('start_date')
            ? Carbon::parse((string) $request->input('start_date'))->startOfDay()
            : $today->copy()->startOfMonth();
        $periodEnd = $request->filled('end_date')
            ? Carbon::parse((string) $request->input('end_date'))->endOfDay()
            : $today->copy()->endOfMonth();

        $upcomingEvents = $user->events()
            ->whereDate('event_date', '>=', $today)
            ->orderBy('event_date')
            ->orderBy('event_time')
            ->limit(5)
            ->get();

        $balanceSummary = $balanceSummaryService->summarize($user, $today, $periodStart, $periodEnd);

        $expensesByCategory = $user->transactions()
            ->where('type', 'expense')
            ->whereBetween('transactions.transaction_date', [$periodStart->toDateString(), $periodEnd->toDateString()])
            ->join('categories', 'transactions.category_id', '=', 'categories.id')
            ->selectRaw('categories.name as category, COALESCE(SUM(transactions.amount),0) as total')
            ->groupBy('categories.name')
            ->orderByDesc('total')
            ->get();

        $monthlySummary = Transaction::query()
            ->where('user_id', $user->id)
            ->whereBetween('transaction_date', [$periodStart->toDateString(), $periodEnd->toDateString()])
            ->selectRaw("DATE_FORMAT(transaction_date, '%Y-%m') as month")
            ->selectRaw("COALESCE(SUM(CASE WHEN type = 'income' THEN amount END), 0) as income")
            ->selectRaw("COALESCE(SUM(CASE WHEN type = 'expense' THEN amount END), 0) as expense")
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return response()->json([
            'upcoming_events' => $upcomingEvents,
            'balance_summary' => $balanceSummary,
            'expenses_by_category' => $expensesByCategory,
            'monthly_summary' => $monthlySummary,
        ]);
    }
}
