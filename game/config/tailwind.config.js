/** @type {import('tailwindcss').Config} */
module.exports = {
    content: ["./srcs/*.{ts,tsx}"],
    theme: {
        extend: {
            colors: {
                "pale-blue": "#b2c6e4",
				"bluish-purple": "#3d3c65",
				"reddish-orange": "#f08666",
				"exit-red": "#ef233c",
            },
            borderRadius: {
                main: "40px",
            },
			fontFamily: {
				roboto: ["Roboto", "sans-serif"],
				zenkaku: ["Zen Kaku Gothic Antique", "sans-serif"],
			},
        },
    },
};
