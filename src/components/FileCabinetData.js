// File Cabinet Data Structure
// Defines folder metadata and ASCII art configurations

export const folderData = [
  {
    id: "bio",
    title: "Bio",
    number: "010",
    color: "electric",
    description: "Personal information and background",
    asciiConfig: {
      imagePath: "/images/profile.jpg",
      artStyle: "classic",
      colorScheme: "white",
      width: 120,
      height: 80,
      disableAnimations: false
    }
  },
  {
    id: "projects",
    title: "Projects",
    number: "012", 
    color: "bio",
    description: "Portfolio projects and work",
    asciiConfig: {
      imagePath: "/images/coinflip.png",
      artStyle: "tech",
      colorScheme: "green",
      width: 120,
      height: 80,
      disableAnimations: false
    }
  },
  {
    id: "research",
    title: "Research",
    number: "005",
    color: "electric", 
    description: "Academic research and publications",
    asciiConfig: {
      imagePath: "/images/rice-datathon.png",
      artStyle: "tech",
      colorScheme: "white",
      width: 120,
      height: 80,
      disableAnimations: false
    }
  },
  {
    id: "leadership",
    title: "Leadership",
    number: "002",
    color: "bio",
    description: "Leadership roles and experiences",
    asciiConfig: {
      imagePath: "/images/stem-sotr.png",
      artStyle: "classic",
      colorScheme: "green",
      width: 120,
      height: 80,
      disableAnimations: false
    }
  },
  {
    id: "skills",
    title: "Skills",
    number: "002",
    color: "electric",
    description: "Technical skills and technologies",
    asciiConfig: {
      imagePath: "/images/gsap-logo.svg",
      artStyle: "tech",
      colorScheme: "white",
      width: 120,
      height: 80,
      disableAnimations: false
    }
  },
  {
    id: "contact",
    title: "Contact",
    number: "002",
    color: "bio",
    description: "Get in touch and connect",
    asciiConfig: {
      imagePath: "/images/threejs-logo.svg",
      artStyle: "classic",
      colorScheme: "green",
      width: 120,
      height: 80,
      disableAnimations: false
    }
  }
];

// Color mapping for folder styling
export const colorMap = {
  electric: {
    background: "var(--glass-white)",
    border: "var(--border-electric)",
    text: "var(--electric-blue)",
    glow: "var(--shadow-dot-glow)"
  },
  bio: {
    background: "var(--glass-white)",
    border: "var(--border-bio)", 
    text: "var(--bio-green)",
    glow: "var(--shadow-bio-glow)"
  }
};

// Default folder dimensions
export const folderDimensions = {
  closed: {
    width: "200px",
    height: "60px"
  },
  open: {
    width: "300px", 
    height: "200px"
  }
};
