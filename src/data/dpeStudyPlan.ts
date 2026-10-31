/**
 * Plano DPE-AM baseado no Anexo II do Edital 01/2023 (FCC).
 * Não é a transcrição nem confirmação do edital de 2026.
 * Referências: https://cdn.direcaoconcursos.com.br/uploads/2023/08/Edital_DPE_AM_.pdf
 * Prova 2023: https://www.qconcursos.com/questoes-de-concursos/provas/fcc-2023-dpe-am-assistente-tecnico-de-defensoria-especialidade-assistente-tecnico-administrativo
 */
export type DpeTopic = { id: string; label: string; priority: 1 | 2 | 3; task: string; subject: string };
export type DpeGroup = { id: string; title: string; context: string; topics: DpeTopic[] };
const parse = (subject: string, input: string): DpeTopic[] =>
  input.trim().split('\n').map((row, index) => {
    const [label, p, task] = row.split('|');
    return { id: subject + '-' + index, label, priority: Number(p) as 1 | 2 | 3, task, subject };
  });

export const dpeGroups: DpeGroup[] = [
  {
    id: 'portugues', title: 'Língua Portuguesa', context: 'Conhecimentos gerais — Anexo II/2023',
    topics: parse('portugues', `
Compreensão e interpretação de textos|1|Resuma o argumento central e identifique informações explícitas e implícitas.
Coesão textual e conectivos|1|Explique a relação entre duas orações e substitua conectivos preservando o sentido.
Sintaxe: período simples e composto|1|Identifique termos da oração, coordenação e subordinação.
Concordância verbal e nominal|1|Resolva 15 questões e justifique a concordância.
Regência verbal e nominal|1|Crie exemplos com regência e uso correto de preposições.
Pontuação, especialmente vírgula|1|Corrija pontuação sem alterar sentido.
Pronomes: emprego e colocação|2|Diferencie próclise, mesóclise e ênclise em exemplos.
Flexão nominal e verbal|2|Classifique flexões e identifique usos adequados.
Tempos e modos verbais|2|Compare valores de indicativo, subjuntivo e imperativo.
Vozes verbais|2|Converta frases entre voz ativa e passiva.
Ortografia oficial|2|Resolva questões de grafia e vocabulário.
Acentuação gráfica|2|Reveja regras e faça questões FCC.
Redação e correção de frases|2|Identifique a alternativa com frase gramaticalmente correta.
Tipos e gêneros textuais|2|Identifique finalidade, estrutura e público.
Adequação da linguagem e formato do documento|3|Reescreva comunicação formal adequada ao contexto.
`)
  },
  {
    id: 'juridico', title: 'Jurídico e institucional', context: 'Conhecimentos gerais — Anexo II/2023',
    topics: parse('juridico', `
Constituição Federal: arts. 1º a 4º|1|Leia os princípios fundamentais e faça 10 questões.
Constituição Federal: art. 5º|1|Revise direitos, garantias e remédios constitucionais.
Constituição Federal: arts. 6º a 17|1|Resuma direitos sociais, nacionalidade e direitos políticos.
Constituição Federal: arts. 18 a 43|2|Estude entes federativos e repartição de competências.
Constituição Federal: arts. 44 a 135|2|Mapeie organização dos poderes e funções essenciais à Justiça.
Constituição Federal: arts. 136 a 144|3|Revise defesa do Estado e segurança pública.
Constituição do Amazonas: arts. 102 e 103|1|Leia os dispositivos e explique a Defensoria no estado.
Lei Complementar Federal 80/1994 e LC 132/2009|1|Monte mapa da organização, princípios e funções da Defensoria.
Lei Complementar AM 01/1990|1|Estude a estrutura e competência da DPE-AM no texto atualizado.
Lei Estadual AM 4.077/2014|1|Revise cargos, atribuições e estrutura de servidores auxiliares.
Código Penal: arts. 312 a 327|2|Diferencie peculato, corrupção passiva, concussão e prevaricação.
Improbidade administrativa: Lei 8.429/1992|1|Estude arts. 1º a 12 com mudanças legislativas vigentes.
`)
  },
  {
    id: 'constitucional', title: 'Direito Constitucional', context: 'Conhecimentos específicos — Anexo II/2023',
    topics: parse('constitucional', `
Princípios fundamentais e fundamentos da República|1|Compare fundamentos, objetivos e relações internacionais.
Direitos individuais e coletivos|1|Resolva questões sobre garantias e remédios constitucionais.
Direitos sociais, nacionalidade e direitos políticos|1|Crie quadro comparativo e faça 10 questões.
Administração pública: art. 37|1|Memorize LIMPE, concurso, acumulação e regras de servidores.
Servidores públicos: arts. 39 a 41|1|Diferencie estabilidade, remuneração e direitos.
Organização político-administrativa|1|Separe competências de União, estados e municípios.
Organização dos Poderes|1|Explique funções típicas e atípicas de cada Poder.
Processo legislativo|2|Revise iniciativa, espécies normativas e emendas.
Tributação, orçamento e ordem econômica|2|Revise princípios gerais e estruturas constitucionais.
`)
  },
  {
    id: 'administrativo', title: 'Direito Administrativo', context: 'Conhecimentos específicos — Anexo II/2023',
    topics: parse('administrativo', `
Princípios da Administração Pública|1|Explique legalidade, impessoalidade, moralidade, publicidade e eficiência.
Administração direta e indireta|1|Compare autarquias, fundações, empresas públicas e sociedades de economia mista.
Centralização, descentralização, concentração|1|Faça tabela e resolva 15 questões de distinção.
Atos administrativos: elementos e requisitos|1|Identifique competência, finalidade, forma, motivo e objeto.
Atos administrativos: atributos e classificação|1|Faça questões sobre presunção, imperatividade e autoexecutoriedade.
Anulação, revogação e convalidação|1|Explique diferenças e consequências em casos práticos.
Serviços públicos e formas de delegação|2|Diferencie concessão, permissão e autorização.
Licitações e contratos: Lei 14.133/2021|1|Revise princípios, fases, modalidades, contratação direta e sanções.
Parcerias público-privadas|3|Estude características e hipóteses gerais.
Controle da Administração: interno, externo e judicial|1|Compare formas de controle e competência de Tribunais de Contas.
`)
  },
  {
    id: 'gestao', title: 'Administração e gestão pública', context: 'Conhecimentos específicos — Anexo II/2023',
    topics: parse('gestao', `
Funções da administração: PODC|1|Exemplifique planejamento, organização, direção e controle.
Planejamento estratégico, tático e operacional|1|Crie uma matriz com objetivos e indicadores.
Modelos patrimonialista, burocrático e gerencial|1|Compare características e limitações.
Gestão por processos e fluxo de trabalho|1|Desenhe um fluxo de atendimento administrativo.
Governança e accountability|1|Explique transparência, prestação de contas e responsabilização.
Qualidade e avaliação de desempenho|2|Monte exemplos de indicadores, metas e melhoria.
Cultura organizacional|2|Diferencie valores, normas e clima.
Motivação e liderança|2|Compare teorias e estilos em situações de equipe.
Orçamento: conceito e princípios|1|Estude unidade, universalidade, anualidade e demais princípios.
PPA, LDO e LOA|1|Compare finalidade, horizonte e relação entre instrumentos.
Licitações e contratos aplicados à gestão|1|Resolva casos de contratação pública sob a lei vigente.
Administração de materiais e patrimônio|1|Classifique itens e simule controle de almoxarifado.
`)
  },
  {
    id: 'materiais', title: 'Materiais e patrimônio', context: 'Desdobramento do tópico de Administração — Anexo II/2023',
    topics: parse('materiais', `
Classificação e catalogação de materiais|1|Diferencie identificação, codificação, cadastramento e catalogação.
Dimensionamento e controle de estoques|1|Resolva casos de estoque mínimo e ponto de reposição.
Localização e armazenagem de materiais|2|Organize um pequeno almoxarifado simulado.
Controle patrimonial e inventário|2|Diferencie bens permanentes e de consumo.
`)
  }
];

