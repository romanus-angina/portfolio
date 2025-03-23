import { useEffect, useRef } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { FaGithub, FaLinkedin, FaFileAlt, FaEnvelope } from 'react-icons/fa';
import PointCloud from './PointCloud';

const LargeSidebar = ({ activeSection }) => {
  const sidebarRef = useRef(null);
  const nameRef = useRef(null);
  const titleRef = useRef(null);
  const descriptionRef = useRef(null);
  const navRef = useRef(null);
  const socialsRef = useRef(null);
  
  useEffect(() => {
    // Animate sidebar elements on mount
    const tl = gsap.timeline({ defaults: { ease: "power3.out" } });
    
    tl.fromTo(
      nameRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 }
    )
    .fromTo(
      titleRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      '-=0.6'
    )
    .fromTo(
      descriptionRef.current,
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.8 },
      '-=0.6'
    )
    .fromTo(
      navRef.current.querySelectorAll('.nav-item'),
      { x: -20, opacity: 0 },
      { x: 0, opacity: 1, stagger: 0.1, duration: 0.5 },
      '-=0.4'
    );
    
    if (socialsRef.current) {
      tl.fromTo(
        socialsRef.current.querySelectorAll('.social-icon'),
        { y: 20, opacity: 0 },
        { y: 0, opacity: 1, stagger: 0.1, duration: 0.5 },
        '-=0.3'
      );
    }
  }, []);
  
  // Force set the lines to white when the component renders
  useEffect(() => {
    // Get all line elements
    const lines = document.querySelectorAll('.nav-link-line');
    lines.forEach(line => {
      line.style.backgroundColor = '#ffffff';
    });

    // Make active line full width
    if (activeSection) {
      const activeLine = document.querySelector(`.nav-item[data-section="${activeSection}"] .nav-link-line`);
      if (activeLine) {
        activeLine.style.transform = 'scaleX(1)';
        activeLine.style.backgroundColor = '#ffffff';
      }
    }
  }, [activeSection]);
  
  return (
    <div ref={sidebarRef} className="large-sidebar">
      <div className="sidebar-content">
        <div className="sidebar-top">
          <div className="sidebar-header">
            <div className="header-with-pointcloud">
              <div className="header-text">
                <h1 ref={nameRef} className="name">Romanus<br/>Ang'ina</h1>
                <h2 ref={titleRef} className="title">Electrical and Computer Engineering Student</h2>
                <p ref={descriptionRef} className="description">
                  I learn by building interesting things.
                </p>
              </div>
              <div className="point-cloud-wrapper">
                <PointCloud />
              </div>
            </div>
          </div>
          
          <nav ref={navRef} className="sidebar-nav">
            <ul>
              <li className={`nav-item ${activeSection === 'about' ? 'active' : ''}`} data-section="about">
                <Link href="#about">
                  <div className="nav-link">
                    <span className="nav-link-line white-line"></span>
                    <span className="nav-link-text">ABOUT</span>
                  </div>
                </Link>
              </li>
              {/* <li className={`nav-item ${activeSection === 'research' ? 'active' : ''}`} data-section="research">
                <Link href="#research">
                  <div className="nav-link">
                    <span className="nav-link-line white-line"></span>
                    <span className="nav-link-text">RESEARCH</span>
                  </div>
                </Link>
              </li> */}
              <li className={`nav-item ${activeSection === 'projects' ? 'active' : ''}`} data-section="projects">
                <Link href="#projects">
                  <div className="nav-link">
                    <span className="nav-link-line white-line"></span>
                    <span className="nav-link-text">PROJECTS</span>
                  </div>
                </Link>
              </li>
              <li className={`nav-item ${activeSection === 'leadership' ? 'active' : ''}`} data-section="leadership">
                <Link href="#leadership">
                  <div className="nav-link">
                    <span className="nav-link-line white-line"></span>
                    <span className="nav-link-text">LEADERSHIP</span>
                  </div>
                </Link>
              </li>
            </ul>
          </nav>
        </div>
        
        <div ref={socialsRef} className="sidebar-footer">
          <div className="social-links">
            <a 
              href="/resume.pdf" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-icon"
              aria-label="Resume"
            >
              <FaFileAlt size={20} />
            </a>
            <a 
              href="mailto:sra12@rice.edu" 
              className="social-icon"
              aria-label="Email"
            >
              <FaEnvelope size={20} />
            </a>
            <a 
              href="https://github.com/romanus-angina" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-icon"
              aria-label="GitHub"
            >
              <FaGithub size={20} />
            </a>
            <a 
              href="https://linkedin.com/in/romanus-angina" 
              target="_blank" 
              rel="noopener noreferrer" 
              className="social-icon"
              aria-label="LinkedIn"
            >
              <FaLinkedin size={20} />
            </a>
          </div>
        </div>
      </div>

      <style jsx>{`
        .large-sidebar {
          width: 40%;
          height: 100vh;
          position: sticky;
          top: 0;
          left: 0;
          padding: 1rem 1.5rem;
          display: flex;
          flex-direction: column;
          z-index: 10;
        }
        
        .sidebar-content {
          height: 100%;
          display: flex;
          flex-direction: column;
          justify-content: space-between;
        }
        
        .sidebar-top {
          flex: 1;
        }
        
        .sidebar-header {
          margin-bottom: 0.5rem;
        }
        
        .header-with-pointcloud {
          display: flex;
          flex-direction: row;
          justify-content: space-between;
          align-items: center;
          gap: 1rem;
        }
        
        .header-text {
          flex: 1;
        }
        
        .point-cloud-wrapper {
          width: 45%;
          min-width: 170px;
        }
        
        .sidebar-header .name {
          font-size: 4rem;
          font-weight: 700;
          line-height: 1;
          margin-bottom: 0.75rem;
          color: #ffffff;
        }
        
        .sidebar-header .title {
          font-size: 1.1rem;
          font-weight: 500;
          margin-bottom: 0.75rem;
          color: #ffffff;
        }
        
        .sidebar-header .description {
          font-size: 1rem;
          color: #b3b3b3;
          line-height: 1.4;
          margin-bottom: 0.25rem;
        }
        
        /* Updated navigation styles with white active colors */
        .sidebar-nav {
          margin: 1rem 0;
        }
        
        .sidebar-nav ul {
          list-style: none;
          display: flex;
          flex-direction: column;
          gap: 0.25rem;
        }
        
        .nav-item a {
          text-decoration: none;
          color: inherit;
        }
        
        .nav-link {
          display: flex;
          align-items: center;
          color: #b3b3b3;
          transition: color 0.2s ease;
          padding: 0.3rem 0;
        }
        
        .nav-item.active .nav-link {
          color: #ffffff !important;
        }
        
        .nav-link-line {
          display: inline-block;
          width: 40px;
          height: 1px;
          background-color: #ffffff !important; /* Force white color */
          margin-right: 1rem;
          transform: scaleX(0.7);
          transform-origin: left;
          transition: transform 0.2s ease, background-color 0.2s ease;
          opacity: 0.5;
        }
        
        .white-line {
          background-color: #ffffff !important;
        }
        
        .nav-item.active .nav-link-line {
          transform: scaleX(1);
          background-color: #ffffff !important; /* Force white color */
          opacity: 1;
        }
        
        .nav-link-text {
          font-family: 'SF Mono', 'Fira Code', monospace;
          font-size: 0.9rem;
          letter-spacing: 1px;
        }
        
        .nav-item:hover .nav-link {
          color: #ffffff;
        }
        
        .nav-item:hover .nav-link-line {
          background-color: #ffffff !important; /* Force white color */
          opacity: 0.8;
        }
        
        /* Social links styling */
        .sidebar-footer {
          padding-top: 1.5rem;
          padding-bottom: 0.75rem;
          margin-top: 1rem;
        }
        
        .social-links {
          display: flex;
          justify-content: center;
          gap: 1.5rem;
        }
        
        .social-icon {
          display: flex;
          align-items: center;
          justify-content: center;
          width: 40px;
          height: 40px;
          border-radius: 50%;
          color: #b3b3b3;
          background-color: #252530;
          transition: all 0.3s ease;
        }
        
        .social-icon:hover {
          color: #ffffff;
          transform: translateY(-3px);
          box-shadow: 0 5px 10px rgba(0, 0, 0, 0.2);
        }
        
        @media (max-width: 1100px) {
          .large-sidebar {
            width: 100%;
            height: auto;
            position: relative;
            padding: 1rem;
          }
          
          .header-with-pointcloud {
            flex-direction: column;
            align-items: center;
          }
          
          .header-text {
            text-align: center;
            margin-bottom: 1rem;
          }
          
          .point-cloud-wrapper {
            width: 100%;
            max-width: 220px;
            margin: 0 auto;
          }
          
          .sidebar-header .name {
            font-size: 3.5rem;
          }
        }
        
        @media (max-width: 768px) {
          .sidebar-header .name {
            font-size: 2.5rem;
          }
        }
      `}</style>
    </div>
  );
};

export default LargeSidebar;