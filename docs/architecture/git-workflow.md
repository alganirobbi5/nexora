# Git Workflow & Conventions - NEXORA

## Branching Strategy

### Branch Types
```
main                    # Production-ready, protected
develop                 # Integration branch for next release
feature/*               # New features (from develop)
fix/*                   # Bug fixes (from develop)
hotfix/*                # Critical production fixes (from main)
release/*               # Release preparation (from develop)
chore/*                 # Maintenance, dependencies, tooling
docs/*                  # Documentation only
refactor/*              # Code restructuring without behavior change
perf/*                  # Performance improvements
test/*                  # Test additions/improvements
```

### Branch Naming Convention
```
<type>/<scope>-<short-description>
```

Examples:
- `feature/transactions-bulk-import`
- `fix/auth-token-refresh`
- `hotfix/security-csrf-bypass`
- `chore/update-dependencies`
- `docs/api-authentication`
- `refactor/analytics-service`

### Branch Protection Rules (main & develop)
- Require PR reviews (1 minimum)
- Require status checks (lint, typecheck, test, build)
- Require linear history (no merge commits)
- Dismiss stale reviews on new commits
- Require signed commits
- No force pushes

## Commit Convention (Conventional Commits)

### Format
```
<type>(<scope>): <description>

[optional body]

[optional footer(s)]
```

### Types
| Type | Description |
|------|-------------|
| `feat` | New feature |
| `fix` | Bug fix |
| `docs` | Documentation only |
| `style` | Formatting, missing semicolons, etc. (no code change) |
| `refactor` | Code restructuring (no behavior change) |
| `perf` | Performance improvement |
| `test` | Adding/updating tests |
| `chore` | Maintenance, dependencies, build config |
| `build` | Build system, CI/CD changes |
| `ci` | CI configuration changes |
| `revert` | Reverts a previous commit |

### Scope Guidelines
- `auth`, `transactions`, `analytics`, `goals`, `tasks`, `notifications`, `settings`, `ui`, `api`, `db`, `config`, `deps`, `docs`

### Description Rules
- Imperative mood: "add" not "added" or "adds"
- Lowercase first letter
- No period at end
- Max 72 characters
- Reference issues: `fix(auth): handle expired token refresh (#123)`

### Examples
```
feat(transactions): add bulk import from CSV

fix(api): correct pagination offset calculation

refactor(services): extract transaction validation to action

chore(deps): update laravel to 11.2

docs(api): document transaction filter parameters

perf(analytics): add Redis caching for monthly reports

test(goals): add unit tests for goal progress calculation

revert: feat(notifications): add push notifications

This reverts commit abc1234.
```

### Body (Optional)
- Explain *what* and *why*, not *how*
- Wrap at 72 characters
- Bullet points for multiple reasons

### Footer (Optional)
- Breaking changes: `BREAKING CHANGE: <description>`
- Issue references: `Closes #123`, `Refs #456`
- Co-authors: `Co-authored-by: Name <email>`

## Pull Request Workflow

### PR Title Format
Same as commit: `<type>(<scope>): <description>`

### PR Description Template
```markdown
## Summary
Brief description of changes.

## Type of Change
- [ ] Bug fix
- [ ] New feature
- [ ] Breaking change
- [ ] Documentation update
- [ ] Refactor
- [ ] Performance improvement
- [ ] Test update

## Testing
- [ ] Unit tests pass
- [ ] Feature tests pass
- [ ] Manual testing completed
- [ ] Edge cases considered

## Checklist
- [ ] Code follows style guide
- [ ] Self-review completed
- [ ] Comments added for complex logic
- [ ] Documentation updated
- [ ] No console.log/debug statements
- [ ] No secrets committed
- [ ] Migration files included (if DB changes)

## Screenshots (if UI)
<!-- Add before/after screenshots -->

## Related Issues
Closes #XXX
```

### Review Requirements
- At least 1 approval required
- All CI checks must pass
- No unresolved conversations
- Branch up to date with base

