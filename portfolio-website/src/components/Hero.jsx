import { useEffect, useRef } from 'react';
import Image from 'next/image';
import { gsap } from 'gsap';
import { FaGithub, FaLinkedin, FaFileAlt } from 'react-icons/fa';

const Hero = () => {
  const heroRef = useRef(null);
  const imageRef = useRef(null);
  const contentRef = useRef(null);
  const titleRef = useRef(null);
  const subtitleRef = useRef(null);
  
  useEffect(() => {
    // Create an entrance animation
    const tl = gsap.timeline({
      defaults: { ease: "power3.out" }
    });
    
    // Simple fade in of profile image
    tl.fromTo(imageRef.current, 
      {
        opacity: 0
      },
      {
        opacity: 1,
        duration: 1,
        ease: "power2.out"
      }
    );
    
    // Animate title with a simple fade in
    tl.fromTo(titleRef.current,
      {
        y: 15,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        ease: "power2.out"
      },
      "-=0.5"
    );
    
    // Staggered entrance for the rest of the content
    tl.fromTo(contentRef.current.querySelectorAll('.animate-item:not(h1)'),
      {
        y: 20,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        stagger: 0.1,
        duration: 0.7,
        ease: "power2.out"
      }, 
      "-=0.4"
    );
    
    // Simple underline animation for the subtitle
    if (subtitleRef.current) {
      const subtitle = subtitleRef.current;
      
      // Create an underline element
      const underline = document.createElement('div');
      underline.className = 'title-underline';
      underline.style.position = 'absolute';
      underline.style.bottom = '-5px';
      underline.style.left = '0';
      underline.style.height = '2px';
      underline.style.width = '0';
      underline.style.backgroundColor = '#aaaaaa';
      underline.style.borderRadius = '1px';
      
      subtitle.style.position = 'relative';
      subtitle.appendChild(underline);
      
      // Animate the underline
      tl.to('.title-underline', {
        width: '100%',
        duration: 1.2,
        ease: "power2.inOut"
      }, "-=0.2");
    }
  }, []);
  
  return (
    <section ref={heroRef} id="about" className="hero-section">
      <div className="hero-container">
        <div ref={imageRef} className="profile-image-container">
          <Image 
            src="/images/profile.jpg" 
            alt="Romanus Ang'ina" 
            width={250} 
            height={250} 
            className="profile-image"
          />
        </div>
        
        <div ref={contentRef} className="hero-content">
          <h1 ref={titleRef} className="animate-item hero-title">Romanus Ang'ina</h1>
          <h2 ref={subtitleRef} className="animate-item hero-subtitle">
            Electrical and Computer Engineering Student at Rice University | Software Developer & Researcher
          </h2>
          
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
              className="social-icon"
            >
              <FaGithub size={24} />
            </a>
            <a 
              href="https://linkedin.com/in/romanus-angina/" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="LinkedIn Profile"
              className="social-icon"
            >
              <FaLinkedin size={24} />
            </a>
            <a 
              href="/resume.pdf" 
              target="_blank" 
              rel="noopener noreferrer" 
              aria-label="Resume"
              className="social-icon"
            >
              <FaFileAlt size={24} />
            </a>
          </div>
          
          <div className="cta-buttons animate-item">
            <a href="#projects" className="primary-btn">View Projects</a>
            <a href="#research" className="secondary-btn">Research Work</a>
          </div>
          
        </div>
      </div>
    </section>
  );
};

export default Hero;