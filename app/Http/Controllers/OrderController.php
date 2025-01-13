<?php

namespace App\Http\Controllers;

use App\Models\Customer;
use App\Models\FinishProduct;
use App\Models\Order;
use App\Models\OrderedItem;
use Exception;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
use Inertia\Inertia;

class OrderController extends Controller
{
    public function index()
    {
        return Inertia::render('Orders/Index', [
            'orders' => Order::with(['customer', 'orders', 'orders.product:id,name,size'])->paginate($this->paginate)
        ]);
    }

    public function indexJson()
    {
        return response()->json(
            Order::with(['customer', 'orders', 'orders.product:id,name,size'])->paginate($this->paginate)
        );
    }

    public function create()
    {
        $products = FinishProduct::select('name as product')->groupBy('name')->get();

        $products = $products->map(function ($product) {
            return collect([
                "name" => $product['product'],
                "thumbnail" => FinishProduct::where('name', '=', $product['product'])->get('thumbnail')->value('thumbnail'),
                "products" => FinishProduct::where('name', $product['product'])->orderBy('size')->get(['id', 'size', 'stock_in', 'price', 'thumbnail'])
            ]);
        });

        return Inertia::render('Orders/NewOrder', [
            "products" => $products
        ]);
    }

    public function store(Request $request)
    {
        DB::beginTransaction();
        try {
            $existCustomer = Customer::where('id', $request->customer['id'])->first();

            $customer = $existCustomer??Customer::create([
                "name" => $request->customer['name'],
                "contact" => $request->customer['contact'],
                "address" => $request->customer['address']
            ]);

            $order = Order::create([
                "customer_id" => $customer->id
            ]);

            $orders = $request->orders;

            foreach ($orders as $value) {
                $product = FinishProduct::find($value['id']);
                $productStock = $product->stock_in;

                $stocks = $productStock - $value['quantity'];

                if($stocks > 0) {
                    $product->stock_in = $stocks;
                } else {
                    throw new Exception($product->name.' is out of stock! Available: '.$productStock);
                }

                $product->save();

                $order->orders()->create([
                    "finish_product_id" => $product->id,
                    "quantity" => $value['quantity'],
                    "total_amount" => $value['total']
                ]);
            }

            DB::commit();

            return back()->with(['message' => 'Order has been successfully made.', 'title' => 'Successful order!', 'status' => 'success']);

        } catch (\Throwable $th) {
            DB::rollBack();

            return back()->with(['message' => $th->getMessage(), 'title' => 'Failed to process!', 'status' => 'error']);
        }
    }
}
