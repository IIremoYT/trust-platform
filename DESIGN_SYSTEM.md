# TRUST Design System

Concise reference for the visual language of the TRUST Platform.

## Colors

| Token | Value | Usage |
|-------|-------|-------|
| `brand-gold` | `#D4AF37` | Primary accent, CTAs, active states |
| `black` | `#000000` | Page background |
| `surface` | `#0A0A0A` | Cards, panels |
| `white/5` | `rgba(255,255,255,0.05)` | Borders, dividers |
| `white/10` | `rgba(255,255,255,0.1)` | Hover borders |
| `zinc-400` | `#A1A1AA` | Secondary text |
| `zinc-500` | `#71717A` | Muted text |

## Typography

- **Font:** Cairo (Arabic), Inter (English fallback)
- **Sizes:** `text-xs` (10px) → `text-sm` (14px) → `text-base` (16px) → `text-4xl` (36px)
- **Weights:** `font-medium` (body), `font-bold` (headings), `font-black` (hero)

## Spacing & Radius

- Cards: `rounded-[28px]` to `rounded-[32px]`
- Buttons: `rounded-2xl` (large), `rounded-full` (pills)
- Inner padding: `p-6` to `p-8`
- Section gaps: `space-y-8` to `space-y-12`

## Shadows & Effects

- Card shadow: `shadow-2xl`
- Gold glow: `shadow-[0_0_40px_rgba(212,175,55,0.15)]`
- Backdrop blur: `backdrop-blur-xl` to `backdrop-blur-2xl`
- Film grain: `opacity-[0.02]` noise overlay

## Motion

All animations defined in `lib/motion.ts`:
- **fadeUp** — Default entrance
- **fadeIn** — Overlays
- **scaleUp** — Interactive cards
- **staggerContainer** — Lists/grids
- Default easing: `[0.16, 1, 0.3, 1]`

## Rules

1. **Subtle over flashy** — Animations should feel expensive, not busy
2. **Dark first** — Everything is dark mode by design
3. **Gold is sacred** — Use `brand-gold` sparingly for emphasis only
4. **No generic colors** — No plain red/blue/green. Use curated variants
5. **RTL native** — All layouts use `dir="rtl"` in admin
