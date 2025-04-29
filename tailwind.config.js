/** @type {import('tailwindcss').Config} */
module.exports = {
    content: [
      "./app/**/*.{js,ts,jsx,tsx}",    // your app folder
      "./components/**/*.{js,ts,jsx,tsx}", // optional if you add components later
    ],
    theme: {
      extend: {},
    },
    plugins: [
      require('@tailwindcss/typography'), // ✅ This styles your markdown (headings, paragraphs, lists, etc.)
    ],
  };