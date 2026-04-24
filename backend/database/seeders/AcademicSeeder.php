<?php

namespace Database\Seeders;

use App\Models\Disciplina;
use App\Models\DisciplinaUsuario;
use App\Models\PreRequisito;
use App\Models\User;
use Illuminate\Database\Seeder;

class AcademicSeeder extends Seeder
{
    /**
     * Seed the academic planner curriculum.
     */
    public function run(?User $user = null): void
    {
        $disciplinas = [
            ['codigo' => 'CC101', 'nome' => 'Matemática Discreta', 'creditos' => 4, 'semestre_sugerido' => 1],
            ['codigo' => 'CC102', 'nome' => 'Metodologia Científica', 'creditos' => 2, 'semestre_sugerido' => 1],
            ['codigo' => 'CC103', 'nome' => 'Fundamentos de Programação', 'creditos' => 4, 'semestre_sugerido' => 1],
            ['codigo' => 'CC104', 'nome' => 'Ética e Cidadania', 'creditos' => 2, 'semestre_sugerido' => 1],
            ['codigo' => 'CC105', 'nome' => 'Introdução à Computação', 'creditos' => 2, 'semestre_sugerido' => 1],
            ['codigo' => 'CC106', 'nome' => 'Cálculo I', 'creditos' => 4, 'semestre_sugerido' => 1],
            ['codigo' => 'CC201', 'nome' => 'Lógica para Computação', 'creditos' => 4, 'semestre_sugerido' => 2],
            ['codigo' => 'CC202', 'nome' => 'Programação Orientada a Objetos', 'creditos' => 4, 'semestre_sugerido' => 2],
            ['codigo' => 'CC203', 'nome' => 'Algoritmos e Estruturas de Dados I', 'creditos' => 4, 'semestre_sugerido' => 2],
            ['codigo' => 'CC204', 'nome' => 'Banco de Dados I', 'creditos' => 4, 'semestre_sugerido' => 2],
            ['codigo' => 'CC205', 'nome' => 'Fundamentos de Sistemas Digitais', 'creditos' => 4, 'semestre_sugerido' => 2],
            ['codigo' => 'CC206', 'nome' => 'Cálculo II', 'creditos' => 4, 'semestre_sugerido' => 2],
            ['codigo' => 'CC301', 'nome' => 'Linguagens, Autômatos e Computabilidade', 'creditos' => 4, 'semestre_sugerido' => 3],
            ['codigo' => 'CC302', 'nome' => 'Prática em Pesquisa', 'creditos' => 2, 'semestre_sugerido' => 3],
            ['codigo' => 'CC303', 'nome' => 'Algoritmos e Estruturas de Dados II', 'creditos' => 4, 'semestre_sugerido' => 3],
            ['codigo' => 'CC304', 'nome' => 'Banco de Dados II', 'creditos' => 4, 'semestre_sugerido' => 3],
            ['codigo' => 'CC305', 'nome' => 'Organização e Arquitetura de Processadores', 'creditos' => 4, 'semestre_sugerido' => 3],
            ['codigo' => 'CC306', 'nome' => 'Probabilidade e Estatística', 'creditos' => 4, 'semestre_sugerido' => 3],
            ['codigo' => 'CC401', 'nome' => 'Fundamentos de Proc. Paralelo e Distribuído', 'creditos' => 4, 'semestre_sugerido' => 4],
            ['codigo' => 'CC402', 'nome' => 'Programação Funcional', 'creditos' => 4, 'semestre_sugerido' => 4],
            ['codigo' => 'CC403', 'nome' => 'Engenharia de Software I', 'creditos' => 4, 'semestre_sugerido' => 4],
            ['codigo' => 'CC404', 'nome' => 'Fundamentos de Desenvolvimento de Software', 'creditos' => 4, 'semestre_sugerido' => 4],
            ['codigo' => 'CC405', 'nome' => 'Infraestrutura para Gestão de Dados', 'creditos' => 4, 'semestre_sugerido' => 4],
            ['codigo' => 'CC406', 'nome' => 'Computação Gráfica', 'creditos' => 4, 'semestre_sugerido' => 4],
            ['codigo' => 'CC407', 'nome' => 'Álgebra Linear e Geometria Analítica', 'creditos' => 4, 'semestre_sugerido' => 4],
            ['codigo' => 'CC501', 'nome' => 'Teoria da Computabilidade e Complexidade', 'creditos' => 4, 'semestre_sugerido' => 5],
            ['codigo' => 'CC502', 'nome' => 'Engenharia de Software II', 'creditos' => 4, 'semestre_sugerido' => 5],
            ['codigo' => 'CC503', 'nome' => 'Experiência do Usuário', 'creditos' => 4, 'semestre_sugerido' => 5],
            ['codigo' => 'CC504', 'nome' => 'Projeto e Otimização de Algoritmos', 'creditos' => 4, 'semestre_sugerido' => 5],
            ['codigo' => 'CC505', 'nome' => 'Projeto e Desenvolvimento de Jogos', 'creditos' => 4, 'semestre_sugerido' => 5],
            ['codigo' => 'CC506', 'nome' => 'Sistemas Operacionais', 'creditos' => 4, 'semestre_sugerido' => 5],
            ['codigo' => 'CC507', 'nome' => 'Métodos Numéricos', 'creditos' => 4, 'semestre_sugerido' => 5],
            ['codigo' => 'CC601', 'nome' => 'Métodos Formais', 'creditos' => 4, 'semestre_sugerido' => 6],
            ['codigo' => 'CC602', 'nome' => 'Prática em Engenharia de Software', 'creditos' => 4, 'semestre_sugerido' => 6],
            ['codigo' => 'CC603', 'nome' => 'Inteligência Artificial', 'creditos' => 4, 'semestre_sugerido' => 6],
            ['codigo' => 'CC604', 'nome' => 'Aprendizado de Máquina', 'creditos' => 4, 'semestre_sugerido' => 6],
            ['codigo' => 'CC605', 'nome' => 'Fundamentos de Redes de Computadores', 'creditos' => 4, 'semestre_sugerido' => 6],
            ['codigo' => 'CC606', 'nome' => 'Laboratório de Redes de Computadores', 'creditos' => 2, 'semestre_sugerido' => 6],
            ['codigo' => 'CC607', 'nome' => 'Laboratório de Sistemas Operacionais', 'creditos' => 2, 'semestre_sugerido' => 6],
            ['codigo' => 'CC701', 'nome' => 'Trabalho de Conclusão I', 'creditos' => 4, 'semestre_sugerido' => 7],
            ['codigo' => 'CC702', 'nome' => 'Construção de Compiladores', 'creditos' => 4, 'semestre_sugerido' => 7],
            ['codigo' => 'CC703', 'nome' => 'Redes de Computadores', 'creditos' => 4, 'semestre_sugerido' => 7],
            ['codigo' => 'CC704', 'nome' => 'Sistemas Distribuídos', 'creditos' => 4, 'semestre_sugerido' => 7],
            ['codigo' => 'CC705', 'nome' => 'Simulação e Métodos Analíticos', 'creditos' => 4, 'semestre_sugerido' => 7],
            ['codigo' => 'CC801', 'nome' => 'Trabalho de Conclusão II', 'creditos' => 4, 'semestre_sugerido' => 8],
            ['codigo' => 'CC802', 'nome' => 'Humanismo e Cultura Religiosa', 'creditos' => 2, 'semestre_sugerido' => 8],
            ['codigo' => 'CC803', 'nome' => 'Segurança de Sistemas', 'creditos' => 4, 'semestre_sugerido' => 8],
            ['codigo' => 'CC804', 'nome' => 'Computação Paralela', 'creditos' => 4, 'semestre_sugerido' => 8],
        ];

        $codigos = collect($disciplinas)->pluck('codigo');

        Disciplina::query()
            ->whereNotIn('codigo', $codigos)
            ->delete();

        foreach ($disciplinas as $disciplina) {
            Disciplina::query()->updateOrCreate(
                ['codigo' => $disciplina['codigo']],
                $disciplina
            );
        }

        $ids = Disciplina::query()->pluck('id', 'codigo');
        $preRequisitos = [
            'CC202' => ['CC103'],
            'CC203' => ['CC202'],
            'CC206' => ['CC106'],
            'CC303' => ['CC203'],
            'CC304' => ['CC204'],
            'CC306' => ['CC206'],
            'CC403' => ['CC303'],
            'CC405' => ['CC304'],
            'CC501' => ['CC301'],
            'CC502' => ['CC403'],
            'CC504' => ['CC303'],
            'CC506' => ['CC305'],
            'CC507' => ['CC306'],
            'CC602' => ['CC502'],
            'CC603' => ['CC303'],
            'CC604' => ['CC603'],
            'CC606' => ['CC605'],
            'CC607' => ['CC506'],
            'CC702' => ['CC301'],
            'CC703' => ['CC605'],
            'CC704' => ['CC703'],
            'CC801' => ['CC701'],
            'CC803' => ['CC703'],
            'CC804' => ['CC401'],
        ];

        PreRequisito::query()
            ->whereIn('disciplina_id', $ids)
            ->delete();

        foreach ($preRequisitos as $disciplinaCodigo => $requisitos) {
            foreach ($requisitos as $requisitoCodigo) {
                PreRequisito::query()->updateOrCreate([
                    'disciplina_id' => $ids[$disciplinaCodigo],
                    'pre_requisito_id' => $ids[$requisitoCodigo],
                ]);
            }
        }

        if (! $user || ! $user->exists) {
            return;
        }

        foreach (['CC101', 'CC102', 'CC103', 'CC104', 'CC105', 'CC106'] as $codigo) {
            DisciplinaUsuario::query()->updateOrCreate(
                ['user_id' => $user->id, 'disciplina_id' => $ids[$codigo]],
                ['status' => 'concluida']
            );
        }

        foreach (['CC201', 'CC202', 'CC203', 'CC204', 'CC205', 'CC206'] as $codigo) {
            DisciplinaUsuario::query()->updateOrCreate(
                ['user_id' => $user->id, 'disciplina_id' => $ids[$codigo]],
                ['status' => 'planejada']
            );
        }
    }
}
