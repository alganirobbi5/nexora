# Documentation Structure - NEXORA

## Directory Structure
```
docs/
├── architecture/
│   ├── frontend-architecture.md
│   ├── backend-architecture.md
│   ├── database-architecture.md
│   ├── design-system.md
│   ├── git-workflow.md
│   ├── implementation-roadmap.md
│   └── decisions/           # Architecture Decision Records (ADRs)
│       ├── 001-use-zustand-for-client-state.md
│       ├── 002-use-react-query-for-server-state.md
│       ├── 003-use-laravel-sanctum-for-auth.md
│       ├── 004-use-ulid-for-primary-keys.md
│       └── ...
├── api/
│   ├── openapi.yaml         # Generated from Scribe
│   ├── auth.md
│   ├── transactions.md
│   ├── analytics.md
│   ├── goals.md
│   ├── tasks.md
│   ├── notifications.md
│   └── users.md
├── components/
│   ├── ui/                  # Base component docs (from shadcn/ui)
│   ├── data-display/
│   ├── forms/
│   ├── layout/
│   ├── feedback/
│   └── navigation/
├── guides/
│   ├── getting-started.md
│   ├── development-setup.md
│   ├── deployment.md
│   ├── testing-guide.md
│   ├── accessibility.md
│   ├── theming.md
│   ├── adding-components.md
│   ├── database-migrations.md
│   └── api-integration.md
├── decisions/               # ADR index
│   └── README.md
└── README.md                # Documentation index
```

## Architecture Decision Records (ADRs)

### Format
```markdown
# ADR-X: Title

## Status
Proposed | Accepted | Deprecated | Superseded

## Context
What is the issue that we're seeing that is motivating this decision?

## Decision
What is the change that we're proposing and/or doing?

## Consequences
What becomes easier or more difficult to do because of this change?

### Positive
- 

### Negative
- 

### Neutral
- 
```

### Required ADRs
1. State management choice (Zustand + React Query)
2. Authentication strategy (Laravel Sanctum SPA)
3. Primary key strategy (ULID vs UUID vs BigInt)
4. API versioning strategy
5. Component library approach (shadcn/ui + 21st.dev)
6. Design token implementation (CSS variables + Tailwind)
7. Testing strategy (Vitest + Pest + Playwright)
8. Monorepo vs separate repos
9. Dark mode implementation
10. Real-time strategy (Reverb vs Pusher vs none)

## API Documentation
- Auto-generated from Scribe annotations
- Versioned with API
- Includes: endpoints, parameters, responses, examples
- Hosted on `/docs/api` in production

## Component Documentation
- Storybook for visual component library
- Each component: props, variants, examples, accessibility notes
- Usage guidelines for composite components

## Guide Documentation
- **Getting Started**: Prerequisites, installation, first run
- **Development Setup**: IDE config, debugging, hot reload
- **Deployment**: Environments, variables, migrations, rollback
- **Testing**: How to run tests, write tests, coverage
- **Accessibility**: Checklist, testing tools, common patterns
- **Theming**: Customizing colors, fonts, adding themes
- **Adding Components**: From shadcn/ui, from 21st.dev, custom
- **Database Migrations**: Creating, running, rolling back, seeding
- **API Integration**: Frontend API client, error handling, types

## README Files
Each major directory has a README:
- `frontend/README.md` - Frontend setup, commands, structure
- `backend/README.md` - Backend setup, commands, structure
- `docs/README.md` - Documentation index
- Root `README.md` - Project overview, quick start

## Documentation Standards
- Markdown with frontmatter for metadata
- Relative links for internal references
- Code blocks with language hints
- Diagrams in Mermaid.js (rendered in GitHub)
- Screenshots in `docs/assets/screenshots/`
- Update with code changes (docs in same PR)