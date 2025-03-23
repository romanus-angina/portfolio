import React from 'react';

const LeadershipSection = () => {
  const organizations = [
    {
        name: "Rice Datathon 2025",
        role: "Workshops Lead",
        period: "Aug 2024-Jan 2025",
        description: "Organized and led workshops on data analysis, machine learning, and data visualization for 200+ participants. Developed and presented a workshop on exploratory data analysis and data visualization using Python, Pandas, and Matplotlib.",
        skills: ["Data Analysis", "Data Visualization", "Machine learning", "Workshop Development"],
        logoSrc: "/images/rice-datathon.png", 
        url: "https://datathon.rice.edu/"
      },
    {
      name: "DEEP Mentorship Program - Rice D2K Lab",
      role: "DEEP Mentor",
      period: "Aug 2024 — Present",
      description: "Led and trained a team of 20+ in foundational data analysis and machine learning skills, managing a project that analyzed real-world housing prices using Jupyter, Pandas, NumPy, TensorFlow, and scikit-learn to develop a predictive model and present the results..",
      skills: ["Leadership", "Project Management", "Mentoring", "Team Management"],
      logoSrc: "/images/d2k.png", 
      url: "https://d2k.rice.edu//"
    },
    {
      name: "Rice Stem Students on the Rise",
      role: "Lead Reviewer",
      period: "Spring 2025",
      description: "Reviewed and provided feedback on 50+ research papers submitted by high school students for the annual Rice Stem Students on the Rise conference. Evaluated papers based on clarity, originality, and scientific rigor.",
      skills: ["Event Planning", "Mentoring", "Review", "Feedback"],
      logoSrc: "/images/stem-sotr.png", 
      url: "https://risestem.blogs.rice.edu/about-us/"
    }
  ];

  return (
    <section id="leadership" className="leadership-section">
      <h2 className="section-title animate-in">Academic Leadership</h2>
      
      <div className="section-content">
        <div className="leadership-cards">
          {organizations.map((org, index) => (
            <div key={index} className="leadership-card animate-in">
              <div className="card-left">
                <a 
                  href={org.url} 
                  target="_blank" 
                  rel="noopener noreferrer"
                  className="logo-link"
                  aria-label={`Visit ${org.name} website`}
                >
                  {/* Use image instead of icon */}
                  <div className="logo-container">
                    <img 
                      src={org.logoSrc} 
                      alt={`${org.name} logo`} 
                      className="org-logo"
                      onError={(e) => {
                        // Fallback to a placeholder if image fails to load
                        e.target.src = `/api/placeholder/40/40?text=${org.name.charAt(0)}`;
                      }}
                    />
                  </div>
                </a>
              </div>
              
              <div className="card-content">
                <div className="card-header">
                  <div className="role-container">
                    <h3 className="role">{org.role}</h3>
                    <div className="organization">
                      {org.name} <span className="period">{org.period}</span>
                    </div>
                  </div>
                </div>
                
                <div className="card-body">
                  <p className="description">
                    {org.description}
                  </p>
                  
                  <div className="skills">
                    {org.skills.map((skill, i) => (
                      <span key={i} className="skill-tag">{skill}</span>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      
      <style jsx>{`
        .leadership-section {
          padding: 2rem 0;
        }
        
        .section-title {
          margin-bottom: 1.25rem;
        }
        
        .leadership-cards {
          display: flex;
          flex-direction: column;
          gap: 0.75rem;
          margin-top: 1rem;
        }
        
        .leadership-card {
          background-color: #252530;
          border-radius: 6px;
          display: flex;
          flex-direction: row;
          transition: transform 0.3s ease, box-shadow 0.3s ease;
          position: relative;
          overflow: hidden;
        }
        
        .leadership-card:hover {
          transform: translateX(8px);
          box-shadow: 0 5px 15px -10px rgba(0, 0, 0, 0.3);
        }
        
        .leadership-card:hover::before {
          opacity: 1;
        }
        
        .leadership-card::before {
          content: '';
          position: absolute;
          left: 0;
          top: 0;
          height: 100%;
          width: 2px;
          background: linear-gradient(to bottom, #ffffff, rgba(255, 255, 255, 0.1));
          opacity: 0;
          transition: opacity 0.3s ease;
        }
        
        .card-left {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 60px;
          min-width: 60px;
          background-color: #1e1e24;
          border-right: 1px solid rgba(255, 255, 255, 0.1);
          padding: 0.5rem;
        }
        
        .card-content {
          flex: 1;
          padding: 0.85rem 1.1rem;
          display: flex;
          flex-direction: column;
        }
        
        .logo-link {
          display: flex;
          align-items: center;
          justify-content: center;
          transition: all 0.3s ease;
        }
        
        .logo-link:hover {
          transform: translateY(-2px);
        }
        
        .logo-container {
          width: 40px;
          height: 40px;
          border-radius: 50%;
          background-color: #252530;
          display: flex;
          align-items: center;
          justify-content: center;
          overflow: hidden;
          border: 1px solid rgba(255, 255, 255, 0.1);
          transition: border-color 0.3s ease, box-shadow 0.3s ease;
        }
        
        .logo-link:hover .logo-container {
          border-color: rgba(255, 255, 255, 0.3);
          box-shadow: 0 3px 8px rgba(0, 0, 0, 0.2);
        }
        
        .org-logo {
          width: 90%;
          height: 90%;
          object-fit: contain;
        }
        
        .card-header {
          margin-bottom: 0.6rem;
        }
        
        .role-container {
          flex: 1;
        }
        
        .period {
          font-family: 'SF Mono', 'Fira Code', monospace;
          font-size: 0.75rem;
          color: #b3b3b3;
          margin-left: 0.75rem;
          white-space: nowrap;
        }
        
        .role {
          font-size: 1rem;
          font-weight: 600;
          margin-bottom: 0.2rem;
          color: #ffffff;
        }
        
        .organization {
          font-size: 0.85rem;
          color: #b3b3b3;
          display: flex;
          align-items: center;
          flex-wrap: wrap;
        }
        
        .card-body {
          display: flex;
          flex-direction: column;
          height: 100%;
        }
        
        .description {
          color: #b3b3b3;
          line-height: 1.45;
          font-size: 0.85rem;
          margin-bottom: 0.6rem;
        }
        
        .skills {
          display: flex;
          flex-wrap: wrap;
          gap: 0.4rem;
          margin-top: auto;
        }
        
        .skill-tag {
          color: #ffffff;
          font-family: 'SF Mono', 'Fira Code', monospace;
          font-size: 0.7rem;
          padding: 0.15rem 0.45rem;
          background-color: rgba(255, 255, 255, 0.08);
          border-radius: 10px;
          white-space: nowrap;
        }
        
        @media (max-width: 768px) {
          .leadership-card {
            flex-direction: column;
          }
          
          .card-left {
            width: 100%;
            min-width: 100%;
            min-height: 50px;
            border-right: none;
            border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          }
          
          .card-content {
            padding: 1rem;
          }
          
          .organization {
            flex-direction: column;
            align-items: flex-start;
          }
          
          .period {
            margin-left: 0;
            margin-top: 0.2rem;
          }
        }
      `}</style>
    </section>
  );
};

export default LeadershipSection;