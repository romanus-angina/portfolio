import React from 'react';

const AboutSection = () => {
  return (
    <section id="about" className="about-section">
      <h2 className="section-title animate-in">About Me</h2>
      
      <div className="section-content">
        <div className="about-text-container">
          <p className="about-text animate-in">
            I'm an undergraduate at Rice University studying Electrical and Computer Engineering with broad interests. 
            I'm passionate about building accessible, user-friendly digital experiences and conducting 
            research to create meaningful impact.
          </p>
          
          <p className="about-text animate-in">
            Currently, I'm focusing on machine learning, web development, and data analysis. My work 
            combines thoughtful design with robust engineering, creating experiences that not only look 
            great but are meticulously built for performance and usability. I am open to any interesting
            opportunities or ideas, so feel free to reach out!
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
      
      <style jsx>{`
        .about-text-container {
          max-width: 100%;
        }
        
        .about-text {
          color: #b3b3b3;
          font-size: 1.1rem;
          line-height: 1.6;
          margin-bottom: 1.5rem;
        }
        
        .skills-container {
          margin-top: 2rem;
        }
        
        .skills-container h3 {
          font-size: 1.2rem;
          margin-bottom: 1rem;
          color: #ffffff;
        }
        
        .skills-list {
          display: grid;
          grid-template-columns: repeat(2, minmax(140px, 200px));
          gap: 0.5rem 1rem;
          padding: 0;
          margin: 1.5rem 0 0 0;
          overflow: hidden;
          list-style: none;
        }
        
        .skills-list li {
          position: relative;
          margin-bottom: 10px;
          padding-left: 20px;
          font-family: 'SF Mono', 'Fira Code', monospace;
          font-size: 0.9rem;
          color: #b3b3b3;
        }
        
        .skills-list li::before {
          content: '▹';
          position: absolute;
          left: 0;
          color: #ffffff;
          font-size: 0.9rem;
          line-height: 1.5;
        }
        
        @media (max-width: 768px) {
          .skills-list {
            grid-template-columns: 1fr;
          }
        }
      `}</style>
    </section>
  );
};

export default AboutSection;