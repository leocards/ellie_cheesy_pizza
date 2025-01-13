<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ProductSize extends Model
{
    protected $fillable = [
        "finish_product_id",
        "size",
        "quantity",
        "opening_stock",
        "closing_stock",
    ];

    public function productName()
    {
        return $this->belongsTo(FinishProduct::class)->select(['id', 'name']);
    }
}
