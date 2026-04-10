<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\NoteStoreRequest;
use App\Http\Requests\NoteUpdateRequest;
use App\Models\Note;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class NoteController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $notes = $request->user()
            ->notes()
            ->orderByDesc('is_pinned')
            ->orderByDesc('updated_at')
            ->get();

        return response()->json($notes);
    }

    public function store(NoteStoreRequest $request): JsonResponse
    {
        $note = $request->user()->notes()->create($request->validated());

        return response()->json($note, 201);
    }

    public function show(Request $request, Note $note): JsonResponse
    {
        abort_if($note->user_id !== $request->user()->id, 404);

        return response()->json($note);
    }

    public function update(NoteUpdateRequest $request, Note $note): JsonResponse
    {
        abort_if($note->user_id !== $request->user()->id, 404);

        $note->update($request->validated());

        return response()->json($note);
    }

    public function destroy(Request $request, Note $note): JsonResponse
    {
        abort_if($note->user_id !== $request->user()->id, 404);

        $note->delete();

        return response()->json([
            'message' => 'Anotacao removida com sucesso.',
        ]);
    }
}
