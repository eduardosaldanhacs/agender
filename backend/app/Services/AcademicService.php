<?php

namespace App\Services;

use App\Models\Disciplina;
use App\Models\DisciplinaUsuario;
use Illuminate\Database\Eloquent\Collection;
use Illuminate\Validation\ValidationException;

class AcademicService
{
    /**
     * @return Collection<int, Disciplina>
     */
    public function listarDisciplinasComContexto(int $userId): Collection
    {
        $disciplinas = Disciplina::query()
            ->with([
                'preRequisitos:id,nome,codigo,creditos,semestre_sugerido',
                'liberaDisciplinas:id,nome,codigo,creditos,semestre_sugerido',
            ])
            ->orderBy('semestre_sugerido')
            ->orderBy('nome')
            ->get();

        $statuses = $this->statusPorDisciplina($userId);

        return $disciplinas->map(function (Disciplina $disciplina) use ($statuses, $userId) {
            $status = $statuses[$disciplina->id] ?? null;

            $disciplina->setAttribute('status_usuario', $status ?? 'bloqueada');
            $disciplina->setAttribute('liberada', $this->verificarDisciplinaLiberada($disciplina->id, $userId));

            return $disciplina;
        });
    }

    public function verificarDisciplinaLiberada(int $disciplinaId, int $userId): bool
    {
        $preRequisitos = Disciplina::query()
            ->whereKey($disciplinaId)
            ->with('preRequisitos:id')
            ->firstOrFail()
            ->preRequisitos
            ->pluck('id');

        if ($preRequisitos->isEmpty()) {
            return true;
        }

        $concluidas = DisciplinaUsuario::query()
            ->where('user_id', $userId)
            ->where('status', 'concluida')
            ->whereIn('disciplina_id', $preRequisitos)
            ->pluck('disciplina_id');

        return $preRequisitos->diff($concluidas)->isEmpty();
    }

    /**
     * @return Collection<int, Disciplina>
     */
    public function disciplinasDisponiveis(int $userId): Collection
    {
        return $this->listarDisciplinasComContexto($userId)
            ->filter(fn (Disciplina $disciplina) => $disciplina->liberada && $disciplina->status_usuario !== 'concluida')
            ->values();
    }

    /**
     * @return Collection<int, Disciplina>
     */
    public function getDisciplinasLiberadas(int $disciplinaId, int $userId): Collection
    {
        $statusConcluidas = $this->statusPorDisciplina($userId)
            ->filter(fn (string $status) => $status === 'concluida')
            ->keys()
            ->push($disciplinaId)
            ->unique();

        return Disciplina::query()
            ->whereHas('preRequisitos', fn ($query) => $query->whereKey($disciplinaId))
            ->with('preRequisitos:id,nome,codigo')
            ->orderBy('semestre_sugerido')
            ->orderBy('nome')
            ->get()
            ->filter(function (Disciplina $disciplina) use ($statusConcluidas) {
                return $disciplina->preRequisitos->pluck('id')->diff($statusConcluidas)->isEmpty();
            })
            ->values();
    }

    /**
     * @return array<string, mixed>
     */
    public function calcularProgresso(int $userId): array
    {
        $totalCreditos = (int) Disciplina::query()->sum('creditos');
        $creditosConcluidos = (int) Disciplina::query()
            ->whereHas('usuarios', fn ($query) => $query->where('user_id', $userId)->where('status', 'concluida'))
            ->sum('creditos');

        return [
            'total_creditos' => $totalCreditos,
            'creditos_concluidos' => $creditosConcluidos,
            'creditos_restantes' => max($totalCreditos - $creditosConcluidos, 0),
            'percentual_conclusao' => $totalCreditos > 0 ? round(($creditosConcluidos / $totalCreditos) * 100, 2) : 0,
            'semestre_estimado_formatura' => $this->calcularPrevisaoFormatura($userId),
        ];
    }

    public function calcularPrevisaoFormatura(int $userId, int $creditosPorSemestre = 20): string
    {
        $creditosRestantes = $this->creditosRestantes($userId);

        if ($creditosRestantes <= 0) {
            return 'Curso concluido';
        }

        $semestresRestantes = (int) ceil($creditosRestantes / max($creditosPorSemestre, 1));
        $anoAtual = (int) now()->format('Y');
        $semestreAtual = (int) now()->format('n') <= 6 ? 1 : 2;

        $indice = ($anoAtual * 2) + ($semestreAtual - 1) + $semestresRestantes;
        $ano = intdiv($indice, 2);
        $semestre = ($indice % 2) + 1;

        return "{$ano}/{$semestre}";
    }

    public function atualizarStatus(int $userId, int $disciplinaId, string $status): DisciplinaUsuario
    {
        Disciplina::query()->whereKey($disciplinaId)->firstOrFail();

        if (in_array($status, ['planejada', 'cursando', 'concluida'], true) && ! $this->verificarDisciplinaLiberada($disciplinaId, $userId)) {
            throw ValidationException::withMessages([
                'disciplina_id' => 'Disciplina bloqueada por pre-requisitos pendentes.',
            ]);
        }

        return DisciplinaUsuario::query()->updateOrCreate(
            [
                'user_id' => $userId,
                'disciplina_id' => $disciplinaId,
            ],
            [
                'status' => $status,
            ]
        );
    }

    /**
     * @return \Illuminate\Support\Collection<int, string>
     */
    private function statusPorDisciplina(int $userId)
    {
        return DisciplinaUsuario::query()
            ->where('user_id', $userId)
            ->pluck('status', 'disciplina_id');
    }

    private function creditosRestantes(int $userId): int
    {
        $totalCreditos = (int) Disciplina::query()->sum('creditos');
        $creditosConcluidos = (int) Disciplina::query()
            ->whereHas('usuarios', fn ($query) => $query->where('user_id', $userId)->where('status', 'concluida'))
            ->sum('creditos');

        return max($totalCreditos - $creditosConcluidos, 0);
    }
}
