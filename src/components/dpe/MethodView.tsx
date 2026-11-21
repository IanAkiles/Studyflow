import { ExternalLink } from 'lucide-react';
import { dpeSources } from '../../data/dpeStudyPlan';

const PHASES: [string, string][] = [
  ['Semanas 1–4', 'Diagnóstico com prova de 2023. Base de Português, Constitucional e Administrativo. Questões desde o primeiro dia.'],
  ['Semanas 5–8', 'Direito institucional, legislação da Defensoria, organização administrativa e licitações na lei vigente.'],
  ['Semanas 9–12', 'Administração, orçamento, gestão de pessoas, processos, materiais e revisão das matérias com mais erros.'],
  ['Semanas 13–16', 'Dois simulados semanais, alternados com correção detalhada e revisão espaçada.'],
  ['Semanas 17–18', 'Reta final: legislação, caderno de erros, controle de tempo, sono e logística. Readequar à data oficial da prova.'],
];

const TECHNIQUES: [string, string][] = [
  ['Estudo ativo', 'Leia um tópico e feche o material. Explique sem olhar antes de marcar como revisado.'],
  ['Repetição espaçada', 'Revisões progressivas em 1, 3, 7, 14 e 30 dias após acertos; erros voltam em 1 dia.'],
  ['Caderno de erros', 'Para cada erro, anote assunto, causa do erro e regra correta em uma frase.'],
  ['Questões FCC', 'Faça blocos cronometrados de 15–25 questões; corrija todas, inclusive acertos por chute.'],
  ['Simulado completo', 'Reserve 3 horas, 60 questões e sem consulta, espelhando o formato de 2023; confira o formato de 2026.'],
  ['Metas mensuráveis', 'Busque ao menos 80% de acertos em treinos; é meta de estudo, não nota oficial de aprovação.'],
];

export function MethodView() {
  return (
    <div className="space-y-6">
      <section>
        <h3 className="font-display text-xl text-stone-900">Como o dia funciona</h3>
        <p className="mt-1 text-sm leading-relaxed text-stone-600">
          Cada sessão segue a mesma ordem: teoria nova, questões para testar e revisão do que já foi visto. As questões são autorais, feitas para treino; não são questões oficiais da FCC. Para provas reais, use os links abaixo.
        </p>
      </section>

      <section>
        <h3 className="font-display text-xl text-stone-900">Estratégia de preparação</h3>
        <div className="mt-3 grid gap-3 sm:grid-cols-2">
          {PHASES.map(([phase, text]) => (
            <div key={phase} className="rounded-2xl border border-stone-200/80 bg-white p-4">
              <h4 className="text-sm font-semibold text-sage-800">{phase}</h4>
              <p className="mt-1 text-sm leading-relaxed text-stone-600">{text}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="rounded-3xl bg-sage-50 border border-sage-100 p-5">
        <h3 className="font-display text-xl text-sage-900">Técnicas para seguir</h3>
        <dl className="mt-3 space-y-2.5">
          {TECHNIQUES.map(([title, desc]) => (
            <div key={title} className="text-sm leading-relaxed text-sage-900">
              <dt className="inline font-semibold">{title}: </dt>
              <dd className="inline text-sage-800">{desc}</dd>
            </div>
          ))}
        </dl>
      </section>

      <section>
        <h3 className="font-display text-xl text-stone-900">Provas, edital e legislação</h3>
        <ul className="mt-3 space-y-2">
          {dpeSources.map((s) => (
            <li key={s.url}>
              <a
                href={s.url}
                target="_blank"
                rel="noreferrer noopener"
                className="flex items-center justify-between gap-3 rounded-2xl border border-stone-200/80 bg-white px-4 py-3 text-sm font-medium text-sage-800 hover:bg-sage-50"
              >
                {s.label}
                <ExternalLink className="h-4 w-4 shrink-0 text-stone-400" aria-hidden />
              </a>
            </li>
          ))}
        </ul>
      </section>

      <p className="rounded-2xl border border-amber-200 bg-amber-50 p-4 text-sm leading-relaxed text-amber-900">
        <strong>Atualização obrigatória:</strong> o edital de 2023 citava leis antigas de licitações (Lei 8.666/1993 e Lei 10.520/2002), já revogadas. Estude a Lei 14.133/2021 e confirme no edital atual quais normas e conteúdos serão exigidos. Vagas em Manaus e datas de 2026 não estão confirmadas aqui.
      </p>
    </div>
  );
}
