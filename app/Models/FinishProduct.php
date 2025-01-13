<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class FinishProduct extends Model
{
    protected $fillable = [
        "name",
        "size",
        "price",
        "stock_in",
        "opening_stock",
        "closing_stock",
        "thumbnail",
    ];

    public function productStock()
    {
        return $this->hasMany(FinishProductStock::class, 'finish_product_id', 'id')->latest();
    }

    public function soldProducts()
    {
        return $this->hasMany(OrderedItem::class);
    }
}
