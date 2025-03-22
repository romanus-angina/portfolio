import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

// Register ScrollTrigger
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

// Project Card Component
const ProjectCard = ({ project }) => {
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
    <div ref={cardRef} className="project-card animate-in">
      <a 
        href={project.link} 
        target="_blank" 
        rel="noopener noreferrer"
        className="project-link"
      >
        <div className="project-logo">
          <Image 
            src={project.logo} 
            alt={project.title} 
            width={80} 
            height={80}
          />
        </div>
        <h3>{project.title}</h3>
        <p>{project.description}</p>
        <div className="project-technologies">
          {project.technologies.map((tech, index) => (
            <span key={index} className="tech-tag">
              {tech}
            </span>
          ))}
        </div>
      </a>
    </div>
  );
};

const Projects = ({ projects }) => {
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
    <section ref={sectionRef} id="projects" className="projects-section">
      <div className="section-container">
        <h2 className="section-title animate-in">Projects</h2>
        
        <div className="projects-grid">
          {projects.map((project, index) => (
            <ProjectCard key={index} project={project} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Projects;