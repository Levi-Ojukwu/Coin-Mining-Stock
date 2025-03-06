<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
            // Modify amount column to handle larger numbers
            // precision of 20 and scale of 2 allows numbers up to 999,999,999,999,999,999.99
            $table->decimal('amount', 20, 2)->change();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('transactions', function (Blueprint $table) {
             // Revert back to original size if needed
             $table->decimal('amount', 10, 2)->change();
        });
    }
};
