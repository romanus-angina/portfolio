import React from 'react';
import AdvancedPointCloudProfile from './AdvancedPointCloudProfile';

const AboutSection = () => {
  return (
    <section id="about" className="about-section">
      <h2 className="section-title animate-in">About Me</h2>
      
      <div className="section-content">
        <div className="about-grid">
          <div className="about-text-container">
            <p className="about-text animate-in">
              I'm an undergraduate at Rice University studying Electrical and Computer Engineering with broad interests. 
              I'm passionate about building accessible, user-friendly digital experiences and conducting 
              research to create meaningful impact.
            </p>
            
            <p className="about-text animate-in">
              Currently, I'm focusing on machine learning, web development, and data analysis. My work 
              combines thoughtful design with robust engineering, creating experiences that not only look 
              great but are meticulously built for performance and usability.
            </p>
            
            <div className="skills-container animate-in">
              <h3>Technologies I work with:</h3>
              <ul className="skills-list">
                <li>JavaScript (ES6+)</li>
                <li>Pytorch</li>
                <li>React</li>
                <li>Next.js</li>
                <li>Node.js</li>
                <li>Python</li>
                <li>TensorFlow</li>
                <li>HTML & CSS</li>
                <li>MATLAB</li>
                <li>Three.js</li>
                <li>GSAP</li>
                <li>Git</li>
              </ul>
            </div>
          </div>
          
          
        </div>
      </div>
      
      <style jsx>{`
        .about-grid {
          display: grid;
          grid-template-columns: 3fr 2fr;
          gap: 4rem;
          align-items: flex-start;
        }
        
        .about-text-container {
          max-width: 600px;
        }
        
        .profile-container {
          position: relative;
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
          justify-content: center;
        }
        
        .point-cloud-wrapper {
          width: 100%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        
        .profile-caption {
          font-family: 'SF Mono', 'Fira Code', monospace;
          font-size: 0.9rem;
          color: #64ffda;
          text-align: center;
          margin-top: 1rem;
        }
        
        @media (max-width: 1100px) {
          .about-grid {
            grid-template-columns: 1fr;
            gap: 2rem;
          }
          
          .profile-container {
            order: -1;
            margin-bottom: 2rem;
          }
        }
      `}</style>
    </section>
  );
};

export default AboutSection;