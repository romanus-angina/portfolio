import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="footer">
      <div className="footer-container">
        <div className="footer-content">
          <div className="footer-section">
            <h3>Get In Touch</h3>
            <p>Feel free to reach withb any opportunities or just a friendly hello!</p>
            <a href="mailto:sra12@rice.edu" className="contact-link">
              <FaEnvelope /> sra12@rice.edu
            </a>
          </div>
          
          <div className="footer-section">
            <h3>Connect</h3>
            <div className="footer-social-links">
              <a 
                href="https://github.com/romanus-angina" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="GitHub Profile"
              >
                <FaGithub size={20} /> GitHub
              </a>
              <a 
                href="https://linkedin.com/in/romanus-angina/" 
                target="_blank" 
                rel="noopener noreferrer" 
                aria-label="LinkedIn Profile"
              >
                <FaLinkedin size={20} /> LinkedIn
              </a>
            </div>
          </div>
        </div>
        
        <div className="footer-bottom">
          <p>© {new Date().getFullYear()} Romanus Ang'ina. All rights reserved.</p>
          <div className="built-with">
            <span>Built with</span>
            <div className="tech-logos">
              <a href="https://reactjs.org" target="_blank" rel="noopener noreferrer" title="React">
                <img src="/images/react-logo.svg" alt="React" className="tech-logo" />
              </a>
              <a href="https://threejs.org" target="_blank" rel="noopener noreferrer" title="Three.js">
                <img src="/images/threejs-logo.svg" alt="Three.js" className="tech-logo" />
              </a>
              <a href="https://greensock.com/gsap/" target="_blank" rel="noopener noreferrer" title="GSAP">
                <img src="/images/gsap-logo.svg" alt="GSAP" className="tech-logo" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;