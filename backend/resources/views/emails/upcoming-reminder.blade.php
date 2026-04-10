<x-mail::message>
# Ola, {{ $userName }}

@if ($kind === 'event')
Voce tem um evento proximo:
@else
Voce tem uma conta recorrente proxima do vencimento:
@endif

<x-mail::panel>
<strong>{{ $title }}</strong>
<br>
Data/Hora: {{ $when }}
</x-mail::panel>

Obrigado,<br>
{{ config('app.name') }}
</x-mail::message>
