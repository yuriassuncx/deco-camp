# AI News Agent: News, Summaries & Podcasts Delivered to You

Este projeto é uma plataforma full-stack com IA que encontra notícias relevantes
para o usuário, resume ou converte o conteúdo em formato de podcast e envia
automaticamente por email. Utiliza o Model Context Protocol (MCP) para
orquestração de workflows, um frontend moderno em React e um backend robusto
rodando em Cloudflare Workers.

---

## 💡 O que faz?

1. **Busca Inteligente de Notícias**: O agente AI pesquisa notícias de
   tecnologia relevantes para o usuário, com filtros e busca personalizada.
2. **Resumo & Conversão para Podcast**: As notícias podem ser resumidas por IA
   ou convertidas em áudio/podcast automaticamente.
3. **Leitura de Notícias via TTS**: O usuário pode ouvir o conteúdo das notícias
   diretamente no navegador usando Text-to-Speech (TTS) integrado à interface.
4. **Envio Automático por Email**: O conteúdo selecionado é enviado para o
   usuário por email, pronto para ser lido ou ouvido.

---

## 🧩 Arquitetura do Projeto

```
├── server/           # Backend MCP Server (Cloudflare Workers + Deco runtime)
│   ├── main.ts      # Entry point: define ferramentas, workflows e integrações
│   ├── tools.ts     # Ferramentas: busca notícias, resumo, TTS, email
│   ├── workflows.ts # Orquestração: fluxo buscar → resumir → podcast → enviar
│   └── deco.gen.ts  # Tipos auto-gerados para integração
└── view/            # Frontend React (Vite + Tailwind CSS)
    ├── src/
    │   ├── lib/rpc.ts    # Cliente RPC tipado para comunicação
    │   ├── routes/       # Rotas TanStack Router (ex: home, profile)
    │   └── components/   # UI components (Tailwind, shadcn/ui)
    └── package.json
```

---

## 🗣️ Text-to-Speech (TTS) no Frontend

- Utilizamos a biblioteca
  [`text-to-speech-js`](https://www.npmjs.com/package/text-to-speech-js) para
  permitir que o usuário ouça o conteúdo das notícias diretamente no navegador.
- O botão "Ouvir" está disponível no modal de cada notícia. Ao clicar, o texto é
  lido em voz alta usando a
  [SpeechSynthesis API](https://developer.mozilla.org/pt-BR/docs/Web/API/SpeechSynthesis).
- O áudio é interrompido automaticamente ao fechar o modal ou ao iniciar uma
  nova leitura, evitando sobreposição de vozes.

---

## 🚦 Como Funciona (Ponta a Ponta)

### 1. Usuário Interage pelo Frontend

- Busca notícias por tema ou palavra-chave na interface React moderna.
- Visualiza resultados, tópicos sugeridos e pode clicar para detalhes.
- Pode ouvir o conteúdo das notícias com um clique, graças ao TTS integrado.

### 2. Backend Orquestra o Workflow

- O frontend chama o workflow MCP via RPC.
- O workflow executa:
  1. **Busca notícias** (API externa, ex: NewsAPI)
  2. **Filtra e resume** notícias relevantes usando IA
  3. **Converte texto em áudio** (TTS/podcast)
  4. **Envia email** com o conteúdo (resumo e/ou podcast)

### 3. Entrega Automática

- O usuário recebe o conteúdo por email, pronto para consumir.
- O sistema pode ser expandido para agendamento, preferências, etc.

---

## 🛠️ Principais Tecnologias

- **MCP (Model Context Protocol)**: Orquestração de workflows e ferramentas
- **Cloudflare Workers**: Backend serverless, rápido e escalável
- **React + Vite + Tailwind CSS**: Frontend moderno e responsivo
- **TanStack Router**: Navegação avançada no frontend
- **shadcn/ui**: Componentes de UI prontos para uso
- **TypeScript**: Tipagem forte ponta a ponta
- **text-to-speech-js**: Leitura de notícias via TTS no navegador

---

## 🚀 Como Rodar Localmente

### Pré-requisitos

- Node.js ≥22.0.0
- [Deco CLI](https://deco.chat): `npm i -g deco-cli`

### Passos

```bash
# Instale as dependências
npm install

# Configure o app (variáveis, integrações)

# Rode o servidor de desenvolvimento
npm run dev
```

O app estará disponível em `http://localhost:8787`.

---

## ✨ Exemplos de Uso

- Buscar "inteligência artificial" → Receber resumo e podcast das principais
  notícias no email
- Ouvir notícias de tecnologia diretamente no navegador com um clique
- Agendar envio diário de notícias de tecnologia
- Receber apenas notícias positivas ou de fontes confiáveis

---

## 📖 Expansão e Customização

- Adicione novas fontes de notícias facilmente em `server/tools.ts`
- Personalize o workflow em `server/workflows.ts` (ex: adicionar tradução,
  filtros, etc)
- Modifique o frontend em `view/src/routes/home.tsx` para novas experiências

---

## 📚 Saiba Mais

- [Model Context Protocol (MCP)](https://spec.modelcontextprotocol.io/)
- [Deco Platform](https://deco.chat/about)
- [Documentação Deco](https://docs.deco.page)

---

**Pronto para transformar notícias em experiências personalizadas com
