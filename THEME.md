# THEME.md — Panduan Visual Jalin

> Tema diekstrak dari 3 gambar referensi di folder `references/`:
> - `retro_design_reference_1.jpeg` — Job board UI dengan background krem & aksen merah
> - `retro_design_reference_2.jpeg` — Reading app dengan auth form, background krem hangat
> - `retro_design_reference_3.jpeg` — Education platform minimal, background off-white, border tegas

---

## Mood & Nuansa

**Retro-Minimal & Warm** — Bersih dan modern, tapi punya karakter hangat yang mengundang. Tidak dingin seperti SaaS korporat, tidak terlalu playful seperti app anak-anak. Tepat untuk pelajar yang serius tapi butuh suasana belajar yang nyaman.

Ciri khas visual:
- Background krem hangat (bukan putih dingin)
- Border tegas tanpa shadow (gaya retro flat)
- Warna aksen merah/coral yang berani untuk CTA
- Tipografi serif untuk heading yang memberikan kesan akademik
- Ilustrasi sederhana sebagai elemen dekoratif (opsional)

---

## Palet Warna

| Token | Hex | Penggunaan |
|---|---|---|
| `primary` | `#E04B3A` | Tombol utama (CTA), link aktif, aksen penting |
| `primary-hover` | `#C73D2E` | Hover state tombol utama |
| `secondary` | `#2E7D8C` | Badge, tag aktif, highlight sekunder |
| `background` | `#F5F0E4` | Background halaman utama |
| `surface` | `#FDFAF4` | Background card, modal, input |
| `text-primary` | `#1A1A1A` | Teks utama, heading |
| `text-secondary` | `#6B6355` | Teks deskripsi, placeholder, caption |
| `border` | `#C9BC9E` | Semua border — tegas, tanpa shadow |
| `error` | `#DC2626` | Pesan error, border input invalid |
| `success` | `#2E7D60` | Pesan sukses, indikator nilai tinggi |
| `warning` | `#D97706` | Peringatan, timer hampir habis |

### Catatan Penting Warna
- **Jangan gunakan `box-shadow` standar.** Gunakan shadow retro flat: `box-shadow: 3px 3px 0px #C9BC9E`
- **Jangan gunakan Tailwind `shadow-*` utilities** kecuali di-override ke gaya retro flat di atas
- White murni `#FFFFFF` hanya digunakan untuk teks di atas background gelap

---

## Tipografi

| Peran | Font | Ukuran Dasar | Tailwind Class |
|---|---|---|---|
| Heading besar (h1) | DM Serif Display | 36–48px | `font-serif text-4xl` |
| Heading sedang (h2, h3) | DM Serif Display | 24–30px | `font-serif text-2xl` |
| Body teks | DM Sans | 16px | `font-sans text-base` |
| Caption / label kecil | DM Sans | 14px | `font-sans text-sm` |

### Setup Font (Next.js)
```ts
// app/layout.tsx
import { DM_Serif_Display, DM_Sans } from 'next/font/google'

const dmSerifDisplay = DM_Serif_Display({
  subsets: ['latin'],
  weight: '400',
  variable: '--font-serif',
})

const dmSans = DM_Sans({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-sans',
})
```

---

## Bentuk & Border Radius

| Elemen | Border Radius | Tailwind Class |
|---|---|---|
| Tombol (button) | 4px | `rounded` |
| Input field | 4px | `rounded` |
| Card / panel | 8px | `rounded-lg` |
| Badge / tag | 4px | `rounded` |
| Avatar | Lingkaran penuh | `rounded-full` |

**Prinsip:** Radius kecil = kesan tegas dan terstruktur. Hindari `rounded-xl` atau `rounded-2xl` kecuali ada alasan khusus.

---

## Shadow (Gaya Retro Flat)

```css
/* Shadow utama — digunakan pada card dan tombol */
box-shadow: 3px 3px 0px #C9BC9E;

/* Shadow saat hover (sedikit lebih besar) */
box-shadow: 4px 4px 0px #C9BC9E;

/* Tidak ada shadow */
box-shadow: none;
```

Dalam Tailwind, tambahkan ke `tailwind.config.ts`:
```ts
boxShadow: {
  'retro': '3px 3px 0px #C9BC9E',
  'retro-lg': '4px 4px 0px #C9BC9E',
}
```

---

## Mode Tampilan

**Light mode only.** Tidak ada dark mode untuk saat ini — gaya retro-warm bergantung pada warna krem hangat yang tidak cocok jika diinvert ke dark theme.

---

## Panduan Komponen

### Tombol Utama (Primary Button)
```
Background: #E04B3A
Teks: #FDFAF4 (light cream)
Border: 1px solid #C73D2E
Shadow: 3px 3px 0px #C9BC9E
Border radius: rounded (4px)
Hover: background #C73D2E, shadow 4px 4px 0px #C9BC9E
```

### Tombol Sekunder (Secondary Button / Outline)
```
Background: transparent
Teks: #1A1A1A
Border: 1px solid #C9BC9E
Shadow: 3px 3px 0px #C9BC9E
Border radius: rounded (4px)
Hover: background #F5F0E4
```

### Input Field
```
Background: #FDFAF4
Teks: #1A1A1A
Placeholder: #6B6355
Border: 1px solid #C9BC9E
Border radius: rounded (4px)
Focus: border #E04B3A (ring primary)
Error state: border #DC2626
```

### Card
```
Background: #FDFAF4
Border: 1px solid #C9BC9E
Shadow: 3px 3px 0px #C9BC9E
Border radius: rounded-lg (8px)
Padding: p-6
```

### Badge / Tag
```
Part 1: background #2E7D8C (secondary), teks putih
Part 2: background #E04B3A (primary), teks putih
Nilai tinggi (≥7.0): background #2E7D60 (success), teks putih
Nilai sedang (5.5–6.5): background #D97706 (warning), teks putih
Nilai rendah (<5.5): background #DC2626 (error), teks putih
```

---

## Konfigurasi Tailwind Lengkap

Tambahkan ke `tailwind.config.ts`:

```ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        primary: {
          DEFAULT: '#E04B3A',
          hover: '#C73D2E',
        },
        secondary: '#2E7D8C',
        background: '#F5F0E4',
        surface: '#FDFAF4',
        border: '#C9BC9E',
        success: '#2E7D60',
        warning: '#D97706',
        text: {
          primary: '#1A1A1A',
          secondary: '#6B6355',
        },
      },
      fontFamily: {
        serif: ['var(--font-serif)', 'Georgia', 'serif'],
        sans: ['var(--font-sans)', 'system-ui', 'sans-serif'],
      },
      boxShadow: {
        retro: '3px 3px 0px #C9BC9E',
        'retro-lg': '4px 4px 0px #C9BC9E',
      },
      borderRadius: {
        DEFAULT: '4px',
      },
    },
  },
  plugins: [],
}

export default config
```
