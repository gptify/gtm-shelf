import type { Metadata } from 'next';
import { getTools, STAGES } from '@/lib/db/data';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { FinderClient } from '@/components/FinderClient';

export const metadata: Metadata = {
  title: 'Find my AI tools: answer a few questions',
  description:
    'Answer 3 to 10 questions and get three ranked AI tool picks for your goal, team, and budget.',
  alternates: {
    canonical: '/find',
  },
  openGraph: {
    title: 'Find my AI tools: answer a few questions',
    description:
      'Answer 3 to 10 questions and get three ranked AI tool picks for your goal, team, and budget.',
    url: '/find',
    siteName: 'GTM Shelf',
  },
};

export default async function FinderPage() {
  const tools = await getTools();

  return (
    <>
      <div className="wrap" id="main-content">
        <Header />
        <FinderClient tools={tools} />
      </div>
      <Footer stages={STAGES} />
    </>
  );
}
