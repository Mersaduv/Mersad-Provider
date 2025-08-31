/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx}",
    "./src/components/**/*.{js,ts,jsx,tsx}",
    "./src/app/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      typography: {
        DEFAULT: {
          css: {
            'direction': 'rtl',
            'text-align': 'right',
            'max-width': 'none',
            'color': '#374151',
            'h1, h2, h3, h4, h5, h6': {
              'color': '#111827',
              'font-weight': '700',
              'margin-top': '1.5em',
              'margin-bottom': '0.5em',
            },
            'p': {
              'margin-top': '1em',
              'margin-bottom': '1em',
              'line-height': '1.75',
            },
            'ul, ol': {
              'margin-top': '1em',
              'margin-bottom': '1em',
              'padding-right': '1.5em',
            },
            'li': {
              'margin-top': '0.5em',
              'margin-bottom': '0.5em',
            },
            'blockquote': {
              'border-right': '4px solid #e5e7eb',
              'padding-right': '1rem',
              'margin-right': '0',
              'margin-left': '0',
              'font-style': 'italic',
              'color': '#6b7280',
            },
            'table': {
              'width': '100%',
              'border-collapse': 'collapse',
              'margin-top': '1em',
              'margin-bottom': '1em',
            },
            'th, td': {
              'border': '1px solid #e5e7eb',
              'padding': '0.5rem',
              'text-align': 'right',
            },
            'th': {
              'background-color': '#f9fafb',
              'font-weight': '600',
            },
            'code': {
              'background-color': '#f3f4f6',
              'padding': '0.25rem 0.5rem',
              'border-radius': '0.25rem',
              'font-size': '0.875em',
              'color': '#dc2626',
            },
            'pre': {
              'background-color': '#1f2937',
              'color': '#f9fafb',
              'padding': '1rem',
              'border-radius': '0.5rem',
              'overflow-x': 'auto',
            },
            'pre code': {
              'background-color': 'transparent',
              'padding': '0',
              'color': 'inherit',
            },
            'a': {
              'color': '#3b82f6',
              'text-decoration': 'underline',
            },
            'a:hover': {
              'color': '#2563eb',
            },
            'img': {
              'border-radius': '0.5rem',
              'margin-top': '1em',
              'margin-bottom': '1em',
            },
          },
        },
      },
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
};
