<?php

namespace App\Jobs;

use App\Models\RecurringRule;
use App\Models\Transaction;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Carbon;

class GenerateRecurringTransactions implements ShouldQueue
{
    use Queueable;

    /**
     * Create a new job instance.
     */
    public function __construct() {}

    /**
     * Execute the job.
     */
    public function handle(): void
    {
        $today = Carbon::today();

        RecurringRule::query()
            ->where('is_active', true)
            ->whereDate('next_run_date', '<=', $today)
            ->orderBy('next_run_date')
            ->chunkById(100, function ($rules) {
                foreach ($rules as $rule) {
                    if ($rule->end_date && Carbon::parse($rule->end_date)->lt(Carbon::today())) {
                        $rule->update(['is_active' => false]);
                        continue;
                    }

                    Transaction::create([
                        'user_id' => $rule->user_id,
                        'category_id' => $rule->category_id,
                        'recurring_rule_id' => $rule->id,
                        'description' => $rule->description,
                        'amount' => $rule->amount,
                        'transaction_date' => $rule->next_run_date,
                        'type' => $rule->type,
                    ]);

                    $nextDate = Carbon::parse($rule->next_run_date);

                    match ($rule->frequency) {
                        'daily' => $nextDate->addDay(),
                        'weekly' => $nextDate->addWeek(),
                        'monthly' => $nextDate->addMonth(),
                        'yearly' => $nextDate->addYear(),
                    };

                    $rule->update([
                        'next_run_date' => $nextDate->toDateString(),
                        'last_generated_at' => now(),
                    ]);
                }
            });
    }
}
