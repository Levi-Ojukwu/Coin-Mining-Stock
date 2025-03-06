<?php

namespace App\Http\Controllers;
use App\Models\User;
use Illuminate\Http\Request;
use App\Models\Transaction;
use Illuminate\Support\Facades\Auth;

class DashboardController extends Controller
{
    public function index()
{
    try {
        $user = Auth::user();
        $totalBalance = User::sum('balance');
        
        // Only get visible transactions for the user
        $transactions = Transaction::where('user_id', $user->id)
            ->where('visible_to_user', true)
            ->latest()
            ->take(10)
            ->get();

        return response()->json([
            'balance' => $user->balance,
            'totalBalance' => $totalBalance,
            'transactions' => $transactions,
        ]);
    } catch (\Exception $e) {
        return response()->json([
            'error' => 'Failed to fetch dashboard data: ' . $e->getMessage()
        ], 500);
    }
}
}
