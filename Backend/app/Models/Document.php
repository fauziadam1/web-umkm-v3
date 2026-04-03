<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Document extends Model
{
    protected $fillable = [
        'loan_id',
        'path',
        'type'
    ];

    public function loan()
    {
        return $this->belongsTo(Loan::class);
    }
}
