<?php

use App\Http\Controllers\CustomerController;
use App\Http\Controllers\FinishProductController;
use App\Http\Controllers\OrderController;
use App\Http\Controllers\ProfileController;
use App\Http\Controllers\RawMaterialController;
use App\Http\Controllers\UserController;
use App\Models\FinishProduct;
use App\Models\OrderedItem;
use App\Models\RawMaterial;
use Illuminate\Foundation\Application;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\Route;
use Illuminate\Support\Facades\URL;
use Inertia\Inertia;

Route::get('/', function () {
    if(Auth::check()){
        if(URL::previous() === URL('/'))
            return redirect('/dashboard');
        else
            return back();
    }

    return Inertia::render('Welcome', [
        'canLogin' => Route::has('login'),
        'canRegister' => Route::has('register'),
    ]);
})->name('home');


Route::middleware('auth')->group(function () {
    Route::get('/profile', [ProfileController::class, 'edit'])->name('profile.edit');
    Route::patch('/profile', [ProfileController::class, 'update'])->name('profile.update');
    Route::delete('/profile', [ProfileController::class, 'destroy'])->name('profile.destroy');

    Route::get('/dashboard', function () {
        $months = [
            "Jan", "Feb", "Mar", "Apr", "May", "Jun",
            "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"
        ];

        $salesPerMonth = OrderedItem::getSalesPerMonth()->map(function ($sales) use ($months) {
            $salesArray = $sales; // Convert to array if it's an object

            $salesArray['month'] = $months[$salesArray['month'] - 1]; // Adjust index for month name
            return $salesArray;
        });

        $productNearlyOut = FinishProduct::whereColumn('stock_in', '<=', 'opening_stock')->get(['id', 'name', 'size', 'stock_in']);
        $rawNearlyOut = RawMaterial::whereColumn('stock_in', '<=', 'opening_stock')->get(['id', 'name', 'stock_in']);

        return Inertia::render('Dashboard/Dashboard', [
            "sales" => $salesPerMonth,
            "sold" => OrderedItem::all()->sum('quantity'),
            "products" => FinishProduct::all()->count(),
            "raw" => RawMaterial::all()->count(),
            "stocks" => collect([
                'product' => $productNearlyOut,
                'raw' => $rawNearlyOut
            ])
        ]);
    })->middleware(['auth', 'verified'])->name('dashboard');


    Route::prefix('users')->group(function () {
        Route::controller(UserController::class)->group(function () {
            Route::get('/', 'index')->name('users');
            Route::get('/json', 'indexJson')->name('users.json');
            Route::get('/new-user/{user?}', 'create')->name('users.create');

            Route::post('/add-user/{user?}', 'store')->name('users.store');
        });
    });

    Route::prefix('inventory')->group(function () {
        Route::prefix('finish-products')->group(function () {
            Route::controller(FinishProductController::class)->group(function () {
                Route::get('/', 'index')->name('inventory.finish');
                Route::get('/json', 'indexJson')->name('inventory.finish.json');

                Route::post('/create/{finishProduct?}', 'store')->name('inventory.create');
            });
        });

        Route::prefix('raw-materials')->group(function () {
            Route::controller(RawMaterialController::class)->group(function () {
                Route::get('/', 'index')->name('inventory.materials');

                Route::post('/create/{rawMaterial?}', 'store')->name('inventory.material.create');
                Route::post('/stock-out/{rawMaterialStock}', 'stockOut')->name('inventory.material.stock_out');
            });
        });
    });

    Route::prefix('stocks')->group(function () {
        Route::prefix('finish-products')->group(function () {
            Route::controller(FinishProductController::class)->group(function () {
                Route::get('/', 'manageFinish')->name('manage.inventory.finish');
                Route::get('/json', 'jsonManageFinish')->name('manage.inventory.finish.json');

                Route::post('/add-stock/{finishProduct}', 'addStock')->name('manage.inventory.finish.add_stock');
            });
        });

        Route::prefix('raw-materials')->group(function () {
            Route::controller(RawMaterialController::class)->group(function () {
                Route::get('/', 'manageRaw')->name('manage.inventory.materials');
                Route::get('/json', 'jsonManageRaw')->name('manage.inventory.raw.json');

                Route::post('/add-stock/{rawMaterial}', 'addStock')->name('manage.inventory.raw.add_stock');
            });
        });
    });

    Route::prefix('orders')->group(function () {
        Route::controller(OrderController::class)->group(function () {
            Route::get('/', 'index')->name('orders');
            Route::get('/new-order', 'create')->name('orders.create');
            Route::get('/json', 'indexJson')->name('orders.json');

            Route::post('/pay-order', 'store')->name('orders.pay');
        });
    });

    Route::get('/customer/json/{search?}', [CustomerController::class, 'jsonIndex'])->name('customer.json');
});

require __DIR__.'/auth.php';
