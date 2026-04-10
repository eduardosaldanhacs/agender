<?php

namespace App\Services;

use App\Models\RecurringRule;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Support\Carbon;

class BalanceSummaryService
{
    public function summarize(User $user, ?Carbon $today = null, ?Carbon $periodStart = null, ?Carbon $periodEnd = null): array
    {
        $today = $today?->copy() ?? Carbon::today();
        $periodStart = $periodStart?->copy()->startOfDay() ?? $today->copy()->startOfMonth();
        $periodEnd = $periodEnd?->copy()->endOfDay() ?? $today->copy()->endOfMonth();

        if ($periodStart->gt($periodEnd)) {
            [$periodStart, $periodEnd] = [$periodEnd->copy()->startOfDay(), $periodStart->copy()->endOfDay()];
        }

        $currentCutoff = $today->copy();
        if ($currentCutoff->gt($periodEnd)) {
            $currentCutoff = $periodEnd->copy();
        }

        $futureStart = $today->copy()->addDay()->startOfDay();
        if ($futureStart->lt($periodStart)) {
            $futureStart = $periodStart->copy();
        }

        $hasCurrentWindow = $periodStart->lte($currentCutoff);
        $hasFutureWindow = $futureStart->lte($periodEnd);

        $currentIncome = $hasCurrentWindow
            ? (float) Transaction::query()
                ->where('user_id', $user->id)
                ->whereBetween('transaction_date', [$periodStart->toDateString(), $currentCutoff->toDateString()])
                ->where('type', 'income')
                ->sum('amount')
            : 0.0;

        $currentExpense = $hasCurrentWindow
            ? (float) Transaction::query()
                ->where('user_id', $user->id)
                ->whereBetween('transaction_date', [$periodStart->toDateString(), $currentCutoff->toDateString()])
                ->where('type', 'expense')
                ->sum('amount')
            : 0.0;

        $futureIncomeTransactions = $hasFutureWindow
            ? (float) Transaction::query()
                ->where('user_id', $user->id)
                ->whereBetween('transaction_date', [$futureStart->toDateString(), $periodEnd->toDateString()])
                ->where('type', 'income')
                ->sum('amount')
            : 0.0;

        $futureExpenseTransactions = $hasFutureWindow
            ? (float) Transaction::query()
                ->where('user_id', $user->id)
                ->whereBetween('transaction_date', [$futureStart->toDateString(), $periodEnd->toDateString()])
                ->where('type', 'expense')
                ->sum('amount')
            : 0.0;

        $currentTransactions = $hasCurrentWindow
            ? Transaction::query()
                ->where('user_id', $user->id)
                ->whereBetween('transaction_date', [$periodStart->toDateString(), $currentCutoff->toDateString()])
                ->select('description', 'amount', 'transaction_date', 'type')
                ->orderByDesc('transaction_date')
                ->orderByDesc('id')
                ->limit(150)
                ->get()
                ->map(fn (Transaction $transaction) => [
                    'source' => 'transaction',
                    'description' => $transaction->description,
                    'amount' => (float) $transaction->amount,
                    'date' => $transaction->transaction_date?->toDateString(),
                    'type' => $transaction->type,
                ])
                ->values()
                ->all()
            : [];

        $futureIncomeTransactionsList = $hasFutureWindow
            ? Transaction::query()
                ->where('user_id', $user->id)
                ->whereBetween('transaction_date', [$futureStart->toDateString(), $periodEnd->toDateString()])
                ->where('type', 'income')
                ->select('description', 'amount', 'transaction_date', 'type')
                ->orderBy('transaction_date')
                ->orderBy('id')
                ->limit(150)
                ->get()
                ->map(fn (Transaction $transaction) => [
                    'source' => 'transaction',
                    'description' => $transaction->description,
                    'amount' => (float) $transaction->amount,
                    'date' => $transaction->transaction_date?->toDateString(),
                    'type' => $transaction->type,
                ])
                ->values()
                ->all()
            : [];

        $futureExpenseTransactionsList = $hasFutureWindow
            ? Transaction::query()
                ->where('user_id', $user->id)
                ->whereBetween('transaction_date', [$futureStart->toDateString(), $periodEnd->toDateString()])
                ->where('type', 'expense')
                ->select('description', 'amount', 'transaction_date', 'type')
                ->orderBy('transaction_date')
                ->orderBy('id')
                ->limit(150)
                ->get()
                ->map(fn (Transaction $transaction) => [
                    'source' => 'transaction',
                    'description' => $transaction->description,
                    'amount' => (float) $transaction->amount,
                    'date' => $transaction->transaction_date?->toDateString(),
                    'type' => $transaction->type,
                ])
                ->values()
                ->all()
            : [];

        [$projectedRecurringIncome, $projectedRecurringExpense, $futureRecurringIncomeItems, $futureRecurringExpenseItems] = $hasFutureWindow
            ? $this->projectRecurringRules($user, $futureStart, $periodEnd)
            : [0.0, 0.0, [], []];

        $currentBalance = $currentIncome - $currentExpense;
        $futureIncome = $futureIncomeTransactions + $projectedRecurringIncome;
        $futureExpenses = $futureExpenseTransactions + $projectedRecurringExpense;
        $projectedBalance = $currentBalance + $futureIncome - $futureExpenses;

        $futureIncomeItems = collect($futureIncomeTransactionsList)
            ->merge($futureRecurringIncomeItems)
            ->sortBy('date')
            ->values()
            ->all();

        $futureExpenseItems = collect($futureExpenseTransactionsList)
            ->merge($futureRecurringExpenseItems)
            ->sortBy('date')
            ->values()
            ->all();

        $projectedItems = collect($futureIncomeItems)
            ->merge($futureExpenseItems)
            ->sortBy('date')
            ->values()
            ->all();

        return [
            'current_income' => round($currentIncome, 2),
            'current_expense' => round($currentExpense, 2),
            'current_balance' => round($currentBalance, 2),
            'future_income' => round($futureIncome, 2),
            'future_expenses' => round($futureExpenses, 2),
            'projected_balance' => round($projectedBalance, 2),
            'period_start' => $periodStart->toDateString(),
            'period_end' => $periodEnd->toDateString(),
            'current_transactions' => $currentTransactions,
            'future_income_items' => $futureIncomeItems,
            'future_expense_items' => $futureExpenseItems,
            'projected_items' => $projectedItems,
        ];
    }

