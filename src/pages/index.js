import Head from 'next/head';
import Layout from '../components/Layout';
import AboutSection from '../components/AboutSection';
import ProjectsSection from '../components/ProjectsSection';
import LeadershipSection from '../components/LeadershipSection';
import ResearchSection from '../components/ResearchSection';
import ASCIIArt from '../components/ASCIIArt';

export default function Home() {
  return (
    <>
      <Head>
        <title>Romanus Ang&apos;ina | Electrical and Computer Engineering</title>
        <meta name="description" content="Romanus Ang&apos;ina - Electrical and Computer Engineering student at Rice University, focusing on software development and research." />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      
      <Layout>
        {/* ASCII Art Test Section */}
        <section id="ascii-test" className="ascii-test-section">
          <h2 className="section-title">ASCII Art Component Test</h2>
          <div className="ascii-test-container">
            <ASCIIArt 
              imagePath="/images/profile.jpg"
              width={120}
              height={80}
              asciiChars=" .:-=+*#%@"
              className="test-ascii"
            />
          </div>
        </section>
        
        <AboutSection />
        <ProjectsSection />
        <LeadershipSection />
      </Layout>

      <style jsx>{`
        .ascii-test-section {
          padding: 4rem 2rem;
          text-align: center;
          background: rgba(255, 255, 255, 0.02);
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .section-title {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 2rem;
          font-weight: 600;
          margin-bottom: 2rem;
          color: #ffffff;
        }

        .ascii-test-container {
          display: flex;
          justify-content: center;
          align-items: center;
          min-height: 200px;
        }

        .test-ascii {
          border: 1px solid rgba(40, 215, 255, 0.2);
          border-radius: 12px;
          padding: 1rem;
          background: rgba(40, 215, 255, 0.05);
        }
      `}</style>
    </>
  );
}