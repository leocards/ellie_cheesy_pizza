<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use Illuminate\Http\Request;

class CustomerController extends Controller
{
    public function jsonIndex($search)
    {
        return response()->json(
            Customer::when($search, function ($query) use ($search) {
                $query->where('name', 'LIKE', "%{$search}%");
            })->get()
        );
    }
}
