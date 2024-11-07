<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('forums', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('university');
            $table->string('title')->nullable();
            $table->date('updated_at')->nullable();
            $table->date('created_at')->nullable();

            // Foreign key
            $table->foreign('university')->references('id')->on('universities')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('forums');
    }
}

?>