    private function projectRecurringRules(User $user, Carbon $windowStart, Carbon $windowEnd): array
    {
        $futureIncome = 0.0;
        $futureExpense = 0.0;
        $futureIncomeItems = [];
        $futureExpenseItems = [];

        $rules = RecurringRule::query()
            ->where('user_id', $user->id)
            ->where('is_active', true)
            ->orderBy('next_run_date')
            ->get();

        foreach ($rules as $rule) {
            $ruleEndDate = $rule->end_date ? Carbon::parse($rule->end_date) : null;
            $occurrence = Carbon::parse($rule->next_run_date);

            while ($occurrence->lt($windowStart)) {
                if ($ruleEndDate && $occurrence->gt($ruleEndDate)) {
                    continue 2;
                }

                $occurrence = $this->advanceDate($occurrence, $rule->frequency);
            }

            while ($occurrence->lte($windowEnd)) {
                if ($ruleEndDate && $occurrence->gt($ruleEndDate)) {
                    break;
                }

                if ($rule->type === 'income') {
                    $futureIncome += (float) $rule->amount;
                    $futureIncomeItems[] = [
                        'source' => 'recurring_rule',
                        'description' => $rule->description,
                        'amount' => (float) $rule->amount,
                        'date' => $occurrence->toDateString(),
                        'type' => 'income',
                    ];
                } else {
                    $futureExpense += (float) $rule->amount;
                    $futureExpenseItems[] = [
                        'source' => 'recurring_rule',
                        'description' => $rule->description,
                        'amount' => (float) $rule->amount,
                        'date' => $occurrence->toDateString(),
                        'type' => 'expense',
                    ];
                }

                $occurrence = $this->advanceDate($occurrence, $rule->frequency);
            }
        }

        return [$futureIncome, $futureExpense, $futureIncomeItems, $futureExpenseItems];
    }

    private function advanceDate(Carbon $date, string $frequency): Carbon
    {
        $nextDate = $date->copy();

        match ($frequency) {
            'daily' => $nextDate->addDay(),
            'weekly' => $nextDate->addWeek(),
            'monthly' => $nextDate->addMonth(),
            'yearly' => $nextDate->addYear(),
            default => $nextDate->addMonth(),
        };

        return $nextDate;
    }
}
