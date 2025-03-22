import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { FaGithub, FaLinkedin, FaFileAlt } from 'react-icons/fa';

const Hero = () => {
  const heroRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  
  useEffect(() => {
    // Fade in the content with staggered animation
    const tl = gsap.timeline();
    
    tl.from(imageRef.current, {
      scale: 0.8,
      opacity: 0,
      duration: 1,
      ease: 'power3.out'
    });
    
    tl.from(contentRef.current.querySelectorAll('.animate-item'), {
      y: 30,
      opacity: 0,
      stagger: 0.2,
      duration: 0.8,
      ease: 'power2.out'
    }, '-=0.5');
    
    // Mouse movement parallax effect
    const handleMouseMove = (e) => {
      const xValue = (e.clientX - window.innerWidth / 2) / 25;
      const yValue = (e.clientY - window.innerHeight / 2) / 25;
      
      gsap.to(imageRef.current, {
        duration: 1,
        x: xValue,
        y: yValue,
        ease: 'power2.out'
      });
      
      gsap.to(contentRef.current.querySelectorAll('.animate-item'), {
        duration: 1,
        x: xValue * 0.5,
        y: yValue * 0.5,
        ease: 'power2.out',
        stagger: 0.05
      });
    };
    
    window.addEventListener('mousemove', handleMouseMove);
    
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []);
  
  return (
    <section ref={heroRef} id="about" className="hero-section">
      <div className="hero-container">
        <div ref={imageRef} className="profile-image-container">
        <Image 
          src="/images/profile.jpg" 
          alt="Your Name" 
          width={250} 
          height={250} 
          className="profile-image"
          priority
        />
        </div>
        
        <div ref={contentRef} className="hero-content">
          <h1 className="animate-item">Romanus Ang'ina</h1>
          <h2 className="animate-item">Electrical and Computer Engineeering Student at Rice University | Software Developer & Researcher</h2>
          
          <p className="animate-item hero-description">
            I'm an undergrad at Rice University studying Electrical and Computer Engineering. I'm passionate about building software applications and conducting research to create meaningful
            impact in the world. Currently, I'm working on projects that involve machine learning, web development, and data analysis.
          </p>
          
          <div className="social-links animate-item">
            <a 
              href="https://github.com/romanus-angina" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="GitHub Profile"
            >
              <FaGithub size={24} />
            </a>
            <a 
              href="https://linkedin.com/in/romanus-angina/" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="LinkedIn Profile"
            >
              <FaLinkedin size={24} />
            </a>
            <a 
              href="/resume.pdf" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Resume"
            >
              <FaFileAlt size={24} />
            </a>
          </div>
          
          <div className="scroll-indicator animate-item">
            <span>Scroll down</span>
            <div className="scroll-arrow">↓</div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;