<?php

namespace App\Http\Controllers;

use App\Models\FinishProduct;
use App\Models\FinishProductStock;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class FinishProductController extends Controller
{
    public function index()
    {
        return Inertia::render('Inventory/Products/Index', [
            "products" => FinishProduct::withSum('soldProducts as sold', 'quantity')->paginate($this->paginate)
        ]);
    }

    public function indexJson(Request $request)
    {
        $search = $request->query('search');
        $filter = $request->query('filter');
        $is_paginate = $request->query('paginate');

        return response()->json(
            FinishProduct::with(['productStock:id,finish_product_id,quantity,created_at'])
                ->withSum('soldProducts as sold', 'quantity')
                ->when($search, function ($query) use ($search) {
                    $query->where('name', 'LIKE', "%{$search}%");
                })->when($filter, function ($query) use ($filter) {
                    $query->where('size', $filter);
                })
                ->when($is_paginate, fn ($q) => $q->get())
                ->when(!$is_paginate, fn ($q) => $q->paginate($this->paginate))
        );
    }

    public function manageFinish()
    {
        return Inertia::render('ManageStocks/Products/Index', [
            'products' => FinishProduct::with(['productStock:id,finish_product_id,quantity,created_at'])
                ->paginate($this->paginate)
        ]);
    }

    public function jsonManageFinish(Request $request)
    {
        $search = $request->query('search');
        $filter = $request->query('filter');
        $is_paginate = $request->query('paginate');

        try {
            $product = FinishProduct::with('productStock:id,finish_product_id,quantity,created_at')
                ->when($search, function ($query) use ($search) {
                    $query->where('name', 'LIKE', "%{$search}%");
                })->when($filter, function ($query) use ($filter) {
                    $query->where('size', $filter);
                })
                ->when($is_paginate, fn ($q) => $q->get())
                ->when(!$is_paginate, fn ($q) => $q->paginate($this->paginate));

            return response()->json($product);
        } catch (\Throwable $th) {
            return response()->json($th->getMessage(), 400);
        }
    }

    public function store(Request $request, $finishProduct = null)
    {
        try {
            $thumbnail = null;

            if($request->thumbnail) {
                $path = $request->file('thumbnail')->store('thumbnail');
                $thumbnail = '/storage/'.$path;
            } else if($finishProduct) {
                $product = FinishProduct::find($finishProduct);
                $thumbnail = $product->thumbnail;
            }

            DB::transaction(function () use ($request, $finishProduct, $thumbnail) {
                $exist = FinishProduct::where('name', $request->name)
                    ->where('size', $request->size)
                    ->when($finishProduct, function ($query) use ($finishProduct) {
                        $query->whereNot('id', $finishProduct);
                    })
                    ->exists();

                if($exist) {
                    throw new Exception("The product already exist.", 1);
                }

                FinishProduct::updateOrCreate(["id" => $finishProduct], [
                    "name" => $request->name,
                    "size" => $request->size,
                    "price" => $request->price,
                    "opening_stock" => $request->opening_stock,
                    "closing_stock" => $request->closing_stock,
                    "thumbnail" => $thumbnail
                ]);
            });

            return back()->with(['message' => 'New product has been '.($finishProduct ? 'updated' : 'created').'.', 'title' => $finishProduct?'Product updated!':'New product!', 'status' => 'success']);
        } catch (\Throwable $th) {
            return back()->with(['message' => $th->getMessage(), 'title' => 'Failed attempt!', 'status' => 'error']);
        }
    }

    public function addStock(Request $request, FinishProduct $finishProduct)
    {
        DB::beginTransaction();
        try {
            $stock = $finishProduct->stock_in + $request->quantity;

            if($stock > $finishProduct->closing_stock)
                throw new Exception('The added stock exceeded the closing stock.', 1);
            else if($stock < $finishProduct->opening_stock)
                throw new Exception('The stock is less than the opening stock.', 1);

            $finishProduct->stock_in = $stock;

            $finishProduct->productStock()->create([
                'quantity' => $request->quantity
            ]);

            $finishProduct->save();

            DB::commit();

            return back()->with(['message' => 'New stock has been added to '.$finishProduct->name, 'title' => 'New stock!', 'status' => 'success']);
        } catch (\Throwable $th) {
            DB::rollBack();

            return back()->with(['message' => $th->getMessage(), 'title' => 'Failed attempt!', 'status' => 'error']);
        }
    }
}
