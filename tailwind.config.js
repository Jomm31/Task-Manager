/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // Original palette
        'raisin': 'rgb(40, 38, 45)',
        'ceil': 'rgb(153, 151, 191)',
        'lavender': 'rgb(208, 203, 227)',
        'silver': 'rgb(116, 109, 108)',
        'pastel': 'rgb(171, 193, 199)',
        
        // Extended palette - depth & variations
        'midnight': 'rgb(28, 26, 32)',        // Darker than raisin for depth
        'dusk': 'rgb(55, 52, 65)',            // Lighter dark for cards/elevated surfaces
        'mauve': 'rgb(180, 175, 200)',        // Between ceil and lavender
        'mist': 'rgb(230, 226, 240)',         // Very light lavender for light mode
        
        // Semantic colors - harmonized with purple palette
        'sage': 'rgb(134, 179, 152)',         // Success - muted green
        'sage-dark': 'rgb(98, 145, 115)',     // Success hover
        'rose': 'rgb(198, 134, 147)',         // Error/danger - soft rose
        'rose-dark': 'rgb(168, 104, 117)',    // Error hover
        'amber': 'rgb(212, 180, 131)',        // Warning - warm amber
        'amber-dark': 'rgb(182, 150, 101)',   // Warning hover
        
        // Accent variations
        'ceil-light': 'rgb(178, 176, 211)',   // Lighter ceil for hover
        'ceil-dark': 'rgb(123, 121, 161)',    // Darker ceil for active
        'pastel-light': 'rgb(196, 213, 218)', // Lighter pastel
        'pastel-dark': 'rgb(141, 163, 169)',  // Darker pastel
      }
    },
  },
  plugins: [],
}
