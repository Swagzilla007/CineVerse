<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        if (!Schema::hasTable('bookings')) {
            Schema::create('bookings', function (Blueprint $table) {
                $table->id();
                $table->foreignId('user_id')->constrained()->onDelete('cascade');
                $table->foreignId('screening_id')->constrained()->onDelete('cascade');
                $table->foreignId('seat_id')->constrained()->onDelete('cascade');
                $table->decimal('total_price', 8, 2);
                $table->enum('status', ['pending', 'confirmed', 'cancelled'])->default('pending');
                $table->timestamps();
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('bookings');
    }
};
