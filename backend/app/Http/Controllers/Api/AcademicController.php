<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Disciplina;
use App\Services\AcademicService;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;
use Illuminate\Validation\Rule;

class AcademicController extends Controller
{
    public function __construct(private readonly AcademicService $academicService)
    {
    }

    public function index(Request $request): JsonResponse
    {
        return response()->json($this->academicService->listarDisciplinasComContexto($request->user()->id));
    }

    public function disponiveis(Request $request): JsonResponse
    {
        return response()->json($this->academicService->disciplinasDisponiveis($request->user()->id));
    }

    public function status(Request $request): JsonResponse
    {
        $validated = $request->validate([
            'disciplina_id' => ['required', 'integer', Rule::exists('disciplinas', 'id')],
            'status' => ['required', Rule::in(['bloqueada', 'planejada', 'cursando', 'concluida'])],
        ]);

        $status = $this->academicService->atualizarStatus(
            $request->user()->id,
            (int) $validated['disciplina_id'],
            $validated['status']
        );

        return response()->json($status->load('disciplina.preRequisitos', 'disciplina.liberaDisciplinas'));
    }

    public function progresso(Request $request): JsonResponse
    {
        return response()->json($this->academicService->calcularProgresso($request->user()->id));
    }

    public function liberadas(Request $request, Disciplina $disciplina): JsonResponse
    {
        return response()->json($this->academicService->getDisciplinasLiberadas($disciplina->id, $request->user()->id));
    }
}
