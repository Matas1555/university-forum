<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('programs', function (Blueprint $table) {
            $table->id();
            $table->string('title')->nullable();
            $table->text('description')->nullable();
            $table->unsignedBigInteger('university');

            // Foreign key
            $table->foreign('university')->references('id')->on('universities');
        });
    }

    public function down()
    {
        Schema::dropIfExists('programs');
    }
}
?>
