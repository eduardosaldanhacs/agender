<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\Event;
use App\Models\FinancialGoal;
use App\Models\Note;
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

        Note::create([
            'user_id' => $user->id,
            'title' => 'Checklist da semana',
            'content' => "- Pagar aluguel\n- Revisar metas\n- Organizar comprovantes",
            'color' => '#FEF3C7',
            'is_pinned' => true,
        ]);

        Note::create([
            'user_id' => $user->id,
            'title' => 'Ideias de economia',
            'content' => "1. Renegociar plano de internet\n2. Consolidar assinaturas",
            'color' => '#DBEAFE',
            'is_pinned' => false,
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

        FinancialGoal::create([
            'user_id' => $user->id,
            'title' => 'Reserva de emergencia',
            'goal_type' => 'saving',
            'target_amount' => 12000,
            'current_amount' => 3500,
            'start_date' => Carbon::today()->startOfYear()->toDateString(),
            'end_date' => Carbon::today()->endOfYear()->toDateString(),
            'status' => 'active',
            'notes' => 'Aporte mensal minimo de R$ 800.',
        ]);

        FinancialGoal::create([
            'user_id' => $user->id,
            'category_id' => $leisure->id,
            'title' => 'Limite de lazer mensal',
            'goal_type' => 'expense_limit',
            'target_amount' => 600,
            'current_amount' => 180,
            'start_date' => Carbon::today()->startOfMonth()->toDateString(),
            'end_date' => Carbon::today()->endOfMonth()->toDateString(),
            'status' => 'active',
        ]);

        $this->callWith(AcademicSeeder::class, [
            'user' => $user,
        ]);
    }
}
