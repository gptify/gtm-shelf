import type { Metadata } from 'next';
import { getTools, STAGES } from '@/lib/db/data';
import { Header } from '@/components/Header';
import { Footer } from '@/components/Footer';
import { BuildMyStackClient } from '@/components/BuildMyStackClient';

export const metadata: Metadata = {
  title: 'Build My GTM Stack • Intelligent AI Architecture Builder',
  description:
    'Configure your tailored Go-To-Market AI stack across Inbound, Outbound, Lead Capture, Data Orchestration, and Agentic Operations based on your CRM, budget, and business stage.',
  alternates: {
    canonical: '/build-my-stack',
  },
  openGraph: {
    title: 'Build My GTM Stack • Intelligent AI Architecture Builder',
    description:
      'Configure your tailored Go-To-Market AI stack across Inbound, Outbound, Lead Capture, Data Orchestration, and Agentic Operations.',
    url: '/build-my-stack',
    siteName: 'GTM Shelf',
  },
};

interface BuildMyStackPageProps {
  searchParams?: Record<string, string | undefined>;
}

export default async function BuildMyStackPage({ searchParams }: BuildMyStackPageProps) {
  const tools = await getTools();

  return (
    <>
      <div className="wrap" id="main-content">
        <Header />
        <BuildMyStackClient tools={tools} initialParams={searchParams} />
      </div>
      <Footer stages={STAGES} />
    </>
  );
}
