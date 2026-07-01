"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { getNews } from "@/lib/actions/news-actions";

export function NewsList() {
  const [articles, setArticles] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function fetchNews() {
      try {
        const data = await getNews();
        setArticles(data);
      } catch (error) {
        console.error("Failed to fetch news:", error);
      } finally {
        setIsLoading(false);
      }
    }

    fetchNews();
  }, []);

  return (
    <div className="flex min-h-0 flex-1 flex-col gap-4 overflow-scroll">
      {isLoading ? (
        <span className="mb-32 flex h-full w-full items-center justify-center text-center text-base-text-darker">
          {"Loading articles..."}
        </span>
      ) : (
        <>
          {articles.length > 0 ? (
            articles.map((article) => (
              <Card key={article.id} article={article} />
            ))
          ) : (
            <span className="mb-32 flex h-full w-full items-center justify-center text-center text-base-text-darker">
              {"No articles found"}
            </span>
          )}
        </>
      )}
    </div>
  );
}

function Card({ article }) {
  const date = new Date(article.createdAt);
  const formattedDate = date.toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });
  return (
    <Link
      href={`/news/${article.id}`}
      className="flex h-fit w-full min-w-0 flex-col gap-4 rounded-2xl border-b-2 border-transparent bg-base-base p-4 transition hover:border-primary"
    >
      <span className="text-small">{formattedDate}</span>
      <h3 className="w-full text-large font-semibold wrap-break-word">
        {article.title}
      </h3>
      <p className="w-full truncate">{article.content}</p>
    </Link>
  );
}
