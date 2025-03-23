import React from 'react';
import { FaExternalLinkAlt, FaRegFilePdf, FaMicrochip, FaServer } from 'react-icons/fa';

const ResearchSection = () => {
  const researchProjects = [
    {
      title: "GaN Power Devices Optimization",
      role: "Research Assistant",
      institution: "Rice Wide Lab",
      institutionLink: "https://wide.rice.edu/",
      period: "2022 — Present",
      description: "Designed and optimized advanced GaN power devices, including trench FETs, multichannel FETs, and FinFETs, using TCAD simulations to achieve E-mode operation, low ON-resistance, high breakdown voltage, and enhanced reliability.",
      tech: ["TCAD", "MATLAB", "Python", "Data Analysis", "GaN Power Devices"],
      paperLink: "https://ieeexplore.ieee.org/",
      icon: <FaMicrochip size={24} />
    },
  ];

  return (
    <section id="research" className="research-section">
      <h2 className="section-title animate-in">Research Experience</h2>
      
      <div className="section-content">
        <div className="research-cards">
          {researchProjects.map((project, index) => (
            <div key={index} className="research-card animate-in">
              <div className="card-left">
                <div className="icon-container">
                  {project.icon}
                </div>
              </div>
              
              <div className="card-content">
                <div className="card-header">
                  <div className="title-container">
                    <h3 className="project-title">{project.title}</h3>
                    <div className="role-institution">
                      <span className="role">{project.role}</span> • 
                      <a 
                        href={project.institutionLink} 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="institution"
                      >
                        {project.institution}
                      </a>
                    </div>
                  </div>
                  <div className="period">{project.period}</div>
                </div>
                
                <div className="card-body">
                  <p className="description">
                    {project.description}
                  </p>
                </div>
                
                <div className="card-footer">
                  <div className="tech-stack">
                    {project.tech.map((tech, i) => (
                      <span key={i} className="tech-tag">{tech}</span>
                    ))}
                  </div>
                  
                  {project.paperLink && (
                    <a 
                      href={project.paperLink} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="paper-link"
                      aria-label="View Research Paper"
                    >
                      <FaRegFilePdf size={16} />
                      <span>Paper</span>
                    </a>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .research-section {
          padding: 3rem 0;
        }
        
        .research-cards {
          display: flex;
          flex-direction: column;
          gap: 1.5rem;
          margin-top: 2rem;
        }
        
        .research-card {
          background-color: #252530;
          border-radius: 8px;
          display: flex;
          flex-direction: row;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .research-card:hover {
          transform: translateX(10px);
          box-shadow: 0 10px 20px -15px rgba(0, 0, 0, 0.3);
        }
        
        .research-card:hover::before {
          opacity: 1;
        }
        
        .research-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 3px;
          background: linear-gradient(to bottom, #ffffff, rgba(255, 255, 255, 0.1));
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .card-left {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 70px;
          min-width: 70px;
          background-color: #1e1e24;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.75rem;
        }
        
        .icon-container {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 45px;
          height: 45px;
          border-radius: 50%;
          background-color: #252530;
          color: #ffffff;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }
        
        .card-content {
          flex: 1;
          padding: 1.25rem 1.5rem;
          display: flex;
          flex-direction: column;
        }
        
        .card-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 0.75rem;
        }
        
        .title-container {
          flex: 1;
        }
        
        .project-title {
          font-size: 1.1rem;
          font-weight: 600;
          margin-bottom: 0.25rem;
          color: #ffffff;
        }
        
        .role-institution {
          font-size: 0.9rem;
          margin-bottom: 0.25rem;
        }
        
        .role {
          color: #b3b3b3;
        }
        
        .institution {
          color: #ffffff;
          margin-left: 0.35rem;
          text-decoration: none;
          transition: color 0.2s ease;
        }
        
        .institution:hover {
          text-decoration: underline;
        }
        
        .period {
          font-family: 'SF Mono', 'Fira Code', monospace;
          font-size: 0.8rem;
          color: #ffffff;
          margin-left: 1rem;
          white-space: nowrap;
        }
        
        .card-body {
          margin-bottom: 1rem;
        }
        
        .description {
          color: #b3b3b3;
          line-height: 1.5;
          font-size: 0.9rem;
        }
        
        .card-footer {
          margin-top: auto;
          display: flex;
          justify-content: space-between;
          align-items: center;
        }
        
        .tech-stack {
          display: flex;
          flex-wrap: wrap;
          gap: 0.5rem;
          flex: 1;
        }
        
        .tech-tag {
          color: #ffffff;
          font-family: 'SF Mono', 'Fira Code', monospace;
          font-size: 0.7rem;
          padding: 0.2rem 0.5rem;
          background-color: rgba(255, 255, 255, 0.08);
          border-radius: 12px;
          white-space: nowrap;
        }
        
        .paper-link {
          display: flex;
          align-items: center;
          gap: 0.5rem;
          padding: 0.4rem 0.8rem;
          border-radius: 5px;
          background-color: rgba(255, 255, 255, 0.05);
          color: #ffffff;
          text-decoration: none;
          transition: background-color 0.2s ease;
          margin-left: 1rem;
        }
        
        .paper-link:hover {
          background-color: rgba(255, 255, 255, 0.1);
        }
        
        .paper-link span {
          font-size: 0.8rem;
          font-family: 'SF Mono', 'Fira Code', monospace;
        }
        
        @media (max-width: 768px) {
          .research-card {
            flex-direction: column;
          }
          
          .card-left {
            width: 100%;
            min-width: 100%;
            min-height: 60px;
            border-right: none;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          .card-content {
            padding: 1.25rem;
          }
          
          .card-header {
            flex-direction: column;
          }
          
          .period {
            margin-left: 0;
            margin-top: 0.25rem;
          }
          
          .card-footer {
            flex-direction: column;
            align-items: flex-start;
            gap: 1rem;
          }
          
          .paper-link {
            margin-left: 0;
          }
        }
      `}</style>
    </section>
  );
};

export default ResearchSection;