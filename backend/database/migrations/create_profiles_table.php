<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('profiles', function (Blueprint $table) {
            $table->id();
            $table->unsignedBigInteger('user_id')->nullable();
            $table->string('bio');
            $table->text('avatar')->nullable();
            $table->unsignedBigInteger('university')->nullable();
            $table->year('yearOfGraduation')->nullable();
            $table->unsignedBigInteger('status')->nullable();
            $table->string('username', 30);
            $table->timestamp('created_at')->nullable();
            $table->timestamp('updated_at')->nullable();

            // Foreign keys
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('university')->references('id')->on('universities');
            $table->foreign('status')->references('id');
        });
    }

    public function down()
    {
        Schema::dropIfExists('profiles');
    }
}

?>
