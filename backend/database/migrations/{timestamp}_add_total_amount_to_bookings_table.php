<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        if (!Schema::hasColumn('bookings', 'total_amount')) {
            Schema::table('bookings', function (Blueprint $table) {
                $table->decimal('total_amount', 10, 2)->after('seat_id');
            });
        }
    }

    public function down()
    {
        if (Schema::hasColumn('bookings', 'total_amount')) {
            Schema::table('bookings', function (Blueprint $table) {
                $table->dropColumn('total_amount');
            });
        }
    }
};
