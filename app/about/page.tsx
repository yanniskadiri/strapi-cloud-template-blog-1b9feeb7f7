'use client';

import axios from 'axios';
import { useEffect, useState } from 'react';

interface AboutData {
  title: string;
}

export default function AboutPage() {
  const [about, setAbout] = useState<AboutData | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchAbout() {
      try {
        const res = await axios.get(
          `${process.env.NEXT_PUBLIC_STRAPI_API_URL}/about`
        );

        const aboutData = res.data?.data;

        if (!aboutData) {
          console.warn('No About data found.');
          return;
        }

        const data = aboutData;

        setAbout({
          title: data.title || data.attributes?.title,
        });
      } catch (error) {
        console.error('Failed to load About page', error);
      } finally {
        setLoading(false);
      }
    }

    fetchAbout();
  }, []);

  if (loading) return <p className="p-8">Loading...</p>;
  if (!about) return <p className="p-8">About content not found.</p>;

  return (
    <main className="p-8 max-w-4xl mx-auto">
      <h1 className="text-4xl font-bold mb-6">{about.title}</h1>
      <p className="text-gray-600">No additional content available yet.</p>
    </main>
  );
}