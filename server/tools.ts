/**
 * This is where you define your tools.
 *
 * Tools are the functions that will be available on your
 * MCP server. They can be called from any other Deco app
 * or from your front-end code via typed RPC. This is the
 * recommended way to build your Web App.
 *
 * @see https://docs.deco.page/en/guides/creating-tools/
 */
import { createPrivateTool, createTool } from "@deco/workers-runtime/mastra";
import { z } from "zod";
import type { Env } from "./main.ts";

// Tool para buscar notícias de tecnologia na News API
export const createFetchTechNewsTool = (_env: Env) =>
  createTool({
    id: "FETCH_TECH_NEWS",
    description: "Busca notícias recentes de tecnologia usando a News API.",
    inputSchema: z.object({
      q: z.string().default("tecnologia"),
      language: z.string().default("pt"),
      sortBy: z.string().default("publishedAt"),
      pageSize: z.number().default(10),
    }),
    outputSchema: z.object({
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
    execute: async ({ context }) => {
      const { q, language, sortBy, pageSize } = context;
      const apiKey = "8800733f2b3c4f8181e8c9193c3592b6";

      if (!apiKey) throw new Error("NEWS_API_KEY não configurada no ambiente");

      const params = new URLSearchParams({
        q,
        language,
        sortBy,
        pageSize: pageSize.toString(),
        apiKey: String(apiKey),
      });
      
      const res = await fetch(`https://newsapi.org/v2/everything?${params}`, {
        headers: {
          "User-Agent": "yuri-camp-server/1.0 (https://yourdomain.com)",
        },
      });
      if (!res.ok) {
        const errorData = await res.json();
        console.error(errorData);
        throw new Error("Erro ao buscar notícias na News API: " + (errorData.message || res.statusText));
      }
      const data = await res.json();
      return { articles: data.articles || [] };
    },
  });


/**
 * `createPrivateTool` is a wrapper around `createTool` that
 * will call `env.DECO_CHAT_REQUEST_CONTEXT.ensureAuthenticated`
 * before executing the tool.
 *
 * It automatically returns a 401 error if valid user credentials
 * are not present in the request. You can also call it manually
 * to get the user object.
 */
export const createGetUserTool = (env: Env) =>
  createPrivateTool({
    id: "GET_USER",
    description: "Get the current logged in user",
    inputSchema: z.object({}),
    outputSchema: z.object({
      id: z.string(),
      name: z.string().nullable(),
      avatar: z.string().nullable(),
      email: z.string(),
    }),
    execute: async () => {
      const user = env.DECO_CHAT_REQUEST_CONTEXT.ensureAuthenticated();

      if (!user) {
        throw new Error("User not found");
      }

      return {
        id: user.id,
        name: user.user_metadata.full_name,
        avatar: user.user_metadata.avatar_url,
        email: user.email,
      };
    },
  });

export const tools = [
  createGetUserTool,
  createFetchTechNewsTool,
];
