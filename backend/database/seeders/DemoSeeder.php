<?php

namespace Database\Seeders;

use App\Models\Category;
use App\Models\CategoryBudget;
use App\Models\FinancialGoal;
use App\Models\FinancialGoalContribution;
use App\Models\Task;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\Hash;

class DemoSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->command->info('Seeding demo data...');

        $user = User::firstOrCreate(
            ['email' => 'demo@nexora.local'],
            [
                'name' => 'Demo User',
                'email_verified_at' => now(),
                'password' => Hash::make('password123'),
            ]
        );

        $monthStart = now()->startOfMonth();

        $date = fn (int $monthsAgo, int $day): string => $monthStart
            ->copy()
            ->subMonths($monthsAgo)
            ->day($day)
            ->toDateString();

        $this->removeLegacyDemoRows($user);
        $categoryMap = $this->seedCategories($user);
        $this->seedTransactions($user, $categoryMap, $date);
        $this->seedBudgets($user, $categoryMap, $monthStart);
        $this->seedGoals($user, $monthStart, $date);
        $this->seedTasks($user);

        $this->command->info('Demo data seeded successfully.');
    }

    /**
     * Remove rows created by the previous DemoSeeder version so the demo
     * account upgrades cleanly without touching unrelated user data.
     */
    private function removeLegacyDemoRows(User $user): void
    {
        $legacyTransactions = [
            ['Gaji Bulanan Januari', '2025-01-15'],
            ['Makanan dan Minuman', '2025-01-16'],
            ['Transportasi Ke Kantor', '2025-01-17'],
            ['Projek Freelance Desain', '2025-01-20'],
            ['Belanja Bulanan', '2025-01-22'],
            ['Listrik dan Air', '2025-01-25'],
            ['Nonton dengan Teman', '2025-01-28'],
            ['Belanja Obat-obatan', '2025-01-30'],
            ['Top Up Game', '2025-02-01'],
            ['Hadiah Lahirnanti', '2025-02-05'],
            ['Coffee Break', '2025-02-08'],
        ];

        foreach ($legacyTransactions as [$description, $transactionDate]) {
            Transaction::where('user_id', $user->id)
                ->where('description', $description)
                ->whereDate('transaction_date', $transactionDate)
                ->delete();
        }

        Task::where('user_id', $user->id)
            ->whereIn('title', [
                'Rekap Keuangan Bulanan',
                'Setor Tabungan',
                'Update Budget',
                'Laporkan Pengeluaran Pajak',
                'Baca Buku Pribadi',
            ])
            ->delete();
    }

    /**
     * @return array<string, Category>
     */
    private function seedCategories(User $user): array
    {
        $definitions = [
            ['name' => 'Salary', 'type' => 'income', 'color' => 'green-500', 'icon' => 'Bag'],
            ['name' => 'Freelance', 'type' => 'income', 'color' => 'green-500', 'icon' => 'File'],
            ['name' => 'Food', 'type' => 'expense', 'color' => 'red-500', 'icon' => 'Utensils'],
            ['name' => 'Transport', 'type' => 'expense', 'color' => 'red-500', 'icon' => 'Car'],
            ['name' => 'Shopping', 'type' => 'expense', 'color' => 'red-500', 'icon' => 'ShoppingBag'],
            ['name' => 'Bills', 'type' => 'expense', 'color' => 'red-500', 'icon' => 'Receipt'],
            ['name' => 'Entertainment', 'type' => 'expense', 'color' => 'red-500', 'icon' => 'Movie'],
        ];

        $categoryMap = [];

        foreach ($definitions as $definition) {
            $categoryMap[$definition['name']] = Category::updateOrCreate(
                ['user_id' => $user->id, 'name' => $definition['name']],
                [
                    'type' => $definition['type'],
                    'color' => $definition['color'],
                    'icon' => $definition['icon'],
                ]
            );
        }

        return $categoryMap;
    }

    /**
     * Seed 15 recent transactions across the last four months.
     *
     * @param  array<string, Category>  $categoryMap
     */
    private function seedTransactions(User $user, array $categoryMap, callable $date): void
    {
        $transactions = [
            [
                'description' => 'Gaji Bulanan',
                'category' => 'Salary',
                'type' => 'income',
                'amount' => 7500000,
                'date' => $date(0, 1),
            ],
            [
                'description' => 'Belanja Bahan Makanan',
                'category' => 'Food',
                'type' => 'expense',
                'amount' => 600000,
                'date' => $date(0, 3),
            ],
            [
                'description' => 'Transportasi ke Kantor',
                'category' => 'Transport',
                'type' => 'expense',
                'amount' => 200000,
                'date' => $date(0, 4),
            ],
            [
                'description' => 'Projek Freelance Website',
                'category' => 'Freelance',
                'type' => 'income',
                'amount' => 1250000,
                'date' => $date(0, 5),
            ],
            [
                'description' => 'Tagihan Listrik dan Internet',
                'category' => 'Bills',
                'type' => 'expense',
                'amount' => 1000000,
                'date' => $date(0, 6),
            ],
            [
                'description' => 'Belanja Pakaian',
                'category' => 'Shopping',
                'type' => 'expense',
                'amount' => 450000,
                'date' => $date(0, 8),
            ],
            [
                'description' => 'Nonton Film Akhir Pekan',
                'category' => 'Entertainment',
                'type' => 'expense',
                'amount' => 150000,
                'date' => $date(0, 10),
            ],
            [
                'description' => 'Makan Siang Kantor',
                'category' => 'Food',
                'type' => 'expense',
                'amount' => 250000,
                'date' => $date(0, 12),
            ],
            [
                'description' => 'Langganan Layanan Streaming',
                'category' => 'Entertainment',
                'type' => 'expense',
                'amount' => 300000,
                'date' => $date(0, 15),
            ],
            [
                'description' => 'Gaji Bulanan Bulan Lalu',
                'category' => 'Salary',
                'type' => 'income',
                'amount' => 7500000,
                'date' => $date(1, 1),
            ],
            [
                'description' => 'Tagihan Bulanan Bulan Lalu',
                'category' => 'Bills',
                'type' => 'expense',
                'amount' => 550000,
                'date' => $date(1, 10),
            ],
            [
                'description' => 'Projek Freelance Bulan Lalu',
                'category' => 'Freelance',
                'type' => 'income',
                'amount' => 1250000,
                'date' => $date(2, 12),
            ],
            [
                'description' => 'Belanja Makanan Bulan Lalu',
                'category' => 'Food',
                'type' => 'expense',
                'amount' => 400000,
                'date' => $date(2, 20),
            ],
            [
                'description' => 'Gaji Bulanan Tiga Bulan Lalu',
                'category' => 'Salary',
                'type' => 'income',
                'amount' => 7500000,
                'date' => $date(3, 1),
            ],
            [
                'description' => 'Belanja Perlengkapan Tiga Bulan Lalu',
                'category' => 'Shopping',
                'type' => 'expense',
                'amount' => 650000,
                'date' => $date(3, 15),
            ],
        ];

        foreach ($transactions as $transaction) {
            Transaction::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'description' => $transaction['description'],
                ],
                [
                    'category_id' => $categoryMap[$transaction['category']]->id,
                    'type' => $transaction['type'],
                    'amount' => $transaction['amount'],
                    'transaction_date' => $transaction['date'],
                ]
            );
        }
    }

    /**
     * @param  array<string, Category>  $categoryMap
     */
    private function seedBudgets(User $user, array $categoryMap, $monthStart): void
    {
        $budgets = [
            ['category' => 'Food', 'limit_amount' => 1000000],
            ['category' => 'Transport', 'limit_amount' => 600000],
            ['category' => 'Bills', 'limit_amount' => 1200000],
            ['category' => 'Entertainment', 'limit_amount' => 400000],
        ];

        foreach ($budgets as $budget) {
            CategoryBudget::updateOrCreate(
                [
                    'user_id' => $user->id,
                    'category_id' => $categoryMap[$budget['category']]->id,
                    'year' => $monthStart->year,
                    'month' => $monthStart->month,
                ],
                ['limit_amount' => $budget['limit_amount']]
            );
        }
    }

    private function seedGoals(User $user, $monthStart, callable $date): void
    {
        $goals = [
            [
                'title' => 'Emergency Fund',
                'target_amount' => 10000000,
                'opening_amount' => 3000000,
                'deadline' => $monthStart->copy()->addMonths(12)->toDateString(),
                'status' => 'active',
            ],
            [
                'title' => 'New Laptop',
                'target_amount' => 15000000,
                'opening_amount' => 2000000,
                'deadline' => $monthStart->copy()->addMonths(6)->toDateString(),
                'status' => 'active',
            ],
            [
                'title' => 'Investment Fund',
                'target_amount' => 8000000,
                'opening_amount' => 1000000,
                'deadline' => $monthStart->copy()->addMonths(18)->toDateString(),
                'status' => 'active',
            ],
        ];

        foreach ($goals as $goal) {
            FinancialGoal::updateOrCreate(
                ['user_id' => $user->id, 'title' => $goal['title']],
                [
                    'target_amount' => $goal['target_amount'],
                    'opening_amount' => $goal['opening_amount'],
                    'current_amount' => $goal['opening_amount'],
                    'deadline' => $goal['deadline'],
                    'status' => $goal['status'],
                ]
            );
        }

        $goalMap = FinancialGoal::where('user_id', $user->id)->get()->keyBy('title');

        $contributions = [
            [
                'goal' => 'Emergency Fund',
                'amount' => 500000,
                'date' => $date(1, 15),
                'note' => 'Monthly saving',
            ],
            [
                'goal' => 'Emergency Fund',
                'amount' => 750000,
                'date' => $date(2, 15),
                'note' => 'Monthly saving lanjutan',
            ],
            [
                'goal' => 'New Laptop',
                'amount' => 1000000,
                'date' => $date(1, 20),
                'note' => 'Freelance allocation',
            ],
            [
                'goal' => 'Investment Fund',
                'amount' => 400000,
                'date' => $date(3, 10),
                'note' => 'Bonus allocation',
            ],
        ];

        foreach ($contributions as $contribution) {
            FinancialGoalContribution::updateOrCreate(
                [
                    'financial_goal_id' => $goalMap[$contribution['goal']]->id,
                    'note' => $contribution['note'],
                ],
                [
                    'amount' => $contribution['amount'],
                    'contribution_date' => $contribution['date'],
                ]
            );
        }

        // Keep the legacy current_amount column aligned with the derived
        // collected amount (opening balance + contributions).
        foreach ($goalMap as $goal) {
            $goal->update(['current_amount' => $goal->collected_amount]);
        }
    }

    private function seedTasks(User $user): void
    {
        $tasks = [
            [
                'title' => 'Review monthly expenses',
                'description' => 'Periksa kategori pengeluaran terbesar bulan ini.',
                'status' => 'pending',
                'priority' => 'high',
                'due_at' => now()->addDays(3),
            ],
            [
                'title' => 'Update savings target',
                'description' => 'Sesuaikan target tabungan dengan pemasukan terbaru.',
                'status' => 'pending',
                'priority' => 'medium',
                'due_at' => now()->addDays(7),
            ],
            [
                'title' => 'Pay internet bill',
                'description' => 'Bayar tagihan internet sebelum jatuh tempo.',
                'status' => 'completed',
                'priority' => 'high',
                'due_at' => now()->subDays(2),
            ],
            [
                'title' => 'Review investment plan',
                'description' => 'Tinjau alokasi investasi triwulan ini.',
                'status' => 'pending',
                'priority' => 'low',
                'due_at' => now()->addDays(14),
            ],
            [
                'title' => 'Prepare weekly budget',
                'description' => 'Susun rencana anggaran untuk minggu depan.',
                'status' => 'completed',
                'priority' => 'medium',
                'due_at' => now()->subDays(5),
            ],
        ];

        foreach ($tasks as $task) {
            Task::updateOrCreate(
                ['user_id' => $user->id, 'title' => $task['title']],
                [
                    'description' => $task['description'],
                    'status' => $task['status'],
                    'priority' => $task['priority'],
                    'due_at' => $task['due_at'],
                ]
            );
        }
    }
}
