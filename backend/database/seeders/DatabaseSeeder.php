<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Event;
use App\Models\RecurringRule;
use App\Models\Transaction;
use App\Models\User;
// use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Carbon;

class DatabaseSeeder extends Seeder
{
    /**
     * Seed the application's database.
     */
    public function run(): void
    {
        $user = User::factory()->create([
            'name' => 'Julia Teste',
            'email' => 'julia@example.com',
            'password' => 'password123',
        ]);

        $salary = Category::create([
            'user_id' => $user->id,
            'name' => 'Salario',
            'color' => '#16A34A',
        ]);

        $housing = Category::create([
            'user_id' => $user->id,
            'name' => 'Moradia',
            'color' => '#DC2626',
        ]);

        $leisure = Category::create([
            'user_id' => $user->id,
            'name' => 'Lazer',
            'color' => '#2563EB',
        ]);

        Transaction::create([
            'user_id' => $user->id,
            'category_id' => $salary->id,
            'description' => 'Salario mensal',
            'amount' => 5500,
            'transaction_date' => Carbon::today()->startOfMonth()->toDateString(),
            'type' => 'income',
        ]);

        Transaction::create([
            'user_id' => $user->id,
            'category_id' => $housing->id,
            'description' => 'Aluguel',
            'amount' => 1800,
            'transaction_date' => Carbon::today()->toDateString(),
            'type' => 'expense',
        ]);

        Transaction::create([
            'user_id' => $user->id,
            'category_id' => $leisure->id,
            'description' => 'Cinema',
            'amount' => 80,
            'transaction_date' => Carbon::today()->subDays(2)->toDateString(),
            'type' => 'expense',
        ]);

        Event::create([
            'user_id' => $user->id,
            'title' => 'Consulta medica',
            'description' => 'Levar exames anteriores.',
            'event_date' => Carbon::today()->addDays(3)->toDateString(),
            'event_time' => '09:30:00',
            'reminder_at' => Carbon::now()->addDay()->toDateTimeString(),
            'reminder_sent' => false,
        ]);

        Event::create([
            'user_id' => $user->id,
            'title' => 'Reuniao de planejamento',
            'description' => 'Revisar metas do mes.',
            'event_date' => Carbon::today()->addDays(7)->toDateString(),
            'event_time' => '14:00:00',
            'reminder_at' => Carbon::now()->addDays(2)->toDateTimeString(),
            'reminder_sent' => false,
        ]);

        RecurringRule::create([
            'user_id' => $user->id,
            'category_id' => $housing->id,
            'description' => 'Assinatura streaming',
            'amount' => 39.90,
            'type' => 'expense',
            'frequency' => 'monthly',
            'next_run_date' => Carbon::today()->addMonth()->startOfMonth()->toDateString(),
            'is_active' => true,
        ]);
    }
}
