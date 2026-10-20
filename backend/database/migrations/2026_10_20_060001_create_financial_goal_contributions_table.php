<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('financial_goal_contributions', function (Blueprint $table) {
            $table->id();
            $table->foreignId('financial_goal_id')
                ->constrained()
                ->cascadeOnDelete();
            $table->unsignedBigInteger('amount');
            $table->date('contribution_date');
            $table->string('note')->nullable();
            $table->timestamps();

            $table->index(
                ['financial_goal_id', 'contribution_date'],
                'goal_contributions_goal_date_index'
            );
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('financial_goal_contributions');
    }
};
