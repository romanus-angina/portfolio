import { useEffect } from 'react';
import Navbar from './Navbar';
import Footer from './Footer';
import ThreeBackground from './ThreeBackground';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

// Register ScrollTrigger with GSAP
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

const Layout = ({ children }) => {
  useEffect(() => {
    // Initialize smooth scrolling
    const smoothScroll = () => {
      gsap.to(window, {
        duration: 0.5,
        scrollTo: { y: window.location.hash, offsetY: 100 },
        ease: 'power2.inOut'
      });
    };

    // Handle anchor links
    const links = document.querySelectorAll('a[href^="#"]');
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault();
        window.location.hash = link.getAttribute('href');
        smoothScroll();
      });
    });

    // Initialize section animations
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
      gsap.fromTo(
        section.querySelectorAll('.animate-in'),
        { 
          y: 50, 
          opacity: 0 
        },
        { 
          y: 0, 
          opacity: 1, 
          stagger: 0.1, 
          duration: 0.8, 
          ease: 'power3.out',
          scrollTrigger: {
            trigger: section,
            start: 'top 70%',
            once: true
          }
        }
      );
    });

    return () => {
      links.forEach(link => {
        link.removeEventListener('click', smoothScroll);
      });
      
      // Kill all scroll triggers to prevent memory leaks
      ScrollTrigger.getAll().forEach(trigger => trigger.kill());
    };
  }, []);

  return (
    <div className="layout">
      <ThreeBackground />
      <Navbar />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default Layout;