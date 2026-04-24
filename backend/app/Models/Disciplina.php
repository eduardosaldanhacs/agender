<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsToMany;
use Illuminate\Database\Eloquent\Relations\HasMany;

class Disciplina extends Model
{
    use HasFactory;

    protected $fillable = [
        'nome',
        'codigo',
        'creditos',
        'semestre_sugerido',
    ];

    protected function casts(): array
    {
        return [
            'creditos' => 'integer',
            'semestre_sugerido' => 'integer',
        ];
    }

    public function preRequisitos(): BelongsToMany
    {
        return $this->belongsToMany(
            self::class,
            'pre_requisitos',
            'disciplina_id',
            'pre_requisito_id'
        )->withTimestamps();
    }

    public function liberaDisciplinas(): BelongsToMany
    {
        return $this->belongsToMany(
            self::class,
            'pre_requisitos',
            'pre_requisito_id',
            'disciplina_id'
        )->withTimestamps();
    }

    public function usuarios(): HasMany
    {
        return $this->hasMany(DisciplinaUsuario::class);
    }
}