### Merge Strategy
- **Squash and merge** for feature/fix branches
- **Rebase and merge** for hotfix/release branches
- Delete branch after merge

## Git Hooks (Husky)

### Pre-commit
- Run lint-staged (ESLint, Prettier, Pint)
- Run typecheck (tsc, PHPStan)
- Check for secrets (gitleaks)
- Validate commit message (commitlint)

### Pre-push
- Run full test suite
- Build verification

### Commit-msg
- Validate conventional commit format

## Release Process

### Versioning (SemVer)
- `MAJOR.MINOR.PATCH`
- MAJOR: Breaking API changes
- MINOR: New features (backward compatible)
- PATCH: Bug fixes (backward compatible)

### Release Flow
1. Create `release/vX.Y.Z` from `develop`
2. Update version in `package.json`, `composer.json`, `CHANGELOG.md`
3. Run full test suite
4. Create PR to `main`
5. After merge, tag: `git tag -a vX.Y.Z -m "Release vX.Y.Z"`
6. Push tags: `git push origin --tags`
7. Deploy from `main`
8. Merge `main` back to `develop`
9. Delete release branch

### Changelog
- Auto-generated from conventional commits
- Categories: Features, Fixes, Performance, Breaking Changes, Dependencies
- Keep a `CHANGELOG.md` in root

## Monorepo Commit Guidelines

### Cross-package Changes
- Single commit per logical change
- If touching both frontend/backend, prefix with both scopes:
  `feat(api,transactions): add transaction categories endpoint`

### Dependency Updates
- Separate commit per package
- `chore(frontend): update react to 18.3`
- `chore(backend): update laravel to 11.2`

## Secrets Management
- **Never commit**: `.env`, `.env.local`, `*.pem`, `*.key`, `secrets.json`
- Use `.env.example` with placeholders
- Use GitHub Secrets for CI/CD
- Use 1Password / Bitwarden for local development
- Pre-commit hook scans for secrets (gitleaks)

## Gitignore Strategy
```
# Dependencies
node_modules/
vendor/

# Build
dist/
build/
public/build/
public/hot

# Environment
.env
.env.local
.env.*.local

# IDE
.idea/
.vscode/
*.swp
*.swo

# OS
.DS_Store
Thumbs.db

# Logs
*.log
npm-debug.log*
storage/logs/*.log

# Testing
coverage/
.nyc_output/

# Cache
.phpstan.cache
.eslintcache
*.tsbuildinfo

# Misc
*.pem
*.key
secrets.json
```

## Commit Signing
- Require GPG/SSH signing for all commits to main/develop
- Configure: `git config --global commit.gpgsign true`
- Use SSH keys with GitHub: `git config --global gpg.format ssh`

## Rebase vs Merge
- **Feature branches**: Rebase onto develop before PR
- **Hotfix branches**: Rebase onto main
- **Release branches**: Merge to main, then merge main to develop
- **Never rebase** shared branches (main, develop, release/*)

## Workflow Examples

### New Feature
```bash
git checkout develop
git pull origin develop
git checkout -b feature/transactions-recurring
# ... make changes ...
git add .
git commit -m "feat(transactions): add recurring transaction support"
git push origin feature/transactions-recurring
# Create PR to develop
```

### Bug Fix
```bash
git checkout develop
git pull origin develop
git checkout -b fix/analytics-date-filter
# ... make changes ...
git add .
git commit -m "fix(analytics): correct date filter timezone handling"
git push origin fix/analytics-date-filter
# Create PR to develop
```

### Hotfix
```bash
git checkout main
git pull origin main
git checkout -b hotfix/auth-session-expiry
# ... make changes ...
git add .
git commit -m "fix(auth): prevent premature session expiry"
git push origin hotfix/auth-session-expiry
# Create PR to main
# After merge, create PR from main to develop
```

### Dependency Update
```bash
git checkout develop
git pull origin develop
git checkout -b chore/update-frontend-deps
# ... update package.json ...
git add package.json package-lock.json
git commit -m "chore(frontend): update dependencies"
git push origin chore/update-frontend-deps
# Create PR to develop
```