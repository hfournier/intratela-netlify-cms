const colors = require('tailwindcss/colors');
const plugin = require('tailwindcss/plugin');

module.exports = {
  mode: 'jit',
  purge: {
    mode: 'all',
    content: ['./**/*.html'],
    options: {
      whitelist: []
    }
  },
  theme: {
    container: {
      center: true
    },
    extend: {
      colors: {
        primary: {
          50: '#f9ebe0',
          100: '#f0ccb3',
          200: '#e6aa80',
          300: '#db884d',
          400: '#d46f26',
          500: '#cc5500',
          600: '#c74e00',
          700: '#c04400',
          800: '#b93b00',
          900: '#ad2a00'
        },
        secondary: {
          50: '#e0eff9',
          100: '#b3d6f0',
          200: '#80bbe6',
          300: '#4da0db',
          400: '#268bd4',
          500: '#0077cc',
          600: '#006fc7',
          700: '#0064c0',
          800: '#005ab9',
          900: '#0047ad'
        },
        gray: colors.warmGray
      },
      fontFamily: {
        cunia: ['Cunia', 'sans-serif']
      },
      transformOrigin: {
        0: '0%'
      },
      transitionProperty: {
        height: 'height'
      },
      animation: {
        floating: 'floating 3s ease-in-out infinite',
        revfloating: 'revfloating 3s ease-in-out infinite',
        wiggle: 'wiggle 1s ease-in-out infinite'
      },
      keyframes: {
        floating: {
          '0%, 100%': {
            transform: 'translate(0, 0px)'
          },
          '25%': {
            transform: 'translate(8px, 8px)'
          },
          '50%': {
            transform: 'translate(0, 16px)'
          },
          '75%': {
            transform: 'translate(-8px, 8px)'
          }
        },
        revfloating: {
          '0%, 100%': {
            transform: 'translate(0, 0px)'
          },
          '25%': {
            transform: 'translate(-8px, 8px)'
          },
          '50%': {
            transform: 'translate(0, 16px)'
          },
          '75%': {
            transform: 'translate(8px, 8px)'
          }
        },
        wiggle: {
          '0%, 100%': { transform: 'rotate(-2deg)' },
          '50%': { transform: 'rotate(2deg)' }
        }
      }
    }
  },
  variants: {},
  plugins: [
    require('@tailwindcss/typography'),
    plugin(function ({ addVariant, e, postcss }) {
      addVariant('firefox', ({ container, separator }) => {
        const isFirefoxRule = postcss.atRule({
          name: '-moz-document',
          params: 'url-prefix()'
        });
        isFirefoxRule.append(container.nodes);
        container.append(isFirefoxRule);
        isFirefoxRule.walkRules((rule) => {
          rule.selector = `.${e(
            `firefox${separator}${rule.selector.slice(1)}`
          )}`;
        });
      });
    })
  ]
};
