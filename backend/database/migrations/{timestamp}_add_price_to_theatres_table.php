<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        if (!Schema::hasColumn('theatres', 'price')) {
            Schema::table('theatres', function (Blueprint $table) {
                $table->decimal('price', 8, 2)->after('screen_type');
            });
        }
    }

    public function down()
    {
        if (Schema::hasColumn('theatres', 'price')) {
            Schema::table('theatres', function (Blueprint $table) {
                $table->dropColumn('price');
            });
        }
    }
};
