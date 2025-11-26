import { useEffect, useState } from 'react';
import GridBackground from './GridBackground';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

// Register ScrollTrigger with GSAP
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Layout = ({ children }) => {
  const [activeSection, setActiveSection] = useState('about');

  useEffect(() => {
    // Track active section on scroll
    const sections = document.querySelectorAll('section[id]');
    
    const handleScroll = () => {
      // Get current scroll position, with a slight offset to trigger earlier
      const scrollPosition = window.scrollY + window.innerHeight / 3;
      
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
        variant="electric" // Electric blue for lab-spec theme
        animated={true} 
        showDots={true} 
        showLines={false} // Disabled grid lines
        opacity={0.4} // Much higher opacity for better visibility
        spacing={60} // Even more spacing for fewer particles
        dotSize={1}
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
          padding: 2rem 0;
          margin-top: 3rem;
        }
        
        .tech-footer-content {
          color: #8892b0;
          font-size: 0.9rem;
          line-height: 1.5;
          text-align: center;
          max-width: 600px;
          margin: 0 auto;
        }
        
        .tech-highlight {
          color: #ffffff;
          font-weight: 500;
        }
      `}</style>
    </div>
  );
};

export default Layout;