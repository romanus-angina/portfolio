import Head from 'next/head';
import Layout from '../components/Layout';
import AboutSection from '../components/AboutSection';
import ProjectsSection from '../components/ProjectsSection';
import LeadershipSection from '../components/LeadershipSection';
import ResearchSection from '../components/ResearchSection';

export default function Home() {
  return (
    <>
      <Head>
        <title>Romanus Ang'ina | Electrical and Computer Engineering</title>
        <meta name="description" content="Romanus Ang'ina - Electrical and Computer Engineering student at Rice University, focusing on software development and research." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Layout>
        <AboutSection />
        <ProjectsSection />
        <LeadershipSection />
      </Layout>
    </>
  );
}