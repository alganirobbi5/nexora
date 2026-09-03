# Database Architecture - NEXORA

## Overview
- **Engine**: MySQL 8.0+ (InnoDB)
- **Character Set**: utf8mb4
- **Collation**: utf8mb4_unicode_ci
- **Primary Keys**: ULID (Universally Unique Lexicographically Sortable Identifier)
- **Timestamps**: `created_at`, `updated_at` on all tables
- **Soft Deletes**: `deleted_at` on user-facing entities
- **Foreign Keys**: Explicit FK constraints with cascade rules

## Entity Relationship Diagram

```
users (1) ──────< (N) accounts
users (1) ──────< (N) categories (user-specific)
users (1) ──────< (N) transactions
users (1) ──────< (N) goals
users (1) ──────< (N) tasks
users (1) ──────< (N) notifications
users (1) ──────< (N) attachments

accounts (1) ──────< (N) transactions (account_id)
accounts (1) ──────< (N) transactions (transfer_account_id)
accounts (1) ──────< (N) goals

categories (1) ──────< (N) categories (parent_id - self-referential)
categories (1) ──────< (N) transactions

transactions (1) ──────< (N) attachments
transactions (1) ──────< (1) recurring_rules (template)

goals (1) ──────< (N) tasks
goals (1) ──────< (N) attachments

tasks (1) ──────< (1) recurring_rules (template)

recurring_rules (1) ──────< (N) transactions (generated)
recurring_rules (1) ──────< (N) tasks (generated)
```

## Table Definitions

