<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\Stock;
use Illuminate\Support\Facades\DB;
//use carbon
use Carbon\Carbon;

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
        
        $Stock = Stock::where('company_id', $id)->select('date', 'price')->get();
        return response()->json([
            'status' => 'success',
            'stock' => $Stock,
        ]);
    }

    public function showLastDay($id)
    {
        // $lastDay = "SELECT MAX(date) FROM stocks WHERE company_id = $id";
        $lastDay = Stock::where('company_id', $id)
                ->max('date');

        $Stock = Stock::where('company_id', $id)->where('date', $lastDay)->select('time', 'price')->get();
        return response()->json([
            'status' => 'success',
            'stock' => $Stock,
        ]);
    }

    public function showLastWeek($id)
    {              
            $last_date = DB::table('stocks')->orderBy('date', 'desc')->first()->date;
            $start_date = Carbon::parse($last_date)->subDays(7)->toDateString();

            $Stock = DB::table('stocks')->where('company_id', $id)
            ->whereBetween('date', [$start_date, $last_date])
            ->select('price', 'date', 'id')
            ->get();

            // ->inRandomOrder()
            // ->limit(200)

        return response()->json([
            'status' => 'success',
            'stock' => $Stock,
        ]);
    }

}
