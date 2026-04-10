<?php

namespace App\Jobs;

use App\Mail\UpcomingReminderMail;
use App\Models\Event;
use App\Models\RecurringRule;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Foundation\Queue\Queueable;
use Illuminate\Support\Facades\Mail;

class SendUpcomingReminders implements ShouldQueue
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
        $windowEnd = now()->addDay();

        Event::query()
            ->with('user:id,email,name')
            ->whereNotNull('reminder_at')
            ->where('reminder_sent', false)
            ->whereBetween('reminder_at', [now(), $windowEnd])
            ->chunkById(100, function ($events) {
                foreach ($events as $event) {
                    if (! $event->user?->email) {
                        continue;
                    }

                    Mail::to($event->user->email)->queue(new UpcomingReminderMail(
                        $event->user->name,
                        'event',
                        $event->title,
                        $event->reminder_at
                    ));

                    $event->update(['reminder_sent' => true]);
                }
            });

        RecurringRule::query()
            ->with('user:id,email,name')
            ->where('is_active', true)
            ->where('type', 'expense')
            ->whereDate('next_run_date', '<=', now()->addDays(2)->toDateString())
            ->chunkById(100, function ($rules) {
                foreach ($rules as $rule) {
                    if (! $rule->user?->email) {
                        continue;
                    }

                    Mail::to($rule->user->email)->queue(new UpcomingReminderMail(
                        $rule->user->name,
                        'bill',
                        $rule->description,
                        $rule->next_run_date
                    ));
                }
            });
    }
}
