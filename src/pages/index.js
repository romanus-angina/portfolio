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
        {/* ASCII Art Test Section - Different Art Styles for Different Folders */}
        <section id="ascii-test" className="ascii-test-section">
          <h2 className="section-title">ASCII Art Styles for Different Folders</h2>
          
          {/* Test ASCII Art Outside Cards */}
          <div className="ascii-test-standalone">
            <h3>Interactive ASCII Art (Standalone)</h3>
            <ASCIIArt 
              imagePath="/images/profile.jpg"
              width={150}
              height={100}
              colorScheme="white"
              disableAnimations={false}
            />
            <p className="interactive-note">Hover for 3D rotation, Click to cycle styles</p>
          </div>
          
          <div className="ascii-test-grid">
            <div className="folder-example">
              <h3>Bio Folder (Classic Style)</h3>
              <ASCIIArt 
                imagePath="/images/profile.jpg"
                width={100}
                height={70}
                artStyle="classic"
                colorScheme="white"
                className="folder-ascii"
              />
            </div>
            
            <div className="folder-example">
              <h3>Projects Folder (Tech Style)</h3>
              <ASCIIArt 
                imagePath="/images/profile.jpg"
                width={100}
                height={70}
                artStyle="tech"
                colorScheme="green"
                className="folder-ascii"
              />
            </div>
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

        .ascii-test-standalone {
          text-align: center;
          margin-bottom: 3rem;
          padding: 2rem;
          border: 2px solid rgba(40, 215, 255, 0.3);
          border-radius: 16px;
          background: rgba(40, 215, 255, 0.05);
          max-width: 600px;
          margin-left: auto;
          margin-right: auto;
        }

        .ascii-test-standalone h3 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1.2rem;
          font-weight: 600;
          margin-bottom: 1rem;
          color: #ffffff;
        }

        .ascii-test-grid {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
          gap: 2rem;
          max-width: 1200px;
          margin: 0 auto;
        }

        .folder-example {
          text-align: center;
          padding: 1rem;
          border: 1px solid rgba(40, 215, 255, 0.2);
          border-radius: 12px;
          background: rgba(40, 215, 255, 0.05);
          transition: all 0.3s ease;
        }

        .folder-example:hover {
          border-color: rgba(40, 215, 255, 0.4);
          background: rgba(40, 215, 255, 0.1);
          transform: translateY(-2px);
        }

        .folder-example h3 {
          font-family: 'Space Grotesk', sans-serif;
          font-size: 1rem;
          font-weight: 500;
          margin-bottom: 1rem;
          color: #ffffff;
        }

        .folder-ascii {
          margin: 0 auto;
        }

        .interactive-note {
          font-size: 0.8rem;
          color: rgba(255, 255, 255, 0.7);
          margin-top: 0.5rem;
          font-style: italic;
        }
      `}</style>
    </>
  );
}