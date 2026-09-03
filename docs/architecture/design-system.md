# Design System & Design Tokens - NEXORA

## Design Principles
1. **Clarity over cleverness** - Obvious beats clever
2. **Consistency builds trust** - Same patterns, same behaviors
3. **Accessible by default** - Not an afterthought
4. **Motion with purpose** - Animation communicates state, not decoration
5. **Data density with breathing room** - Information-rich but not cluttered

## Color System

### Semantic Color Tokens (CSS Variables)
```css
:root {
  /* Background */
  --color-bg-primary: #ffffff;
  --color-bg-secondary: #f8fafc;
  --color-bg-tertiary: #f1f5f9;
  --color-bg-inverse: #0f172a;
  --color-bg-hover: #e2e8f0;
  --color-bg-active: #cbd5e1;

  /* Surface */
  --color-surface: #ffffff;
  --color-surface-hover: #f8fafc;
  --color-surface-border: #e2e8f0;
  --color-surface-border-hover: #cbd5e1;

  /* Text */
  --color-text-primary: #0f172a;
  --color-text-secondary: #475569;
  --color-text-tertiary: #94a3b8;
  --color-text-inverse: #f8fafc;
  --color-text-link: #2563eb;
  --color-text-link-hover: #1d4ed8;

  /* Brand */
  --color-brand-50: #eff6ff;
  --color-brand-100: #dbeafe;
  --color-brand-200: #bfdbfe;
  --color-brand-300: #93c5fd;
  --color-brand-400: #60a5fa;
  --color-brand-500: #3b82f6;
  --color-brand-600: #2563eb;
  --color-brand-700: #1d4ed8;
  --color-brand-800: #1e40af;
  --color-brand-900: #1e3a8a;
  --color-brand-950: #172554;

  /* Success */
  --color-success-50: #f0fdf4;
  --color-success-100: #dcfce7;
  --color-success-500: #22c55e;
  --color-success-600: #16a34a;
  --color-success-700: #15803d;

  /* Warning */
  --color-warning-50: #fffbeb;
  --color-warning-100: #fef3c7;
  --color-warning-500: #f59e0b;
  --color-warning-600: #d97706;
  --color-warning-700: #b45309;

  /* Error/Danger */
  --color-error-50: #fef2f2;
  --color-error-100: #fee2e2;
  --color-error-500: #ef4444;
  --color-error-600: #dc2626;
  --color-error-700: #b91c1c;

  /* Income (Green) */
  --color-income-50: #f0fdf4;
  --color-income-100: #dcfce7;
  --color-income-500: #22c55e;
  --color-income-600: #16a34a;

  /* Expense (Red) */
  --color-expense-50: #fef2f2;
  --color-expense-100: #fee2e2;
  --color-expense-500: #ef4444;
  --color-expense-600: #dc2626;

  /* Transfer (Blue) */
  --color-transfer-50: #eff6ff;
  --color-transfer-100: #dbeafe;
  --color-transfer-500: #3b82f6;
  --color-transfer-600: #2563eb;

  /* Focus */
  --color-focus-ring: #2563eb;
  --color-focus-ring-offset: #ffffff;

  /* Overlay */
  --color-overlay: rgba(15, 23, 42, 0.5);
  --color-overlay-light: rgba(255, 255, 255, 0.8);
}

/* Dark mode */
[data-theme="dark"] {
  --color-bg-primary: #0f172a;
  --color-bg-secondary: #1e293b;
  --color-bg-tertiary: #334155;
  --color-bg-inverse: #f8fafc;
  --color-bg-hover: #334155;
  --color-bg-active: #475569;

  --color-surface: #1e293b;
  --color-surface-hover: #334155;
  --color-surface-border: #334155;
  --color-surface-border-hover: #475569;

  --color-text-primary: #f8fafc;
  --color-text-secondary: #cbd5e1;
  --color-text-tertiary: #64748b;
  --color-text-inverse: #0f172a;
  --color-text-link: #60a5fa;
  --color-text-link-hover: #93c5fd;

  --color-focus-ring: #60a5fa;
  --color-focus-ring-offset: #0f172a;

  --color-overlay: rgba(0, 0, 0, 0.7);
  --color-overlay-light: rgba(15, 23, 42, 0.9);
}
```

