<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        if (!Schema::hasColumn('bookings', 'booking_number')) {
            Schema::table('bookings', function (Blueprint $table) {
                $table->string('booking_number')->after('id');
            });
        }
    }

    public function down()
    {
        if (Schema::hasColumn('bookings', 'booking_number')) {
            Schema::table('bookings', function (Blueprint $table) {
                $table->dropColumn('booking_number');
            });
        }
    }
};
