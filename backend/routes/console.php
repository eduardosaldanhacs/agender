<?php

use App\Jobs\GenerateRecurringTransactions;
use App\Jobs\SendUpcomingReminders;
use Illuminate\Foundation\Inspiring;
use Illuminate\Support\Facades\Artisan;
use Illuminate\Support\Facades\Schedule;

Artisan::command('inspire', function () {
    $this->comment(Inspiring::quote());
})->purpose('Display an inspiring quote');

Schedule::job(new GenerateRecurringTransactions())->hourly();
Schedule::job(new SendUpcomingReminders())->everyThirtyMinutes();
