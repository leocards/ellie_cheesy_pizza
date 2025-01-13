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
        Schema::create('finish_products', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->enum('size', ['small', 'medium', 'large'])->nullable();
            $table->string('price');
            $table->string('stock_in')->nullable();
            $table->string('opening_stock');
            $table->string('closing_stock');
            $table->string('thumbnail', 500)->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('finish_products');
    }
};