### Tailwind Config Mapping
```typescript
// tailwind.config.ts
export default {
  theme: {
    extend: {
      colors: {
        bg: {
          primary: 'var(--color-bg-primary)',
          secondary: 'var(--color-bg-secondary)',
          tertiary: 'var(--color-bg-tertiary)',
          inverse: 'var(--color-bg-inverse)',
          hover: 'var(--color-bg-hover)',
          active: 'var(--color-bg-active)',
        },
        surface: {
          DEFAULT: 'var(--color-surface)',
          hover: 'var(--color-surface-hover)',
          border: 'var(--color-surface-border)',
          'border-hover': 'var(--color-surface-border-hover)',
        },
        text: {
          primary: 'var(--color-text-primary)',
          secondary: 'var(--color-text-secondary)',
          tertiary: 'var(--color-text-tertiary)',
          inverse: 'var(--color-text-inverse)',
          link: 'var(--color-text-link)',
          'link-hover': 'var(--color-text-link-hover)',
        },
        brand: {
          50: 'var(--color-brand-50)',
          100: 'var(--color-brand-100)',
          200: 'var(--color-brand-200)',
          300: 'var(--color-brand-300)',
          400: 'var(--color-brand-400)',
          500: 'var(--color-brand-500)',
          600: 'var(--color-brand-600)',
          700: 'var(--color-brand-700)',
          800: 'var(--color-brand-800)',
          900: 'var(--color-brand-900)',
          950: 'var(--color-brand-950)',
        },
        success: {
          50: 'var(--color-success-50)',
          100: 'var(--color-success-100)',
          500: 'var(--color-success-500)',
          600: 'var(--color-success-600)',
          700: 'var(--color-success-700)',
        },
        warning: {
          50: 'var(--color-warning-50)',
          100: 'var(--color-warning-100)',
          500: 'var(--color-warning-500)',
          600: 'var(--color-warning-600)',
          700: 'var(--color-warning-700)',
        },
        error: {
          50: 'var(--color-error-50)',
          100: 'var(--color-error-100)',
          500: 'var(--color-error-500)',
          600: 'var(--color-error-600)',
          700: 'var(--color-error-700)',
        },
        income: {
          50: 'var(--color-income-50)',
          100: 'var(--color-income-100)',
          500: 'var(--color-income-500)',
          600: 'var(--color-income-600)',
        },
        expense: {
          50: 'var(--color-expense-50)',
          100: 'var(--color-expense-100)',
          500: 'var(--color-expense-500)',
          600: 'var(--color-expense-600)',
        },
        transfer: {
          50: 'var(--color-transfer-50)',
          100: 'var(--color-transfer-100)',
          500: 'var(--color-transfer-500)',
          600: 'var(--color-transfer-600)',
        },
        focus: {
          ring: 'var(--color-focus-ring)',
          offset: 'var(--color-focus-ring-offset)',
        },
      },
    },
  },
}
```

## Typography

### Font Families
```css
:root {
  --font-sans: 'Inter', system-ui, -apple-system, sans-serif;
  --font-mono: 'JetBrains Mono', 'Fira Code', monospace;
  --font-display: 'Cal Sans', 'Inter', system-ui, sans-serif;
}
```

### Type Scale
```typescript
// tailwind.config.ts
fontSize: {
  'display-xl': ['4.5rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }], // 72px
  'display-lg': ['3.75rem', { lineHeight: '1.1', letterSpacing: '-0.02em' }], // 60px
  'display-md': ['3rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],     // 48px
  'display-sm': ['2.25rem', { lineHeight: '1.2', letterSpacing: '-0.01em' }],  // 36px
  'heading-xl': ['1.875rem', { lineHeight: '1.3', letterSpacing: '-0.01em' }], // 30px
  'heading-lg': ['1.5rem', { lineHeight: '1.4', letterSpacing: '-0.01em' }],   // 24px
  'heading-md': ['1.25rem', { lineHeight: '1.4' }],                            // 20px
  'heading-sm': ['1.125rem', { lineHeight: '1.4' }],                           // 18px
  'body-lg': ['1.125rem', { lineHeight: '1.6' }],                              // 18px
  'body': ['1rem', { lineHeight: '1.6' }],                                     // 16px
  'body-sm': ['0.875rem', { lineHeight: '1.5' }],                              // 14px
  'caption': ['0.75rem', { lineHeight: '1.5' }],                               // 12px
  'overline': ['0.75rem', { lineHeight: '1.5', letterSpacing: '0.1em', textTransform: 'uppercase' }],
}
```

### Font Weights
- Light: 300 (display only)
- Regular: 400 (body)
- Medium: 500 (emphasis, buttons)
- Semibold: 600 (headings, labels)
- Bold: 700 (display headings)

## Spacing System
```typescript
// Based on 4px base unit
spacing: {
  '0': '0',
  '1': '0.25rem',   // 4px
  '2': '0.5rem',    // 8px
  '3': '0.75rem',   // 12px
  '4': '1rem',      // 16px
  '5': '1.25rem',   // 20px
  '6': '1.5rem',    // 24px
  '8': '2rem',      // 32px
  '10': '2.5rem',   // 40px
  '12': '3rem',     // 48px
  '16': '4rem',     // 64px
  '20': '5rem',     // 80px
  '24': '6rem',     // 96px
}
```

