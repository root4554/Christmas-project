<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Real_time_stocks;

class Real_time_stocksController extends Controller
{
    public function __construct()
    {
        $this->middleware('auth:api');
    }
    
    public function index()
    {
        $Real_time_stocks = Real_time_stocks::all();
        return response()->json([
            'status' => 'success',
            'real_time_stocks' => $Real_time_stocks,
        ]);
    }
    public function show($id)
    {
        $Real_time_stock = Real_time_stocks::find($id);
        return response()->json([
            'status' => 'success',
            'real_time_stock' => $Real_time_stock,
        ]);
    }
    public function showLastMinute($id)
    {
        $Real_time_stock = $Real_time_stock = Real_time_stocks::where('company_id', $id)->orderBy('date', 'desc')->orderBy('time', 'desc')->first();
        return response()->json([
            'status' => 'success',
            'real_time_stock' => $Real_time_stock,
        ]);
    }

    // public function showLastDay($id, $date)
    // {
    //     $Real_time_stock = Real_time_stocks::where('company-id', $id)->where('date', $date)->get();
    //     return response()->json([
    //         'status' => 'success',
    //         'real_time_stock' => $Real_time_stock,
    //     ]);
    // }
}
