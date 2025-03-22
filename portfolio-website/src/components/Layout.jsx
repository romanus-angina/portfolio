import { useEffect, useState } from 'react';
import LargeSidebar from './LargeSidebar';
import CursorGlow from './CursorGlow';
import MetallicBackground from './MetallicBackground';
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
  }, [activeSection]);

  return (
    <div className="layout modern-layout">
      {/* Use the metallic background instead of SimpleBackground */}
      <MetallicBackground />
      
      {/* Add CursorGlow for the glowing cursor effect */}
      <CursorGlow />
      
      <div className="content-container">
        <LargeSidebar activeSection={activeSection} />
        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default Layout;