import Head from 'next/head';
import Layout from '../components/Layout';
import Hero from '../components/Hero';
import Projects from '../components/Projects';
import Research from '../components/Research';
import Leadership from '../components/Leadership';

// Import project and leadership data
import projectsData from '../data/projects';
import organizationsData from '../data/leadership';

export default function Home() {
  return (
    <>
      <Head>
        <title>Romanus - Portfolio</title>
        <meta name="description" content="Personal portfolio website showcasing projects and research" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Layout>
        <Hero />
        <Projects projects={projectsData} />
        <Research />
        <Leadership organizations={organizationsData} />
      </Layout>
    </>
  );
}