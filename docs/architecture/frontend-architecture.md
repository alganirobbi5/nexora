# Frontend Architecture - NEXORA

## Stack
- **Framework**: React 18+ with TypeScript
- **Build Tool**: Vite 5+
- **Styling**: Tailwind CSS 3.4+
- **UI Library**: shadcn/ui (Radix UI primitives)
- **Component Source**: 21st.dev components (curated, not raw)
- **Icons**: Lucide React
- **Animations**: Framer Motion 11+
- **State Management**: Zustand (global) + React Query (server state)
- **Forms**: React Hook Form + Zod validation
- **Routing**: React Router v6
- **HTTP Client**: Axios with interceptors
- **Date Handling**: date-fns
- **Charts**: Recharts (for analytics)

## Project Structure
```
frontend/
├── public/                    # Static assets
├── src/
│   ├── components/
│   │   ├── ui/               # shadcn/ui base components (Button, Input, Card, etc.)
│   │   ├── layout/           # Layout components (Header, Sidebar, Footer, Container)
│   │   ├── forms/            # Form-specific components (FormField, FormSection, etc.)
│   │   ├── data-display/     # Data display (Tables, Cards, Charts, Stats, Badges)
│   │   ├── feedback/         # Toast, Modal, Alert, Tooltip, Skeleton, Spinner
│   │   └── navigation/       # Nav items, Breadcrumbs, Tabs, Pagination
│   ├── hooks/                # Custom React hooks
│   │   ├── queries/          # React Query hooks (useTransactions, useAnalytics, etc.)
│   │   ├── mutations/        # React Query mutations
│   │   ├── ui/               # UI hooks (useMediaQuery, useTheme, useDisclosure)
│   │   └── form/             # Form hooks (useFormValidation, useArrayField)
│   ├── stores/               # Zustand stores
│   │   ├── authStore.ts      # Authentication state
│   │   ├── uiStore.ts        # Global UI state (sidebar, modals, toasts)
│   │   ├── themeStore.ts     # Theme state (light/dark/system)
│   │   └── notificationStore.ts # Notification state
│   ├── types/                # TypeScript types
│   │   ├── api.ts            # API response types
│   │   ├── entities.ts       # Domain entities (Transaction, Goal, Task, etc.)
│   │   ├── forms.ts          # Form types
│   │   └── ui.ts             # UI-related types
│   ├── utils/                # Utility functions
│   │   ├── formatters.ts     # Currency, date, number formatting
│   │   ├── validators.ts     # Zod schemas
│   │   ├── helpers.ts        # General helpers
│   │   └── constants.ts      # App constants
│   ├── config/               # Configuration
│   │   ├── api.ts            # Axios instance, API endpoints
│   │   ├── queryClient.ts    # React Query configuration
│   │   └── theme.ts          # Theme configuration
│   ├── styles/               # Global styles
│   │   ├── globals.css       # Tailwind imports, CSS variables
│   │   └── animations.css    # Custom animations
│   ├── pages/                # Page components (route-level)
│   │   ├── auth/             # Login, Register, ForgotPassword, ResetPassword
│   │   ├── dashboard/        # Dashboard overview
│   │   ├── transactions/     # Transaction list, detail, create, edit
│   │   ├── analytics/        # Analytics charts and reports
│   │   ├── goals/            # Financial goals CRUD
│   │   ├── tasks/            # Task management
│   │   ├── notifications/    # Notification center
│   │   ├── settings/         # Profile, preferences, security, billing
│   │   └── landing/          # Public landing page
│   ├── App.tsx               # Root component
│   ├── main.tsx              # Entry point
│   └── vite-env.d.ts         # Vite type declarations
├── tests/
│   ├── unit/                 # Unit tests (Vitest)
│   ├── integration/          # Integration tests
│   └── e2e/                  # E2E tests (Playwright)
├── .eslintrc.json
├── .prettierrc
├── tailwind.config.ts
├── tsconfig.json
├── tsconfig.node.json
├── vite.config.ts
├── vitest.config.ts
├── playwright.config.ts
├── package.json
└── README.md
```

## Component Architecture

