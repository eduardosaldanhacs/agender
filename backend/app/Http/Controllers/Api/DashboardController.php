<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Transaction;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;

class DashboardController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $user = $request->user();
        $today = Carbon::today();

        $upcomingEvents = $user->events()
            ->whereDate('event_date', '>=', $today)
            ->orderBy('event_date')
            ->orderBy('event_time')
            ->limit(5)
            ->get();

        $balance = (float) $user->transactions()
            ->selectRaw("COALESCE(SUM(CASE WHEN type = 'income' THEN amount ELSE -amount END), 0) as balance")
            ->value('balance');

        $expensesByCategory = $user->transactions()
            ->where('type', 'expense')
            ->join('categories', 'transactions.category_id', '=', 'categories.id')
            ->selectRaw('categories.name as category, COALESCE(SUM(transactions.amount),0) as total')
            ->groupBy('categories.name')
            ->orderByDesc('total')
            ->get();

        $monthlySummary = Transaction::query()
            ->where('user_id', $user->id)
            ->whereDate('transaction_date', '>=', $today->copy()->subMonths(5)->startOfMonth())
            ->selectRaw("DATE_FORMAT(transaction_date, '%Y-%m') as month")
            ->selectRaw("COALESCE(SUM(CASE WHEN type = 'income' THEN amount END), 0) as income")
            ->selectRaw("COALESCE(SUM(CASE WHEN type = 'expense' THEN amount END), 0) as expense")
            ->groupBy('month')
            ->orderBy('month')
            ->get();

        return response()->json([
            'upcoming_events' => $upcomingEvents,
            'balance' => $balance,
            'expenses_by_category' => $expensesByCategory,
            'monthly_summary' => $monthlySummary,
        ]);
    }
}
