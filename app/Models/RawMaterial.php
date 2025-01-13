<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class RawMaterial extends Model
{
    protected $fillable = [
        "name",
        "stock_in",
        "opening_stock",
        "closing_stock",
    ];

    public function rawMaterialStocks()
    {
        return $this->hasMany(RawMaterialStock::class);
    }
}
