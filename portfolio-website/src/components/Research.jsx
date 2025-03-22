import { useEffect, useRef } from 'react';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Research = () => {
  const sectionRef = useRef(null);
  const contentRef = useRef(null);
  
  useEffect(() => {
    // Staggered animation for research content
    gsap.from('.research-title', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
        once: true
      }
    });
    
    gsap.from(contentRef.current.querySelectorAll('.animate-in'), {
      y: 30,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      scrollTrigger: {
        trigger: contentRef.current,
        start: 'top 80%',
        once: true
      }
    });
  }, []);
  
  return (
    <section ref={sectionRef} id="research" className="research-section">
      <div className="section-container">
        <h2 className="section-title research-title">Research</h2>
        
        <div ref={contentRef} className="research-content">
          <p className="research-description animate-in">
            My research focused on the improvement of semiconductors to improve 
            trench FETs, multichannel FETs, and FinFETs. 
          </p>
          
          <div className="research-highlights animate-in">
            <h3>Research Highlights:</h3>
            <ul>
              <li>
                Designed and optimized advanced GaN power devices, including trench FETs, multichannel FETs, and FinFETs, using TCAD simulations to achieve E-mode operation, low ON-resistance, high breakdown voltage, and enhanced reliability, while aligning simulation data with experimental results.
              </li>
              <li>
                Worked under<a 
                  href="https://wide.rice.edu/" 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="highlight-link"
                >Rice Wide Lab</a> to create [research output].
              </li>
            </ul>
          </div>
          
          <div className="lab-link animate-in">
            <p>
              Learn more about our research at the
              <a 
                href="https://wide.rice.edu/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="lab-website-link"
              >
                {" "}Lab Website →
              </a>
            </p>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Research;