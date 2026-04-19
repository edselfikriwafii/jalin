import type { Config } from 'tailwindcss'

const config: Config = {
  content: [
    './app/**/*.{ts,tsx}',
    './components/**/*.{ts,tsx}',
  ],
  theme: {
    extend: {
      colors: {
        // Warna utama — merah/coral hangat untuk CTA
        primary: {
          DEFAULT: '#E04B3A',
          hover: '#C73D2E',
        },
        // Warna sekunder — teal dalam untuk badge dan aksen
        secondary: '#2E7D8C',
        // Background halaman — krem hangat
        background: '#F5F0E4',
        // Background card, modal, input — krem lebih terang
        surface: '#FDFAF4',
        // Border — tan hangat, tegas tanpa shadow
        border: '#C9BC9E',
        // Status
        success: '#2E7D60',
        warning: '#D97706',
        error: '#DC2626',
        // Teks
        text: {
          primary: '#1A1A1A',
          secondary: '#6B6355',
        },
      },
      fontFamily: {
        // Heading besar — serif untuk kesan akademik
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        // Body teks — sans-serif bersih dan mudah dibaca
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        // Shadow gaya retro flat — bukan drop-shadow standar
        retro: '3px 3px 0px #C9BC9E',
        'retro-lg': '4px 4px 0px #C9BC9E',
        'retro-primary': '3px 3px 0px #C73D2E',
      },
    },
  },
  plugins: [],
}

export default config
