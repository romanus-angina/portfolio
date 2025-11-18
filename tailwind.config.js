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
    },
  },
  plugins: [],
}
