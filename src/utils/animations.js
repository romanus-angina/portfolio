import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/dist/ScrollTrigger';

// Register plugins
if (typeof window !== 'undefined') {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Animate elements into view when scrolling
 * @param {string} selector - CSS selector for elements to animate
 * @param {Object} options - Animation options
 */
export const animateOnScroll = (selector, options = {}) => {
  const defaults = {
    y: 20,
    opacity: 0,
    duration: 0.7,
    stagger: 0.08,
    ease: 'power2.out',
    start: 'top 75%',
    markers: false,
    once: false // Allow re-animation on scroll back up
  };

  const settings = { ...defaults, ...options };

  // Create the GSAP animation that animates FROM invisible TO visible 
  return gsap.fromTo(selector, 
    {
      y: settings.y,
      opacity: settings.opacity
    },
    {
      y: 0,
      opacity: 1,
      duration: settings.duration,
      stagger: settings.stagger,
      ease: settings.ease,
      scrollTrigger: {
        trigger: settings.trigger || selector,
        start: settings.start,
        end: settings.end || 'bottom 20%',
        toggleActions: 'play reverse play reverse', // Makes animation reverse when scrolling back up
        markers: settings.markers,
        once: settings.once
      }
    }
  );
};

/**
 * Creates a staggered entrance animation for a group of elements
 * @param {string} selector - CSS selector for elements to animate
 * @param {Object} options - Animation options
 */
export const staggerEntrance = (selector, options = {}) => {
  const defaults = {
    y: 20,
    opacity: 0,
    duration: 0.7,
    stagger: 0.08,
    ease: 'power2.out',
    delay: 0.2
  };

  const settings = { ...defaults, ...options };

  return gsap.fromTo(selector, 
    {
      y: settings.y,
      opacity: settings.opacity
    },
    {
      y: 0,
      opacity: 1,
      duration: settings.duration,
      stagger: settings.stagger,
      ease: settings.ease,
      delay: settings.delay
    }
  );
};

/**
 * Creates a subtle hover effect for elements
 * @param {string} selector - CSS selector for elements to animate
 * @param {Object} options - Animation options
 */
export const createHoverEffect = (selector, options = {}) => {
  const defaults = {
    y: -5,
    scale: 1.02,
    duration: 0.3,
    ease: 'power2.out'
  };

  const settings = { ...defaults, ...options };
  
  const elements = document.querySelectorAll(selector);
  
  elements.forEach(element => {
    element.addEventListener('mouseenter', () => {
      gsap.to(element, {
        y: settings.y,
        scale: settings.scale,
        duration: settings.duration,
        ease: settings.ease
      });
    });
    
    element.addEventListener('mouseleave', () => {
      gsap.to(element, {
        y: 0,
        scale: 1,
        duration: settings.duration,
        ease: settings.ease
      });
    });
  });
  
  // Return a cleanup function
  return () => {
    elements.forEach(element => {
      element.removeEventListener('mouseenter', () => {});
      element.removeEventListener('mouseleave', () => {});
    });
  };
};

/**
 * Creates a subtle parallax scrolling effect
 * @param {string} selector - CSS selector for elements to animate
 * @param {Object} options - Animation options
 */
export const createParallax = (selector, options = {}) => {
  const defaults = {
    y: '20%',
    ease: 'none',
    scrollTrigger: {
      trigger: selector,
      start: 'top bottom',
      end: 'bottom top',
      scrub: 0.5
    }
  };

  const settings = { ...defaults, ...options };
  
  return gsap.to(selector, {
    y: settings.y,
    ease: settings.ease,
    scrollTrigger: settings.scrollTrigger
  });
};

/**
 * Adds a subtle fade effect to section headings
 * @param {string} selector - CSS selector for heading elements
 */
export const animateHeadings = (selector) => {
  const headings = document.querySelectorAll(selector);
  
  headings.forEach(heading => {
    gsap.fromTo(heading,
      {
        y: 20,
        opacity: 0
      },
      {
        y: 0,
        opacity: 1,
        duration: 0.8,
        scrollTrigger: {
          trigger: heading,
          start: 'top 80%',
          toggleActions: 'play reverse play reverse',
          once: false
        }
      }
    );
    
    // Add subtle underline animation
    const underline = document.createElement('div');
    underline.className = 'heading-underline';
    underline.style.position = 'absolute';
    underline.style.bottom = '-10px';
    underline.style.left = '0';
    underline.style.height = '3px';
    underline.style.width = '0';
    underline.style.backgroundColor = '#aaaaaa';
    
    heading.style.position = 'relative';
    heading.appendChild(underline);
    
    gsap.to(underline, {
      width: '80px',
      duration: 0.6,
      delay: 0.2,
      scrollTrigger: {
        trigger: heading,
        start: 'top 80%',
        toggleActions: 'play reverse play reverse',
        once: false
      }
    });
  });
};

/**
 * Enhances buttons with subtle hover effects
 * @param {string} selector - CSS selector for button elements
 */
export const enhanceButtons = (selector) => {
  const buttons = document.querySelectorAll(selector);
  
  buttons.forEach(button => {
    button.addEventListener('mouseenter', () => {
      gsap.to(button, {
        y: -2,
        boxShadow: '0 5px 15px rgba(0, 0, 0, 0.1)',
        duration: 0.3
      });
    });
    
    button.addEventListener('mouseleave', () => {
      gsap.to(button, {
        y: 0,
        boxShadow: 'none',
        duration: 0.3
      });
    });
  });
};

/**
 * Initialize all page animations
 */
export const initPageAnimations = () => {
  // Animate hero section elements with staggered entrance
  staggerEntrance('.hero-content > *', { 
    delay: 0.3,
    duration: 0.7,
    stagger: 0.08
  });
  
  // Subtle hover effects
  createHoverEffect('.project-card, .org-card');
  
  // Enhance buttons
  enhanceButtons('.primary-btn, .secondary-btn, .resume-button');
  
  // Animate section headings
  animateHeadings('.section-title');
  
  // Add parallax to profile image
  createParallax('.profile-image-container', {
    y: '-10%',
    scrollTrigger: {
      scrub: 0.5
    }
  });
  
  // Animate content on scroll
  animateOnScroll('.project-card, .org-card', { 
    stagger: 0.1,
    y: 30
  });
};

// Export all animations
export default {
  animateOnScroll,
  staggerEntrance,
  createHoverEffect,
  createParallax,
  animateHeadings,
  enhanceButtons,
  initPageAnimations
};