export const dpeSources = [
  {label:'Edital DPE-AM 2023 — Anexo II (base histórica)', url:'https://cdn.direcaoconcursos.com.br/uploads/2023/08/Edital_DPE_AM_.pdf'},
  {label:'Prova real FCC DPE-AM 2023 — Assistente Administrativo', url:'https://www.qconcursos.com/questoes-de-concursos/provas/fcc-2023-dpe-am-assistente-tecnico-de-defensoria-especialidade-assistente-tecnico-administrativo'},
  {label:'Provas anteriores DPE-AM (2019, 2022 e 2023)', url:'https://questoes.grancursosonline.com.br/prova/dpe-am-am-2023-fcc-assistente-tecnico-de-defensoria-assistente-tecnico-administrativo'},
  {label:'Portal oficial da DPE-AM — conferir edital e retificações', url:'https://diario.defensoria.am.def.br/'},
  {label:'Portal oficial da banca FCC', url:'https://www.concursosfcc.com.br/'},
  {label:'Constituição Federal vigente', url:'https://www.planalto.gov.br/ccivil_03/constituicao/constituicao.htm'},
  {label:'Lei Complementar 80/1994 — Defensoria', url:'https://www.planalto.gov.br/ccivil_03/leis/lcp/lcp80.htm'},
  {label:'Lei 14.133/2021 — Licitações', url:'https://www.planalto.gov.br/ccivil_03/_ato2019-2022/2021/lei/l14133.htm'},
  {label:'Lei 8.429/1992 — Improbidade', url:'https://www.planalto.gov.br/ccivil_03/leis/l8429.htm'},
  {label:'Código Penal vigente', url:'https://www.planalto.gov.br/ccivil_03/decreto-lei/del2848compilado.htm'},
];

