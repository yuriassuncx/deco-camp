/**
 * This is where you define your workflows.
 *
 * Workflows are a way to encode complex flows of steps
 * reusing your tools and with built-in observability
 * on the Deco project dashboard. They can also do much more!
 *
 * When exported, they will be available on the MCP server
 * via built-in tools for starting, resuming and cancelling
 * them.
 *
 * @see https://docs.deco.page/en/guides/building-workflows/
 */
import {
  createStepFromTool,
  createWorkflow,
} from "@deco/workers-runtime/mastra";
import { z } from "zod";
import { Env } from "./main";
import { createFetchTechNewsTool } from "./tools";


// Workflow: Buscar notícias, filtrar positivas e gerar tópicos

// Step 2 como tool para garantir compatibilidade mastra
import { createTool } from "@deco/workers-runtime/mastra";

const createProcessTechNewsTool = () =>
  createTool({
    id: "PROCESS_TECH_NEWS",
    description: "Filtra notícias positivas e gera tópicos.",
    inputSchema: z.object({
      articles: z.array(
        z.object({
          title: z.string(),
          description: z.string().nullable(),
          url: z.string(),
          publishedAt: z.string(),
          source: z.object({ name: z.string() }),
        })
      ),
    }),
    outputSchema: z.object({
      topics: z.array(z.string()),
      articles: z.array(
        z.object({
          title: z.string(),
          description: z.string().nullable(),
          url: z.string(),
          publishedAt: z.string(),
          source: z.object({ name: z.string() }),
        })
      ),
    }),
    execute: async (input) => {
      // Para ToolExecutionContext, os dados estão em input.input
      const articles: Array<{ title: string; description: string | null; url: string; publishedAt: string; source: { name: string } }> = (input as any).input.articles;
      const positiveKeywords = [
        "avanço", "inovação", "crescimento", "descoberta", "sucesso", "melhoria", "progresso", "impacto", "tendência", "revolução"
      ];
      const positiveArticles = articles.filter((a) =>
        positiveKeywords.some((kw) =>
          (a.title + ' ' + (a.description || "")).toLowerCase().includes(kw)
        )
      );
      const topics = positiveArticles.map((a) => {
        if (a.title.toLowerCase().includes("inteligência artificial"))
          return "Últimas inovações em inteligência artificial";
        if (a.title.toLowerCase().includes("computação quântica"))
          return "Tendências emergentes em computação quântica";
        if (a.title.toLowerCase().includes("5g"))
          return "Impacto da tecnologia 5G na sociedade";
        return a.title;
      });
      return { topics, articles: positiveArticles };
    },
  });

export const createTechNewsTopicsWorkflow = (env: Env) => {
  const fetchNewsStep = createStepFromTool(createFetchTechNewsTool(env));
  const processStep = createStepFromTool(createProcessTechNewsTool());

  return createWorkflow({
    id: "TECH_NEWS_TOPICS",
    inputSchema: z.object({
      q: z.string().default("tecnologia"),
      language: z.string().default("pt"),
      sortBy: z.string().default("publishedAt"),
      pageSize: z.number().default(10),
    }),
    outputSchema: z.object({
      topics: z.array(z.string()),
      articles: z.array(
        z.object({
          title: z.string(),
          description: z.string().nullable(),
          url: z.string(),
          publishedAt: z.string(),
          source: z.object({ name: z.string() }),
        })
      ),
    }),
  })
    .then(fetchNewsStep)
    .then(processStep)
    .commit();
};

export const workflows = [createTechNewsTopicsWorkflow];
