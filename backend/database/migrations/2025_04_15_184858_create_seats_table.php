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
        Schema::create('seats', function (Blueprint $table) {
            $table->id();
            $table->foreignId('theatre_id')->constrained()->onDelete('cascade');
            $table->string('row');
            $table->integer('number');
            $table->enum('status', ['available', 'booked', 'maintenance'])->default('available');
            $table->enum('type', ['regular', 'premium', 'wheelchair'])->default('regular');
            $table->timestamps();
            
            // Ensure unique seat combinations per theatre
            $table->unique(['theatre_id', 'row', 'number']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('seats');
    }
};
