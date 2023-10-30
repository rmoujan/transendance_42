/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{js,jsx,ts,tsx,html,css}"],
  theme: {
    extend: {
      screens: {
        'mobile': '320px',
        // => @media (min-width: 640px) { ... }
  
        'tablet': '768px',
        // => @media (min-width: 1024px) { ... }
  
        'laptop': '1024px',
        // => @media (min-width: 1280px) { ... }
        'lg-laptop': '1280px',
        // => @media (min-width: 1280px) { ... }
      },
      colors:{
        glass: "rgba(255, 255, 255, 0.25)",
        brown: "rgb(30, 30 , 17);",
        primary:"#16132B",
        secondary:"#3D3C65",
        tartiary:"#FE754D",
        grey:"#B7B7C9",
        "pale-blue": "#b2c6e4",
				"bluish-purple": "#3d3c65",
				"reddish-orange": "#f08666",
				"exit-red": "#ef233c",
      },
      borderRadius: {
        main: "40px",
    },
      animation: {
        "text-reveal": "text-reveal 1.5s cubic-bezier(0.77, 0, 0.175, 1) 0.5s",
      },
      keyframes: {
        "text-reveal": {
          "0%": {
            transform: "translate(0, 100%)",
          },
          "100%": {
            transform: "translate(0, 0)",
          },
        },
      },
      fontFamily:{
        zcool:['ZCOOL KuaiLe', 'Roboto'],
        Lemon:['Lemon'],
        PalanquinDark:['Palanquin Dark'],
        Lalezar: ['Lalezar'],
        Satisfy:['Satisfy'],
        Sacramento:['Sacramento'],
        Architects_Daughter:['Architects Daughter'],
        Bad_Script:['Bad Script'],
        roboto: ["Roboto", "sans-serif"],
				zenkaku: ["Zen Kaku Gothic Antique", "sans-serif"],
      }
    },

  },
  plugins: [
    require("tailwind-scrollbar")
  ],
}
