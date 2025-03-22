import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Leadership Organization Card
const OrganizationCard = ({ organization }) => {
  const cardRef = useRef(null);
  
  useEffect(() => {
    gsap.from(cardRef.current, {
      y: 50,
      opacity: 0,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: cardRef.current,
        start: 'top 80%',
        once: true
      }
    });
  }, []);
  
  return (
    <div ref={cardRef} className="org-card animate-in">
      <a 
        href={organization.website} 
        target="_blank" 
        rel="noopener noreferrer"
        className="org-link"
      >
        <div className="org-logo">
          <Image 
            src={organization.logo} 
            alt={organization.name} 
            width={100} 
            height={100}
          />
        </div>
        <h3>{organization.name}</h3>
        <h4>{organization.role}</h4>
        <p>{organization.description}</p>
      </a>
    </div>
  );
};

const Leadership = ({ organizations }) => {
  const sectionRef = useRef(null);
  
  useEffect(() => {
    gsap.from('.section-title', {
      y: 30,
      opacity: 0,
      duration: 0.8,
      scrollTrigger: {
        trigger: sectionRef.current,
        start: 'top 70%',
        once: true
      }
    });
  }, []);
  
  return (
    <section ref={sectionRef} id="leadership" className="leadership-section">
      <div className="section-container">
        <h2 className="section-title animate-in">Academic Leadership</h2>
        
        <div className="organizations-grid">
          {organizations.map((organization, index) => (
            <OrganizationCard key={index} organization={organization} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Leadership;