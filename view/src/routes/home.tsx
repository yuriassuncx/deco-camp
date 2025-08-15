import { createRoute, Link, type RootRoute } from "@tanstack/react-router";
import { LogIn, User } from "lucide-react";
import { useOptionalUser, useTechNewsTopics } from "@/lib/hooks";
import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";


type Article = {
  title: string;
  description: string | null;
  url: string;
  publishedAt: string;
  source: { name: string };
};

type NewsData = {
  topics: string[];
  articles: Article[];
};

interface NewsGridProps {
  query: string;
}

function NewsGrid({ query }: NewsGridProps) {
  const { data, isLoading, error } = useTechNewsTopics(query ? { q: query } : undefined) as { data: NewsData; isLoading: boolean; error: unknown };
  const [selectedArticle, setSelectedArticle] = useState<Article | null>(null);

  if (isLoading) {
    return <div className="text-slate-300 text-center py-12">Carregando notícias...</div>;
  }
  if (error) {
    return <div className="text-red-400 text-center py-12">Erro ao carregar notícias.</div>;
  }
  if (!data || !data.articles.length) {
    return <div className="text-slate-400 text-center py-12">Nenhuma notícia encontrada.</div>;
  }

  return (
    <div>
      <h2 className="text-2xl font-bold text-white mb-4 flex items-center gap-2">
        <span role="img" aria-label="tech">📰</span> Notícias
      </h2>
      {data.topics && data.topics.length > 0 && (
        <div className="mb-6 flex flex-wrap gap-2">
          {data.topics.map((topic: string, i: number) => (
            <span key={i} className="bg-blue-800/80 text-blue-100 px-3 py-1 rounded-full text-xs font-medium shadow">
              {topic}
            </span>
          ))}
        </div>
      )}
      <div className="grid gap-6 md:grid-cols-2">
        {data.articles.map((article: Article, i: number) => (
          <button
            key={i}
            onClick={() => setSelectedArticle(article)}
            className="block text-left w-full bg-slate-800/80 rounded-xl shadow-lg hover:scale-[1.02] transition-transform border border-slate-700 overflow-hidden group focus:outline-none"
            tabIndex={0}
          >
            <div className="p-4 flex flex-col h-full">
              <h3 className="text-lg font-semibold text-white group-hover:text-blue-400 transition-colors mb-2 line-clamp-2">
                {article.title}
              </h3>
              <p className="text-slate-300 text-sm mb-3 line-clamp-3">
                {article.description || <span className="italic text-slate-500">Sem descrição</span>}
              </p>
              <div className="mt-auto flex items-center justify-between text-xs text-slate-400">
                <span className="truncate">{article.source?.name}</span>
                <span>{new Date(article.publishedAt).toLocaleDateString()}</span>
              </div>
            </div>
          </button>
        ))}
      </div>

      {/* Popup Modal */}
      {selectedArticle && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 backdrop-blur-sm">
          <div className="bg-slate-900 rounded-xl shadow-2xl max-w-lg w-full mx-4 p-6 relative animate-fade-in">
            <button
              className="absolute top-3 right-3 text-slate-400 hover:text-white text-xl font-bold focus:outline-none"
              onClick={() => setSelectedArticle(null)}
              aria-label="Fechar"
            >
              ×
            </button>
            <h3 className="text-2xl font-bold text-white mb-2">
              {selectedArticle.title}
            </h3>
            <div className="text-xs text-slate-400 mb-2 flex gap-2">
              <span>{selectedArticle.source?.name}</span>
              <span>•</span>
              <span>{new Date(selectedArticle.publishedAt).toLocaleString()}</span>
            </div>
            {selectedArticle.description && (
              <p className="text-slate-200 mb-4 whitespace-pre-line">
                {selectedArticle.description}
              </p>
            )}
            <a
              href={selectedArticle.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block mt-2 px-4 py-2 bg-blue-700 text-white rounded hover:bg-blue-800 transition-colors font-medium shadow"
            >
              Ler notícia completa
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

function HomePage() {
  const user = useOptionalUser();
  const [query, setQuery] = useState("");
  const [inputValue, setInputValue] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);
  // Para UX: submit ao pressionar Enter
  const handleInputKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      setQuery(inputValue.trim());
    }
  };
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setQuery(inputValue.trim());
    inputRef.current?.blur();
  };

  return (
    <div className="bg-slate-900 min-h-screen flex items-center justify-center p-6">
      <div className="max-w-4xl mx-auto w-full">
        {/* Header */}
        <div className="flex items-center justify-between mb-12">
          <div className="flex items-center gap-3">
            <img
              src="/logo.png"
              alt="Deco"
              className="w-8 h-8 object-contain"
            />
            <div>
              <h1 className="text-xl font-semibold text-white">
                Deco MCP Template
              </h1>
              <p className="text-sm text-slate-400">
                React + Tailwind + Authentication
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            {user.data && (
              <Button
                asChild
                size="sm"
                variant="outline"
                className="bg-transparent border-slate-600 text-slate-300 hover:bg-slate-700 hover:text-white"
              >
                <Link to="/profile" className="inline-flex items-center gap-2">
                  <User className="w-3 h-3" />
                  Profile
                </Link>
              </Button>
            )}

            {!user.data && (
              <Button
                asChild
                size="sm"
                className="bg-slate-700 text-slate-200 hover:bg-slate-600 hover:text-white border-slate-600"
              >
                <a
                  href="/oauth/start"
                  className="inline-flex items-center gap-2"
                >
                  <LogIn className="w-3 h-3" />
                  Login
                </a>
              </Button>
            )}
          </div>
        </div>

        {/* Busca por notícias */}
        <form onSubmit={handleSubmit} className="mb-8 flex items-center gap-2 max-w-xl mx-auto">
          <input
            ref={inputRef}
            type="text"
            placeholder="Buscar notícias..."
            className="flex-1 px-4 py-2 rounded-l bg-slate-800 text-slate-100 border border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-600 placeholder:text-slate-400"
            value={inputValue}
            onChange={e => setInputValue(e.target.value)}
            onKeyDown={handleInputKeyDown}
            aria-label="Buscar notícias"
          />
          <Button
            type="submit"
            className="rounded-l-none rounded-r px-4 py-2 bg-blue-700 text-white hover:bg-blue-800 border border-blue-700"
            disabled={!inputValue.trim() || inputValue.trim() === query}
          >
            Buscar
          </Button>
        </form>

        {/* News Section */}
        <div className="mb-12">
          <NewsGrid query={query} />
        </div>

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-slate-700">
          <p className="text-xs text-slate-500 text-center">
            Template includes: Tools, Workflows, Authentication, Database
            (SQLite + Drizzle)
          </p>
        </div>
      </div>
    </div>
  );
}

export default (parentRoute: RootRoute) =>
  createRoute({
    path: "/",
    component: HomePage,
    getParentRoute: () => parentRoute,
  });