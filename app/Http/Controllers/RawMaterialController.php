<?php

namespace App\Http\Controllers;

use App\Models\RawMaterial;
use App\Models\RawMaterialStock;
use Carbon\Carbon;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class RawMaterialController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return Inertia::render('Inventory/Materials/Index', [
            'rawMaterials' => RawMaterial::with('rawMaterialStocks:id,raw_material_id,quantity,isStockOut,created_at')
                ->paginate($this->paginate)
        ]);
    }

    public function manageRaw()
    {
        return Inertia::render('ManageStocks/Materials/Index', [
            'stocks' => RawMaterial::with('rawMaterialStocks:id,raw_material_id,quantity,isStockOut,created_at')
                ->paginate($this->paginate)
        ]);
    }

    public function jsonManageRaw(Request $request)
    {
        $search = $request->query('search');
        $filter = $request->query('filter');
        $is_paginate = $request->query('paginate');

        try {
            $rawMaterial = RawMaterial::with('rawMaterialStocks:id,raw_material_id,quantity,isStockOut,created_at')
            ->when($search, function ($query) use ($search) {
                $query->where('name', 'LIKE', "%{$search}%");
            })->when($filter, function ($query) use ($filter) {
                if($filter == "today")
                    $query->whereDate('created_at', Carbon::now()->format('Y-m-d'));
                else if($filter == "yesterday")
                    $query->whereDate('created_at', Carbon::yesterday()->format('Y-m-d'));
                else if($filter == "7d")
                    $query->whereBetween('created_at', [Carbon::now()->subDays(7), Carbon::now()]);
                else if($filter == "30d")
                    $query->whereBetween('created_at', [Carbon::now()->subDays(30), Carbon::now()]);
                else
                    $query->whereDate('created_at', $filter);
            })
            ->when($is_paginate, fn ($q) => $q->get())
            ->when(!$is_paginate, fn ($q) => $q->paginate($this->paginate));

            return response()->json($rawMaterial);
        } catch (\Throwable $th) {
            return response()->json($th->getMessage(), 400);
        }
    }

    public function store(Request $request, $rawMaterial = null)
    {
        try {

            DB::transaction(function () use ($request, $rawMaterial) {
                $exist = RawMaterial::where('name', $request->name)
                    ->when($rawMaterial, function ($query) use ($rawMaterial) {
                        $query->whereNot('id', $rawMaterial);
                    })
                    ->exists();

                if($exist) {
                    throw new Exception("The raw material already exist.", 1);
                }

                RawMaterial::updateOrCreate(["id" => $rawMaterial], [
                    "name" => $request->name,
                    "opening_stock" => $request->opening_stock,
                    "closing_stock" => $request->closing_stock,
                ]);
            });

            return back()->with(['message' => 'New raw material has been '.($rawMaterial ? 'updated' : 'created').'.', 'title' => $rawMaterial?'Product updated!':'New product!', 'status' => 'success']);
        } catch (\Throwable $th) {
            return back()->with(['message' => $th->getMessage(), 'title' => 'Failed attempt!', 'status' => 'error']);
        }
    }

    public function addStock(Request $request, RawMaterial $rawMaterial)
    {
        DB::beginTransaction();
        try {
            $stock = $rawMaterial->stock_in + $request->quantity;

            if($stock > $rawMaterial->closing_stock)
                throw new Exception('The added stock exceeded the closing stock.', 1);

            $rawMaterial->stock_in = $stock;

            $rawMaterial->rawMaterialStocks()->create([
                'quantity' => $request->quantity
            ]);

            $rawMaterial->save();

            DB::commit();

            return back()->with(['message' => 'New stock has been added to raw material '.$rawMaterial->name, 'title' => 'New stock!', 'status' => 'success']);
        } catch (\Throwable $th) {
            DB::rollBack();

            return back()->with(['message' => $th->getMessage(), 'title' => 'Failed attempt!', 'status' => 'error']);
        }
    }

    public function stockOut(RawMaterialStock $rawMaterialStock)
    {
        try {
            $revert = false;

            $revert = DB::transaction(function () use ($rawMaterialStock, $revert) {
                if(!$rawMaterialStock->isStockOut) {
                    $rawMaterialStock->isStockOut = true;

                    $stock = $rawMaterialStock->rawMaterial->stock_in - $rawMaterialStock->quantity;

                    $rawMaterialStock->rawMaterial()->update([
                        'stock_in' => $stock < 0 ? 0 : $stock
                    ]);
                } else {
                    $revert = true;
                    $rawMaterialStock->isStockOut = null;
                    $rawMaterialStock->rawMaterial()->update([
                        'stock_in' => $rawMaterialStock->rawMaterial->stock_in + $rawMaterialStock->quantity
                    ]);
                }

                $rawMaterialStock->save();

                return $revert;
            });

            $message =  ($revert ? $rawMaterialStock->name." stocks has been recovered." : "Successfull stock-out.");

            return back()->with(['message' => $message, 'title' => $revert ? 'Recovered stock!' : 'Stock-out!', 'status' => 'success']);
        } catch (\Throwable $th) {
            return back()->with(['message' => 'Failed to stock-out the raw material '. $rawMaterialStock->name, 'title' => 'Faitled attemp!', 'status' => 'error']);
        }
    }
}
