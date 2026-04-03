<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Loan extends Model
{
    protected $fillable = [
        'user_id',
        'name',
        'email',
        'business_name',
        'purpose',
        'address',
        'phone_number',
        'account_number',
        'amount',
        'tenor',
        'request_date',
        'status',
    ];

    public function installments()
    {
        return $this->hasMany(Installment::class);
    }

    public function documents()
    {
        return $this->hasMany(Document::class);
    }
}