### Layout Spacing
- Page padding: `p-6` (mobile), `p-8` (tablet), `p-10` (desktop)
- Section gap: `gap-8` (mobile), `gap-10` (desktop)
- Component gap: `gap-4` (tight), `gap-6` (normal), `gap-8` (loose)
- Inset spacing: `space-y-4` (forms), `space-y-6` (cards)

## Border Radius
```typescript
borderRadius: {
  'none': '0',
  'sm': '0.25rem',    // 4px - badges, tags
  'DEFAULT': '0.5rem', // 8px - buttons, inputs, cards
  'md': '0.75rem',    // 12px - modals, dropdowns
  'lg': '1rem',       // 16px - large cards
  'xl': '1.5rem',     // 24px - hero sections
  'full': '9999px',   // pills, avatars
}
```

## Shadows
```typescript
boxShadow: {
  'xs': '0 1px 2px 0 rgb(0 0 0 / 0.05)',
  'sm': '0 1px 3px 0 rgb(0 0 0 / 0.1), 0 1px 2px -1px rgb(0 0 0 / 0.1)',
  'DEFAULT': '0 4px 6px -1px rgb(0 0 0 / 0.1), 0 2px 4px -2px rgb(0 0 0 / 0.1)',
  'md': '0 10px 15px -3px rgb(0 0 0 / 0.1), 0 4px 6px -4px rgb(0 0 0 / 0.1)',
  'lg': '0 20px 25px -5px rgb(0 0 0 / 0.1), 0 8px 10px -6px rgb(0 0 0 / 0.1)',
  'xl': '0 25px 50px -12px rgb(0 0 0 / 0.25)',
  'inner': 'inset 0 2px 4px 0 rgb(0 0 0 / 0.05)',
  'focus': '0 0 0 3px var(--color-focus-ring)',
}
```

## Animation & Motion

### Duration Tokens
```typescript
transitionDuration: {
  'instant': '0ms',
  'fast': '100ms',
  'normal': '200ms',
  'slow': '300ms',
  'slower': '500ms',
}
```

### Easing Tokens
```typescript
transitionTimingFunction: {
  'ease-in': 'cubic-bezier(0.4, 0, 1, 1)',
  'ease-out': 'cubic-bezier(0, 0, 0.2, 1)',
  'ease-in-out': 'cubic-bezier(0.4, 0, 0.2, 1)',
  'spring': 'cubic-bezier(0.34, 1.56, 0.64, 1)',
  'bounce': 'cubic-bezier(0.68, -0.55, 0.265, 1.55)',
}
```

### Framer Motion Variants
```typescript
// src/utils/animations.ts
export const fadeIn = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit: { opacity: 0 },
  transition: { duration: 0.2, ease: 'easeOut' },
};

export const slideUp = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 },
  transition: { duration: 0.25, ease: 'easeOut' },
};

export const slideInFromRight = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: 20 },
  transition: { duration: 0.2, ease: 'easeOut' },
};

export const scaleIn = {
  initial: { opacity: 0, scale: 0.95 },
  animate: { opacity: 1, scale: 1 },
  exit: { opacity: 0, scale: 0.95 },
  transition: { duration: 0.15, ease: 'easeOut' },
};

export const staggerContainer = {
  animate: { transition: { staggerChildren: 0.05 } },
};

export const staggerItem = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  transition: { duration: 0.3, ease: 'easeOut' },
};
```

### Reduced Motion
```css
@media (prefers-reduced-motion: reduce) {
  *,
  *::before,
  *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
    scroll-behavior: auto !important;
  }
}
```

## Breakpoints
```typescript
screens: {
  'sm': '640px',   // Mobile landscape / small tablet
  'md': '768px',   // Tablet
  'lg': '1024px',  // Desktop
  'xl': '1280px',  // Large desktop
  '2xl': '1536px', // Extra large
}
```

## Z-Index Scale
```typescript
zIndex: {
  'hide': '-1',
  'base': '0',
  'dropdown': '100',
  'sticky': '200',
  'fixed': '300',
  'modal-backdrop': '400',
  'modal': '500',
  'popover': '600',
  'tooltip': '700',
  'toast': '800',
  'max': '9999',
}
```

## Component Variants (CVA - Class Variance Authority)

