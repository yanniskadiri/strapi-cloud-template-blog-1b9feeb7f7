'use client';

import axios from 'axios';
import { notFound, useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { marked } from 'marked';

interface Article {
  id: number;
  title: string;
  description: string;
  slug: string;
  blocks: any[];
  cover?: { url: string };
  author?: { name: string; email: string; avatarUrl?: string };
  category?: { name: string; slug: string };
}

export default function ArticlePage() {
  const params = useParams<{ slug: string }>();
  const [article, setArticle] = useState<Article | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchArticle() {
      try {
        const slug = Array.isArray(params.slug) ? params.slug[0] : params.slug;
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/articles?filters[slug][$eq]=${slug}&populate=*`
        );
        const articleRaw = res.data.data[0];

        if (!articleRaw) notFound();

        const formattedArticle: Article = {
          id: articleRaw.id,
          title: articleRaw.title,
          description: articleRaw.description,
          slug: articleRaw.slug,
          blocks: articleRaw.blocks || [],
          cover: articleRaw.cover ? { url: articleRaw.cover.url } : undefined,
          author: articleRaw.author
            ? {
                name: articleRaw.author.name,
                email: articleRaw.author.email,
                avatarUrl: articleRaw.author.avatar?.url,
              }
            : undefined,
          category: articleRaw.category
            ? {
                name: articleRaw.category.name,
                slug: articleRaw.category.slug,
              }
            : undefined,
        };

        setArticle(formattedArticle);
      } catch (error) {
        console.error('Error loading article', error);
        notFound();
      } finally {
        setLoading(false);
      }
    }

    fetchArticle();
  }, [params]);

  if (loading) return <p className="p-8">Loading article...</p>;
  if (!article) return <p className="p-8">Article not found.</p>;

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">{article.title}</h1>

      {article.cover && (
        <img
          src={article.cover.url}
          alt={article.title}
          className="w-full h-80 object-cover rounded mb-6"
        />
      )}

      {article.author && (
        <div className="flex items-center gap-4 mb-6">
          {article.author.avatarUrl && (
            <img
              src={article.author.avatarUrl}
              alt={article.author.name}
              className="w-10 h-10 rounded-full"
            />
          )}
          <div>
            <p className="text-sm font-semibold">{article.author.name}</p>
            <p className="text-xs text-gray-500">{article.author.email}</p>
          </div>
        </div>
      )}

      {article.category && (
        <p className="text-sm text-gray-600 mb-6">
          Category: {article.category.name}
        </p>
      )}

      <div className="prose">
        {article.blocks.map((block, index) => {
          switch (block.__component) {
            case 'shared.rich-text':
              return (
                <div
                  key={index}
                  dangerouslySetInnerHTML={{ __html: marked(block.body || '') }}
                />
              );
            case 'shared.quote':
              return (
                <blockquote
                  key={index}
                  className="my-8 p-4 bg-gray-100 border-l-4 border-gray-400"
                >
                  <h3 className="text-lg font-semibold">{block.title}</h3>
                  <p className="text-gray-700">{block.body}</p>
                </blockquote>
              );
            case 'shared.media':
              return (
                <p key={index} className="text-gray-500">
                  No image available
                </p>
              );
            case 'shared.slider':
              return (
                <div key={index} className="my-8 grid grid-cols-2 gap-4">
                  {(block.files || []).map((file: any, idx: number) => (
                    <img
                      key={idx}
                      src={file.url}
                      alt="Slider Image"
                      className="rounded-lg"
                    />
                  ))}
                </div>
              );
            default:
              return null;
          }
        })}
      </div>
    </main>
  );
}