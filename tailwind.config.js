module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        latoRegular: ["Lato-Regular", "sans-serif"],
        latoThin: ["Lato-Thin", "sans-serif"],
        latoBold: ["Lato-Bold", "sans-serif"],
        latoBlack: ["Lato-Black", "sans-serif"],

        prata: ["Prata-Regular", "sans-serif"],

        ttCommonsRegular: ["TTCommonsPro-Regular", "sans-serif"],
        ttCommonsThin: ["TTCommonsPro-Thin", "sans-serif"],
        ttCommonsExpandedRegular: [
          "TTCommonsPro-Expanded-Regular",
          "sans-serif",
        ],
        ttCommonsExpandedThin: ["TTCommonsPro-Expanded-Thin", "sans-serif"],
      },
    },
  },
  plugins: [require("tailwind-scrollbar")({ nocompatible: true })],
};
