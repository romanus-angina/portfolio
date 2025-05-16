import React from 'react';
import { FaGithub, FaExternalLinkAlt } from 'react-icons/fa';

const ProjectsSection = () => {
  const projects = [
    {
      title: "Team Coinflip: Travel Fatigue and Performance",
      description: "Analyzed the impact of MLB team travel schedules and fatigue on in-game performance using exploratory data analysis, a custom ELO ranking system, and an XGBoost model, finding little evidence that fatigue affects performance; the project placed 2nd at the 2024 Rice Datathon.",
      tech: ["Python", "Pandas", "NumPy", "Folium", "XGBoost"],
      github: "https://github.com/Lou-Zhou/ricedatathon2024",
      external: "https://devpost.com/software/team-coin-flip-travel-fatigue-and-performance",
      featured: true
    },
    {
      title: "Portfolio Website",
      description: "Personal portfolio website built with modern web technologies featuring Three.js effects, GSAP animations, and responsive design.",
      tech: ["React", "Next.js", "Three.js", "GSAP"],
      github: "https://github.com/romanus-angina/portfolio",
      external: "https://github.com/romanus-angina/portfolio",
      featured: true
    },
    {
        title: "In Progress: Baby GPU",
        description: "Baby GPU is a simple GPU built in verilog that goes over the functioning of GPUs from the ground up.",
        tech: ["verilog", "FPGA", "GPU", "Computer Architecture"],
        github: "https://github.com/romanus-angina/Baby-GPU",
        external: "#",
        featured: false
      }
  ];

  return (
    <section id="projects" className="projects-section">
      <h2 className="section-title animate-in">Things I've Built</h2>
      
      <div className="section-content">
        <div className="projects-list">
          {projects.map((project, index) => (
            <div key={index} className={`project-card animate-in ${project.featured ? 'featured' : ''}`}>
              <div className="project-content">
                <div className="project-header">
                  <h3 className="project-title">{project.title}</h3>
                  
                  <div className="project-links">
                    {project.github && (
                      <a href={project.github} target="_blank" rel="noopener noreferrer" aria-label="GitHub Repository">
                        <FaGithub size={18} />
                      </a>
                    )}
                    {project.external && (
                      <a href={project.external} target="_blank" rel="noopener noreferrer" aria-label="View Project">
                        <FaExternalLinkAlt size={16} />
                      </a>
                    )}
                  </div>
                </div>
                
                <div className="project-description">
                  <p>{project.description}</p>
                </div>
                
                <div className="tech-stack">
                  {project.tech.map((tech, i) => (
                    <span key={i} className="tech-tag">{tech}</span>
                  ))}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .projects-section {
          padding: 2rem 0;
        }
        
        .section-title {
          margin-bottom: 1.25rem;
        }
        
        .projects-list {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 1rem;
        }
        
        .project-card {
          background-color: #252530;
          border-radius: 6px;
          padding: 1.1rem 1.5rem 1.1rem 1.1rem;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
          overflow: hidden;
          display: flex;
          flex-direction: row;
        }
        
        .project-card::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          width: 2px;
          height: 100%;
          background: linear-gradient(to bottom, #ffffff, rgba(255, 255, 255, 0.1));
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .project-card:hover {
          transform: translateX(8px);
          box-shadow: 0 5px 15px -10px rgba(0, 0, 0, 0.3);
        }
        
        .project-card:hover::before {
          opacity: 1;
        }
        
        .project-content {
          flex: 1;
        }
        
        .project-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.6rem;
        }
        
        .project-title {
          font-size: 1rem;
          font-weight: 600;
          color: #ffffff;
          margin: 0;
        }
        
        .project-links {
          display: flex;
          gap: 0.8rem;
          margin-left: 1rem;
        }
        
        .project-links a {
          color: #b3b3b3;
          transition: color 0.3s ease;
        }
        
        .project-links a:hover {
          color: #ffffff;
        }
        
        .project-description {
          color: #b3b3b3;
          margin-bottom: 0.8rem;
          line-height: 1.45;
          font-size: 0.85rem;
        }
        
        .tech-stack {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-top: 0.6rem;
        }
        
        .tech-tag {
          color: #ffffff;
          font-family: 'SF Mono', 'Fira Code', monospace;
          font-size: 0.7rem;
          padding: 0.15rem 0.45rem;
          background-color: rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          white-space: nowrap;
        }
        
        .project-card.featured::after {
          content: 'Featured';
          position: absolute;
          top: 0.5rem;
          right: -2.5rem;
          background: rgba(255, 255, 255, 0.1);
          padding: 0.2rem 2.5rem;
          font-size: 0.65rem;
          font-family: 'SF Mono', 'Fira Code', monospace;
          transform: rotate(45deg);
          color: #ffffff;
        }
        
        @media (max-width: 768px) {
          .project-header {
            flex-direction: column;
            align-items: flex-start;
            gap: 0.6rem;
          }
          
          .project-links {
            margin-left: 0;
          }
        }
      `}</style>
    </section>
  );
};

export default ProjectsSection;