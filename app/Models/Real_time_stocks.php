<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Real_time_stocks extends Model
{
    use HasFactory;
    protected $fillable = [
        'company_id',
        'price',
        'date',
        'time',
    ];
   
}
