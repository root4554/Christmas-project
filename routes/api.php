<?php

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;
use App\Http\Controllers\AuthController;
use App\Http\Controllers\StocksController;
use App\Http\Controllers\Real_time_stocksController;

/*
|--------------------------------------------------------------------------
| API Routes
|--------------------------------------------------------------------------
|
| Here is where you can register API routes for your application. These
| routes are loaded by the RouteServiceProvider within a group which
| is assigned the "api" middleware group. Enjoy building your API!
|
*/

// Route::middleware('auth:sanctum')->get('/user', function (Request $request) {
//     return $request->user();
// });

Route::controller(AuthController::class)->group(function () {
    Route::post('login', 'login');
    Route::post('register', 'register');
    Route::post('logout', 'logout');
    Route::post('refresh', 'refresh');

});

Route::controller(StocksController::class)->group(function () {
    Route::get('stocks', 'index');
    Route::get('stocks/{id}', 'show');
    Route::get('stocks/{id}/lastday', 'showLastDay');
    Route::get('stocks/{id}/lastweek', 'showLastWeek');
});

Route::controller(Real_time_stocksController::class)->group(function () {
    Route::get('real_time_stocks', 'index');
    Route::get('real_time_stock/{id}', 'show');
    Route::get('real_time_stock/{id}/lastminute', 'showLastMinute');
    // Route::get('real_time_stock/{id}/{date}', 'showLastDay');
});