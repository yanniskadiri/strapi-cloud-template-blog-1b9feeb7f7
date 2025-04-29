'use client';

import axios from 'axios';
import Link from 'next/link';
import { useEffect, useState } from 'react';

interface Article {
  id: number;
  title: string;
  slug: string;
  description: string;
  cover?: {
    url: string;
  };
}

export default function Home() {
  const [articles, setArticles] = useState<Article[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticles() {
      try {
        const res = await axios.get(`${process.env.NEXT_PUBLIC_STRAPI_API_URL}/articles?populate=cover`);
        console.log('Fetched Articles:', res.data.data);

        // Notice: Strapi sends array of objects
        const formattedArticles = res.data.data.map((item: any) => ({
          id: item.id,
          title: item.title,
          slug: item.slug,
          description: item.description,
          cover: item.cover ? { url: item.cover.url } : undefined,
        }));

        setArticles(formattedArticles);
      } catch (error) {
        console.error('Error fetching articles', error);
      } finally {
        setLoading(false);
      }
    }
    fetchArticles();
  }, []);

  if (loading) return <p className="p-8">Loading articles...</p>;

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-8">My Blog</h1>

      {articles.length === 0 ? (
        <p className="text-gray-500">No articles found. Create and publish some articles in Strapi!</p>
      ) : (
        <div className="grid gap-8">
          {articles.map((article) => (
            <Link
              key={article.id}
              href={`/articles/${article.slug}`}
              className="block border rounded p-6 hover:shadow-lg transition"
            >
              {article.cover && (
                <img
                  src={article.cover.url}
                  alt={article.title}
                  className="w-full h-60 object-cover mb-4 rounded"
                />
              )}
              <h2 className="text-2xl font-semibold">{article.title}</h2>
              <p className="text-gray-600 mt-2">{article.description}</p>
            </Link>
          ))}
        </div>
      )}
    </main>
  );
}