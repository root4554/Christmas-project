<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Stock;

class StocksController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }
    public function index()
    {
        $Stocks = Stock::all();
        return response()->json([
            'status' => 'success',
            'stocks' => $Stocks,
        ]);
    }
    public function show($id)
    {
        $Stock = Stock::find($id);
        return response()->json([
            'status' => 'success',
            'stock' => $Stock,
        ]);
    }
}
