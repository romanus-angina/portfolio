import { useEffect, useState } from 'react';
import GridBackground from './GridBackground';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

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
  const FOOTER_FONT_SIZE_REM = 0.9;
  const FOOTER_LINE_HEIGHT = 1.5;
  const FOOTER_MAX_WIDTH_PX = 600;
  const FOOTER_TEXT_COLOR = '#8892b0';
  const FOOTER_HIGHLIGHT_COLOR = '#ffffff';
  const FOOTER_HIGHLIGHT_FONT_WEIGHT = 500;

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
          
          {/* Technology footer */}
          <div className="tech-footer">
            <div className="tech-footer-content">
               Built with <span className="tech-highlight">Next.js</span>, <span className="tech-highlight">Three.js</span>, and <span className="tech-highlight">React</span>. 
              Animations powered by <span className="tech-highlight">GSAP</span>.
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

        .tech-footer-content {
          color: ${FOOTER_TEXT_COLOR};
          font-size: ${FOOTER_FONT_SIZE_REM}rem;
          line-height: ${FOOTER_LINE_HEIGHT};
          text-align: center;
          max-width: ${FOOTER_MAX_WIDTH_PX}px;
          margin: 0 auto;
        }

        .tech-highlight {
          color: ${FOOTER_HIGHLIGHT_COLOR};
          font-weight: ${FOOTER_HIGHLIGHT_FONT_WEIGHT};
        }
      `}</style>
    </div>
  );
};

export default Layout;