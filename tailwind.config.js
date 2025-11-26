/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/pages/**/*.{js,ts,jsx,tsx,mdx}',
    './src/components/**/*.{js,ts,jsx,tsx,mdx}',
    './src/app/**/*.{js,ts,jsx,tsx,mdx}',
  ],
  theme: {
    extend: {
      // Lab-spec biotech futurism color palette
      colors: {
        // Base colors
        'base-white': '#FFFFFF',
        'base-graphite': '#2A2A2A',
        'base-graphite-light': '#3A3A3A',
        'base-graphite-dark': '#1A1A1A',
        
        // Accent colors
        'electric-blue': '#28D7FF',
        'bio-green': '#48F0A5',
        
        // Glass effect colors
        'glass-white': 'rgba(255, 255, 255, 0.1)',
        'glass-graphite': 'rgba(42, 42, 42, 0.1)',
        
        // Border colors with opacity
        'border-light': 'rgba(255, 255, 255, 0.12)',
        'border-dark': 'rgba(42, 42, 42, 0.12)',
      },
      
      // Typography - Lab-spec fonts
      fontFamily: {
        'display': ['Space Grotesk', 'sans-serif'],
        'mono': ['IBM Plex Mono', 'Fira Code', 'monospace'],
        'sans': ['Inter', 'system-ui', 'sans-serif'],
      },
      
      // Glass blur effects
      backdropBlur: {
        'glass': '16px',
        'glass-light': '12px',
      },
      
      // Custom shadows for glass effects
      boxShadow: {
        'glass': '0 8px 32px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.1)',
        'glass-inner': 'inset 0 1px 0 rgba(255, 255, 255, 0.1), inset 0 -1px 0 rgba(0, 0, 0, 0.1)',
        'dot-glow': '0 0 20px rgba(40, 215, 255, 0.3)',
        'bio-glow': '0 0 20px rgba(72, 240, 165, 0.3)',
      },
      
      // Grid background opacity
      backgroundImage: {
        'grid-pattern': 'radial-gradient(circle, rgba(255, 255, 255, 0.03) 1px, transparent 1px)',
        'grid-pattern-dark': 'radial-gradient(circle, rgba(42, 42, 42, 0.03) 1px, transparent 1px)',
      },
      
      // Animation for lab-spec effects
      animation: {
        'pulse-glow': 'pulse-glow 2s ease-in-out infinite alternate',
        'float': 'float 6s ease-in-out infinite',
        'ticker': 'ticker 20s linear infinite',
      },
      
      keyframes: {
        'pulse-glow': {
          '0%': { boxShadow: '0 0 20px rgba(40, 215, 255, 0.3)' },
          '100%': { boxShadow: '0 0 30px rgba(40, 215, 255, 0.6)' },
        },
        'float': {
          '0%, 100%': { transform: 'translateY(0px)' },
          '50%': { transform: 'translateY(-10px)' },
        },
        'ticker': {
          '0%': { transform: 'translateY(100%)' },
          '100%': { transform: 'translateY(-100%)' },
        },
      },
      
      // Spacing for grid system
      spacing: {
        'grid': '20px',
        'grid-sm': '10px',
        'grid-lg': '40px',
      },

      // Custom cursors with white outlines
      cursor: {
        'plus': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cline x1='12' y1='4' x2='12' y2='20' stroke='%23FFFFFF' stroke-width='4' stroke-linecap='round'/%3E%3Cline x1='4' y1='12' x2='20' y2='12' stroke='%23FFFFFF' stroke-width='4' stroke-linecap='round'/%3E%3Cline x1='12' y1='4' x2='12' y2='20' stroke='%232A2A2A' stroke-width='2' stroke-linecap='round'/%3E%3Cline x1='4' y1='12' x2='20' y2='12' stroke='%232A2A2A' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E") 12 12, auto`,
        'plus-interactive': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cline x1='12' y1='4' x2='12' y2='20' stroke='%23FFFFFF' stroke-width='4.5' stroke-linecap='round'/%3E%3Cline x1='4' y1='12' x2='20' y2='12' stroke='%23FFFFFF' stroke-width='4.5' stroke-linecap='round'/%3E%3Cline x1='12' y1='4' x2='12' y2='20' stroke='%2328D7FF' stroke-width='2.5' stroke-linecap='round'/%3E%3Cline x1='4' y1='12' x2='20' y2='12' stroke='%2328D7FF' stroke-width='2.5' stroke-linecap='round'/%3E%3C/svg%3E") 12 12, pointer`,
        'plus-bio': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cline x1='12' y1='4' x2='12' y2='20' stroke='%23FFFFFF' stroke-width='4.5' stroke-linecap='round'/%3E%3Cline x1='4' y1='12' x2='20' y2='12' stroke='%23FFFFFF' stroke-width='4.5' stroke-linecap='round'/%3E%3Cline x1='12' y1='4' x2='12' y2='20' stroke='%2348F0A5' stroke-width='2.5' stroke-linecap='round'/%3E%3Cline x1='4' y1='12' x2='20' y2='12' stroke='%2348F0A5' stroke-width='2.5' stroke-linecap='round'/%3E%3C/svg%3E") 12 12, pointer`,
        'plus-sm': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='16' height='16' viewBox='0 0 16 16'%3E%3Cline x1='8' y1='2' x2='8' y2='14' stroke='%23FFFFFF' stroke-width='3.5' stroke-linecap='round'/%3E%3Cline x1='2' y1='8' x2='14' y2='8' stroke='%23FFFFFF' stroke-width='3.5' stroke-linecap='round'/%3E%3Cline x1='8' y1='2' x2='8' y2='14' stroke='%232A2A2A' stroke-width='1.5' stroke-linecap='round'/%3E%3Cline x1='2' y1='8' x2='14' y2='8' stroke='%232A2A2A' stroke-width='1.5' stroke-linecap='round'/%3E%3C/svg%3E") 8 8, auto`,
        'plus-lg': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='32' height='32' viewBox='0 0 32 32'%3E%3Cline x1='16' y1='4' x2='16' y2='28' stroke='%23FFFFFF' stroke-width='4.5' stroke-linecap='round'/%3E%3Cline x1='4' y1='16' x2='28' y2='16' stroke='%23FFFFFF' stroke-width='4.5' stroke-linecap='round'/%3E%3Cline x1='16' y1='4' x2='16' y2='28' stroke='%232A2A2A' stroke-width='2.5' stroke-linecap='round'/%3E%3Cline x1='4' y1='16' x2='28' y2='16' stroke='%232A2A2A' stroke-width='2.5' stroke-linecap='round'/%3E%3C/svg%3E") 16 16, auto`,
        'x': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cline x1='6' y1='6' x2='18' y2='18' stroke='%23FFFFFF' stroke-width='4' stroke-linecap='round'/%3E%3Cline x1='18' y1='6' x2='6' y2='18' stroke='%23FFFFFF' stroke-width='4' stroke-linecap='round'/%3E%3Cline x1='6' y1='6' x2='18' y2='18' stroke='%232A2A2A' stroke-width='2' stroke-linecap='round'/%3E%3Cline x1='18' y1='6' x2='6' y2='18' stroke='%232A2A2A' stroke-width='2' stroke-linecap='round'/%3E%3C/svg%3E") 12 12, auto`,
        'x-interactive': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cline x1='6' y1='6' x2='18' y2='18' stroke='%23FFFFFF' stroke-width='4.5' stroke-linecap='round'/%3E%3Cline x1='18' y1='6' x2='6' y2='18' stroke='%23FFFFFF' stroke-width='4.5' stroke-linecap='round'/%3E%3Cline x1='6' y1='6' x2='18' y2='18' stroke='%2328D7FF' stroke-width='2.5' stroke-linecap='round'/%3E%3Cline x1='18' y1='6' x2='6' y2='18' stroke='%2328D7FF' stroke-width='2.5' stroke-linecap='round'/%3E%3C/svg%3E") 12 12, pointer`,
        'x-bio': `url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='24' height='24' viewBox='0 0 24 24'%3E%3Cline x1='6' y1='6' x2='18' y2='18' stroke='%23FFFFFF' stroke-width='4.5' stroke-linecap='round'/%3E%3Cline x1='18' y1='6' x2='6' y2='18' stroke='%23FFFFFF' stroke-width='4.5' stroke-linecap='round'/%3E%3Cline x1='6' y1='6' x2='18' y2='18' stroke='%2348F0A5' stroke-width='2.5' stroke-linecap='round'/%3E%3Cline x1='18' y1='6' x2='6' y2='18' stroke='%2348F0A5' stroke-width='2.5' stroke-linecap='round'/%3E%3C/svg%3E") 12 12, pointer`,
      },
    },
  },
  plugins: [],
}
