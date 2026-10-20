<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\DB;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Add the historical opening balance used for goal progress.
     *
     * The legacy current_amount column is intentionally preserved so that
     * existing data and clients keep working, but opening_amount becomes the
     * authoritative base for the derived collected amount.
     */
    public function up(): void
    {
        if (! Schema::hasColumn('financial_goals', 'opening_amount')) {
            Schema::table('financial_goals', function (Blueprint $table) {
                $table->unsignedBigInteger('opening_amount')
                    ->default(0)
                    ->after('current_amount');
            });
        }

        // Preserve legacy savings exactly once: no contribution rows are
        // created and no date is invented for historical amounts.
        DB::table('financial_goals')
            ->where('opening_amount', 0)
            ->update(['opening_amount' => DB::raw('current_amount')]);
    }

    public function down(): void
    {
        if (Schema::hasColumn('financial_goals', 'opening_amount')) {
            Schema::table('financial_goals', function (Blueprint $table) {
                $table->dropColumn('opening_amount');
            });
        }
    }
};
