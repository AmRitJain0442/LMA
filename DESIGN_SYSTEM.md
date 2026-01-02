# LoanLattice Design System

## Overview
A complete UI/UX redesign featuring a modern duotone color scheme, glassmorphism, smooth animations, and rich visual components.

---

## Color Palette

### Duotone Base Colors

#### Primary (Indigo)
- Primary-500: `#6366F1` - Main brand color
- Range: 50 to 950 shades
- Use: Primary actions, headings, accents

#### Secondary (Orange)
- Secondary-500: `#F97316` - Complementary accent
- Range: 50 to 950 shades
- Use: CTAs, highlights, warm accents

#### Accent (Teal)
- Accent-500: `#14B8A6`
- Use: Success states, progress indicators

#### Dark (Slate)
- Dark-900: `#0f172a` - Primary text
- Range: 50 to 950 shades
- Use: Text, backgrounds, UI elements

---

## Gradients

### Linear Gradients
- `gradient-primary`: Indigo gradient
- `gradient-secondary`: Orange gradient
- `gradient-duotone`: Indigo → Orange
- `gradient-duotone-reverse`: Orange → Indigo
- `gradient-subtle`: Light duotone
- `gradient-dark`: Dark slate
- `gradient-accent`: Teal gradient

### Radial Gradients
- `gradient-radial-primary`: Centered indigo
- `gradient-radial-duotone`: Duotone ellipse
- `gradient-radial-soft`: Soft primary glow

### Animated Gradients
- `gradient-animated`: Multi-color shift
- `gradient-mesh`: Complex mesh pattern

---

## Typography

### Font Families
- **Display**: "Plus Jakarta Sans" - Headlines, UI
- **Body**: "DM Sans" - Content, paragraphs

### Text Styles
- `.text-gradient`: Duotone gradient text
- `.text-gradient-primary`: Primary gradient text
- `.text-gradient-secondary`: Secondary gradient text
- `.text-shadow-soft`: Subtle shadow
- `.text-shadow-glow`: Glowing effect

---

## Components

### Glass Card
Modern glassmorphism effect with backdrop blur:
```jsx
<div className="glass-card">
  {/* Content */}
</div>
```

**Variants:**
- `.glass-card` - Light frosted glass
- `.glass-card-dark` - Dark frosted glass

**Features:**
- Backdrop blur
- Semi-transparent background
- Subtle borders
- Hover lift effect

### Gradient Button
Beautiful gradient buttons with animations:
```jsx
<button className="btn-gradient">
  Click Me
</button>
```

**Variants:**
- `.btn-gradient` - Duotone gradient with shine
- `.btn-outline` - Gradient border

**Features:**
- Shimmer animation on hover
- Lift effect
- Active press state
- Loading state support

### Modern Input
Clean input fields with focus states:
```jsx
<input className="input-modern" />
```

**Features:**
- Glassmorphism background
- Gradient focus ring
- Smooth transitions

### Badges
Status indicators with backdrop blur:
```jsx
<span className="badge badge-primary">Active</span>
```

**Variants:**
- `badge-primary` - Indigo
- `badge-secondary` - Orange
- `badge-success` - Teal

---

## React Components

### AnimatedCard
Card with hover effects and glow:
```jsx
<AnimatedCard
  hoverEffect="lift"
  glowColor="primary"
  className="p-6"
>
  Content
</AnimatedCard>
```

**Props:**
- `hoverEffect`: 'lift' | 'scale' | 'rotate' | 'none'
- `glowColor`: 'primary' | 'secondary' | 'accent' | 'none'

### GradientButton
Modern button with variants:
```jsx
<GradientButton
  variant="duotone"
  size="lg"
  icon={ArrowRight}
  loading={false}
>
  Get Started
</GradientButton>
```

**Variants:**
- `duotone` - Gradient background
- `outline` - Gradient border
- `primary` | `secondary` | `accent` - Solid colors
- `ghost` - Transparent

**Sizes:** `sm` | `md` | `lg`

### ScrollSection
Scroll-triggered animations:
```jsx
<ScrollSection
  animation="fade-in-up"
  delay={100}
  threshold={0.2}
>
  Content
</ScrollSection>
```

**Animations:**
- `fade-in`, `fade-in-up`, `fade-in-down`
- `slide-up`, `slide-left`, `slide-right`
- `scale-in`

### InfoCard
Feature card with icon:
```jsx
<InfoCard
  icon={Zap}
  title="Fast Processing"
  description="Process documents instantly"
  accentColor="primary"
/>
```

### StatCard
Animated statistics display:
```jsx
<StatCard
  icon={DollarSign}
  label="Total Volume"
  value={2500000}
  prefix="$"
  trend="up"
  trendValue="+23%"
  animate={true}
/>
```

