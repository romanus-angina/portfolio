import { useEffect, useState } from 'react';
import { gsap } from 'gsap';
import Link from 'next/link';

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  
  useEffect(() => {
    // Animate navbar on page load
    gsap.from('.navbar', {
      y: -100,
      opacity: 0,
      duration: 1,
      ease: 'power3.out',
      delay: 0.2
    });
    
    // Change navbar style on scroll
    const handleScroll = () => {
      if (window.scrollY > 50) {
        setIsScrolled(true);
      } else {
        setIsScrolled(false);
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);
  
  return (
    <nav className={`navbar ${isScrolled ? 'scrolled' : ''}`}>
      <div className="navbar-container">
        <div className="logo">
          <Link href="/">Romanus Ang'ina</Link>
        </div>
        <div className="nav-links">
          <Link href="#about">About</Link>
          <Link href="#projects">Projects</Link>
          <Link href="#research">Research</Link>
          <Link href="#leadership">Leadership</Link>
          <a 
            href="/resume.pdf" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="resume-button"
          >
            Resume
          </a>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;