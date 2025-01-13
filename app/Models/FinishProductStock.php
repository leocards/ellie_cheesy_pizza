<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FinishProductStock extends Model
{
    protected $fillable = [
        "finish_product_id",
        "quantity"
    ];

    public function finishProduct()
    {
        return $this->belongsTo(FinishProduct::class);
    }
}
