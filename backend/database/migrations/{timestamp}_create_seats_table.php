<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        if (!Schema::hasTable('seats')) {
            Schema::create('seats', function (Blueprint $table) {
                $table->id();
                $table->foreignId('theatre_id')->constrained()->onDelete('cascade');
                $table->string('row');
                $table->integer('number');
                $table->enum('status', ['available', 'booked'])->default('available');
                $table->timestamps();
            });
        }
    }

    public function down()
    {
        Schema::dropIfExists('seats');
    }
};
