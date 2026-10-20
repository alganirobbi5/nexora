<?php

namespace Database\Seeders;

use Illuminate\Support\Facades\Hash;
use App\Models\Category;
use App\Models\FinancialGoal;
use App\Models\Task;
use App\Models\Transaction;
use App\Models\User;
use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;

class DemoSeeder extends Seeder
{
    use WithoutModelEvents;

    public function run(): void
    {
        $this->command->info('Seeding demo data...');

        // 1. Demo user (idempotent via firstOrCreate)
        $user = User::firstOrCreate(
            ['email' => 'demo@nexora.local'],
            [
                'name' => 'Demo User',
                'email_verified_at' => now(),
                'password' => Hash::make('password123'),
            ]
        );

        // 2. Demo categories (idempotent via firstOrCreate)
        $incomeCategories = [
            ['name' => 'Salary', 'type' => 'income', 'color' => 'green-500', 'icon' => 'Bag'],
            ['name' => 'Freelance', 'type' => 'income', 'color' => 'green-500', 'icon' => 'File'],
        ];

        $expenseCategories = [
            ['name' => 'Food', 'type' => 'expense', 'color' => 'red-500', 'icon' => 'Utensils'],
            ['name' => 'Transport', 'type' => 'expense', 'color' => 'red-500', 'icon' => 'Car'],
            ['name' => 'Shopping', 'type' => 'expense', 'color' => 'red-500', 'icon' => 'ShoppingBag'],
            ['name' => 'Bills', 'type' => 'expense', 'color' => 'red-500', 'icon' => 'Receipt'],
            ['name' => 'Entertainment', 'type' => 'expense', 'color' => 'red-500', 'icon' => 'Movie'],
        ];

        foreach ($incomeCategories as $cat) {
            Category::firstOrCreate(
                ['user_id' => $user->id, 'name' => $cat['name']],
                array_merge(['user_id' => $user->id, 'type' => $cat['type']], $cat)
            );
        }

        foreach ($expenseCategories as $cat) {
            Category::firstOrCreate(
                ['user_id' => $user->id, 'name' => $cat['name']],
                array_merge(['user_id' => $user->id, 'type' => $cat['type']], $cat)
            );
        }

        // Refresh categories for the user
        $categories = Category::where('user_id', $user->id)->get();
        $categoryMap = $categories->keyBy('name');

        // 3. Demo transactions (8-12 transactions, Indonesian Rupiah)
        $transactions = [
            [
                'type' => 'income',
                'amount' => 15000000,
                'description' => 'Gaji Bulanan Januari',
                'transaction_date' => '2025-01-15',
                'category_name' => 'Salary',
            ],
            [
                'type' => 'income',
                'amount' => 5000000,
                'description' => 'Projek Freelance Desain',
                'transaction_date' => '2025-01-20',
                'category_name' => 'Freelance',
            ],
            [
                'type' => 'expense',
                'amount' => 3500000,
                'description' => 'Makanan dan Minuman',
                'transaction_date' => '2025-01-16',
                'category_name' => 'Food',
            ],
            [
                'type' => 'expense',
                'amount' => 2500000,
                'description' => 'Transportasi Ke Kantor',
                'transaction_date' => '2025-01-17',
                'category_name' => 'Transport',
            ],
            [
                'type' => 'expense',
                'amount' => 8000000,
                'description' => 'Belanja Bulanan',
                'transaction_date' => '2025-01-22',
                'category_name' => 'Shopping',
            ],
            [
                'type' => 'expense',
                'amount' => 2000000,
                'description' => 'Listrik dan Air',
                'transaction_date' => '2025-01-25',
                'category_name' => 'Bills',
            ],
            [
                'type' => 'expense',
                'amount' => 1500000,
                'description' => 'Nonton dengan Teman',
                'transaction_date' => '2025-01-28',
                'category_name' => 'Entertainment',
            ],
            [
                'type' => 'expense',
                'amount' => 1200000,
                'description' => 'Belanja Obat-obatan',
                'transaction_date' => '2025-01-30',
                'category_name' => 'Food',
            ],
            [
                'type' => 'expense',
                'amount' => 3000000,
                'description' => 'Top Up Game',
                'transaction_date' => '2025-02-01',
                'category_name' => 'Entertainment',
            ],
            [
                'type' => 'income',
                'amount' => 3000000,
                'description' => 'Hadiah Lahirnanti',
                'transaction_date' => '2025-02-05',
                'category_name' => 'Freelance',
            ],
            [
                'type' => 'expense',
                'amount' => 500000,
                'description' => 'Coffee Break',
                'transaction_date' => '2025-02-08',
                'category_name' => 'Food',
            ],
        ];

        // Clear existing transactions for this user idempotently
        Transaction::where('user_id', $user->id)->delete();

        foreach ($transactions as $tx) {
            $cat = $categoryMap->get($tx['category_name']);
            $category_id = $cat?->id;

            Transaction::create([
                'user_id' => $user->id,
                'category_id' => $category_id,
                'type' => $tx['type'],
                'amount' => $tx['amount'],
                'description' => $tx['description'],
                'transaction_date' => $tx['transaction_date'],
            ]);
        }

        // 4. Demo financial goals (2-3 goals)
        $goals = [
            [
                'title' => 'Emergency Fund',
                'target_amount' => 50000000,
                'current_amount' => 12500000,
                'deadline' => '2026-12-31',
                'status' => 'active',
            ],
            [
                'title' => 'New Laptop',
                'target_amount' => 20000000,
                'current_amount' => 8000000,
                'deadline' => '2025-06-30',
                'status' => 'active',
            ],
            [
                'title' => 'Investment Fund',
                'target_amount' => 100000000,
                'current_amount' => 15000000,
                'deadline' => '2027-12-31',
                'status' => 'active',
            ],
        ];

        // Clear existing goals for this user idempotently
        FinancialGoal::where('user_id', $user->id)->delete();

        foreach ($goals as $goal) {
            FinancialGoal::create([
                'user_id' => $user->id,
                'title' => $goal['title'],
                'target_amount' => $goal['target_amount'],
                'opening_amount' => $goal['current_amount'],
                'current_amount' => $goal['current_amount'],
                'deadline' => $goal['deadline'],
                'status' => $goal['status'],
            ]);
        }

        // 5. Demo tasks (4-6 tasks)
        $tasks = [
            [
                'title' => 'Rekap Keuangan Bulanan',
                'description' => 'Menginput semua transaksi bulan ini',
                'status' => 'pending',
                'priority' => 'high',
                'due_at' => '2025-02-15',
            ],
            [
                'title' => 'Setor Tabungan',
                'description' => 'Menabung ke rekening berbeda',
                'status' => 'completed',
                'priority' => 'medium',
                'due_at' => '2025-02-10',
            ],
            [
                'title' => 'Update Budget',
                'description' => 'Mengatur anggaran minggu ini',
                'status' => 'pending',
                'priority' => 'low',
                'due_at' => '2025-02-20',
            ],
            [
                'title' => 'Laporkan Pengeluaran Pajak',
                'description' => 'Mengumpulkan bukti pemasukan/pengeluaran',
                'status' => 'pending',
                'priority' => 'high',
                'due_at' => '2025-02-28',
            ],
            [
                'title' => 'Baca Buku Pribadi',
                'description' => '30 menit setiap hari',
                'status' => 'completed',
                'priority' => 'low',
                'due_at' => '2025-03-01',
            ],
        ];

        // Clear existing tasks for this user idempotently
        Task::where('user_id', $user->id)->delete();

        foreach ($tasks as $task) {
            Task::create([
                'user_id' => $user->id,
                'title' => $task['title'],
                'description' => $task['description'],
                'status' => $task['status'],
                'priority' => $task['priority'],
                'due_at' => $task['due_at'],
            ]);
        }

        $this->command->info('Demo data seeded successfully.');
    }
}