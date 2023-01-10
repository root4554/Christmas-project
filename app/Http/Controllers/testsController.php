<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\DB;
class testsController extends Controller
{
     
    function show(){
        $data = DB::table('db-test')->get();
        return view('tests', ['tests' => $data]);
    }
}
