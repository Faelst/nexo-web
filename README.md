# Nexo Assist — web

Implementação em Next.js (App Router) + TypeScript + Tailwind CSS v4 das telas do protótipo `nexo.pen`.

Esta é a interface. A API (NestJS + Socket.IO + Prisma/Postgres + agent Mastra) está em
[`../nexo-api`](../nexo-api).

## Como rodar localmente

Pré-requisitos: Node 22 (o mesmo da API), npm e a **API rodando em http://localhost:3333**.
O passo a passo completo (banco no Docker, `.env`, seed, problemas comuns) está em
[`../nexo-api/README.md`](../nexo-api/README.md#como-rodar-localmente). Resumo:

```bash
# 1. API (terminal 1)
cd nexo-api && nvm use && npm install && cp .env.example .env   # preencha OPENAI_API_KEY e JWT_SECRET
npm run setup && npm run start:dev                              # Postgres + migrations + seed, API na :3333

# 2. Frontend (terminal 2)
cd nexo-web && npm install && cp .env.example .env.local        # NEXT_PUBLIC_API_URL=http://localhost:3333
npm run dev                                                     # http://localhost:3000
```

Rode o frontend na porta **3000**: é a origem liberada no CORS da API (`FRONTEND_URL`). Para produção:
`npm run build && npm start`.

### Acesso

Qualquer senha não vazia funciona (ex.: `123`) — os usuários vêm do seed da API.

| Papel | E-mail | Vai para |
|---|---|---|
| Funcionária | `ana.souza@nexo.com.br` | `/atendimento` (chat) |
| Analista Suporte N2 | `rafael.lima@nexo.com.br` | `/atendente` (console) |
| Analista Suporte N1 | `juliana.costa@nexo.com.br` | `/atendente` (console) |

A lista completa de usuários e o que cada um tem nos dados de exemplo está no
[README da API](../nexo-api/README.md#acesso-dados-de-exemplo).

## Rotas

| Rota | Tela |
|---|---|
| `/` | Índice das telas |
| `/login` | Identificação (react-hook-form) — redireciona pelo papel |
| `/atendimento` | Chat do funcionário: abre a conversa em andamento mais recente (requer papel EMPLOYEE) |
| `/atendimento/[id]` | Uma conversa do histórico (a sidebar lista todas; "Nova conversa" cria outra) |
| `/perfil` | Meu perfil (requer papel EMPLOYEE) |
| `/atendente` | Console do analista: conversas, assumir/devolver/encerrar, chamados (requer ANALYST) |

## Arquitetura (MVVM)

```
src/
├── app/                  Rotas do App Router. Só montam a View correspondente.
│   └── (cliente)/        Grupo com o layout do cliente (sidebar + topbar).
├── models/               M — dados e regras de acesso
│   ├── entities/         Tipos de domínio (Ticket, Conversation, ChatMessage…)
│   └── services/         Acesso à API: REST (lib/api/http) e Socket.IO (lib/api/socket)
├── viewmodels/           VM — hooks com estado e ações de cada tela
│                         (useLoginViewModel, useClientChatViewModel…)
├── views/                V — compõem componentes a partir do ViewModel
├── components/
│   ├── ui/               Primitivos reutilizáveis (Button, Card, Pill, Avatar,
│   │                     TextField, Drawer, StatusLabel…) — importar de `@/components/ui`
│   ├── brand/            Logo e marca
│   ├── layout/           ClientShell, Sidebar, TopBar, NavItem
│   ├── chat/             Chat do cliente (InfoCard composto, DraftTicketCard,
│   │                     TicketSelector, ChatComposer…)
│   ├── agent/            Console do atendente (ConversationList, Thread,
│   │                     TakeoverBar, TicketHistoryPanel…)
│   ├── login/            Vitrine do login
│   └── profile/          DataList/DataRow, ActionCard
├── hooks/                useSession (contexto de sessão), useSocketEvent, useAutoScroll, useHotkey
└── lib/
    ├── api/              http (fetch + erros), socket (singleton autenticado), session-store
    └── …                 cn, tons, formatação de datas, cores de avatar
```

Fluxo: **View** chama o **ViewModel** (`const vm = useXViewModel()`), que lê/escreve nos
**services** do Model e assina os eventos do socket. Componentes são apresentacionais: recebem dados e callbacks
por props. Formulários (login, rascunho de chamado, composers) usam **react-hook-form**.

## Integração com a API

- **Sessão:** JWT salvo no navegador; `RequireRole` protege as áreas e redireciona pelo papel. Um 401 encerra a sessão.
- **Histórico de conversas:** na sidebar, abaixo de Atendimento e Meu perfil — nova conversa, lista com título
  (primeira mensagem), horário e estado (aguardando analista, com analista, encerrada), atualizada em tempo real.
  Conversas encerradas abrem só para leitura.
- **Chat:** carrega a conversa por REST e envia por socket (`chat:send` com ack, informando a conversa). Mensagens, cards e passos do
  agent chegam ao vivo (`message:new`, `message:updated`, `agent:status`). Ao reconectar, ressincroniza.
- **Transparência:** cada resposta do agent tem "Por quê?" com intenção, ação, confiança, motivo e ferramentas.
- **Rascunhos:** confirmar/editar/cancelar o chamado direto no card; nada é criado sem confirmação.
- **Console:** lista e conversa em tempo real, resumo da transferência, confiança por resposta, assumir (pausa o
  agent), devolver, encerrar e responder; painel com os chamados do funcionário.
- **Estados:** carregamento (spinners), erro com "Tentar de novo", erros de ação em alertas inline.

Os tokens de design (cores, fontes, sombras) estão em `src/app/globals.css` no bloco `@theme`
e viram classes Tailwind (`bg-ink`, `text-primary-text`, `shadow-card`, `font-display`…).

## Responsividade

- **Login:** a vitrine aparece só a partir de `lg`.
- **Cliente:** a sidebar fica fixa a partir de `md`; abaixo disso vira drawer (botão de menu).
- **Atendente:** lista e conversa lado a lado a partir de `lg`. Abaixo disso funciona como
  lista → conversa, com botão de voltar. O painel de chamados é coluna fixa a partir de `xl`
  e drawer abaixo disso.