export type DpeQuestion = { subject: string; prompt: string; options: string[]; correct: number; explanation: string };
/** Questões autorais, inspiradas em assuntos previstos, NÃO são questões oficiais da FCC. */
export const dpeQuestions: DpeQuestion[] = [
  {subject:'Português',prompt:'No enunciado “Embora estivesse cansada, concluiu o relatório”, a oração inicial expressa:',options:['causa','condição','concessão','finalidade','comparação'],correct:2,explanation:'“Embora” estabelece concessão: o cansaço não impediu a conclusão.'},
  {subject:'Português',prompt:'Assinale a frase com concordância verbal adequada:',options:['Houveram muitos candidatos.','Fazem três meses que estudo.','Existem documentos pendentes.','Deve haverem novas provas.','Foi entregue os relatórios.'],correct:2,explanation:'O verbo existir concorda com “documentos”. Haver impessoal e fazer temporal ficam no singular.'},
  {subject:'Português',prompt:'Na frase “O servidor arquivou os documentos, pois o prazo havia encerrado”, o termo “pois” introduz:',options:['oposição','explicação/causa','alternância','comparação','consequência obrigatória'],correct:1,explanation:'“Pois” conecta a conclusão à justificativa/causa expressa na oração seguinte.'},
  {subject:'Português',prompt:'Em “Os processos foram analisados pela equipe”, ocorre:',options:['voz reflexiva','voz ativa','voz passiva analítica','sujeito indeterminado','oração sem sujeito'],correct:2,explanation:'Estrutura ser + particípio, com agente da passiva (“pela equipe”).'},
  {subject:'Constitucional',prompt:'O princípio que proíbe promoção pessoal de agentes em publicidade institucional é:',options:['eficiência','impessoalidade','hierarquia','continuidade','autotutela'],correct:1,explanation:'Impessoalidade exige finalidade pública e evita promoção pessoal do agente.'},
  {subject:'Constitucional',prompt:'Segundo a Constituição, os Municípios são:',options:['órgãos da União','entidades da administração indireta','entes da organização político-administrativa','subordinados hierarquicamente aos estados','poderes da República'],correct:2,explanation:'A organização político-administrativa compreende União, estados, DF e municípios, todos autônomos nos termos constitucionais.'},
  {subject:'Administrativo',prompt:'A retirada de ato válido por razões de conveniência e oportunidade denomina-se:',options:['anulação','revogação','convalidação','cassação penal','homologação judicial'],correct:1,explanation:'Revogação atua sobre ato válido por mérito administrativo; anulação recai sobre ilegalidade.'},
  {subject:'Administrativo',prompt:'São integrantes da administração indireta:',options:['Ministérios e secretarias','Somente órgãos policiais','Autarquias e fundações públicas','Somente gabinetes de governo','Apenas tribunais'],correct:2,explanation:'Autarquias e fundações públicas integram a administração indireta, ao lado de empresas públicas e sociedades de economia mista.'},
  {subject:'Gestão pública',prompt:'No ciclo de gestão, comparar resultados com metas e corrigir desvios corresponde a:',options:['direção','organização','planejamento','controle','delegação'],correct:3,explanation:'Controle acompanha resultados e corrige desvios em relação ao planejado.'},
  {subject:'Gestão pública',prompt:'O modelo burocrático de administração pública enfatiza:',options:['patrimônio pessoal do governante','regras e impessoalidade','ausência de procedimentos','favoritismo','metas sem controles'],correct:1,explanation:'O modelo burocrático busca procedimentos formalizados, impessoalidade e profissionalização.'},
  {subject:'Orçamento',prompt:'Qual instrumento estabelece metas e prioridades para orientar a elaboração da LOA?',options:['PPA','LDO','RREO','RAP','Balanço patrimonial'],correct:1,explanation:'A Lei de Diretrizes Orçamentárias orienta a elaboração do orçamento anual; o PPA estabelece diretrizes de médio prazo.'},
  {subject:'Materiais',prompt:'Agrupar itens por atributos semelhantes para facilitar a gestão de estoques chama-se:',options:['classificação de materiais','reposição imediata','liquidação da despesa','alienação patrimonial','inventário contábil'],correct:0,explanation:'A classificação organiza materiais por características para facilitar controle, aquisição e estoque.'},
];
