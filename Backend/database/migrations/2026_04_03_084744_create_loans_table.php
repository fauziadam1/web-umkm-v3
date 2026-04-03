<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('loans', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('email');
            $table->string('business_name');
            $table->text('purpose');
            $table->text('address');
            $table->string('phone_number');
            $table->integer('account_number');
            $table->integer('amount');
            $table->integer('tenor');
            $table->date('request_date');
            $table->enum('status', ['pending', 'approved', 'success'])->default('pending');
            $table->foreignUuid('user_id')->references('id')->on('users')->cascadeOnDelete();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('loans');
    }
};
