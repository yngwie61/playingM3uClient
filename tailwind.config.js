/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './src/**/*.{html,js,ts,jsx,tsx}', // ここにファイルのパスを指定
  ],
  theme: {
    extend: {
      colors: {
        'primary': '#6200ee', // マテリアルデザインのプライマリカラー
        'secondary': '#03dac6', // セカンダリカラー
      },
      boxShadow: {
        'md': '0 4px 6px rgba(0, 0, 0, 0.1), 0 1px 3px rgba(0, 0, 0, 0.08)',
      },
      borderRadius: {
        'lg': '8px',
      },
    },
  },
  plugins: [],
}