### users
```sql
CREATE TABLE users (
    id CHAR(26) PRIMARY KEY,                    -- ULID
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    email_verified_at TIMESTAMP NULL,
    password VARCHAR(255) NOT NULL,
    avatar_url VARCHAR(500) NULL,
    locale VARCHAR(10) DEFAULT 'en',
    currency CHAR(3) DEFAULT 'USD',             -- ISO 4217
    theme ENUM('light','dark','system') DEFAULT 'system',
    timezone VARCHAR(50) DEFAULT 'UTC',
    two_factor_enabled BOOLEAN DEFAULT FALSE,
    two_factor_secret TEXT NULL,
    two_factor_recovery_codes TEXT NULL,
    remember_token VARCHAR(100) NULL,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_users_email (email),
    INDEX idx_users_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### accounts
```sql
CREATE TABLE accounts (
    id CHAR(26) PRIMARY KEY,
    user_id CHAR(26) NOT NULL,
    name VARCHAR(100) NOT NULL,
    type ENUM('checking','savings','credit','investment','cash','crypto','other') NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'USD',
    balance DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    initial_balance DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    institution VARCHAR(100) NULL,
    account_number_masked VARCHAR(20) NULL,
    is_default BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_accounts_user_id (user_id),
    INDEX idx_accounts_user_default (user_id, is_default),
    INDEX idx_accounts_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### categories
```sql
CREATE TABLE categories (
    id CHAR(26) PRIMARY KEY,
    user_id CHAR(26) NULL,                      -- NULL = system category
    name VARCHAR(100) NOT NULL,
    type ENUM('income','expense') NOT NULL,
    icon VARCHAR(50) NOT NULL,                  -- Lucide icon name
    color CHAR(7) NOT NULL,                     -- Hex color
    parent_id CHAR(26) NULL,                    -- Subcategory support
    is_system BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    sort_order INT DEFAULT 0,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (parent_id) REFERENCES categories(id) ON DELETE SET NULL,
    INDEX idx_categories_user_type (user_id, type),
    INDEX idx_categories_parent (parent_id),
    INDEX idx_categories_system (is_system),
    INDEX idx_categories_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### transactions
```sql
CREATE TABLE transactions (
    id CHAR(26) PRIMARY KEY,
    user_id CHAR(26) NOT NULL,
    account_id CHAR(26) NOT NULL,
    category_id CHAR(26) NULL,
    type ENUM('income','expense','transfer') NOT NULL,
    amount DECIMAL(15,2) NOT NULL,
    currency CHAR(3) NOT NULL DEFAULT 'USD',
    exchange_rate DECIMAL(10,6) NOT NULL DEFAULT 1.000000,
    description VARCHAR(255) NOT NULL,
    notes TEXT NULL,
    transaction_date DATE NOT NULL,
    status ENUM('pending','cleared','reconciled') NOT NULL DEFAULT 'cleared',
    is_recurring BOOLEAN DEFAULT FALSE,
    recurring_rule_id CHAR(26) NULL,
    transfer_account_id CHAR(26) NULL,          -- For transfers
    metadata JSON NULL,                         -- Flexible extra data
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE RESTRICT,
    FOREIGN KEY (category_id) REFERENCES categories(id) ON DELETE SET NULL,
    FOREIGN KEY (recurring_rule_id) REFERENCES recurring_rules(id) ON DELETE SET NULL,
    FOREIGN KEY (transfer_account_id) REFERENCES accounts(id) ON DELETE SET NULL,
    
    INDEX idx_transactions_user_date (user_id, transaction_date DESC),
    INDEX idx_transactions_user_account (user_id, account_id),
    INDEX idx_transactions_user_category (user_id, category_id),
    INDEX idx_transactions_user_status (user_id, status),
    INDEX idx_transactions_user_type (user_id, type),
    INDEX idx_transactions_recurring (recurring_rule_id),
    INDEX idx_transactions_transfer (transfer_account_id),
    INDEX idx_transactions_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### recurring_rules
```sql
CREATE TABLE recurring_rules (
    id CHAR(26) PRIMARY KEY,
    user_id CHAR(26) NOT NULL,
    frequency ENUM('daily','weekly','monthly','yearly') NOT NULL,
    interval INT NOT NULL DEFAULT 1,            -- Every N periods
    day_of_week TINYINT NULL,                   -- 0=Sunday, for weekly
    day_of_month TINYINT NULL,                  -- 1-31, for monthly
    end_date DATE NULL,                         -- NULL = never ends
    next_occurrence_date DATE NOT NULL,
    is_active BOOLEAN DEFAULT TRUE,
    template_data JSON NOT NULL,                -- Transaction/Task template
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_recurring_user_active (user_id, is_active),
    INDEX idx_recurring_next_occurrence (next_occurrence_date, is_active),
    INDEX idx_recurring_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### goals
```sql
CREATE TABLE goals (
    id CHAR(26) PRIMARY KEY,
    user_id CHAR(26) NOT NULL,
    account_id CHAR(26) NULL,                   -- Linked account for auto-contribute
    name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    target_amount DECIMAL(15,2) NOT NULL,
    current_amount DECIMAL(15,2) NOT NULL DEFAULT 0.00,
    currency CHAR(3) NOT NULL DEFAULT 'USD',
    start_date DATE NOT NULL,
    target_date DATE NOT NULL,
    status ENUM('active','completed','paused','cancelled') NOT NULL DEFAULT 'active',
    priority ENUM('low','medium','high') NOT NULL DEFAULT 'medium',
    auto_contribute BOOLEAN DEFAULT FALSE,
    contribution_amount DECIMAL(15,2) NULL,
    contribution_frequency ENUM('monthly','quarterly','yearly') NULL,
    metadata JSON NULL,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (account_id) REFERENCES accounts(id) ON DELETE SET NULL,
    INDEX idx_goals_user_status (user_id, status),
    INDEX idx_goals_user_target_date (user_id, target_date),
    INDEX idx_goals_account (account_id),
    INDEX idx_goals_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### tasks
```sql
CREATE TABLE tasks (
    id CHAR(26) PRIMARY KEY,
    user_id CHAR(26) NOT NULL,
    goal_id CHAR(26) NULL,                      -- Optional link to goal
    title VARCHAR(255) NOT NULL,
    description TEXT NULL,
    status ENUM('pending','in_progress','completed','cancelled') NOT NULL DEFAULT 'pending',
    priority ENUM('low','medium','high','urgent') NOT NULL DEFAULT 'medium',
    due_date DATE NULL,
    completed_at TIMESTAMP NULL,
    recurring_rule_id CHAR(26) NULL,
    sort_order INT DEFAULT 0,
    deleted_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY (goal_id) REFERENCES goals(id) ON DELETE SET NULL,
    FOREIGN KEY (recurring_rule_id) REFERENCES recurring_rules(id) ON DELETE SET NULL,
    INDEX idx_tasks_user_status (user_id, status),
    INDEX idx_tasks_user_due_date (user_id, due_date),
    INDEX idx_tasks_user_goal (user_id, goal_id),
    INDEX idx_tasks_recurring (recurring_rule_id),
    INDEX idx_tasks_deleted_at (deleted_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### notifications
```sql
CREATE TABLE notifications (
    id CHAR(26) PRIMARY KEY,
    user_id CHAR(26) NOT NULL,
    type ENUM(
        'transaction_created','transaction_large',
        'goal_progress','goal_completed','goal_at_risk',
        'task_due','task_overdue','task_completed',
        'budget_alert','budget_exceeded',
        'system','security','info'
    ) NOT NULL,
    title VARCHAR(255) NOT NULL,
    message TEXT NOT NULL,
    data JSON NULL,                             -- action_url, entity_ids, etc.
    read_at TIMESTAMP NULL,
    archived_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_notifications_user_read (user_id, read_at),
    INDEX idx_notifications_user_created (user_id, created_at DESC),
    INDEX idx_notifications_type (type),
    INDEX idx_notifications_unread (user_id, read_at, archived_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### attachments
```sql
CREATE TABLE attachments (
    id CHAR(26) PRIMARY KEY,
    user_id CHAR(26) NOT NULL,
    attachable_type VARCHAR(50) NOT NULL,       -- 'Transaction', 'Goal', 'Task'
    attachable_id CHAR(26) NOT NULL,
    file_name VARCHAR(255) NOT NULL,
    file_path VARCHAR(500) NOT NULL,
    mime_type VARCHAR(100) NOT NULL,
    file_size INT UNSIGNED NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE,
    INDEX idx_attachments_attachable (attachable_type, attachable_id),
    INDEX idx_attachments_user (user_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

### personal_access_tokens (Sanctum)
```sql
-- Created by Sanctum migration
CREATE TABLE personal_access_tokens (
    id BIGINT UNSIGNED PRIMARY KEY AUTO_INCREMENT,
    tokenable_type VARCHAR(255) NOT NULL,
    tokenable_id CHAR(26) NOT NULL,
    name VARCHAR(255) NOT NULL,
    token VARCHAR(64) NOT NULL UNIQUE,
    abilities TEXT NULL,
    last_used_at TIMESTAMP NULL,
    expires_at TIMESTAMP NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    
    INDEX idx_pat_tokenable (tokenable_type, tokenable_id),
    INDEX idx_pat_expires (expires_at)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;
```

## Migration Strategy

### Naming Convention
```
YYYY_MM_DD_HHMMSS_description.php
```
Examples:
- `2024_01_15_000001_create_users_table.php`
- `2024_01_15_000002_create_accounts_table.php`
- `2024_01_15_000003_add_avatar_to_users_table.php`

### Ordering
1. Users & auth tables
2. Core domain tables (accounts, categories)
3. Transactional tables (transactions, recurring_rules)
4. Feature tables (goals, tasks, notifications)
5. Supporting tables (attachments)
6. Seeders for system data

### Seeders
- `CategorySeeder`: System categories (income/expense with icons/colors)
- `UserSeeder`: Demo user for development
- `CurrencySeeder`: ISO 4217 currencies (if separate table)

### Factories
- Use `Laravel\Factories\Factory` with Faker
- Define realistic relationships
- Support trait-based overrides for tests

## Query Optimization

### Common Queries & Indexes
| Query | Index |
|-------|-------|
| User transactions by date | `idx_transactions_user_date` |
| User transactions by account | `idx_transactions_user_account` |
| User transactions by category | `idx_transactions_user_category` |
| User goals by status | `idx_goals_user_status` |
| User tasks by due date | `idx_tasks_user_due_date` |
| Unread notifications | `idx_notifications_unread` |
| Next recurring occurrences | `idx_recurring_next_occurrence` |

### Eager Loading Patterns
```php
// Transaction with relations
Transaction::with(['account', 'category', 'transferAccount'])
    ->where('user_id', $userId)
    ->latest('transaction_date')
    ->paginate(20);

// Goal with progress
Goal::with(['account', 'tasks'])
    ->where('user_id', $userId)
    ->get();

// Dashboard summary (single query with subqueries)
User::with([
    'accounts' => fn($q) => $q->select('id', 'user_id', 'name', 'balance', 'currency'),
    'transactions' => fn($q) => $q->where('transaction_date', '>=', now()->startOfMonth()),
])->find($userId);
```

### Materialized Views (Future)
- Monthly spending by category
- Net worth snapshots
- Cash flow projections

## Data Integrity

### Constraints
- All FKs have explicit constraints
- `transactions.transfer_account_id` requires `type = 'transfer'`
- `goals.target_date >= goals.start_date`
- `tasks.due_date` validation in application layer
- `recurring_rules.next_occurrence_date` updated by scheduler

### Triggers (Minimal)
- Avoid triggers; use Eloquent events/observers
- Exception: `recurring_rules.next_occurrence_date` update via scheduler job

### Auditing
- `created_at`/`updated_at` on all tables
- `deleted_at` for soft deletes
- Consider `activity_log` table for critical changes (future)

## Backup & Recovery
- Daily automated backups (managed DB)
- Point-in-time recovery enabled
- Test restore procedure quarterly
- Export scripts for GDPR compliance

## Scaling Considerations
- Partition `transactions` by `transaction_date` (monthly) when > 10M rows
- Read replicas for analytics queries
- Redis caching for dashboard/analytics
- Archive old transactions to cold storage