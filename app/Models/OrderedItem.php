<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Support\Facades\DB;

class OrderedItem extends Model
{
    protected $fillable = [
        "order_id",
        "finish_product_id",
        "quantity",
        "total_amount",
    ];

    public function product()
    {
        return $this->belongsTo(FinishProduct::class, 'finish_product_id', 'id');
    }

    public static function getSalesPerMonth($year = null)
    {
        $query = self::select(
                DB::raw('YEAR(created_at) as year'),
                DB::raw('MONTH(created_at) as month'),
                DB::raw('SUM(total_amount) as total_sales')
            )
            ->groupBy('year', 'month')
            ->orderBy('year', 'desc')
            ->orderBy('month', 'desc');

        if ($year) {
            $query->whereYear('created_at', $year);
        }

        return $query->get();
    }
}
