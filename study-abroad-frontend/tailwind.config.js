export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        midnight: 'var(--bg-primary)',
        card: 'var(--bg-card)',
        gold: 'var(--accent-gold)',
        teal: 'var(--accent-teal)',
        coral: 'var(--accent-coral)',
      },
      fontFamily: {
        playfair: ['Playfair Display', 'serif'],
        'dm-sans': ['DM Sans', 'sans-serif'],
        jetbrains: ['JetBrains Mono', 'monospace'],
      },
    },
  },
  plugins: [],
}
