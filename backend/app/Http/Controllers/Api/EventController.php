<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Http\Requests\EventStoreRequest;
use App\Http\Requests\EventUpdateRequest;
use App\Models\Event;
use Illuminate\Http\JsonResponse;
use Illuminate\Http\Request;

class EventController extends Controller
{
    public function index(Request $request): JsonResponse
    {
        $events = $request->user()
            ->events()
            ->when($request->filled('start') && $request->filled('end'), function ($query) use ($request) {
                $query->whereBetween('event_date', [$request->string('start'), $request->string('end')]);
            })
            ->orderBy('event_date')
            ->orderBy('event_time')
            ->get();

        return response()->json($events);
    }

    public function store(EventStoreRequest $request): JsonResponse
    {
        $event = $request->user()->events()->create($request->validated());

        return response()->json($event, 201);
    }

    public function show(Request $request, Event $event): JsonResponse
    {
        abort_if($event->user_id !== $request->user()->id, 404);

        return response()->json($event);
    }

    public function update(EventUpdateRequest $request, Event $event): JsonResponse
    {
        abort_if($event->user_id !== $request->user()->id, 404);

        $event->update($request->validated());

        return response()->json($event);
    }

    public function destroy(Request $request, Event $event): JsonResponse
    {
        abort_if($event->user_id !== $request->user()->id, 404);

        $event->delete();

        return response()->json([
            'message' => 'Evento removido com sucesso.',
        ]);
    }
}
