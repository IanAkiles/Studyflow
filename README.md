# StudyFlow

Organizador de objetivos de estudo com prazos, status e filtros. O painel da DPE-AM inclui revisões, questões autorais e um plano para Assistente Técnico Administrativo, baseado no conteúdo histórico do edital de 2023. Consulte o [plano de estudos](docs/PLANO-DPE-AM-ADMINISTRATIVO.md) para ver as fontes e o contexto do material.

## Rodar localmente

Use Node.js 24, a mesma versão usada no workflow de publicação.

```sh
git clone https://github.com/IanAkiles/Studyflow.git
cd Studyflow
npm install
npm run dev
```

Abra `http://localhost:3000/Studyflow/`. Clique em **Novo Objetivo** para cadastrar uma meta ou use **Estudar hoje** no painel da DPE-AM.

O navegador guarda as metas e o progresso das revisões no armazenamento local. Cada navegador mantém seu próprio progresso. Limpar os dados do site apaga esse progresso.

## Verificar e gerar o build

```sh
npm run lint
npm run build
```

O Vite gera o site em `dist/`. O [workflow de publicação](.github/workflows/deploy.yml) envia essa pasta para o GitHub Pages.