### Button Variants
```typescript
// src/components/ui/button.tsx
const buttonVariants = cva(
  'inline-flex items-center justify-center gap-2 font-medium transition-all duration-fast focus:outline-none focus:ring-2 focus:ring-focus-ring focus:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none',
  {
    variants: {
      variant: {
        default: 'bg-brand-600 text-white hover:bg-brand-700 active:bg-brand-800',
        destructive: 'bg-error-600 text-white hover:bg-error-700 active:bg-error-800 focus:ring-error-500',
        outline: 'border border-surface-border bg-transparent hover:bg-surface-hover active:bg-surface-border',
        secondary: 'bg-surface border border-surface-border text-text-primary hover:bg-surface-hover active:bg-surface-border',
        ghost: 'bg-transparent hover:bg-bg-hover active:bg-bg-active',
        link: 'bg-transparent text-text-link hover:text-text-link-hover underline-offset-2 hover:underline',
        income: 'bg-income-600 text-white hover:bg-income-700 active:bg-income-800',
        expense: 'bg-expense-600 text-white hover:bg-expense-700 active:bg-expense-800',
      },
      size: {
        sm: 'h-8 px-3 text-body-sm gap-1.5',
        md: 'h-10 px-4 text-body gap-2',
        lg: 'h-12 px-6 text-body-lg gap-2',
        xl: 'h-14 px-8 text-heading-sm gap-2.5',
        icon: 'h-10 w-10',
      },
    },
    defaultVariants: { variant: 'default', size: 'md' },
  }
);
```

### Card Variants
```typescript
const cardVariants = cva(
  'bg-surface border border-surface-border rounded-lg transition-shadow duration-fast',
  {
    variants: {
      variant: {
        default: 'shadow-sm hover:shadow-md',
        elevated: 'shadow-md hover:shadow-lg',
        outlined: 'border-2 border-surface-border-hover',
        interactive: 'cursor-pointer hover:shadow-lg hover:border-brand-300 dark:hover:border-brand-700',
      },
      padding: {
        none: '',
        sm: 'p-4',
        md: 'p-6',
        lg: 'p-8',
      },
    },
    defaultVariants: { variant: 'default', padding: 'md' },
  }
);
```

## Icon System
- **Library**: Lucide React
- **Sizes**: 16px (inline), 20px (default), 24px (large), 32px (feature)
- **Stroke width**: 2 (default), 1.5 (small)
- **Usage**: Always wrap in `<span className="inline-flex shrink-0">` for alignment

## Component Inventory (shadcn/ui Base + NEXORA Extensions)

### Base (from shadcn/ui)
- Button, Input, Textarea, Label, Select, Checkbox, Radio, Switch, Slider
- Card, Separator, ScrollArea, Tabs, Accordion, Collapsible
- Dialog, AlertDialog, Sheet, Drawer, Popover, Tooltip, HoverCard
- DropdownMenu, ContextMenu, Menubar, NavigationMenu, Breadcrumb, Pagination
- Table, DataTable, Badge, Avatar, Skeleton, Progress, Toast, Alert
- Form, Fieldset, Calendar, DatePicker, InputOTP, Toggle, ToggleGroup

### NEXORA Extensions (in src/components/)
- **Data Display**: StatCard, TransactionRow, GoalProgress, TaskItem, NotificationItem, ChartContainer, DataTable
- **Forms**: CurrencyInput, DateRangePicker, CategorySelect, AccountSelect, RecurringRuleBuilder
- **Layout**: AppShell, Sidebar, Header, PageHeader, Section, Container, Grid, Stack
- **Feedback**: EmptyState, ErrorState, LoadingState, ConfirmDialog, ToastProvider
- **Navigation**: NavItem, UserMenu, Breadcrumbs, Stepper
- **Domain**: TransactionForm, GoalCard, TaskCard, AnalyticsWidget, BudgetBar

## Dark Mode Implementation
```typescript
// src/hooks/ui/useTheme.ts
export function useTheme() {
  const { theme, setTheme } = useThemeStore();
  
  useEffect(() => {
    const root = document.documentElement;
    root.setAttribute('data-theme', theme);
    localStorage.setItem('theme', theme);
  }, [theme]);
  
  return { theme, setTheme };
}
```

## Accessibility Tokens
- Focus ring: `focus:ring-2 focus:ring-focus-ring focus:ring-offset-2 focus:ring-offset-focus-offset`
- Skip link: `.skip-link { @apply sr-only focus:not-sr-only focus:absolute focus:top-4 focus:left-4 focus:z-max focus:px-4 focus:py-2 focus:bg-brand-600 focus:text-white focus:rounded-md }`
- Screen reader only: `.sr-only { @apply absolute w-px h-px p-0 -m-px overflow-hidden whitespace-nowrap border-0 }` (clipped)