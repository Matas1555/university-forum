<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('comments', function (Blueprint $table) {
            $table->id();
            $table->text('text');
            $table->unsignedBigInteger('post');
            $table->unsignedBigInteger('user');
            $table->date('updated_at')->nullable();
            $table->date('created_at')->nullable();

            // Foreign keys
            $table->foreign('post')->references('id')->on('posts')->onDelete('cascade');
            $table->foreign('user')->references('id')->on('users');
        });
    }

    public function down()
    {
        Schema::dropIfExists('comments');
    }
}

?>