### Base UI Components (shadcn/ui)
- Use shadcn/ui as the foundation - copy components into `src/components/ui/`
- Customize via Tailwind config and CSS variables
- Never modify Radix UI primitives directly

### Composite Components
- Build domain-specific components from base UI components
- Example: `TransactionCard` = Card + Badge + Text + Button
- Location: `src/components/data-display/` or `src/components/forms/`

### Page Components
- Thin components that compose features
- Handle routing, data fetching (via hooks), and layout
- Delegate business logic to hooks and stores

## State Management Strategy

### Server State (React Query / TanStack Query)
- All API data: transactions, analytics, goals, tasks, notifications
- Caching, background refetching, optimistic updates
- Query keys structured: `['transactions', { filters }]`, `['analytics', 'monthly', { month }]`

### Client State (Zustand)
- Auth state: user, token, permissions
- UI state: sidebar open/closed, active modal, toasts
- Theme state: light/dark/system preference
- Notification state: unread count, list

### Form State (React Hook Form)
- Local form state only
- Zod schemas for validation (shared with backend via API docs)

## Routing Strategy
```
Public Routes:
  /                    → LandingPage
  /login               → LoginPage
  /register            → RegisterPage
  /forgot-password     → ForgotPasswordPage
  /reset-password/:token → ResetPasswordPage

Protected Routes (require auth):
  /dashboard           → DashboardPage
  /transactions        → TransactionListPage
  /transactions/new    → TransactionCreatePage
  /transactions/:id    → TransactionDetailPage
  /transactions/:id/edit → TransactionEditPage
  /analytics           → AnalyticsPage
  /goals               → GoalListPage
  /goals/new           → GoalCreatePage
  /goals/:id           → GoalDetailPage
  /tasks               → TaskListPage
  /tasks/new           → TaskCreatePage
  /tasks/:id           → TaskDetailPage
  /notifications       → NotificationPage
  /settings            → SettingsLayout
    /settings/profile  → ProfileSettingsPage
    /settings/preferences → PreferencesPage
    /settings/security → SecurityPage
    /settings/billing  → BillingPage
```

## 21st.dev Integration Rules
1. **Curate, don't copy-paste blindly** - Only use components that match design system
2. **Wrap in adapter components** - Create `src/components/ui/[component-name].tsx` that wraps 21st.dev component
3. **Theme alignment** - Ensure 21st.dev components use our CSS variables (colors, spacing, radius)
4. **TypeScript first** - All 21st.dev components must have proper TypeScript types
5. **Accessibility check** - Verify ARIA attributes, keyboard navigation
6. **Bundle size awareness** - Tree-shake, avoid heavy components for simple needs
7. **Documentation** - Document each adapted component in `docs/components/`

## Design System Integration
- Tailwind config extends design tokens (colors, spacing, typography, shadows, radius)
- CSS variables for dynamic theming (light/dark mode)
- shadcn/ui components styled via `@apply` or direct Tailwind classes
- Framer Motion variants defined in `src/utils/animations.ts`

## Responsive Strategy
- Mobile-first approach
- Breakpoints: `sm: 640px`, `md: 768px`, `lg: 1024px`, `xl: 1280px`, `2xl: 1536px`
- Sidebar collapses to drawer on mobile
- Tables transform to cards on mobile
- Charts responsive via Recharts ResponsiveContainer

## Accessibility Requirements
- WCAG 2.1 AA compliance
- Semantic HTML (proper heading hierarchy, landmarks)
- Focus management (visible focus rings, skip links)
- ARIA labels for icon-only buttons
- Color contrast ratios (4.5:1 normal, 3:1 large)
- Keyboard navigation for all interactive elements
- Screen reader announcements for dynamic content (toasts, loading states)
- Reduced motion support (`prefers-reduced-motion`)

## Performance Requirements
- Code splitting by route (`React.lazy` + `Suspense`)
- Image optimization (WebP, lazy loading)
- Bundle analysis (`vite-bundle-analyzer`)
- Target: < 100KB JS gzipped initial load
- Lighthouse score > 90

## Testing Strategy
- Unit: Vitest + React Testing Library (components, hooks, utils)
- Integration: Vitest + MSW (API mocking)
- E2E: Playwright (critical user flows)
- Coverage target: > 80% for business logic