/**
 * This is where you define your views.
 *
 * Declaring views here will make them available on the user's
 * project when they install your MCP server.
 *
 * @see https://docs.deco.page/en/guides/building-views/
 */
import { StateSchema } from "./deco.gen";
import { Env } from "./main.ts";
import type { CreateMCPServerOptions } from "@deco/workers-runtime/mastra";

export const views: CreateMCPServerOptions<Env, typeof StateSchema>["views"] =
  () => [
    {
      title: "Tech News AI Agent",
      icon: "auto_awesome",
      url: "https://yuri-camp-2.deco.page/",
      description: "Veja tópicos e notícias positivas de tecnologia filtradas por IA.",
    },
  ];
