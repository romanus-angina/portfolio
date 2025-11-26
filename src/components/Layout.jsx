import { useEffect, useState } from 'react';
import GridBackground from './GridBackground';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';
import { FaGithub, FaLinkedin, FaEnvelope } from 'react-icons/fa';
import { FaXTwitter } from 'react-icons/fa6';

// Register ScrollTrigger with GSAP
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Layout = ({ children }) => {
  // Grid background constants
  const GRID_SPACING_PX = 60;
  const GRID_DOT_SIZE_PX = 1;
  const GRID_OPACITY = 0.4;

  // Scroll tracking constants
  const SCROLL_OFFSET_DIVISOR = 3;

  // Footer styling constants
  const FOOTER_PADDING_REM = 2;
  const FOOTER_MARGIN_TOP_REM = 3;
  const FOOTER_TEXT_COLOR = '#6A6A6A';
  const FOOTER_HIGHLIGHT_COLOR = '#FFFFFF';

  const [activeSection, setActiveSection] = useState('about');

  useEffect(() => {
    // Track active section on scroll
    const sections = document.querySelectorAll('section[id]');

    const handleScroll = () => {
      // Get current scroll position, with a slight offset to trigger earlier
      const scrollPosition = window.scrollY + window.innerHeight / SCROLL_OFFSET_DIVISOR;
      
      // Find the section that's currently in view
      let currentSection = '';
      
      sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < (sectionTop + sectionHeight)) {
          currentSection = section.getAttribute('id');
        }
      });
      
      // Only update state if we have a valid section and it's different from current active section
      if (currentSection && currentSection !== activeSection) {
        setActiveSection(currentSection);
      }
    };
    
    // Set up initial active section
    handleScroll();
    
    // Add scroll event listener
    window.addEventListener('scroll', handleScroll);
    
    // Initialize smooth scrolling for navigation links
    const handleLinkClick = (e) => {
      const target = e.currentTarget;
      
      if (target.hash) {
        e.preventDefault();
        const targetElement = document.querySelector(target.hash);
        
        if (targetElement) {
          // Get the target section ID
          const sectionId = target.hash.replace('#', '');
          
          // Update active section
          setActiveSection(sectionId);
          
          // Smooth scroll to the section
          window.scrollTo({
            top: targetElement.offsetTop,
            behavior: 'smooth'
          });
        }
      }
    };
    
    // Add click event listeners to all navigation links
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
      link.addEventListener('click', handleLinkClick);
    });
    
    // Clean up event listeners on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
      navLinks.forEach(link => {
        link.removeEventListener('click', handleLinkClick);
      });
    };
  }, []);

  return (
    <div className="layout modern-layout">
      <GridBackground
        variant="electric"
        animated={true}
        showDots={true}
        showLines={false}
        opacity={GRID_OPACITY}
        spacing={GRID_SPACING_PX}
        dotSize={GRID_DOT_SIZE_PX}
        interactive={true}
      />

      <div className="content-container">
        <main className="main-content">
          {children}
          
          {/* Social footer */}
          <div className="tech-footer">
            <div className="social-footer-content">
              <a
                href="https://mail.google.com/mail/?view=cm&fs=1&to=sra12@rice.edu"
                target="_blank"
                rel="noopener noreferrer"
                className="social-footer-link"
                aria-label="Email"
              >
                <FaEnvelope size={28} />
              </a>
              <a
                href="https://github.com/romanus-angina"
                target="_blank"
                rel="noopener noreferrer"
                className="social-footer-link"
                aria-label="GitHub"
              >
                <FaGithub size={28} />
              </a>
              <a
                href="https://www.linkedin.com/in/romanus-angina/"
                target="_blank"
                rel="noopener noreferrer"
                className="social-footer-link"
                aria-label="LinkedIn"
              >
                <FaLinkedin size={28} />
              </a>
              <a
                href="https://x.com/rxmxnvs"
                target="_blank"
                rel="noopener noreferrer"
                className="social-footer-link"
                aria-label="X"
              >
                <FaXTwitter size={28} />
              </a>
            </div>
          </div>
        </main>
      </div>
      
      <style jsx>{`
        .tech-footer {
          width: 100%;
          padding: ${FOOTER_PADDING_REM}rem 0;
          margin-top: ${FOOTER_MARGIN_TOP_REM}rem;
        }

        .social-footer-content {
          display: flex;
          justify-content: center;
          align-items: center;
          gap: 1.5rem;
        }

        .social-footer-link {
          display: inline-flex;
          align-items: center;
          justify-content: center;
          color: ${FOOTER_TEXT_COLOR};
          transition: all 0.3s ease;
          text-decoration: none;
        }

        .social-footer-link:hover {
          color: ${FOOTER_HIGHLIGHT_COLOR};
          transform: translateY(-3px);
        }
      `}</style>
    </div>
  );
};

export default Layout;