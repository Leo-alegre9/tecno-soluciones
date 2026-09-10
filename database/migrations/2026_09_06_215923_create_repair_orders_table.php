<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('repair_orders', function (Blueprint $table) {
            $table->id();
            $table->string('code')->unique();

            $table->string('customer_name');
            $table->string('customer_phone');
            $table->string('customer_dni')->nullable();

            $table->string('device_type');
            $table->string('brand');
            $table->string('model');
            $table->string('serial_number')->nullable();
            $table->text('reported_issue');
            $table->text('accessories')->nullable();
            $table->string('device_password')->nullable();

            $table->string('status')->default('recibido');

            $table->decimal('parts_cost', 12, 2)->default(0);
            $table->decimal('labor_cost', 12, 2)->default(0);
            $table->decimal('charged_price', 12, 2)->nullable();

            $table->unsignedInteger('warranty_days')->default(30);
            $table->text('warranty_notes')->nullable();
            $table->text('internal_notes')->nullable();

            $table->foreignId('technician_id')->nullable()->constrained('users')->nullOnDelete();

            $table->timestamp('received_at')->useCurrent();
            $table->timestamp('promised_at')->nullable();
            $table->timestamp('delivered_at')->nullable();

            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('repair_orders');
    }
};
