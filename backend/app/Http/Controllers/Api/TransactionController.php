<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\TransactionStoreRequest;
use App\Http\Requests\TransactionUpdateRequest;
use App\Models\RecurringRule;
use App\Models\Transaction;
use App\Services\BalanceSummaryService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Support\Carbon;
use Illuminate\Support\Facades\DB;

class TransactionController extends Controller
{
    public function index(Request $request, BalanceSummaryService $balanceSummaryService): JsonResponse
    {
        $today = Carbon::today();
        $periodStart = $request->filled('start')
            ? Carbon::parse((string) $request->input('start'))->startOfDay()
            : $today->copy()->startOfMonth();
        $periodEnd = $request->filled('end')
            ? Carbon::parse((string) $request->input('end'))->endOfDay()
            : $today->copy()->endOfMonth();

        $transactions = $request->user()
            ->transactions()
            ->with('category:id,name,color')
            ->whereBetween('transaction_date', [$periodStart->toDateString(), $periodEnd->toDateString()])
            ->orderByDesc('transaction_date')
            ->get();

        $balanceSummary = $balanceSummaryService->summarize($request->user(), $today, $periodStart, $periodEnd);

        return response()->json([
            'data' => $transactions,
            'balance_summary' => $balanceSummary,
        ]);
    }

    public function store(TransactionStoreRequest $request): JsonResponse
    {
        $data = $request->validated();

        $transaction = DB::transaction(function () use ($request, $data) {
            $recurringRule = null;

            if (($data['is_recurring'] ?? false) === true) {
                $recurringRule = RecurringRule::create([
                    'user_id' => $request->user()->id,
                    'category_id' => $data['category_id'],
                    'description' => $data['description'],
                    'amount' => $data['amount'],
                    'type' => $data['type'],
                    'frequency' => $data['frequency'],
                    'next_run_date' => $this->nextRunDate($data['transaction_date'], $data['frequency']),
                    'end_date' => $data['end_date'] ?? null,
                    'is_active' => true,
                ]);
            }

            return $request->user()->transactions()->create([
                'category_id' => $data['category_id'],
                'recurring_rule_id' => $recurringRule?->id,
                'description' => $data['description'],
                'amount' => $data['amount'],
                'transaction_date' => $data['transaction_date'],
                'type' => $data['type'],
            ]);
        });

        return response()->json($transaction->load('category:id,name,color'), 201);
    }

    public function show(Request $request, Transaction $transaction): JsonResponse
    {
        abort_if($transaction->user_id !== $request->user()->id, 404);

        return response()->json($transaction->load('category:id,name,color', 'recurringRule'));
    }

    public function update(TransactionUpdateRequest $request, Transaction $transaction): JsonResponse
    {
        abort_if($transaction->user_id !== $request->user()->id, 404);

        $data = $request->validated();

        DB::transaction(function () use ($transaction, $data) {
            $transaction->update([
                'description' => $data['description'] ?? $transaction->description,
                'amount' => $data['amount'] ?? $transaction->amount,
                'transaction_date' => $data['transaction_date'] ?? $transaction->transaction_date,
                'type' => $data['type'] ?? $transaction->type,
                'category_id' => $data['category_id'] ?? $transaction->category_id,
            ]);

            if (array_key_exists('is_recurring', $data)) {
                if ($data['is_recurring'] === true) {
                    $rule = $transaction->recurringRule;

                    if (! $rule) {
                        $rule = RecurringRule::create([
                            'user_id' => $transaction->user_id,
                            'category_id' => $transaction->category_id,
                            'description' => $transaction->description,
                            'amount' => $transaction->amount,
                            'type' => $transaction->type,
                            'frequency' => $data['frequency'] ?? 'monthly',
                            'next_run_date' => $this->nextRunDate($transaction->transaction_date, $data['frequency'] ?? 'monthly'),
                            'end_date' => $data['end_date'] ?? null,
                            'is_active' => true,
                        ]);

                        $transaction->update(['recurring_rule_id' => $rule->id]);
                    } else {
                        $rule->update([
                            'category_id' => $transaction->category_id,
                            'description' => $transaction->description,
                            'amount' => $transaction->amount,
                            'type' => $transaction->type,
                            'frequency' => $data['frequency'] ?? $rule->frequency,
                            'end_date' => $data['end_date'] ?? $rule->end_date,
                            'is_active' => true,
                        ]);
                    }
                }

                if ($data['is_recurring'] === false && $transaction->recurringRule) {
                    $transaction->recurringRule->update(['is_active' => false]);
                    $transaction->update(['recurring_rule_id' => null]);
                }
            }
        });

        return response()->json($transaction->fresh()->load('category:id,name,color', 'recurringRule'));
    }

    private function nextRunDate(string $date, string $frequency): string
    {
        $nextDate = Carbon::parse($date);

        match ($frequency) {
            'daily' => $nextDate->addDay(),
            'weekly' => $nextDate->addWeek(),
            'monthly' => $nextDate->addMonth(),
            'yearly' => $nextDate->addYear(),
        };

        return $nextDate->toDateString();
    }

    public function destroy(Request $request, Transaction $transaction): JsonResponse
    {
        abort_if($transaction->user_id !== $request->user()->id, 404);

        if ($transaction->recurringRule) {
            $transaction->recurringRule->update(['is_active' => false]);
        }

        $transaction->delete();

        return response()->json([
            'message' => 'Transacao removida com sucesso.',
        ]);
    }
}
