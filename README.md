# Bloco de Notas Digital

Projeto PIME VI — aplicação **front-end** em Angular para criar, editar, categorizar, buscar, fixar e arquivar anotações pessoais. Os dados ficam no `localStorage` do navegador (sem back-end).

## Funcionalidades

- Criar, editar e excluir notas (título, conteúdo, categoria e cor)
- Categorias: Estudos, Trabalho, Pessoal e Ideias, com filtro
- Busca por título ou conteúdo (ignora acentos e maiúsculas)
- Fixar notas no topo e arquivar/restaurar
- Visualização em grade ou lista (preferência lembrada)
- Persistência entre sessões, interface responsiva e tema claro/escuro automático
- Acessibilidade: rótulos, foco visível, `aria-live`, *skip link*

## Como executar

Requisitos: Node.js 20+ e npm.

```bash
npm install
npm start          # http://localhost:4200
npm test           # testes unitários (Vitest)
npm run lint       # ESLint (angular-eslint)
npm run format     # Prettier
npm run build      # build de produção em dist/
```

## Arquitetura

```
src/app/
├── core/                      # regras de domínio e infraestrutura (sem UI)
│   ├── models/                # Note, tipos, constantes e type guards
│   ├── storage/               # NotesRepository (contrato) + LocalStorage (implementação)
│   ├── state/                 # NotesStore (signals): estado e regras de negócio
│   └── testing/               # dublês para testes
├── shared/                    # reutilizáveis sem conhecimento de domínio
│   ├── ui/icon/               # ícones SVG
│   ├── services/              # ConfirmService
│   └── utils/                 # id, normalização de texto
├── features/notes/            # funcionalidade (carregada sob demanda – lazy)
│   ├── pages/                 # componentes "container" (ligados à store e rotas)
│   ├── components/            # componentes "de apresentação" (input/output)
│   └── notes.routes.ts
├── app.config.ts              # providers globais (injeta a implementação do repositório)
└── app.routes.ts
```

### Decisões e boas práticas aplicadas

- **Separação em camadas**: UI → store → repositório. A UI nunca acessa `localStorage` diretamente.
- **Inversão de dependência**: `NotesRepository` é uma abstração; trocar para IndexedDB ou API REST exige só uma nova classe e uma linha em `app.config.ts`.
- **Componentes standalone, signals e `OnPush`** (Angular moderno, sem NgModules).
- **Container vs. apresentação**: páginas coordenam; `note-card`, `note-list`, `notes-toolbar` e `note-form` só recebem `input()` e emitem `output()`/`model()`.
- **Estado imutável e centralizado**: `NotesStore` expõe signals somente-leitura e `computed` para filtros/ordenação.
- **Roteamento por rota** (`/notas`, `/notas/nova`, `/notas/:id/editar`) com *lazy loading* e `withComponentInputBinding`.
- **Dados não confiáveis**: o conteúdo do storage é validado (`isNote`); JSON corrompido ou storage indisponível não derrubam o app.
- **TypeScript `strict`**, ESLint e Prettier configurados.
- **Testes** da store, do repositório, do formulário e da página principal.

## Possíveis evoluções

Exportar/importar notas em JSON, tags livres, markdown, desfazer exclusão, sincronização com back-end (basta nova implementação de `NotesRepository`).
