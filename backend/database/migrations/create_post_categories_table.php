<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up()
    {
        Schema::create('post_categories', function (Blueprint $table) {
            $table->unsignedBigInteger('postID');
            $table->unsignedBigInteger('categoryID');

            $table->primary(['postID', 'categoryID']);

            // Foreign keys
            $table->foreign('postID')->references('id')->on('posts')->onDelete('cascade');
            $table->foreign('categoryID')->references('id')->on('categories')->onDelete('cascade');
        });
    }

    public function down()
    {
        Schema::dropIfExists('post_categories');
    }
}

?>
