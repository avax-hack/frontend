# OpenLaunch Design Guide — Buidlpad-Inspired Redesign

Reference: https://buidlpad.com/

## Design System

### Color Palette (Monochrome + Accent)
- **Background**: `#ffffff` (white)
- **Foreground**: `#0a0a0a` (near-black)
- **Card Dark**: `#111111` (dark cards with white text)
- **Card Dark Foreground**: `#ffffff`
- **Muted**: `#f5f5f5` (light gray sections)
- **Muted Foreground**: `#737373` (gray text)
- **Border**: `#e5e5e5` (subtle borders)
- **Primary**: `#0a0a0a` (black buttons/accents)
- **Primary Foreground**: `#ffffff`
- **Secondary**: `#f5f5f5`
- **Accent Green**: `#22c55e` (success/live indicators)
- **Accent Red**: `#ef4444` (destructive)
- **Ring/Focus**: `#0a0a0a`

### Typography
- **Font**: Keep Geist Sans (clean, modern)
- **Hero**: `text-5xl md:text-6xl lg:text-7xl font-bold tracking-tight`
- **Section titles**: `text-3xl font-bold`
- **Body**: `text-base` neutral gray
- **Labels/captions**: `text-sm text-muted-foreground`

### Components Style
- **Buttons**: Black fill with white text (primary), white outline (secondary), rounded-full (pill shape)
- **Cards**: Two styles:
  1. Light cards: white bg, subtle border, rounded-2xl
  2. Dark cards: #111 bg, white text, rounded-2xl (for featured/project cards)
- **Badges**: Small pills with subtle bg colors
- **Progress bars**: Thin, rounded-full
- **Header**: Clean white bg, subtle bottom border. Pill tab switcher (bg-muted rounded-full)
- **Sections**: Generous padding (py-16 to py-24), max-w-7xl centered

### Layout Patterns (from Buidlpad)
1. **Hero**: Large bold text, subtitle below, CTA pill buttons (black + outline)
2. **Featured Section**: Dark project cards in carousel/grid
3. **Feature highlights**: 2-col grid — left text checklist, right dark card
4. **CTA Section**: Simple text + action button
5. **Project cards (dark)**: Dark bg, logo, name, progress bar, stats, status badge

### Spacing
- Page sections: `py-16 md:py-24`
- Card padding: `p-6 md:p-8`
- Between sections: `gap-16 md:gap-24`
- Content max-width: `max-w-7xl`

### Transitions
- Hover cards: subtle translateY(-2px) lift + shadow
- Buttons: opacity transition on hover
- Tab switcher: smooth background slide