**Features:**
- Number count-up animation
- Trend indicators
- Icon support

---

## Animations

### Keyframes
All animations use hardware-accelerated properties:

**Movement:**
- `float` - Gentle floating motion
- `drift` - Complex drift pattern
- `wiggle` - Subtle rotation

**Fade & Slide:**
- `fadeIn`, `fadeInUp`, `fadeInDown`
- `slideUp`, `slideDown`, `slideLeft`, `slideRight`

**Scale & Pulse:**
- `scaleIn` - Scale from 95% to 100%
- `pulseSlow` - Breathing effect
- `pulseGlow` - Glowing pulse

**Gradients:**
- `gradientShift` - Background position shift
- `gradientXY` - Complex 2D movement
- `shimmer` - Shine effect

### Animation Classes
```css
.animate-float
.animate-drift
.animate-fade-in-up
.animate-pulse-slow
.animate-gradient-shift
```

---

## Utility Classes

### Background Patterns
- `.grid-pattern` - Grid overlay
- `.dot-pattern` - Dot matrix
- `.mesh-gradient` - Complex gradient mesh

### Effects
- `.glow-primary` - Primary color glow
- `.glow-secondary` - Secondary color glow
- `.frosted` - Frosted glass effect
- `.animated-bg` - Animated gradient background

### Scrollbars
- `.custom-scrollbar` - Styled with gradient thumb
- `.no-scrollbar` - Hidden scrollbar

### Borders
- `.gradient-border-box` - Gradient border wrapper

---

## Page Layouts

### Landing Page
**Sections:**
1. **Hero** - Full-screen with floating orbs, gradient text, CTAs
2. **Stats** - 4 animated stat cards
3. **Features** - 6 feature cards in grid
4. **How It Works** - 4-step workflow on dark background
5. **CTA** - Final conversion section

**Key Features:**
- Scroll-triggered animations
- Floating gradient orbs
- Parallax effects
- Glass navigation bar

### Dashboard
Redesigned with:
- Glass cards
- Gradient stat cards
- Modern table design
- Animated charts

---

## Best Practices

### Performance
- Use `will-change` sparingly
- Prefer `transform` and `opacity` for animations
- Use `backdrop-filter` with fallbacks
- Lazy load heavy components

### Accessibility
- Maintain 4.5:1 contrast ratios
- Provide focus states
- Use semantic HTML
- Add ARIA labels where needed

### Responsive Design
- Mobile-first approach
- Breakpoints: sm (640px), md (768px), lg (1024px), xl (1280px)
- Flexible grid layouts
- Touch-friendly targets (min 44px)

---

## Migration Guide

### From Old Neumorphic to New Glass

**Old:**
```jsx
<NeumorphicCard>Content</NeumorphicCard>
```

**New:**
```jsx
<AnimatedCard hoverEffect="lift">Content</AnimatedCard>
```

### Colors
- `neu-accent` → `primary-600`
- `neu-bg` → `glass-card`
- `neu-text-accent` → `text-gradient`

### Buttons
- `NeumorphicButton` → `GradientButton`
- `variant="primary"` → `variant="duotone"`

---

## File Structure

```
frontend/src/
├── components/
│   ├── modern/
│   │   ├── AnimatedCard.jsx
│   │   ├── GradientButton.jsx
│   │   ├── ScrollSection.jsx
│   │   ├── InfoCard.jsx
│   │   ├── StatCard.jsx
│   │   └── index.js
│   └── neumorphic/          # Legacy components
├── pages/
│   ├── LandingNew.jsx       # New landing page
│   ├── Landing.jsx          # Old landing (keep for reference)
│   └── ...
├── index.css                # Global styles & utilities
└── App.jsx                  # Updated with new navigation

tailwind.config.js           # Extended with new design system
```

---

## Quick Start

1. **Install dependencies** (if needed):
```bash
cd frontend
npm install
```

2. **Start dev server**:
```bash
npm run dev
```

3. **Use new components**:
```jsx
import { GradientButton, ScrollSection, InfoCard } from '@/components/modern';

function MyPage() {
  return (
    <ScrollSection animation="fade-in-up">
      <InfoCard
        icon={Zap}
        title="Feature"
        description="Description"
        accentColor="primary"
      />
      <GradientButton variant="duotone">
        Click Me
      </GradientButton>
    </ScrollSection>
  );
}
```

---

## Credits

**Design System:** Duotone Glassmorphism
**Animations:** Hardware-accelerated CSS
**Components:** React + Tailwind CSS
**Icons:** Lucide React
**Fonts:** Plus Jakarta Sans, DM Sans
