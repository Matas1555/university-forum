<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('posts', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->unsignedBigInteger('user');
            $table->unsignedBigInteger('forum');
            $table->date('updated_at')->nullable();
            $table->date('created_at')->nullable();

            // Foreign keys
            $table->foreign('user')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('forum')->references('id')->on('forums')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('posts');
    }
}

?>
