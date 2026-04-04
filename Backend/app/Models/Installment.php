<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Installment extends Model
{
    protected $fillable = [
        'loan_id',
        'due_date',
        'installment_number',
        'amount',
        'principal',
        'interest',
        'remaining_balance',
        'payment_date',
        'status'
    ];

    public function loans()
    {
        return $this->belongsTo(Loan::class);
    }
}
