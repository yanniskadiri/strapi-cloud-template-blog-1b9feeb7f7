'use client';

import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Article {
  id: number;
  title: string;
  description: string;
  slug: string;
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/articles?populate=*`
        );
        const articlesRaw = res.data.data;

        const formattedArticles = articlesRaw.map((article: any) => ({
          id: article.id,
          title: article.title,
          description: article.description,
          slug: article.slug,
        }));

        setArticles(formattedArticles);
      } catch (error) {
        console.error('Failed to load articles', error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  if (loading) return <p className="p-8">Loading articles...</p>;

  return (
    <main className="p-8 max-w-5xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">My Blog</h1>
      <div className="grid gap-6 md:grid-cols-2">
        {articles.map((article) => (
          <Link
            key={article.id}
            href={`/articles/${article.slug}`}
            className="p-6 border rounded-lg hover:shadow-md transition"
          >
            <h2 className="text-2xl font-semibold mb-2">{article.title}</h2>
            <p className="text-gray-600">{article.description}</p>
          </Link>
        ))}
      </div>
    </main>
  );
}